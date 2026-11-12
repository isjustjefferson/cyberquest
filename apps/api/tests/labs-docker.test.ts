import { afterAll, beforeAll, describe, expect, it } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.LAB_FLAG_SECRET = 'test-lab-secret';
process.env.LOG_LEVEL = 'silent';

const dockerModule = await import('../src/modules/labs/docker');

async function imageExists(image: string) {
  try {
    await dockerModule.getDocker().getImage(image).inspect();
    return true;
  } catch {
    return false;
  }
}

async function ensureImage(image: string) {
  if (await imageExists(image)) return;
  const docker = dockerModule.getDocker();
  await new Promise<void>((resolve, reject) => {
    docker.pull(image, (error: Error | null, stream: NodeJS.ReadableStream) => {
      if (error) {
        reject(error);
        return;
      }
      docker.modem.followProgress(stream, (progressError: Error | null) =>
        progressError ? reject(progressError) : resolve()
      );
    });
  });
}

const dockerAvailable = await dockerModule.isDockerAvailable();
const workstationReady =
  dockerAvailable && (await imageExists('cyberquest/dba-workstation:latest'));

describe.skipIf(!dockerAvailable || !workstationReady)(
  'Lab DBA com Docker real',
  () => {
    const USER_ID = 1;
    let db: import('../src/db/connection').DB;
    let orchestrator: import('../src/modules/labs/orchestrator').LabOrchestrator;

    beforeAll(async () => {
      await ensureImage('postgres:16');

      const connection = await import('../src/db/connection');
      const { LabOrchestrator } = await import('../src/modules/labs/orchestrator');

      db = connection.createDatabase(':memory:');
      connection.runMigrations(db);
      db.prepare(
        `INSERT INTO users (id, username, email, password_hash, display_name, accepted_lab_terms_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        USER_ID,
        'docker-tester',
        'docker-tester@cyberquest.local',
        'hash',
        'Docker Tester',
        new Date().toISOString(),
        new Date().toISOString()
      );

      orchestrator = new LabOrchestrator(db);
    }, 120_000);

    afterAll(async () => {
      if (db) {
        const sessions = db
          .prepare('SELECT id FROM lab_sessions WHERE user_id = ? AND status = ?')
          .all(USER_ID, 'running') as Array<{ id: string }>;
        for (const session of sessions) {
          await orchestrator.stop(session.id, USER_ID);
        }
        db.close();
      }
    });

    it(
      'inicia, verifica objetivos e remove containers e volumes',
      async () => {
        const docker = dockerModule.getDocker();
        const session = await orchestrator.start(USER_ID, 'psql-primeiros-passos');
        expect(session.status).toBe('running');

        const pending = await orchestrator.verify(session.id, USER_ID, 'criar-padaria-dev');
        expect(pending.passed).toBe(false);

        const outcome = await orchestrator.verify(session.id, USER_ID, 'explorar');
        expect(outcome.passed, outcome.message).toBe(true);
        expect(outcome.message).toContain('cumprido');

        const containers = await docker.listContainers({
          all: true,
          filters: { label: [`cyberquest.session=${session.id}`] }
        });
        expect(containers.length).toBeGreaterThan(0);
        const sizes = containers.map((container) => container.Labels['cyberquest.name']).sort();
        expect(sizes).toEqual(['db', 'workstation']);

        await orchestrator.stop(session.id, USER_ID);

        const remainingContainers = await docker.listContainers({
          all: true,
          filters: { label: [`cyberquest.session=${session.id}`] }
        });
        expect(remainingContainers).toHaveLength(0);

        const remainingVolumes = await docker.listVolumes({
          filters: { label: [`cyberquest.session=${session.id}`] }
        });
        expect(remainingVolumes.Volumes ?? []).toHaveLength(0);
      },
      180_000
    );

    it(
      'inicia os labs avançados de PITR, replicação e plantão',
      async () => {
        const sessions: Array<{ id: string }> = [];
        try {
          const pitr = await orchestrator.start(USER_ID, 'pitr');
          sessions.push(pitr);
          const safetyBackup = await orchestrator.verify(pitr.id, USER_ID, 'backup-de-seguranca');
          expect(safetyBackup.passed).toBe(false);
          await orchestrator.stop(pitr.id, USER_ID);
          sessions.pop();

          const replication = await orchestrator.start(USER_ID, 'replicacao-streaming');
          sessions.push(replication);
          const streaming = await orchestrator.verify(replication.id, USER_ID, 'standby-conectado');
          expect(streaming.passed, streaming.message).toBe(true);
          const replicatedData = await orchestrator.verify(replication.id, USER_ID, 'dados-replicados');
          expect(replicatedData.passed, replicatedData.message).toBe(true);
          await orchestrator.stop(replication.id, USER_ID);
          sessions.pop();

          const rescue = await orchestrator.start(USER_ID, 'resgate-padaria-byte');
          sessions.push(rescue);
          const activeIncident = await orchestrator.verify(rescue.id, USER_ID, 'conexoes-esgotadas');
          expect(activeIncident.passed).toBe(false);
          const openTrustRule = await orchestrator.verify(rescue.id, USER_ID, 'regra-trust');
          expect(openTrustRule.passed).toBe(false);
        } finally {
          for (const session of sessions.reverse()) {
            await orchestrator.stop(session.id, USER_ID);
          }
        }
      },
      360_000
    );
  }
);

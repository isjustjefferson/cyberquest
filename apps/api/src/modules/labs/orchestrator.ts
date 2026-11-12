import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import net from 'node:net';
import { Readable } from 'node:stream';
import path from 'node:path';
import type Docker from 'dockerode';
import type { ContainerCreateOptions, Network } from 'dockerode';
import {
  LAB_SECURITY,
  type LabDetail,
  type LabManifest,
  type LabManifestContainer,
  type LabManifestObjective,
  type LabSessionPublic
} from '@cyberquest/shared';
import type { DB } from '../../db/connection';
import { config } from '../../config';
import { logger } from '../../logger';
import { AppError } from '../../utils/errors';
import { dynamicFlag, generatedPassword, newNonce } from '../../utils/crypto';
import { getUser } from '../gamification/service';
import { getDocker, isDockerAvailable } from './docker';
import { loadManifest, loadWriteup, resolveLabFile } from './manifest';
import { createTarFile } from './tar';
import { nowIso } from '../../utils/time';

interface SessionRow {
  id: string;
  user_id: number;
  lab_slug: string;
  status: 'starting' | 'running' | 'stopped' | 'expired' | 'error';
  network_id: string | null;
  container_ids_json: string;
  proxy_ports_json: string;
  nonce: string;
  started_at: string;
  expires_at: string;
  stopped_at: string | null;
  extended: number;
  error_message: string | null;
}

interface CreatedResources {
  containerIds: string[];
  networkId: string | null;
  proxyPorts: Record<string, number>;
}

interface ExecResult {
  exitCode: number;
  output: string;
}

export interface VerifyOutcome {
  passed: boolean;
  message: string;
  objective: LabManifestObjective;
}

const PG_CAPS = ['CHOWN', 'SETUID', 'SETGID', 'DAC_OVERRIDE', 'FOWNER'];

function envKeyFor(objectiveId: string): string {
  return `CQ_FLAG_${objectiveId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
}

function labelsFor(sessionId: string, userId: number, extra: Record<string, string> = {}): Record<string, string> {
  return {
    'cyberquest.managed': 'true',
    'cyberquest.session': sessionId,
    'cyberquest.user': String(userId),
    ...extra
  };
}

function pgMajor(): string {
  return process.env.LAB_PG_MAJOR ?? '16';
}

function resolvePlaceholders(value: string, password: string): string {
  return value
    .replace(/\{\{\s*generated_password\s*\}\}/g, password)
    .replace(/\$\{\s*PG_MAJOR\s*\}/g, pgMajor());
}

function resolveEnv(
  env: Record<string, string> | undefined,
  password: string
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, value] of Object.entries(env ?? {})) {
    resolved[key] = resolvePlaceholders(value, password);
  }
  return resolved;
}

function isPostgres(base: LabManifestContainer): boolean {
  return base.image.startsWith('postgres:');
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Não foi possível reservar uma porta'));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
  });
}

async function runExec(
  docker: Docker,
  containerId: string,
  cmd: string[],
  options: { user?: string; env?: string[]; timeoutMs?: number } = {}
): Promise<ExecResult> {
  const container = docker.getContainer(containerId);
  const exec = await container.exec({
    Cmd: cmd,
    User: options.user,
    Env: options.env,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true
  });
  const stream = (await exec.start({
    hijack: true,
    stdin: false,
    Tty: true
  })) as unknown as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];
  const finished = new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
  const timeoutMs = options.timeoutMs ?? 10_000;
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
  });
  try {
    await Promise.race([finished, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
  const info = await exec.inspect();
  return {
    exitCode: info.ExitCode ?? -1,
    output: Buffer.concat(chunks).toString('utf8')
  };
}

async function waitForPort(docker: Docker, containerId: string, host: string, port: number): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const result = await runExec(docker, containerId, ['sh', '-c', `nc -z -w 1 ${host} ${port}`], {
        timeoutMs: 3_000
      });
      if (result.exitCode === 0) return;
    } catch {
      // tenta de novo
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Serviço ${host}:${port} não respondeu ao healthcheck`);
}

async function waitForCommand(
  docker: Docker,
  containerId: string,
  cmd: string,
  timeoutS: number,
  env: string[]
): Promise<void> {
  const deadline = Date.now() + timeoutS * 1000;
  while (Date.now() < deadline) {
    try {
      const result = await runExec(docker, containerId, ['sh', '-c', cmd], {
        timeoutMs: 5_000,
        env
      });
      if (result.exitCode === 0) return;
    } catch {
      // tenta de novo
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Serviço não ficou pronto em ${timeoutS}s`);
}

export class LabOrchestrator {
  constructor(private db: DB) {}

  getSessionRow(sessionId: string): SessionRow {
    const row = this.db.prepare('SELECT * FROM lab_sessions WHERE id = ?').get(sessionId) as
      | SessionRow
      | undefined;
    if (!row) throw new AppError(404, 'SESSION_NOT_FOUND', 'Sessão de lab não encontrada.');
    return row;
  }

  getOwnedSession(sessionId: string, userId: number): SessionRow {
    const row = this.getSessionRow(sessionId);
    if (row.user_id !== userId) {
      throw new AppError(403, 'SESSION_FORBIDDEN', 'Esta sessão não pertence a você.');
    }
    return row;
  }

  async start(userId: number, labSlug: string): Promise<LabSessionPublic> {
    const user = getUser(this.db, userId);
    if (!user.accepted_lab_terms_at) {
      throw new AppError(400, 'TERMS_REQUIRED', 'Aceite o termo de uso dos labs antes de começar.');
    }
    const manifest = loadManifest(labSlug);
    if (!(await isDockerAvailable())) {
      throw new AppError(
        503,
        'DOCKER_UNAVAILABLE',
        'Docker não encontrado. Instale/inicie o Docker e recarregue a página.'
      );
    }
    const existing = this.db
      .prepare(
        "SELECT * FROM lab_sessions WHERE user_id = ? AND status IN ('starting','running') ORDER BY started_at DESC LIMIT 1"
      )
      .get(userId) as SessionRow | undefined;
    if (existing) {
      if (existing.lab_slug === labSlug) return this.publicSession(existing);
      throw new AppError(
        409,
        'ACTIVE_SESSION',
        'Você já tem um lab ativo. Encerre a sessão atual antes de iniciar outro.'
      );
    }
    const globalActive = (
      this.db
        .prepare("SELECT COUNT(*) AS total FROM lab_sessions WHERE status IN ('starting','running')")
        .get() as { total: number }
    ).total;
    if (globalActive >= config.MAX_CONCURRENT_LABS) {
      throw new AppError(
        429,
        'LAB_LIMIT_REACHED',
        'O servidor atingiu o limite de labs simultâneos. Tente novamente em alguns minutos.'
      );
    }

    const sessionId = crypto.randomUUID();
    const nonce = newNonce();
    const started = new Date();
    const ttl = Math.min(manifest.ttl_minutes, config.LAB_DEFAULT_TTL_MINUTES * 4);
    const expires = new Date(started.getTime() + ttl * 60_000);
    this.db
      .prepare(
        `INSERT INTO lab_sessions (id, user_id, lab_slug, status, nonce, started_at, expires_at)
         VALUES (?, ?, ?, 'starting', ?, ?, ?)`
      )
      .run(sessionId, userId, labSlug, nonce, started.toISOString(), expires.toISOString());

    try {
      const resources = await this.provision(sessionId, userId, manifest, nonce);
      this.db
        .prepare(
          `UPDATE lab_sessions SET status = 'running', network_id = ?, container_ids_json = ?,
             proxy_ports_json = ? WHERE id = ?`
        )
        .run(
          resources.networkId,
          JSON.stringify(resources.containerIds),
          JSON.stringify(resources.proxyPorts),
          sessionId
        );
      logger.info({ sessionId, userId, labSlug }, 'Lab iniciado');
      return this.publicSession(this.getSessionRow(sessionId));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao iniciar o lab';
      logger.error({ err: error, sessionId, labSlug }, 'Falha ao iniciar lab; rollback');
      await this.rollback(sessionId);
      this.db
        .prepare("UPDATE lab_sessions SET status = 'error', error_message = ?, stopped_at = ? WHERE id = ?")
        .run(message, nowIso(), sessionId);
      throw new AppError(500, 'LAB_START_FAILED', `Não foi possível iniciar o lab: ${message}`);
    }
  }

  private async createVolumes(
    docker: Docker,
    sessionId: string,
    userId: number,
    targets: LabManifestContainer[]
  ): Promise<Map<string, string>> {
    const volumes = new Map<string, string>();
    for (const target of targets) {
      for (const mountPath of target.ephemeral_volumes ?? []) {
        if (volumes.has(mountPath)) continue;
        const name = `cq-${sessionId.slice(0, 8)}-${volumes.size}`;
        try {
          await docker.createVolume({
            Name: name,
            Labels: labelsFor(sessionId, userId, { 'cyberquest.role': 'volume' })
          });
        } catch (error) {
          logger.warn({ err: error, name }, 'Volume já existia ou não pôde ser criado');
        }
        volumes.set(mountPath, name);
      }
    }
    return volumes;
  }

  private async copyIntoContainer(
    docker: Docker,
    containerId: string,
    archivePath: string,
    files: Array<{ file: string; name: string }>
  ): Promise<void> {
    if (files.length === 0) return;
    const container = docker.getContainer(containerId);
    for (const entry of files) {
      const content = await fs.readFile(entry.file);
      const tar = createTarFile(entry.name, content);
      await container.putArchive(Readable.from([tar]), { path: archivePath });
    }
  }

  private async provision(
    sessionId: string,
    userId: number,
    manifest: LabManifest,
    nonce: string
  ): Promise<CreatedResources> {
    const docker = getDocker();
    const password = generatedPassword(nonce);
    const networkName = `cq-${sessionId.slice(0, 12)}`;
    const network = await docker.createNetwork({
      Name: networkName,
      Driver: 'bridge',
      Internal: manifest.network?.internal !== false,
      Labels: labelsFor(sessionId, userId)
    });
    const created: CreatedResources = { containerIds: [], networkId: network.id, proxyPorts: {} };
    const flagEnv = manifest.objectives.map(
      (objective) => `${envKeyFor(objective.id)}=${dynamicFlag(userId, objective.id, nonce)}`
    );
    const targets = manifest.containers.targets ?? [];
    const volumes = await this.createVolumes(docker, sessionId, userId, targets);

    try {
      for (const target of targets) {
        const name = `cq-${sessionId.slice(0, 8)}-${target.name}`;
        const env = [...flagEnv, ...Object.entries(resolveEnv(target.env, password)).map(([key, value]) => `${key}=${value}`)];
        const binds = (target.ephemeral_volumes ?? [])
          .map((mountPath) => {
            const volumeName = volumes.get(mountPath);
            return volumeName ? `${volumeName}:${mountPath}` : null;
          })
          .filter((bind): bind is string => Boolean(bind));
        const memoryBytes = (target.resources?.memory_mb ?? 512) * 1024 * 1024;
        const nanoCpus = Math.round((target.resources?.cpus ?? 1) * 1_000_000_000);
        const options: ContainerCreateOptions = {
          name,
          Image: resolvePlaceholders(target.image, password),
          Hostname: target.hostname ?? target.name,
          Cmd: target.command,
          Env: env,
          Labels: labelsFor(sessionId, userId, {
            'cyberquest.role': 'target',
            'cyberquest.name': target.name ?? 'target'
          }),
          HostConfig: {
            NetworkMode: networkName,
            Binds: binds,
            CapDrop: ['ALL'],
            CapAdd: isPostgres(target) ? PG_CAPS : undefined,
            SecurityOpt: ['no-new-privileges'],
            Memory: memoryBytes,
            NanoCpus: nanoCpus,
            PidsLimit: LAB_SECURITY.pidsLimit,
            Tmpfs: { '/tmp': 'rw,noexec,nosuid,size=64m' }
          }
        };
        const container = await docker.createContainer(options);
        created.containerIds.push(container.id);
        const initFiles = (target.init_scripts ?? []).map((script) => ({
          file: resolveLabFile(script),
          name: path.basename(script)
        }));
        await this.copyIntoContainer(docker, container.id, '/docker-entrypoint-initdb.d', initFiles);
        for (const file of target.files ?? []) {
          await this.copyIntoContainer(docker, container.id, file.destination, [
            { file: resolveLabFile(file.source), name: path.basename(file.source) }
          ]);
        }
        await container.start();
        if (target.healthcheck?.cmd) {
          await waitForCommand(
            docker,
            container.id,
            target.healthcheck.cmd,
            target.healthcheck.timeout_s ?? 60,
            [`PGPASSWORD=${password}`, `PGDATABASE=${target.env?.POSTGRES_DB ?? 'postgres'}`]
          );
        }
      }

      const worker = manifest.containers.workstation
        ? {
            image: manifest.containers.workstation.image,
            hostname: manifest.containers.workstation.hostname ?? 'workstation',
            role: 'workstation',
            name: 'workstation',
            env: resolveEnv(manifest.containers.workstation.env, password),
            capAdd: [] as string[]
          }
        : {
            image: manifest.containers.attacker!.image,
            hostname: manifest.containers.attacker!.hostname ?? 'attacker',
            role: 'attacker',
            name: 'attacker',
            env: {} as Record<string, string>,
            capAdd: ['NET_RAW'] as string[]
          };
      if (manifest.containers.workstation) {
        const dbTarget = targets.find(isPostgres);
        if (dbTarget) {
          const defaults: Record<string, string> = {
            PGHOST: dbTarget.hostname ?? dbTarget.name ?? 'db',
            PGUSER: 'postgres',
            PGPASSWORD: password,
            PGDATABASE: resolveEnv(dbTarget.env, password).POSTGRES_DB ?? 'postgres'
          };
          for (const [key, value] of Object.entries(defaults)) {
            if (!(key in worker.env)) worker.env[key] = value;
          }
        }
      }

      const workerEnv = Object.entries(worker.env).map(([key, value]) => `${key}=${value}`);
      const workerContainer = await docker.createContainer({
        name: `cq-${sessionId.slice(0, 8)}-${worker.name}`,
        Image: resolvePlaceholders(worker.image, password),
        Hostname: worker.hostname,
        Env: workerEnv.length > 0 ? workerEnv : undefined,
        Labels: labelsFor(sessionId, userId, {
          'cyberquest.role': worker.role,
          'cyberquest.name': worker.name
        }),
        HostConfig: {
          NetworkMode: networkName,
          CapDrop: ['ALL'],
          CapAdd: worker.capAdd.length > 0 ? worker.capAdd : undefined,
          SecurityOpt: ['no-new-privileges'],
          Memory: LAB_SECURITY.memoryBytes,
          NanoCpus: LAB_SECURITY.nanoCpus,
          PidsLimit: LAB_SECURITY.pidsLimit,
          Tmpfs: { '/tmp': 'rw,nosuid,size=64m' }
        }
      });
      created.containerIds.push(workerContainer.id);
      await workerContainer.start();

      for (const target of targets) {
        if (!target.expose_web_port) continue;
        await waitForPort(
          docker,
          workerContainer.id,
          target.hostname ?? target.name ?? 'target',
          target.expose_web_port
        );
      }

      const webTarget = targets.find((target) => target.expose_web_port);
      if (webTarget?.expose_web_port) {
        const hostPort = await freePort();
        const targetHost = webTarget.hostname ?? webTarget.name ?? 'target';
        const proxy = await docker.createContainer({
          name: `cq-${sessionId.slice(0, 8)}-proxy`,
          Image: 'cyberquest/proxy:latest',
          Labels: labelsFor(sessionId, userId, { 'cyberquest.role': 'proxy', 'cyberquest.name': 'proxy' }),
          Cmd: ['socat', `TCP-LISTEN:8080,fork,reuseaddr`, `TCP:${targetHost}:${webTarget.expose_web_port}`],
          HostConfig: {
            NetworkMode: 'bridge',
            CapDrop: ['ALL'],
            SecurityOpt: ['no-new-privileges'],
            Memory: 128 * 1024 * 1024,
            NanoCpus: 500_000_000,
            PidsLimit: 128,
            PortBindings: {
              '8080/tcp': [{ HostIp: '127.0.0.1', HostPort: String(hostPort) }]
            }
          }
        });
        created.containerIds.push(proxy.id);
        await proxy.start();
        const typedNetwork = network as Network;
        await typedNetwork.connect({ Container: proxy.id });
        created.proxyPorts[webTarget.name ?? 'web'] = hostPort;
      }

      return created;
    } catch (error) {
      await this.removeResources(created, sessionId);
      throw error;
    }
  }

  private async removeResources(resources: CreatedResources, sessionId?: string): Promise<void> {
    const docker = getDocker();
    for (const containerId of resources.containerIds) {
      try {
        const container = docker.getContainer(containerId);
        await container.stop({ t: 1 }).catch(() => undefined);
        await container.remove({ force: true }).catch(() => undefined);
      } catch (error) {
        logger.warn({ err: error, containerId }, 'Falha ao remover container do lab');
      }
    }
    if (resources.networkId) {
      try {
        await docker.getNetwork(resources.networkId).remove();
      } catch (error) {
        logger.warn({ err: error, networkId: resources.networkId }, 'Falha ao remover rede do lab');
      }
    }
    if (sessionId) await this.removeVolumes(sessionId);
  }

  private async removeVolumes(sessionId: string): Promise<void> {
    try {
      const docker = getDocker();
      const result = await docker.listVolumes({
        filters: { label: [`cyberquest.session=${sessionId}`] }
      });
      for (const volume of result.Volumes ?? []) {
        try {
          await docker.getVolume(volume.Name).remove();
        } catch (error) {
          logger.warn({ err: error, volume: volume.Name }, 'Falha ao remover volume do lab');
        }
      }
    } catch (error) {
      logger.warn({ err: error, sessionId }, 'Falha ao listar volumes do lab');
    }
  }

  private async rollback(sessionId: string): Promise<void> {
    const row = this.getSessionRow(sessionId);
    let containerIds: string[] = [];
    try {
      containerIds = JSON.parse(row.container_ids_json);
    } catch {
      containerIds = [];
    }
    const docker = getDocker();
    try {
      const containers = await docker.listContainers({
        all: true,
        filters: { label: [`cyberquest.session=${sessionId}`] }
      });
      for (const container of containers) {
        if (!containerIds.includes(container.Id)) containerIds.push(container.Id);
      }
    } catch {
      // segue com os IDs conhecidos
    }
    let networkId = row.network_id;
    if (!networkId) {
      try {
        const networks = await docker.listNetworks({
          filters: { label: ['cyberquest.session=' + sessionId] }
        });
        networkId = networks[0]?.Id ?? null;
      } catch {
        networkId = null;
      }
    }
    await this.removeResources({ containerIds, networkId, proxyPorts: {} }, sessionId);
  }

  async stop(sessionId: string, userId?: number): Promise<SessionRow> {
    const row = userId ? this.getOwnedSession(sessionId, userId) : this.getSessionRow(sessionId);
    if (row.status === 'stopped' || row.status === 'expired') return row;
    let containerIds: string[] = [];
    try {
      containerIds = JSON.parse(row.container_ids_json);
    } catch {
      containerIds = [];
    }
    await this.removeResources({ containerIds, networkId: row.network_id, proxyPorts: {} }, sessionId);
    this.db
      .prepare("UPDATE lab_sessions SET status = 'stopped', stopped_at = ? WHERE id = ?")
      .run(nowIso(), sessionId);
    logger.info({ sessionId }, 'Lab encerrado');
    return this.getSessionRow(sessionId);
  }

  async expire(sessionId: string): Promise<void> {
    const row = this.getSessionRow(sessionId);
    if (row.status !== 'running' && row.status !== 'starting') return;
    let containerIds: string[] = [];
    try {
      containerIds = JSON.parse(row.container_ids_json);
    } catch {
      containerIds = [];
    }
    await this.removeResources({ containerIds, networkId: row.network_id, proxyPorts: {} }, sessionId);
    this.db
      .prepare("UPDATE lab_sessions SET status = 'expired', stopped_at = ? WHERE id = ?")
      .run(nowIso(), sessionId);
  }

  extend(sessionId: string, userId: number): SessionRow {
    const row = this.getOwnedSession(sessionId, userId);
    if (row.status !== 'running') {
      throw new AppError(400, 'SESSION_NOT_RUNNING', 'A sessão não está em execução.');
    }
    if (row.extended) {
      throw new AppError(400, 'ALREADY_EXTENDED', 'Você já estendeu esta sessão uma vez.');
    }
    if (new Date(row.expires_at).getTime() <= Date.now()) {
      throw new AppError(400, 'SESSION_EXPIRED', 'A sessão já expirou.');
    }
    const newExpires = new Date(
      new Date(row.expires_at).getTime() + LAB_SECURITY.maxExtendMinutes * 60_000
    ).toISOString();
    this.db
      .prepare('UPDATE lab_sessions SET expires_at = ?, extended = 1 WHERE id = ?')
      .run(newExpires, sessionId);
    return this.getSessionRow(sessionId);
  }

  async verify(
    sessionId: string,
    userId: number,
    objectiveId: string
  ): Promise<VerifyOutcome> {
    const row = this.getOwnedSession(sessionId, userId);
    if (row.status !== 'running') {
      throw new AppError(400, 'SESSION_NOT_RUNNING', 'A sessão não está ativa.');
    }
    const manifest = loadManifest(row.lab_slug);
    const objective = manifest.objectives.find((item) => item.id === objectiveId);
    if (!objective) throw new AppError(404, 'OBJECTIVE_NOT_FOUND', 'Objetivo não encontrado.');
    const verify = objective.verify;
    if (!verify) {
      throw new AppError(400, 'NOT_VERIFIABLE', 'Este objetivo não tem verificação automática.');
    }
    const docker = getDocker();
    const containers = await docker.listContainers({
      all: true,
      filters: {
        label: [`cyberquest.session=${sessionId}`, `cyberquest.name=${verify.container}`]
      }
    });
    const found = containers[0];
    if (!found) {
      throw new AppError(503, 'VERIFY_CONTAINER_MISSING', 'Container de verificação não encontrado.');
    }
    const password = generatedPassword(row.nonce);
    const env = [
      `PGPASSWORD=${password}`,
      `PGUSER=${verify.user ?? 'postgres'}`,
      `PGDATABASE=${verify.database ?? 'postgres'}`,
      'PGHOST=127.0.0.1',
      'PGDATA=/var/lib/postgresql/data'
    ];
    const cmd =
      verify.type === 'sql'
        ? ['psql', '-X', '-w', '-At', '-P', 'pager=off', '-v', 'ON_ERROR_STOP=1', '-c', verify.query]
        : ['sh', '-c', verify.query];
    let result: ExecResult;
    try {
      result = await runExec(docker, found.Id, cmd, {
        user: verify.user ?? 'postgres',
        env,
        timeoutMs: 10_000
      });
    } catch (error) {
      const message = error instanceof Error && error.message === 'timeout'
        ? 'A verificação demorou mais de 10 segundos. Tente novamente.'
        : 'Não foi possível executar a verificação.';
      return { passed: false, message, objective };
    }
    const output = result.output.trim();
    let passed = true;
    if (verify.expect.equals !== undefined) {
      passed = passed && output === verify.expect.equals.trim();
    }
    if (verify.expect.matches !== undefined) {
      try {
        passed = passed && new RegExp(verify.expect.matches, 'm').test(result.output);
      } catch {
        passed = false;
      }
    }
    if (verify.expect.exit_code !== undefined) {
      passed = passed && result.exitCode === verify.expect.exit_code;
    }
    return {
      passed,
      message: passed
        ? 'Objetivo cumprido.'
        : output
          ? `Ainda não. Saída da verificação: ${output.slice(0, 300)}`
          : `Ainda não. A verificação terminou com código ${result.exitCode}.`,
      objective
    };
  }

  async cleanupExpired(): Promise<number> {
    const expired = this.db
      .prepare(
        "SELECT id FROM lab_sessions WHERE status IN ('starting','running') AND expires_at <= ?"
      )
      .all(nowIso()) as Array<{ id: string }>;
    for (const row of expired) {
      await this.expire(row.id);
    }
    return expired.length;
  }

  async cleanupOrphans(): Promise<void> {
    if (!(await isDockerAvailable())) return;
    const docker = getDocker();
    try {
      const containers = await docker.listContainers({
        all: true,
        filters: { label: ['cyberquest.managed=true'] }
      });
      for (const container of containers) {
        try {
          const ref = docker.getContainer(container.Id);
          await ref.stop({ t: 1 }).catch(() => undefined);
          await ref.remove({ force: true });
        } catch (error) {
          logger.warn({ err: error, id: container.Id }, 'Falha ao limpar container órfão');
        }
      }
      const networks = await docker.listNetworks();
      for (const network of networks) {
        const managed = network.Labels?.['cyberquest.managed'] === 'true';
        if (!managed) continue;
        try {
          await docker.getNetwork(network.Id).remove();
        } catch (error) {
          logger.warn({ err: error, id: network.Id }, 'Falha ao limpar rede órfã');
        }
      }
      const volumes = await docker.listVolumes({
        filters: { label: ['cyberquest.managed=true'] }
      });
      for (const volume of volumes.Volumes ?? []) {
        try {
          await docker.getVolume(volume.Name).remove();
        } catch (error) {
          logger.warn({ err: error, volume: volume.Name }, 'Falha ao limpar volume órfão');
        }
      }
      this.db
        .prepare(
          "UPDATE lab_sessions SET status = 'stopped', stopped_at = ? WHERE status IN ('starting','running')"
        )
        .run(nowIso());
    } catch (error) {
      logger.warn({ err: error }, 'Não foi possível limpar recursos órfãos');
    }
  }

  publicSession(row: SessionRow): LabSessionPublic {
    const manifest = loadManifest(row.lab_slug);
    const done = new Set(
      (
        this.db
          .prepare('SELECT objective_id FROM lab_objectives_done WHERE user_id = ? AND lab_slug = ?')
          .all(row.user_id, row.lab_slug) as Array<{ objective_id: string }>
      ).map((item) => item.objective_id)
    );
    const objectives = manifest.objectives.map((objective) => {
      const hintsUsed = (
        this.db
          .prepare(
            "SELECT COUNT(*) AS total FROM hint_usage WHERE user_id = ? AND scope = 'lab' AND scope_id = ?"
          )
          .get(row.user_id, `${row.lab_slug}:${objective.id}`) as { total: number }
      ).total;
      return {
        id: objective.id,
        title: objective.title,
        xp: objective.xp,
        mode: objective.verify ? ('auto' as const) : ('flag' as const),
        hints: (objective.hints ?? []).map((hint, index) => ({
          text: index < hintsUsed ? hint.text : '',
          costBits: hint.cost_bits
        })),
        completed: done.has(objective.id),
        hintsUsed
      };
    });
    let proxyPorts: Record<string, number> = {};
    try {
      proxyPorts = JSON.parse(row.proxy_ports_json);
    } catch {
      proxyPorts = {};
    }
    const proxyPort = Object.values(proxyPorts)[0] ?? null;
    const secondsRemaining = Math.max(
      0,
      Math.floor((new Date(row.expires_at).getTime() - Date.now()) / 1000)
    );
    return {
      id: row.id,
      labSlug: row.lab_slug,
      status: row.status,
      startedAt: row.started_at,
      expiresAt: row.expires_at,
      secondsRemaining,
      extended: Boolean(row.extended),
      proxyPort: row.status === 'running' ? proxyPort : null,
      objectives,
      errorMessage: row.error_message
    };
  }

  labDetail(userId: number, labSlug: string, dockerAvailable: boolean): LabDetail {
    const template = this.db.prepare('SELECT * FROM lab_templates WHERE slug = ?').get(labSlug) as
      | { slug: string; title: string; difficulty: number; ttl_minutes: number; xp_reward: number }
      | undefined;
    if (!template) throw new AppError(404, 'LAB_NOT_FOUND', 'Lab não encontrado.');
    const manifest = loadManifest(labSlug);
    const user = getUser(this.db, userId);
    const done = new Set(
      (
        this.db
          .prepare('SELECT objective_id FROM lab_objectives_done WHERE user_id = ? AND lab_slug = ?')
          .all(userId, labSlug) as Array<{ objective_id: string }>
      ).map((row) => row.objective_id)
    );
    const objectives = manifest.objectives.map((objective) => {
      const hintsUsed = (
        this.db
          .prepare(
            "SELECT COUNT(*) AS total FROM hint_usage WHERE user_id = ? AND scope = 'lab' AND scope_id = ?"
          )
          .get(userId, `${labSlug}:${objective.id}`) as { total: number }
      ).total;
      return {
        id: objective.id,
        title: objective.title,
        xp: objective.xp,
        mode: objective.verify ? ('auto' as const) : ('flag' as const),
        hints: (objective.hints ?? []).map((hint, index) => ({
          text: index < hintsUsed ? hint.text : '',
          costBits: hint.cost_bits
        })),
        completed: done.has(objective.id),
        hintsUsed
      };
    });
    const active = this.db
      .prepare(
        "SELECT * FROM lab_sessions WHERE user_id = ? AND lab_slug = ? AND status IN ('starting','running') ORDER BY started_at DESC LIMIT 1"
      )
      .get(userId, labSlug) as SessionRow | undefined;
    const allDone = objectives.every((objective) => objective.completed);
    return {
      slug: template.slug,
      title: template.title,
      description: manifest.description,
      difficulty: template.difficulty,
      ttlMinutes: template.ttl_minutes,
      xpReward: template.xp_reward,
      objectives,
      writeup: allDone ? loadWriteup(manifest) : null,
      dockerAvailable,
      activeSession: active ? this.publicSession(active) : null,
      termsAccepted: Boolean(user.accepted_lab_terms_at)
    };
  }
}

export type { SessionRow };

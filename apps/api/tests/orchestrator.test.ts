import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const dockerState = vi.hoisted(() => {
  interface FakeContainer {
    id: string;
    options: any;
    started: boolean;
    removed: boolean;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    exec: ReturnType<typeof vi.fn>;
  }

  interface FakeNetwork {
    id: string;
    options: any;
    connect: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  }

  const state = {
    available: true,
    failStartRole: null as string | null,
    sequence: 0,
    containers: [] as FakeContainer[],
    networks: [] as FakeNetwork[],
    reset() {
      this.available = true;
      this.failStartRole = null;
      this.sequence = 0;
      this.containers = [];
      this.networks = [];
    }
  };

  function makeStream() {
    const listeners: Record<string, Array<() => void>> = {};
    const stream = {
      on(event: string, listener: () => void) {
        listeners[event] = [...(listeners[event] ?? []), listener];
        if (event === 'end') queueMicrotask(() => listener());
        return stream;
      }
    };
    return stream;
  }

  const client = {
    async createNetwork(options: any) {
      const id = `net-${++state.sequence}`;
      const network: FakeNetwork = {
        id,
        options,
        connect: vi.fn(async () => undefined),
        remove: vi.fn(async () => {
          state.networks = state.networks.filter((item) => item.id !== id);
        })
      };
      state.networks.push(network);
      return network;
    },
    async createContainer(options: any) {
      const id = `ctr-${++state.sequence}`;
      const container: FakeContainer = {
        id,
        options,
        started: false,
        removed: false,
        start: vi.fn(async () => {
          if (state.failStartRole === options.Labels?.['cyberquest.role']) {
            throw new Error('falha simulada ao iniciar container');
          }
          container.started = true;
        }),
        stop: vi.fn(async () => undefined),
        remove: vi.fn(async () => {
          container.removed = true;
        }),
        exec: vi.fn(async () => ({
          start: vi.fn(async () => makeStream()),
          inspect: vi.fn(async () => ({ ExitCode: 0 }))
        }))
      };
      state.containers.push(container);
      return container;
    },
    getContainer(id: string) {
      const container = state.containers.find((item) => item.id === id);
      if (!container) throw new Error(`Container não encontrado: ${id}`);
      return container;
    },
    getNetwork(id: string) {
      const network = state.networks.find((item) => item.id === id);
      if (!network) throw new Error(`Rede não encontrada: ${id}`);
      return network;
    },
    async listNetworks(filters?: { label?: string[] }) {
      return state.networks
        .filter((network) => {
          const labels = filters?.label ?? [];
          return labels.every((entry) => {
            const [key, value] = entry.split('=');
            return network.options.Labels?.[key] === value;
          });
        })
        .map((network) => ({ Id: network.id, Labels: network.options.Labels }));
    },
    async listContainers() {
      return state.containers
        .filter((container) => !container.removed)
        .map((container) => ({ Id: container.id, Labels: container.options.Labels }));
    },
    async ping() {
      return true;
    }
  };

  return { state, client };
});

vi.mock('../src/modules/labs/docker', () => ({
  getDocker: () => dockerState.client,
  isDockerAvailable: async () => dockerState.state.available,
  resetDockerClient: () => undefined
}));

const USER_ID = 1;

let db: import('../src/db/connection').DB;
let orchestrator: import('../src/modules/labs/orchestrator').LabOrchestrator;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.LAB_FLAG_SECRET = 'test-lab-secret';
  process.env.LOG_LEVEL = 'silent';

  const connection = await import('../src/db/connection');
  const { LabOrchestrator } = await import('../src/modules/labs/orchestrator');

  db = connection.createDatabase(':memory:');
  connection.runMigrations(db);
  db.prepare(
    `INSERT INTO users (id, username, email, password_hash, display_name, accepted_lab_terms_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    USER_ID,
    'tester',
    'tester@cyberquest.local',
    'hash',
    'Tester',
    new Date().toISOString(),
    new Date().toISOString()
  );

  orchestrator = new LabOrchestrator(db);
});

beforeEach(() => {
  dockerState.state.reset();
  db.exec('DELETE FROM lab_sessions; DELETE FROM lab_objectives_done; DELETE FROM hint_usage;');
});

afterAll(() => {
  db.close();
});

describe('LabOrchestrator com Docker mockado', () => {
  it('provisiona alvo, attacker e proxy sem vazar flags para o attacker', async () => {
    const session = await orchestrator.start(USER_ID, 'ola-terminal');

    expect(session.status).toBe('running');
    expect(session.proxyPort).toBeGreaterThan(0);
    expect(session.objectives).toHaveLength(3);
    expect(session.objectives.every((objective) => objective.completed === false)).toBe(true);

    const containers = dockerState.state.containers;
    const target = containers.find(
      (container) => container.options.Labels['cyberquest.role'] === 'target'
    );
    const attacker = containers.find(
      (container) => container.options.Labels['cyberquest.role'] === 'attacker'
    );
    const proxy = containers.find(
      (container) => container.options.Labels['cyberquest.role'] === 'proxy'
    );

    expect(target?.started).toBe(true);
    expect(attacker?.started).toBe(true);
    expect(proxy?.started).toBe(true);

    expect(target?.options.Env).toEqual(
      expect.arrayContaining([
        'CQ_LAB=ola-terminal',
        expect.stringMatching(/^CQ_FLAG_FIND_FILE=CQ\{[a-f0-9]{24}\}$/),
        expect.stringMatching(/^CQ_FLAG_READ_HIDDEN=CQ\{[a-f0-9]{24}\}$/),
        expect.stringMatching(/^CQ_FLAG_IDENTIFY_USER=CQ\{[a-f0-9]{24}\}$/)
      ])
    );
    expect(attacker?.options.Env).toBeUndefined();

    expect(target?.options.HostConfig).toMatchObject({
      CapDrop: ['ALL'],
      SecurityOpt: ['no-new-privileges']
    });
    expect(target?.options.HostConfig.CapAdd).toBeUndefined();
    expect(attacker?.options.HostConfig).toMatchObject({
      CapDrop: ['ALL'],
      CapAdd: ['NET_RAW'],
      SecurityOpt: ['no-new-privileges']
    });

    expect(dockerState.state.networks[0].options).toMatchObject({
      Internal: true,
      Driver: 'bridge'
    });

    expect(proxy?.options.Cmd).toEqual([
      'socat',
      'TCP-LISTEN:8080,fork,reuseaddr',
      'TCP:target:8080'
    ]);
    expect(proxy?.options.HostConfig.PortBindings['8080/tcp'][0]).toEqual({
      HostIp: '127.0.0.1',
      HostPort: String(session.proxyPort)
    });
    expect(dockerState.state.networks[0].connect).toHaveBeenCalledWith({
      Container: proxy?.id
    });
  });

  it('faz rollback de containers e rede quando o provisionamento falha', async () => {
    dockerState.state.failStartRole = 'target';

    await expect(orchestrator.start(USER_ID, 'ola-terminal')).rejects.toMatchObject({
      status: 500,
      code: 'LAB_START_FAILED'
    });

    const row = db.prepare('SELECT * FROM lab_sessions').get() as {
      status: string;
      error_message: string;
    };
    expect(row.status).toBe('error');
    expect(row.error_message).toContain('falha simulada');

    const target = dockerState.state.containers.find(
      (container) => container.options.Labels['cyberquest.role'] === 'target'
    );
    expect(target?.started).toBe(false);
    expect(target?.stop).toHaveBeenCalled();
    expect(target?.remove).toHaveBeenCalledWith({ force: true });
    expect(
      dockerState.state.containers.some(
        (container) => container.options.Labels['cyberquest.role'] === 'attacker'
      )
    ).toBe(false);
    expect(dockerState.state.networks).toHaveLength(0);
  });

  it('encerra a sessão removendo containers e rede, de forma idempotente', async () => {
    const session = await orchestrator.start(USER_ID, 'ola-terminal');

    const stopped = await orchestrator.stop(session.id, USER_ID);
    expect(stopped.status).toBe('stopped');
    expect(stopped.stopped_at).not.toBeNull();

    for (const container of dockerState.state.containers) {
      expect(container.stop).toHaveBeenCalled();
      expect(container.remove).toHaveBeenCalledWith({ force: true });
    }
    expect(dockerState.state.networks).toHaveLength(0);

    const repeated = await orchestrator.stop(session.id, USER_ID);
    expect(repeated.status).toBe('stopped');
    expect(dockerState.state.containers.every((container) => container.removed)).toBe(true);
  });

  it('expira sessões vencidas e limpa os recursos', async () => {
    const session = await orchestrator.start(USER_ID, 'ola-terminal');
    db.prepare('UPDATE lab_sessions SET expires_at = ? WHERE id = ?').run(
      new Date(Date.now() - 60_000).toISOString(),
      session.id
    );

    const count = await orchestrator.cleanupExpired();

    expect(count).toBe(1);
    const row = db.prepare('SELECT status FROM lab_sessions WHERE id = ?').get(session.id) as {
      status: string;
    };
    expect(row.status).toBe('expired');
    expect(dockerState.state.networks).toHaveLength(0);
    expect(dockerState.state.containers.every((container) => container.removed)).toBe(true);
  });

  it('permite estender a sessão apenas uma vez', async () => {
    const session = await orchestrator.start(USER_ID, 'ola-terminal');
    const extended = await orchestrator.extend(session.id, USER_ID);

    expect(extended.extended).toBe(1);
    expect(new Date(extended.expires_at).getTime()).toBeGreaterThan(
      new Date(session.expiresAt).getTime()
    );

    try {
      orchestrator.extend(session.id, USER_ID);
      expect.unreachable('A segunda extensão deveria falhar');
    } catch (error) {
      expect(error).toMatchObject({ code: 'ALREADY_EXTENDED' });
    }
  });
});

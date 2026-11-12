import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { config } from '../../../config';
import { AppError } from '../../../utils/errors';
import type { SqlDatasetSchema, SqlGradeMode, SqlResult } from '@cyberquest/shared';

export interface SqlWorkerData {
  mode: SqlGradeMode | 'run' | 'schema';
  datasetSql: string;
  setup?: string;
  sql?: string;
  expectedSql?: string;
  checkSql?: string;
  maxRows: number;
}

export interface SqlComparisonResult {
  actual: SqlResult;
  expected: SqlResult;
}

export interface SqlPlanResult {
  plan: string;
  error?: string;
}

let active = 0;
const queue: Array<() => void> = [];

async function acquire(): Promise<void> {
  if (active < config.SQL_MAX_CONCURRENT) {
    active += 1;
    return;
  }
  await new Promise<void>((resolve) => queue.push(resolve));
}

function release(): void {
  const next = queue.shift();
  if (next) next();
  else active -= 1;
}

function workerPath(): string {
  return path.join(__dirname, 'sql-worker.cjs');
}

function execute<T>(data: SqlWorkerData, timeoutMs = config.SQL_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const worker = new Worker(workerPath(), { workerData: data });
    let settled = false;
    let timedOut = false;
    let executionTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(loadTimer);
      if (executionTimer) clearTimeout(executionTimer);
      callback();
    };
    const loadTimer = setTimeout(() => {
      timedOut = true;
      void worker.terminate();
      finish(() => reject(new AppError(504, 'SQL_LOAD_TIMEOUT', 'Não foi possível preparar o dataset SQL.')));
    }, 20_000);

    worker.on('message', (message: { ready?: boolean; ok?: boolean; result?: T; error?: string }) => {
      if (message.ready) {
        clearTimeout(loadTimer);
        executionTimer = setTimeout(() => {
          timedOut = true;
          void worker.terminate();
          finish(() =>
            reject(
              new AppError(
                408,
                'SQL_TIMEOUT',
                `A consulta demorou mais de ${Math.ceil(timeoutMs / 1000)}s e foi interrompida.`
              )
            )
          );
        }, timeoutMs);
        return;
      }
      finish(() => {
        if (message.ok && message.result !== undefined) resolve(message.result);
        else reject(new Error(message.error ?? 'Falha ao executar SQL.'));
      });
    });
    worker.once('error', (error) => {
      finish(() => reject(error));
    });
    worker.once('exit', (code) => {
      if (settled || timedOut) return;
      if (code !== 0) finish(() => reject(new Error(`Worker SQL encerrou com código ${code}.`)));
    });
  });
}

async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  await acquire();
  try {
    return await fn();
  } finally {
    release();
  }
}

export async function runSql(
  data: Omit<SqlWorkerData, 'maxRows'> & { maxRows?: number },
  timeoutMs?: number
): Promise<SqlResult> {
  return withSlot(() =>
    execute<SqlResult>(
      {
        ...data,
        maxRows: data.maxRows ?? config.SQL_MAX_ROWS
      },
      timeoutMs
    )
  );
}

export async function compareSql(
  data: Omit<SqlWorkerData, 'maxRows'> & { maxRows?: number },
  timeoutMs?: number
): Promise<SqlComparisonResult> {
  return withSlot(() =>
    execute<SqlComparisonResult>(
      {
        ...data,
        maxRows: data.maxRows ?? config.SQL_MAX_ROWS
      },
      timeoutMs
    )
  );
}

export async function inspectPlan(
  data: Omit<SqlWorkerData, 'maxRows'> & { maxRows?: number },
  timeoutMs?: number
): Promise<SqlPlanResult> {
  return withSlot(() =>
    execute<SqlPlanResult>(
      {
        ...data,
        maxRows: data.maxRows ?? config.SQL_MAX_ROWS
      },
      timeoutMs
    )
  );
}

export async function loadDatasetSchema(
  datasetSql: string,
  name: string
): Promise<SqlDatasetSchema> {
  const result = await withSlot(() =>
    execute<{ tables: SqlDatasetSchema['tables'] }>({
      mode: 'schema',
      datasetSql,
      maxRows: config.SQL_MAX_ROWS
    })
  );
  return { name, tables: result.tables };
}

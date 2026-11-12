import fs from 'node:fs';
import path from 'node:path';
import type { SqlDatasetSchema } from '@cyberquest/shared';
import { config } from '../../../config';
import { AppError } from '../../../utils/errors';
import { loadDatasetSchema } from './runner';

const sqlCache = new Map<string, string>();
const schemaCache = new Map<string, Promise<SqlDatasetSchema>>();

export function assertDatasetName(name: string): void {
  if (!/^[a-z0-9_]+$/.test(name)) {
    throw new AppError(400, 'INVALID_DATASET', 'Nome de dataset inválido.');
  }
}

export function readDatasetSql(name: string): string {
  assertDatasetName(name);
  const cached = sqlCache.get(name);
  if (cached) return cached;
  const file = path.join(config.contentDir, 'datasets', `${name}.sql`);
  if (!fs.existsSync(file)) {
    throw new AppError(404, 'DATASET_NOT_FOUND', `Dataset "${name}" não encontrado.`);
  }
  const sql = fs.readFileSync(file, 'utf8');
  sqlCache.set(name, sql);
  return sql;
}

export function getDatasetSchema(name: string): Promise<SqlDatasetSchema> {
  const cached = schemaCache.get(name);
  if (cached) return cached;
  const promise = loadDatasetSchema(readDatasetSql(name), name).catch((error) => {
    schemaCache.delete(name);
    throw error;
  });
  schemaCache.set(name, promise);
  return promise;
}

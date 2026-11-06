import { closeDb, getDb } from './connection';
import { logger } from '../logger';

try {
  const db = getDb();
  const pending = db
    .prepare('SELECT name FROM schema_migrations ORDER BY name')
    .all() as Array<{ name: string }>;
  logger.info({ migrations: pending.map((row) => row.name) }, 'Migrations aplicadas');
} finally {
  closeDb();
}

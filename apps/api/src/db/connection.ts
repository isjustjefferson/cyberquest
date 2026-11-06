import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../config';
import { runMigrations } from './migrate-runner';

export type DB = Database.Database;

let singleton: DB | null = null;

export function createDatabase(databasePath: string): DB {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }
  const db = new Database(databasePath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  return db;
}

export function getDb(): DB {
  if (!singleton) {
    singleton = createDatabase(config.databasePath);
    runMigrations(singleton);
  }
  return singleton;
}

export function closeDb(): void {
  if (singleton) {
    singleton.close();
    singleton = null;
  }
}

export { runMigrations } from './migrate-runner';

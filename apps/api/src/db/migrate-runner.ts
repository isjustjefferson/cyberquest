import fs from 'node:fs';
import path from 'node:path';
import type { DB } from './connection';

function migrationsDir(): string {
  const fromDist = path.resolve(__dirname, 'migrations');
  if (fs.existsSync(fromDist)) return fromDist;
  const fromSrc = path.resolve(process.cwd(), 'src/db/migrations');
  if (fs.existsSync(fromSrc)) return fromSrc;
  throw new Error('Diretório de migrations não encontrado');
}

export function runMigrations(db: DB): string[] {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  );`);
  const dir = migrationsDir();
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.sql'))
    .sort();
  const applied: string[] = [];
  const exists = db.prepare('SELECT 1 FROM schema_migrations WHERE name = ?');
  const insert = db.prepare('INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)');
  for (const file of files) {
    if (exists.get(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const transaction = db.transaction(() => {
      db.exec(sql);
      insert.run(file, new Date().toISOString());
    });
    transaction();
    applied.push(file);
  }
  return applied;
}

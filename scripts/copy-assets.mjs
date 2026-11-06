import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve(process.cwd(), 'src/db/migrations');
const target = resolve(process.cwd(), 'dist/db/migrations');

if (existsSync(source)) {
  cpSync(source, target, { recursive: true });
}

const seedSource = resolve(process.cwd(), 'src/db/seed-queries.sql');
if (existsSync(seedSource)) {
  cpSync(seedSource, resolve(process.cwd(), 'dist/db/seed-queries.sql'));
}

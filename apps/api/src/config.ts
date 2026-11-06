import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(8).default('change-me'),
  LAB_FLAG_SECRET: z.string().min(8).default('change-me-too'),
  DATABASE_PATH: z.string().default('./data/cyberquest.db'),
  MAX_CONCURRENT_LABS: z.coerce.number().int().min(1).max(50).default(3),
  LAB_DEFAULT_TTL_MINUTES: z.coerce.number().int().min(5).max(240).default(60),
  DOCKER_SOCKET: z.string().default('/var/run/docker.sock'),
  CONTENT_DIR: z.string().default('../../content'),
  LABS_DIR: z.string().default('../../labs'),
  LOG_LEVEL: z.string().default('info')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Configuração inválida:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

if (raw.NODE_ENV === 'production') {
  const weak = new Set(['change-me', 'change-me-too', 'secret', 'changeme']);
  if (weak.has(raw.JWT_SECRET) || weak.has(raw.LAB_FLAG_SECRET)) {
    console.error('Recusando iniciar em produção com segredos padrão. Defina JWT_SECRET e LAB_FLAG_SECRET.');
    process.exit(1);
  }
}

export const config = {
  ...raw,
  isProduction: raw.NODE_ENV === 'production',
  isTest: raw.NODE_ENV === 'test',
  webOrigin: raw.WEB_ORIGIN.split(',').map((origin) => origin.trim()),
  databasePath: path.resolve(process.cwd(), raw.DATABASE_PATH),
  contentDir: path.resolve(process.cwd(), raw.CONTENT_DIR),
  labsDir: path.resolve(process.cwd(), raw.LABS_DIR),
  cookieName: 'cq_token',
  jwtExpiresIn: '7d'
};

export type AppConfig = typeof config;

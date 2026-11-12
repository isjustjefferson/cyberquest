import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import type { LabManifest } from '@cyberquest/shared';
import { config } from '../../config';

const imageSchema = z.string().regex(/^(cyberquest\/|postgres:)/, 'Imagem não permitida');

const verifySchema = z
  .object({
    type: z.enum(['sql', 'cmd']),
    container: z.string().min(1),
    user: z.string().min(1).optional(),
    database: z.string().min(1).optional(),
    query: z.string().min(1),
    expect: z
      .object({
        equals: z.string().optional(),
        matches: z.string().optional(),
        exit_code: z.number().int().min(0).max(255).optional()
      })
      .refine((value) => Object.keys(value).length > 0, 'verify.expect precisa de um critério')
  })
  .strict();

const containerSchema = z
  .object({
    name: z.string().min(1),
    image: imageSchema,
    hostname: z.string().optional(),
    env: z.record(z.string(), z.string()).optional(),
    command: z.array(z.string()).optional(),
    init_scripts: z.array(z.string()).optional().default([]),
    files: z
      .array(z.object({ source: z.string().min(1), destination: z.string().min(1) }))
      .optional()
      .default([]),
    ephemeral_volumes: z.array(z.string().startsWith('/')).optional().default([]),
    resources: z
      .object({ memory_mb: z.number().int().min(64).max(4096), cpus: z.number().min(0.1).max(4) })
      .optional(),
    expose_web_port: z.number().int().optional(),
    healthcheck: z
      .object({
        path: z.string().optional(),
        cmd: z.string().optional(),
        timeout_s: z.number().int().min(1).max(180).optional()
      })
      .optional()
  })
  .strict();

const manifestSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    description: z.string(),
    difficulty: z.number().int().min(1).max(5),
    ttl_minutes: z.number().int().min(5).max(240),
    xp_reward: z.number().int().min(0),
    network: z.object({ internal: z.boolean().default(true) }).optional(),
    containers: z
      .object({
        attacker: z.object({ image: imageSchema, hostname: z.string().optional() }).optional(),
        workstation: z
          .object({
            image: imageSchema,
            hostname: z.string().optional(),
            env: z.record(z.string(), z.string()).optional()
          })
          .optional(),
        targets: z.array(containerSchema).optional().default([])
      })
      .strict()
      .refine((value) => Boolean(value.attacker || value.workstation), {
        message: 'O manifesto precisa de containers.attacker ou containers.workstation'
      }),
    terminal: z
      .object({ container: z.string().min(1).optional(), user: z.string().min(1).optional() })
      .strict()
      .optional(),
    objectives: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z0-9-]+$/),
            title: z.string(),
            xp: z.number().int().min(0),
            flag_mode: z.enum(['dynamic', 'static']).optional(),
            verify: verifySchema.optional(),
            hints: z
              .array(z.object({ text: z.string(), cost_bits: z.number().int().min(0) }))
              .optional()
              .default([])
          })
          .strict()
          .refine((objective) => !(objective.verify && objective.flag_mode), {
            message: 'verify e flag_mode são mutuamente exclusivos'
          })
      )
      .min(1),
    writeup: z.string().optional()
  })
  .strict();

export function manifestPathFor(slug: string): string {
  return path.join(config.labsDir, 'manifests', `${slug}.yml`);
}

export function resolveLabFile(relative: string): string {
  const root = path.resolve(config.labsDir, '..');
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep)) {
    throw new Error(`Caminho fora do projeto: ${relative}`);
  }
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo do lab não encontrado: ${relative}`);
  }
  return file;
}

export function loadManifest(slug: string): LabManifest {
  const file = manifestPathFor(slug);
  if (!file.startsWith(path.resolve(config.labsDir))) {
    throw new Error('Manifesto inválido');
  }
  if (!fs.existsSync(file)) {
    throw new Error(`Lab não encontrado: ${slug}`);
  }
  return manifestSchema.parse(yaml.load(fs.readFileSync(file, 'utf8')));
}

export function loadAllManifests(): LabManifest[] {
  const dir = path.join(config.labsDir, 'manifests');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))
    .sort()
    .map((file) => manifestSchema.parse(yaml.load(fs.readFileSync(path.join(dir, file), 'utf8'))));
}

export function loadWriteup(manifest: LabManifest): string | null {
  if (!manifest.writeup) return null;
  const file = path.resolve(config.labsDir, manifest.writeup);
  if (!file.startsWith(path.resolve(config.labsDir))) return null;
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

export { manifestSchema };

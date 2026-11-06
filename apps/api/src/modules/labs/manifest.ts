import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import type { LabManifest } from '@cyberquest/shared';
import { config } from '../../config';

const manifestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string(),
  difficulty: z.number().int().min(1).max(5),
  ttl_minutes: z.number().int().min(5).max(240),
  xp_reward: z.number().int().min(0),
  network: z.object({ internal: z.boolean().default(true) }).optional(),
  containers: z.object({
    attacker: z.object({ image: z.string().regex(/^cyberquest\//), hostname: z.string().optional() }),
    targets: z
      .array(
        z.object({
          name: z.string(),
          image: z.string().regex(/^cyberquest\//),
          hostname: z.string().optional(),
          env: z.record(z.string(), z.string()).optional(),
          expose_web_port: z.number().int().optional(),
          healthcheck: z
            .object({ path: z.string().optional(), timeout_s: z.number().int().optional() })
            .optional()
        })
      )
      .optional()
      .default([])
  }),
  objectives: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        title: z.string(),
        xp: z.number().int().min(0),
        flag_mode: z.enum(['dynamic', 'static']).optional().default('dynamic'),
        hints: z
          .array(z.object({ text: z.string(), cost_bits: z.number().int().min(0) }))
          .optional()
          .default([])
      })
    )
    .min(1),
  writeup: z.string().optional()
});

export function manifestPathFor(slug: string): string {
  return path.join(config.labsDir, 'manifests', `${slug}.yml`);
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

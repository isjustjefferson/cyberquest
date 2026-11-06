import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import {
  lessonFrontmatterSchema,
  moduleFrontmatterSchema,
  trackFrontmatterSchema,
  type LessonFrontmatter,
  type ModuleFrontmatter,
  type TrackFrontmatter
} from '@cyberquest/shared';
import { config } from '../config';
import { logger } from '../logger';

export interface LoadedLesson {
  relativePath: string;
  frontmatter: LessonFrontmatter;
  body: string;
  moduleDir: string;
  trackDir: string;
}

export interface LoadedModule {
  dir: string;
  frontmatter: ModuleFrontmatter;
  lessons: LoadedLesson[];
}

export interface LoadedTrack {
  dir: string;
  frontmatter: TrackFrontmatter;
  modules: LoadedModule[];
}

export interface LoadedAchievement {
  slug: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  criteria: Record<string, unknown>;
}

function readYamlFile<T>(filePath: string): T {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as T;
}

function dirsSorted(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function loadContent(contentDir = config.contentDir): LoadedTrack[] {
  const tracksRoot = path.join(contentDir, 'tracks');
  const tracks: LoadedTrack[] = [];
  for (const trackDir of dirsSorted(tracksRoot)) {
    const trackYml = path.join(tracksRoot, trackDir, 'track.yml');
    if (!fs.existsSync(trackYml)) {
      logger.warn({ trackDir }, 'track.yml ausente; trilha ignorada');
      continue;
    }
    const trackFrontmatter = trackFrontmatterSchema.parse(readYamlFile(trackYml));
    if (!trackFrontmatter.slug) {
      trackFrontmatter.slug = trackDir.replace(/^\d+-/, '');
    }
    const modules: LoadedModule[] = [];
    for (const moduleDir of dirsSorted(path.join(tracksRoot, trackDir))) {
      const modulePath = path.join(tracksRoot, trackDir, moduleDir);
      const moduleYml = path.join(modulePath, 'module.yml');
      if (!fs.existsSync(moduleYml)) continue;
      const moduleFrontmatter = moduleFrontmatterSchema.parse(readYamlFile(moduleYml));
      const lessons: LoadedLesson[] = [];
      const files = fs
        .readdirSync(modulePath)
        .filter((file) => file.endsWith('.md'))
        .sort();
      for (const file of files) {
        const full = path.join(modulePath, file);
        const parsed = matter(fs.readFileSync(full, 'utf8'));
        const frontmatter = lessonFrontmatterSchema.parse(parsed.data);
        lessons.push({
          relativePath: path.relative(contentDir, full).split(path.sep).join('/'),
          frontmatter,
          body: parsed.content,
          moduleDir,
          trackDir
        });
      }
      modules.push({ dir: moduleDir, frontmatter: moduleFrontmatter, lessons });
    }
    tracks.push({ dir: trackDir, frontmatter: trackFrontmatter, modules });
  }
  return tracks;
}

export function loadAchievements(contentDir = config.contentDir): LoadedAchievement[] {
  const file = path.join(contentDir, 'achievements.yml');
  if (!fs.existsSync(file)) return [];
  const data = yaml.load(fs.readFileSync(file, 'utf8')) as { achievements?: LoadedAchievement[] };
  return data.achievements ?? [];
}

export function readLessonBody(contentPath: string, contentDir = config.contentDir): string {
  const full = path.resolve(contentDir, contentPath);
  if (!full.startsWith(path.resolve(contentDir))) {
    throw new Error('Caminho de conteúdo inválido');
  }
  if (!fs.existsSync(full)) {
    return '_Conteúdo indisponível. Rode `pnpm seed` novamente._';
  }
  return matter(fs.readFileSync(full, 'utf8')).content;
}

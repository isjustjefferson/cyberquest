import {
  publicExercisePayload,
  type AreaDetail,
  type AreaNextLesson,
  type AreaStats,
  type AreaSummary,
  type Exercise,
  type LessonDetail,
  type LessonListEntry,
  type ModuleDetail,
  type PublicExercise,
  type TrackDetail,
  type TrackSummary
} from '@cyberquest/shared';
import type { DB } from '../../db/connection';
import { readLessonBody } from '../../content/loader';
import { AppError } from '../../utils/errors';

export interface LessonRow {
  id: number;
  module_id: number;
  slug: string;
  title: string;
  kind: 'lesson' | 'lab' | 'boss';
  difficulty: number;
  est_minutes: number;
  xp_reward: number;
  position: number;
  content_path: string;
  lab_slug: string | null;
  status: 'complete' | 'draft';
  prerequisites_json: string;
}

export interface OrderedLessonRow extends LessonRow {
  module_slug: string;
  module_title: string;
  module_position: number;
  track_slug: string;
  track_title: string;
  track_position: number;
  area_id: number;
  area_slug: string;
  area_title: string;
  area_position: number;
}

interface AreaRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  status: 'active' | 'coming_soon';
}

export type ProgressStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface ProgressInfo {
  status: ProgressStatus;
  stars: number;
  bestScore: number | null;
}

export function orderedLessons(db: DB, areaSlug?: string): OrderedLessonRow[] {
  const where = areaSlug ? 'WHERE a.slug = ?' : '';
  const params = areaSlug ? [areaSlug] : [];
  return db
    .prepare(
      `SELECT l.*, m.slug AS module_slug, m.title AS module_title, m.position AS module_position,
              t.slug AS track_slug, t.title AS track_title, t.position AS track_position,
              a.id AS area_id, a.slug AS area_slug, a.title AS area_title, a.position AS area_position
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
       JOIN areas a ON a.id = t.area_id
       ${where}
       ORDER BY a.position ASC, t.position ASC, m.position ASC, l.position ASC`
    )
    .all(...params) as OrderedLessonRow[];
}

export function progressMap(db: DB, userId: number, areaSlug?: string): Map<number, ProgressInfo> {
  const lessons = orderedLessons(db, areaSlug);
  const rows = db
    .prepare('SELECT lesson_id, status, stars, best_score FROM user_lessons WHERE user_id = ?')
    .all(userId) as Array<{ lesson_id: number; status: string; stars: number; best_score: number | null }>;
  const userState = new Map(rows.map((row) => [row.lesson_id, row]));
  const completedSlugs = new Set(
    lessons.filter((lesson) => userState.get(lesson.id)?.status === 'completed').map((lesson) => lesson.slug)
  );
  const result = new Map<number, ProgressInfo>();
  const previousCompletedByArea = new Map<string, boolean>();
  for (const lesson of lessons) {
    const state = userState.get(lesson.id);
    let prerequisites: string[] = [];
    try {
      prerequisites = JSON.parse(lesson.prerequisites_json);
    } catch {
      prerequisites = [];
    }
    const previousCompleted = previousCompletedByArea.get(lesson.area_slug) ?? true;
    const prerequisitesDone = prerequisites.every((slug) => completedSlugs.has(slug));
    let status: ProgressStatus;
    if (state?.status === 'completed') {
      status = 'completed';
    } else if (!previousCompleted || !prerequisitesDone) {
      status = 'locked';
    } else if (state?.status === 'in_progress') {
      status = 'in_progress';
    } else {
      status = 'available';
    }
    result.set(lesson.id, {
      status,
      stars: state?.stars ?? 0,
      bestScore: state?.best_score ?? null
    });
    previousCompletedByArea.set(lesson.area_slug, state?.status === 'completed');
  }
  return result;
}

export function listTracks(db: DB, userId?: number, areaSlug?: string): TrackSummary[] {
  const where = areaSlug ? 'WHERE a.slug = ?' : '';
  const params = areaSlug ? [areaSlug] : [];
  const tracks = db
    .prepare(
      `SELECT t.*, a.slug AS area_slug, a.title AS area_title
       FROM tracks t
       JOIN areas a ON a.id = t.area_id
       ${where}
       ORDER BY a.position ASC, t.position ASC`
    )
    .all(...params) as Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    position: number;
    status: 'available' | 'coming_soon';
    area_slug: string;
    area_title: string;
  }>;
  const progress = userId ? progressMap(db, userId, areaSlug) : null;
  return tracks.map((track) => {
    const lessons = db
      .prepare(
        `SELECT l.id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.track_id = ?`
      )
      .all(track.id) as Array<{ id: number }>;
    const completed = lessons.filter((lesson) => progress?.get(lesson.id)?.status === 'completed').length;
    return {
      id: track.id,
      slug: track.slug,
      title: track.title,
      description: track.description,
      icon: track.icon,
      color: track.color,
      position: track.position,
      status: track.status,
      areaSlug: track.area_slug,
      areaTitle: track.area_title,
      totalLessons: lessons.length,
      completedLessons: completed,
      percent: lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100)
    };
  });
}

export function getTrack(db: DB, slug: string, userId?: number): TrackDetail {
  const tracks = listTracks(db, userId);
  const summary = tracks.find((track) => track.slug === slug);
  if (!summary) throw new AppError(404, 'TRACK_NOT_FOUND', 'Trilha não encontrada.');
  const progress = userId ? progressMap(db, userId) : new Map<number, ProgressInfo>();
  const modules = db
    .prepare('SELECT * FROM modules WHERE track_id = ? ORDER BY position ASC')
    .all(summary.id) as Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
    position: number;
  }>;
  const moduleDetails: ModuleDetail[] = modules.map((module) => {
    const lessons = db
      .prepare('SELECT * FROM lessons WHERE module_id = ? ORDER BY position ASC')
      .all(module.id) as LessonRow[];
    const entries: LessonListEntry[] = lessons.map((lesson) => {
      const info = progress.get(lesson.id);
      return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        kind: lesson.kind,
        difficulty: lesson.difficulty,
        estMinutes: lesson.est_minutes,
        xp: lesson.xp_reward,
        status: lesson.status,
        progressStatus: (info?.status ?? 'locked') as ProgressStatus,
        stars: info?.stars ?? 0,
        labSlug: lesson.lab_slug
      };
    });
    return {
      id: module.id,
      slug: module.slug,
      title: module.title,
      description: module.description,
      position: module.position,
      lessons: entries
    };
  });
  return { ...summary, modules: moduleDetails };
}

export function findLessonBySlug(db: DB, slug: string): OrderedLessonRow {
  const lesson = db
    .prepare(
      `SELECT l.*, m.slug AS module_slug, m.title AS module_title, m.position AS module_position,
              t.slug AS track_slug, t.title AS track_title, t.position AS track_position,
              a.id AS area_id, a.slug AS area_slug, a.title AS area_title, a.position AS area_position
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
       JOIN areas a ON a.id = t.area_id
       WHERE l.slug = ?`
    )
    .get(slug) as OrderedLessonRow | undefined;
  if (!lesson) throw new AppError(404, 'LESSON_NOT_FOUND', 'Lição não encontrada.');
  return lesson;
}

export function getLessonDetail(db: DB, slug: string, userId?: number): LessonDetail {
  const lesson = findLessonBySlug(db, slug);
  const progress = userId ? progressMap(db, userId) : new Map<number, ProgressInfo>();
  const info = progress.get(lesson.id);
  if (userId && info?.status === 'locked') {
    throw new AppError(403, 'LESSON_LOCKED', 'Complete as lições anteriores para desbloquear esta.');
  }
  const exercises = db
    .prepare('SELECT * FROM exercises WHERE lesson_id = ? ORDER BY position ASC')
    .all(lesson.id) as Array<{ id: number; lesson_id: number; position: number; type: string; payload_json: string; xp: number }>;
  const publicExercises: PublicExercise[] = exercises.map((exercise) => {
    const payload = JSON.parse(exercise.payload_json) as Exercise;
    return {
      id: exercise.id,
      lessonSlug: lesson.slug,
      position: exercise.position,
      type: payload.type,
      xp: exercise.xp,
      payload: publicExercisePayload(payload)
    };
  });
  let prerequisites: string[] = [];
  try {
    prerequisites = JSON.parse(lesson.prerequisites_json);
  } catch {
    prerequisites = [];
  }
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    kind: lesson.kind,
    difficulty: lesson.difficulty,
    estMinutes: lesson.est_minutes,
    xp: lesson.xp_reward,
    status: lesson.status,
    areaSlug: lesson.area_slug,
    areaTitle: lesson.area_title,
    trackSlug: lesson.track_slug,
    trackTitle: lesson.track_title,
    moduleSlug: lesson.module_slug,
    moduleTitle: lesson.module_title,
    content: readLessonBody(lesson.content_path),
    prerequisites,
    progressStatus: (info?.status ?? 'available') as ProgressStatus,
    stars: info?.stars ?? 0,
    bestScore: info?.bestScore ?? null,
    labSlug: lesson.lab_slug,
    exercises: publicExercises
  };
}

function areaLessonCounts(db: DB, areaId: number): { total: number } {
  const row = db
    .prepare(
      `SELECT COUNT(l.id) AS total
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
       WHERE t.area_id = ?`
    )
    .get(areaId) as { total: number } | undefined;
  return { total: row?.total ?? 0 };
}

export function areaExists(db: DB, slug: string): boolean {
  return Boolean(db.prepare('SELECT 1 FROM areas WHERE slug = ?').get(slug));
}

export function areaXp(db: DB, userId: number, areaId: number): number {
  const row = db
    .prepare('SELECT COALESCE(SUM(amount), 0) AS xp FROM xp_events WHERE user_id = ? AND area_id = ?')
    .get(userId, areaId) as { xp: number } | undefined;
  return row?.xp ?? 0;
}

function nextLessonForArea(db: DB, userId: number, areaSlug: string): AreaNextLesson | null {
  const lessons = orderedLessons(db, areaSlug);
  const progress = progressMap(db, userId, areaSlug);
  const inProgress = lessons.find((lesson) => progress.get(lesson.id)?.status === 'in_progress');
  const available = lessons.find((lesson) => progress.get(lesson.id)?.status === 'available');
  const lesson = inProgress ?? available;
  if (!lesson) return null;
  return {
    slug: lesson.slug,
    title: lesson.title,
    trackSlug: lesson.track_slug,
    trackTitle: lesson.track_title,
    moduleTitle: lesson.module_title,
    status: inProgress ? 'in_progress' : 'available'
  };
}

export function listAreas(db: DB, userId?: number): AreaSummary[] {
  const areas = db.prepare('SELECT * FROM areas ORDER BY position ASC, slug ASC').all() as AreaRow[];
  return areas.map((area) => {
    const counts = areaLessonCounts(db, area.id);
    const completed = userId
      ? (
          db
            .prepare(
              `SELECT COUNT(*) AS total
               FROM user_lessons ul
               JOIN lessons l ON l.id = ul.lesson_id
               JOIN modules m ON m.id = l.module_id
               JOIN tracks t ON t.id = m.track_id
               WHERE ul.user_id = ? AND ul.status = 'completed' AND t.area_id = ?`
            )
            .get(userId, area.id) as { total: number }
        ).total
      : 0;
    return {
      id: area.id,
      slug: area.slug,
      title: area.title,
      description: area.description,
      icon: area.icon,
      color: area.color,
      position: area.position,
      status: area.status,
      totalLessons: counts.total,
      completedLessons: completed,
      percent: counts.total === 0 ? 0 : Math.round((completed / counts.total) * 100),
      xp: userId ? areaXp(db, userId, area.id) : 0,
      nextLesson: userId ? nextLessonForArea(db, userId, area.slug) : null
    };
  });
}

export function getArea(db: DB, slug: string, userId?: number): AreaDetail {
  const area = listAreas(db, userId).find((item) => item.slug === slug);
  if (!area) throw new AppError(404, 'AREA_NOT_FOUND', 'Área não encontrada.');
  return { ...area, tracks: listTracks(db, userId, slug) };
}

export function getUserAreaStats(db: DB, userId: number): AreaStats[] {
  const areas = db.prepare('SELECT * FROM areas ORDER BY position ASC, slug ASC').all() as AreaRow[];
  return areas.map((area) => {
    const counts = areaLessonCounts(db, area.id);
    const completed = (
      db
        .prepare(
          `SELECT COUNT(*) AS total
           FROM user_lessons ul
           JOIN lessons l ON l.id = ul.lesson_id
           JOIN modules m ON m.id = l.module_id
           JOIN tracks t ON t.id = m.track_id
           WHERE ul.user_id = ? AND ul.status = 'completed' AND t.area_id = ?`
        )
        .get(userId, area.id) as { total: number }
    ).total;
    return {
      id: area.id,
      slug: area.slug,
      title: area.title,
      icon: area.icon,
      color: area.color,
      xp: areaXp(db, userId, area.id),
      completedLessons: completed,
      totalLessons: counts.total,
      percent: counts.total === 0 ? 0 : Math.round((completed / counts.total) * 100)
    };
  });
}

export function markLessonStarted(db: DB, userId: number, lessonSlug: string): void {
  const lesson = findLessonBySlug(db, lessonSlug);
  const info = progressMap(db, userId, lesson.area_slug).get(lesson.id);
  if (!info || info.status === 'locked') {
    throw new AppError(403, 'LESSON_LOCKED', 'Esta lição ainda está bloqueada.');
  }
  if (info.status === 'completed') return;
  db.prepare(
    `INSERT INTO user_lessons (user_id, lesson_id, status, attempts)
     VALUES (?, ?, 'in_progress', 0)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = 'in_progress'`
  ).run(userId, lesson.id);
}

import {
  publicExercisePayload,
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
}

export type ProgressStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface ProgressInfo {
  status: ProgressStatus;
  stars: number;
  bestScore: number | null;
}

export function orderedLessons(db: DB): OrderedLessonRow[] {
  return db
    .prepare(
      `SELECT l.*, m.slug AS module_slug, m.title AS module_title, m.position AS module_position,
              t.slug AS track_slug, t.title AS track_title, t.position AS track_position
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
       ORDER BY t.position ASC, m.position ASC, l.position ASC`
    )
    .all() as OrderedLessonRow[];
}

export function progressMap(db: DB, userId: number): Map<number, ProgressInfo> {
  const lessons = orderedLessons(db);
  const rows = db
    .prepare('SELECT lesson_id, status, stars, best_score FROM user_lessons WHERE user_id = ?')
    .all(userId) as Array<{ lesson_id: number; status: string; stars: number; best_score: number | null }>;
  const userState = new Map(rows.map((row) => [row.lesson_id, row]));
  const completedSlugs = new Set(
    lessons.filter((lesson) => userState.get(lesson.id)?.status === 'completed').map((lesson) => lesson.slug)
  );
  const result = new Map<number, ProgressInfo>();
  let previousCompleted = true;
  for (const lesson of lessons) {
    const state = userState.get(lesson.id);
    let prerequisites: string[] = [];
    try {
      prerequisites = JSON.parse(lesson.prerequisites_json);
    } catch {
      prerequisites = [];
    }
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
    previousCompleted = state?.status === 'completed';
  }
  return result;
}

export function listTracks(db: DB, userId?: number): TrackSummary[] {
  const tracks = db.prepare('SELECT * FROM tracks ORDER BY position ASC').all() as Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    position: number;
    status: 'available' | 'coming_soon';
  }>;
  const progress = userId ? progressMap(db, userId) : null;
  return tracks.map((track) => {
    const lessons = db
      .prepare(
        `SELECT l.id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.track_id = ?`
      )
      .all(track.id) as Array<{ id: number }>;
    const completed = lessons.filter((lesson) => progress?.get(lesson.id)?.status === 'completed').length;
    return {
      ...track,
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
              t.slug AS track_slug, t.title AS track_title, t.position AS track_position
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
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

export function markLessonStarted(db: DB, userId: number, lessonSlug: string): void {
  const lesson = findLessonBySlug(db, lessonSlug);
  const info = progressMap(db, userId).get(lesson.id);
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

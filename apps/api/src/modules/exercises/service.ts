import {
  sm2,
  type AnswerResult,
  type Exercise,
  type ReviewItem,
  type PublicExercise,
  publicExercisePayload
} from '@cyberquest/shared';
import type { DB } from '../../db/connection';
import { findLessonBySlug, progressMap } from '../content/service';
import { evaluateAchievements, grantXp, getUser, getUserStats, touchActivity } from '../gamification/service';
import { gradeExercise } from './grader';
import { AppError } from '../../utils/errors';
import { nowIso } from '../../utils/time';

interface ExerciseRow {
  id: number;
  lesson_id: number;
  position: number;
  type: string;
  payload_json: string;
  xp: number;
}

function getExercise(db: DB, exerciseId: number): ExerciseRow {
  const row = db.prepare('SELECT * FROM exercises WHERE id = ?').get(exerciseId) as ExerciseRow | undefined;
  if (!row) throw new AppError(404, 'EXERCISE_NOT_FOUND', 'Exercício não encontrado.');
  return row;
}

function scheduleReview(db: DB, userId: number, exerciseId: number, quality: number, now = new Date()): void {
  const existing = db
    .prepare('SELECT interval_days, ease FROM review_queue WHERE user_id = ? AND exercise_id = ?')
    .get(userId, exerciseId) as { interval_days: number; ease: number } | undefined;
  const next = sm2(existing ? { intervalDays: existing.interval_days, ease: existing.ease } : null, quality);
  const nextDate = new Date(now.getTime() + next.intervalDays * 86_400_000).toISOString();
  db.prepare(
    `INSERT INTO review_queue (user_id, exercise_id, next_review_at, interval_days, ease)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, exercise_id) DO UPDATE SET
       next_review_at = excluded.next_review_at,
       interval_days = excluded.interval_days,
       ease = excluded.ease`
  ).run(userId, exerciseId, nextDate, next.intervalDays, next.ease);
}

export function answerExercise(db: DB, userId: number, exerciseId: number, answer: unknown): AnswerResult {
  const row = getExercise(db, exerciseId);
  const lesson = findLessonBySlug(
    db,
    (db.prepare('SELECT slug FROM lessons WHERE id = ?').get(row.lesson_id) as { slug: string }).slug
  );
  const info = progressMap(db, userId).get(lesson.id);
  if (!info || info.status === 'locked') {
    throw new AppError(403, 'LESSON_LOCKED', 'Esta lição ainda está bloqueada.');
  }
  const exercise = JSON.parse(row.payload_json) as Exercise;
  const graded = gradeExercise(exercise, answer);
  const userBefore = getUser(db, userId);

  db.prepare(
    'INSERT INTO exercise_attempts (user_id, exercise_id, correct, answer_json, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, exerciseId, graded.correct ? 1 : 0, JSON.stringify(answer ?? null), nowIso());

  db.prepare(
    `INSERT INTO user_lessons (user_id, lesson_id, status, attempts)
     VALUES (?, ?, 'in_progress', 1)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET
       attempts = attempts + 1,
       status = CASE WHEN user_lessons.status = 'completed' THEN 'completed' ELSE 'in_progress' END`
  ).run(userId, lesson.id);

  let xpGained = 0;
  if (graded.correct) {
    xpGained += grantXp(db, userId, 'exercise', String(exerciseId), exercise.xp ?? row.xp);
    scheduleReview(db, userId, exerciseId, 5);
  } else {
    scheduleReview(db, userId, exerciseId, 1);
  }

  const activity = touchActivity(db, userId);
  xpGained += activity.xpGained;
  const unlockedAchievements = evaluateAchievements(db, userId, {
    type: 'exercise_answered',
    lessonSlug: lesson.slug,
    moduleSlug: lesson.module_slug,
    trackSlug: lesson.track_slug,
    exerciseType: exercise.type
  });
  const userAfter = getUser(db, userId);
  const stats = getUserStats(db, userId);

  return {
    correct: graded.correct,
    explanation: graded.explanation,
    xpGained,
    totalXp: userAfter.xp_total,
    level: userAfter.level,
    levelTitle: stats.levelTitle,
    leveledUp: userAfter.level > userBefore.level,
    bitsGained: 0,
    streak: {
      current: userAfter.streak_current,
      best: userAfter.streak_best,
      freezes: userAfter.streak_freezes
    },
    unlockedAchievements,
    reviewScheduled: true
  };
}

export function dueReviews(db: DB, userId: number, now = new Date()): ReviewItem[] {
  const rows = db
    .prepare(
      `SELECT e.*, r.next_review_at, r.interval_days, l.slug AS lesson_slug
       FROM review_queue r
       JOIN exercises e ON e.id = r.exercise_id
       JOIN lessons l ON l.id = e.lesson_id
       WHERE r.user_id = ? AND r.next_review_at <= ?
       ORDER BY r.next_review_at ASC
       LIMIT 20`
    )
    .all(userId, now.toISOString()) as Array<
    ExerciseRow & { next_review_at: string; interval_days: number; lesson_slug: string }
  >;
  return rows.map((row) => {
    const payload = JSON.parse(row.payload_json) as Exercise;
    const publicExercise: PublicExercise = {
      id: row.id,
      lessonSlug: row.lesson_slug,
      position: row.position,
      type: payload.type,
      xp: row.xp,
      payload: publicExercisePayload(payload)
    };
    return {
      exercise: publicExercise,
      nextReviewAt: row.next_review_at,
      intervalDays: row.interval_days
    };
  });
}

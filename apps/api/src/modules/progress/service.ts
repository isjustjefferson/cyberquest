import { perfectLessonBonus, starsForLesson, XP } from '@cyberquest/shared';
import type { DB } from '../../db/connection';
import { findLessonBySlug, progressMap } from '../content/service';
import { evaluateAchievements, grantBits, grantXp, getUserStats, touchActivity } from '../gamification/service';
import { AppError } from '../../utils/errors';
import { nowIso } from '../../utils/time';

export interface LessonCompletionResult {
  lessonSlug: string;
  xpGained: number;
  bonusXp: number;
  bitsGained: number;
  stars: number;
  moduleCompleted: boolean;
  stats: ReturnType<typeof getUserStats>;
  unlockedAchievements: ReturnType<typeof evaluateAchievements>;
}

export function completeLesson(db: DB, userId: number, lessonSlug: string): LessonCompletionResult {
  const lesson = findLessonBySlug(db, lessonSlug);
  const info = progressMap(db, userId).get(lesson.id);
  if (!info || info.status === 'locked') {
    throw new AppError(403, 'LESSON_LOCKED', 'Esta lição ainda está bloqueada.');
  }
  const already = info.status === 'completed';
  const exerciseCount = (
    db.prepare('SELECT COUNT(*) AS total FROM exercises WHERE lesson_id = ?').get(lesson.id) as { total: number }
  ).total;
  const wrongAttempts = (
    db
      .prepare(
        `SELECT COUNT(*) AS total FROM exercise_attempts a
         JOIN exercises e ON e.id = a.exercise_id
         WHERE a.user_id = ? AND e.lesson_id = ? AND a.correct = 0`
      )
      .get(userId, lesson.id) as { total: number }
  ).total;
  const stars = starsForLesson(wrongAttempts, exerciseCount);
  const perfect = exerciseCount > 0 && wrongAttempts === 0;
  const bonusXp = perfect ? perfectLessonBonus(lesson.xp_reward) : 0;
  const xpGained = already ? 0 : grantXp(db, userId, 'lesson', lesson.slug, lesson.xp_reward + bonusXp);
  const bitsGained = xpGained > 0 ? grantBits(db, userId, `lesson_${lesson.slug}`, XP.bitsPerLesson) : 0;

  db.prepare(
    `INSERT INTO user_lessons (user_id, lesson_id, status, best_score, attempts, stars, completed_at)
     VALUES (?, ?, 'completed', ?, 1, ?, ?)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET
       status = 'completed',
       best_score = MAX(COALESCE(best_score, 0), excluded.best_score),
       stars = MAX(stars, excluded.stars),
       completed_at = COALESCE(completed_at, excluded.completed_at)`
  ).run(userId, lesson.id, perfect ? 100 : Math.max(50, 100 - wrongAttempts * 10), stars, nowIso());

  const moduleTotals = db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN ul.status = 'completed' THEN 1 ELSE 0 END) AS done
       FROM lessons l
       LEFT JOIN user_lessons ul ON ul.lesson_id = l.id AND ul.user_id = ?
       WHERE l.module_id = ?`
    )
    .get(userId, lesson.module_id) as { total: number; done: number | null };
  const moduleRow = db
    .prepare('SELECT slug, xp_reward FROM modules WHERE id = ?')
    .get(lesson.module_id) as { slug: string; xp_reward: number };
  let moduleCompleted = false;
  if ((moduleTotals.done ?? 0) >= moduleTotals.total && moduleRow.xp_reward > 0) {
    const gained = grantXp(db, userId, 'module', moduleRow.slug, moduleRow.xp_reward);
    if (gained > 0) {
      moduleCompleted = true;
      grantBits(db, userId, `module_${moduleRow.slug}`, 15);
    }
  }

  const activity = touchActivity(db, userId);
  const unlockedAchievements = evaluateAchievements(db, userId, {
    type: 'lesson_completed',
    lessonSlug: lesson.slug,
    moduleSlug: lesson.module_slug,
    trackSlug: lesson.track_slug
  });

  return {
    lessonSlug: lesson.slug,
    xpGained: xpGained + activity.xpGained,
    bonusXp,
    bitsGained,
    stars,
    moduleCompleted,
    stats: getUserStats(db, userId),
    unlockedAchievements
  };
}

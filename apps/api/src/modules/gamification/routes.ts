import { Router } from 'express';
import {
  cosmeticById,
  COSMETICS,
  publicExercisePayload,
  SHOP,
  type AnswerResult,
  type DailyChallenge,
  type Exercise,
  type PublicExercise
} from '@cyberquest/shared';
import { z } from 'zod';
import { getDb } from '../../db/connection';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler, AppError } from '../../utils/errors';
import {
  allTimeLeaderboard,
  evaluateAchievements,
  getUser,
  getUserStats,
  grantBits,
  grantXp,
  listAchievements,
  touchActivity,
  weeklyLeaderboard
} from './service';
import { gradeExercise } from '../exercises/grader';
import { sm2 } from '@cyberquest/shared';
import { nowIso } from '../../utils/time';

export const gamificationRouter = Router();

gamificationRouter.get(
  '/me/stats',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ stats: getUserStats(db, req.user!.id) });
  })
);

gamificationRouter.get(
  '/me/dashboard',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const userId = req.user!.id;
    const { orderedLessons, progressMap } = await import('../content/service');
    const lessons = orderedLessons(db);
    const progress = progressMap(db, userId);
    const inProgress = lessons.find((lesson) => progress.get(lesson.id)?.status === 'in_progress');
    const available = lessons.find((lesson) => progress.get(lesson.id)?.status === 'available');
    const next = inProgress ?? available ?? lessons[0] ?? null;
    const dueCount = (
      db
        .prepare('SELECT COUNT(*) AS total FROM review_queue WHERE user_id = ? AND next_review_at <= ?')
        .get(userId, new Date().toISOString()) as { total: number }
    ).total;
    const recentAchievements = listAchievements(db, userId)
      .filter((item) => item.unlockedAt)
      .slice(-3)
      .reverse();
    res.json({
      stats: getUserStats(db, userId),
      continueLesson: next
        ? {
            slug: next.slug,
            title: next.title,
            kind: next.kind,
            trackSlug: next.track_slug,
            trackTitle: next.track_title,
            moduleTitle: next.module_title,
            status: progress.get(next.id)?.status ?? 'available'
          }
        : null,
      dueCount,
      dailyChallenge: ensureDailyChallenge(db, userId),
      recentAchievements,
      weeklyLeaderboard: weeklyLeaderboard(db).slice(0, 5)
    });
  })
);

gamificationRouter.get(
  '/me/achievements',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ achievements: listAchievements(db, req.user!.id) });
  })
);

gamificationRouter.get(
  '/achievements',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ achievements: listAchievements(db, req.user!.id) });
  })
);

gamificationRouter.get(
  '/leaderboard/weekly',
  asyncHandler(async (_req, res) => {
    const db = getDb();
    res.json({ leaderboard: weeklyLeaderboard(db) });
  })
);

gamificationRouter.get(
  '/leaderboard/all-time',
  asyncHandler(async (_req, res) => {
    const db = getDb();
    res.json({ leaderboard: allTimeLeaderboard(db) });
  })
);

function ensureDailyChallenge(db: ReturnType<typeof getDb>, userId: number): DailyChallenge {
  const today = new Date().toISOString().slice(0, 10);
  let row = db.prepare('SELECT * FROM daily_challenges WHERE date = ?').get(today) as
    | { date: string; exercise_id: number | null; bonus_xp: number }
    | undefined;
  if (!row) {
    let picked = db
      .prepare(
        `SELECT e.id FROM exercises e
         WHERE e.lesson_id IN (SELECT lesson_id FROM user_lessons WHERE user_id = ? AND status = 'completed')
         ORDER BY RANDOM() LIMIT 1`
      )
      .get(userId) as { id: number } | undefined;
    if (!picked) {
      picked = db.prepare('SELECT id FROM exercises ORDER BY RANDOM() LIMIT 1').get() as
        | { id: number }
        | undefined;
    }
    if (picked) {
      db.prepare('INSERT OR IGNORE INTO daily_challenges (date, exercise_id, bonus_xp) VALUES (?, ?, ?)').run(
        today,
        picked.id,
        SHOP.hintPricePerIndex + 15
      );
      row = db.prepare('SELECT * FROM daily_challenges WHERE date = ?').get(today) as typeof row;
    }
  }
  const answered = Boolean(
    db
      .prepare("SELECT 1 FROM xp_events WHERE user_id = ? AND source_type = 'daily_challenge' AND source_id = ?")
      .get(userId, today)
  );
  let exercise: PublicExercise | null = null;
  if (row?.exercise_id) {
    const exerciseRow = db
      .prepare(
        `SELECT e.*, l.slug AS lesson_slug FROM exercises e JOIN lessons l ON l.id = e.lesson_id WHERE e.id = ?`
      )
      .get(row.exercise_id) as
      | { id: number; lesson_slug: string; position: number; payload_json: string; xp: number }
      | undefined;
    if (exerciseRow) {
      const payload = JSON.parse(exerciseRow.payload_json) as Exercise;
      exercise = {
        id: exerciseRow.id,
        lessonSlug: exerciseRow.lesson_slug,
        position: exerciseRow.position,
        type: payload.type,
        xp: exerciseRow.xp,
        payload: publicExercisePayload(payload)
      };
    }
  }
  return { date: today, exercise, bonusXp: row?.bonus_xp ?? 25, answered };
}

gamificationRouter.get(
  '/daily-challenge',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ challenge: ensureDailyChallenge(db, req.user!.id) });
  })
);

const dailyAnswerSchema = z.object({
  exerciseId: z.number().int(),
  answer: z.unknown()
});

gamificationRouter.post(
  '/daily-challenge/answer',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = dailyAnswerSchema.parse(req.body);
    const db = getDb();
    const userId = req.user!.id;
    const challenge = ensureDailyChallenge(db, userId);
    if (!challenge.exercise || challenge.exercise.id !== input.exerciseId) {
      throw new AppError(400, 'INVALID_CHALLENGE', 'Este não é o desafio diário de hoje.');
    }
    const row = db.prepare('SELECT * FROM exercises WHERE id = ?').get(input.exerciseId) as {
      payload_json: string;
    };
    const exercise = JSON.parse(row.payload_json) as Exercise;
    const graded = gradeExercise(exercise, input.answer);
    db.prepare(
      'INSERT INTO exercise_attempts (user_id, exercise_id, correct, answer_json, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, input.exerciseId, graded.correct ? 1 : 0, JSON.stringify(input.answer), nowIso());

    const before = getUser(db, userId);
    let xpGained = 0;
    if (graded.correct) {
      xpGained += grantXp(db, userId, 'daily_challenge', challenge.date, challenge.bonusXp);
    }
    const activity = touchActivity(db, userId);
    xpGained += activity.xpGained;
    const unlockedAchievements = evaluateAchievements(db, userId, { type: 'daily_challenge' });
    const after = getUser(db, userId);
    const stats = getUserStats(db, userId);
    const result: AnswerResult = {
      correct: graded.correct,
      explanation: graded.explanation,
      xpGained,
      totalXp: after.xp_total,
      level: after.level,
      levelTitle: stats.levelTitle,
      leveledUp: after.level > before.level,
      bitsGained: 0,
      streak: { current: after.streak_current, best: after.streak_best, freezes: after.streak_freezes },
      unlockedAchievements,
      reviewScheduled: false
    };
    res.json(result);
  })
);

gamificationRouter.post(
  '/shop/streak-freeze',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const user = getUser(db, req.user!.id);
    if (user.streak_freezes >= SHOP.maxStreakFreezes) {
      throw new AppError(400, 'MAX_FREEZES', 'Você já tem o máximo de congelamentos de streak.');
    }
    if (user.bits < SHOP.streakFreezePrice) {
      throw new AppError(400, 'NOT_ENOUGH_BITS', 'Bits insuficientes para comprar um congelamento.');
    }
    const transaction = db.transaction(() => {
      grantBits(db, user.id, 'streak_freeze_purchase', -SHOP.streakFreezePrice);
      db.prepare('UPDATE users SET streak_freezes = streak_freezes + 1 WHERE id = ?').run(user.id);
    });
    transaction();
    res.json({ stats: getUserStats(db, user.id) });
  })
);

gamificationRouter.get(
  '/me/cosmetics',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const owned = db
      .prepare('SELECT item_id FROM user_cosmetics WHERE user_id = ?')
      .all(req.user!.id) as Array<{ item_id: string }>;
    const ownedIds = new Set(owned.map((row) => row.item_id));
    res.json({
      cosmetics: COSMETICS.map((item) => ({ ...item, owned: ownedIds.has(item.id) })),
      avatarId: req.user!.avatar_id
    });
  })
);

gamificationRouter.post(
  '/shop/cosmetics/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const item = cosmeticById(req.params.id);
    if (!item) throw new AppError(404, 'ITEM_NOT_FOUND', 'Item não encontrado.');
    if (item.priceBits <= 0) throw new AppError(400, 'INVALID_ITEM', 'Este item não está à venda.');
    const db = getDb();
    const user = getUser(db, req.user!.id);
    const owned = db
      .prepare('SELECT 1 FROM user_cosmetics WHERE user_id = ? AND item_id = ?')
      .get(user.id, item.id);
    if (owned) throw new AppError(400, 'ALREADY_OWNED', 'Você já possui este item.');
    if (user.bits < item.priceBits) {
      throw new AppError(400, 'NOT_ENOUGH_BITS', 'Bits insuficientes para este item.');
    }
    const transaction = db.transaction(() => {
      grantBits(db, user.id, `cosmetic_${item.id}`, -item.priceBits);
      db.prepare('INSERT INTO user_cosmetics (user_id, item_id, acquired_at) VALUES (?, ?, ?)').run(
        user.id,
        item.id,
        nowIso()
      );
    });
    transaction();
    res.json({ ok: true, stats: getUserStats(db, user.id) });
  })
);

gamificationRouter.post(
  '/me/avatar',
  requireAuth,
  asyncHandler(async (req, res) => {
    const avatarId = z.object({ avatarId: z.string().min(1) }).parse(req.body).avatarId;
    const db = getDb();
    const owned = db
      .prepare('SELECT 1 FROM user_cosmetics WHERE user_id = ? AND item_id = ?')
      .get(req.user!.id, avatarId);
    const cosmetic = cosmeticById(avatarId);
    if (!owned || !cosmetic || cosmetic.kind !== 'avatar') {
      throw new AppError(400, 'AVATAR_NOT_OWNED', 'Escolha um avatar que você já possui.');
    }
    db.prepare('UPDATE users SET avatar_id = ? WHERE id = ?').run(avatarId, req.user!.id);
    res.json({ stats: getUserStats(db, req.user!.id) });
  })
);

gamificationRouter.post(
  '/me/lab-terms',
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = z.object({ accepted: z.literal(true) }).safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'TERMS_REQUIRED', 'Você precisa aceitar o termo de uso dos labs.');
    }
    const db = getDb();
    db.prepare('UPDATE users SET accepted_lab_terms_at = ? WHERE id = ?').run(nowIso(), req.user!.id);
    res.json({ ok: true });
  })
);

gamificationRouter.get(
  '/me/review-plan',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const row = db
      .prepare(
        `SELECT COUNT(*) AS total, MIN(next_review_at) AS next_at FROM review_queue WHERE user_id = ?`
      )
      .get(req.user!.id) as { total: number; next_at: string | null };
    res.json({ total: row.total, nextAt: row.next_at });
  })
);

export { sm2 };

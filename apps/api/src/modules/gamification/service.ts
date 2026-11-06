import {
  applyDailyActivity,
  levelForXp,
  rankTitle,
  xpForLevel,
  xpIntoLevel,
  xpToNextLevel,
  levelProgressPercent,
  type AchievementSummary,
  type LeaderboardEntry,
  type UserStats
} from '@cyberquest/shared';
import type { DB } from '../../db/connection';
import { currentWeekStart, userHour, userToday } from '../../utils/time';
import { AppError } from '../../utils/errors';
import { logger } from '../../logger';

export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  avatar_id: string;
  role: string;
  xp_total: number;
  level: number;
  bits: number;
  streak_current: number;
  streak_best: number;
  streak_freezes: number;
  last_activity_date: string | null;
  timezone: string;
  accepted_lab_terms_at: string | null;
  sounds_enabled: number;
  theme: string;
  reduce_motion: number;
  created_at: string;
}

const RARITY_BITS: Record<string, number> = {
  comum: 10,
  rara: 25,
  epica: 50,
  lendaria: 100
};

const RARITY_XP: Record<string, number> = {
  comum: 20,
  rara: 40,
  epica: 80,
  lendaria: 150
};

export function getUser(db: DB, userId: number): UserRow {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined;
  if (!user) throw new AppError(401, 'UNAUTHORIZED', 'Sessão inválida. Entre novamente.');
  return user;
}

export function grantXp(
  db: DB,
  userId: number,
  sourceType: string,
  sourceId: string,
  amount: number,
  now = new Date()
): number {
  if (amount <= 0) return 0;
  const result = db
    .prepare(
      'INSERT OR IGNORE INTO xp_events (user_id, source_type, source_id, amount, created_at) VALUES (?, ?, ?, ?, ?)'
    )
    .run(userId, sourceType, sourceId, Math.floor(amount), now.toISOString());
  if (result.changes === 0) return 0;
  const user = getUser(db, userId);
  const newXp = user.xp_total + Math.floor(amount);
  const newLevel = levelForXp(newXp);
  db.prepare('UPDATE users SET xp_total = ?, level = ? WHERE id = ?').run(newXp, newLevel, userId);
  const week = currentWeekStart(now);
  db.prepare(
    `INSERT INTO weekly_xp (user_id, week_start, xp) VALUES (?, ?, ?)
     ON CONFLICT(user_id, week_start) DO UPDATE SET xp = xp + excluded.xp`
  ).run(userId, week, Math.floor(amount));
  return Math.floor(amount);
}

export function grantBits(
  db: DB,
  userId: number,
  reason: string,
  amount: number,
  now = new Date()
): number {
  if (amount === 0) return 0;
  db.prepare('UPDATE users SET bits = MAX(0, bits + ?) WHERE id = ?').run(amount, userId);
  db.prepare('INSERT INTO bit_events (user_id, reason, amount, created_at) VALUES (?, ?, ?, ?)').run(
    userId,
    reason,
    amount,
    now.toISOString()
  );
  return amount;
}

export function touchActivity(
  db: DB,
  userId: number,
  now = new Date()
): { firstToday: boolean; xpGained: number; streak: { current: number; best: number; freezes: number } } {
  const user = getUser(db, userId);
  const today = userToday(user.timezone, now);
  const updated = applyDailyActivity(
    {
      current: user.streak_current,
      best: user.streak_best,
      freezes: user.streak_freezes,
      lastActivityDate: user.last_activity_date
    },
    today
  );

  let xpGained = 0;
  if (user.last_activity_date !== today) {
    db.prepare(
      'UPDATE users SET streak_current = ?, streak_best = ?, streak_freezes = ?, last_activity_date = ? WHERE id = ?'
    ).run(updated.current, updated.best, updated.freezes, today, userId);

    const yesterday = new Date(now.getTime() - 86_400_000);
    const yesterdayKey = userToday(user.timezone, yesterday);
    const hadYesterday = user.last_activity_date === yesterdayKey;
    if (hadYesterday || !user.last_activity_date) {
      xpGained += grantXp(db, userId, 'daily_presence', today, 10, now);
    } else {
      xpGained += grantXp(db, userId, 'daily_presence', today, 10, now);
    }

    const milestone = [3, 7, 14, 30, 100].includes(updated.current);
    if (milestone) {
      const reason = `streak_milestone_${updated.current}`;
      const existing = db
        .prepare('SELECT 1 FROM bit_events WHERE user_id = ? AND reason = ?')
        .get(userId, reason);
      if (!existing) {
        grantBits(db, userId, reason, 25, now);
        logger.info({ userId, streak: updated.current }, 'Marco de streak alcançado');
      }
    }
  }

  return {
    firstToday: user.last_activity_date !== today,
    xpGained,
    streak: { current: updated.current, best: updated.best, freezes: updated.freezes }
  };
}

export function getUserStats(db: DB, userId: number, now = new Date()): UserStats {
  const user = getUser(db, userId);
  const lessonsCompleted = (
    db
      .prepare("SELECT COUNT(*) AS total FROM user_lessons WHERE user_id = ? AND status = 'completed'")
      .get(userId) as { total: number }
  ).total;
  const weekly = db
    .prepare('SELECT xp FROM weekly_xp WHERE user_id = ? AND week_start = ?')
    .get(userId, currentWeekStart(now)) as { xp: number } | undefined;
  return {
    userId: user.id,
    username: user.username,
    displayName: user.display_name,
    avatarId: user.avatar_id,
    xpTotal: user.xp_total,
    level: user.level,
    levelTitle: rankTitle(user.level),
    xpIntoLevel: xpIntoLevel(user.xp_total),
    xpToNextLevel: xpToNextLevel(user.xp_total),
    levelPercent: levelProgressPercent(user.xp_total),
    bits: user.bits,
    streakCurrent: user.streak_current,
    streakBest: user.streak_best,
    streakFreezes: user.streak_freezes,
    lessonsCompleted,
    weeklyXp: weekly?.xp ?? 0
  };
}

export interface AchievementRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementSummary['rarity'];
  criteria_json: string;
}

interface EventContext {
  type: string;
  lessonSlug?: string;
  moduleSlug?: string;
  trackSlug?: string;
  labSlug?: string;
  hintsUsed?: number;
  exerciseType?: string;
}

interface Metrics {
  lessonsCompleted: number;
  threeStarLessons: number;
  labsCompleted: number;
  streak: number;
  level: number;
  bits: number;
  xp: number;
  achievementsOwned: number;
  objectivesDone: number;
  completedTracks: Set<string>;
  completedModules: Set<string>;
  completedLessons: Set<string>;
  completedLabs: Set<string>;
  hour: number;
}

function collectMetrics(db: DB, userId: number, user: UserRow, now: Date): Metrics {
  const lessonsCompleted = (
    db
      .prepare("SELECT COUNT(*) AS total FROM user_lessons WHERE user_id = ? AND status = 'completed'")
      .get(userId) as { total: number }
  ).total;
  const threeStarLessons = (
    db
      .prepare("SELECT COUNT(*) AS total FROM user_lessons WHERE user_id = ? AND stars = 3 AND status = 'completed'")
      .get(userId) as { total: number }
  ).total;
  const achievementsOwned = (
    db.prepare('SELECT COUNT(*) AS total FROM user_achievements WHERE user_id = ?').get(userId) as {
      total: number;
    }
  ).total;
  const objectivesDone = (
    db.prepare('SELECT COUNT(*) AS total FROM lab_objectives_done WHERE user_id = ?').get(userId) as {
      total: number;
    }
  ).total;

  const completedLessonsRows = db
    .prepare(
      `SELECT l.slug AS lesson_slug, m.slug AS module_slug, t.slug AS track_slug
       FROM user_lessons ul
       JOIN lessons l ON l.id = ul.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
       WHERE ul.user_id = ? AND ul.status = 'completed'`
    )
    .all(userId) as Array<{ lesson_slug: string; module_slug: string; track_slug: string }>;
  const completedLessons = new Set(completedLessonsRows.map((row) => row.lesson_slug));

  const allTracks = db
    .prepare(
      `SELECT t.slug AS track_slug, COUNT(l.id) AS total
       FROM tracks t
       JOIN modules m ON m.track_id = t.id
       JOIN lessons l ON l.module_id = m.id
       GROUP BY t.slug`
    )
    .all() as Array<{ track_slug: string; total: number }>;
  const allModules = db
    .prepare(
      `SELECT m.slug AS module_slug, COUNT(l.id) AS total
       FROM modules m
       JOIN lessons l ON l.module_id = m.id
       GROUP BY m.slug`
    )
    .all() as Array<{ module_slug: string; total: number }>;

  const completedByTrack = new Map<string, number>();
  const completedByModule = new Map<string, number>();
  for (const row of completedLessonsRows) {
    completedByTrack.set(row.track_slug, (completedByTrack.get(row.track_slug) ?? 0) + 1);
    completedByModule.set(row.module_slug, (completedByModule.get(row.module_slug) ?? 0) + 1);
  }
  const completedTracks = new Set(
    allTracks.filter((track) => (completedByTrack.get(track.track_slug) ?? 0) >= track.total).map((t) => t.track_slug)
  );
  const completedModules = new Set(
    allModules.filter((mod) => (completedByModule.get(mod.module_slug) ?? 0) >= mod.total).map((m) => m.module_slug)
  );

  const completedLabsRows = db
    .prepare("SELECT DISTINCT source_id FROM xp_events WHERE user_id = ? AND source_type = 'lab'")
    .all(userId) as Array<{ source_id: string }>;
  const completedLabs = new Set(completedLabsRows.map((row) => row.source_id));

  return {
    lessonsCompleted,
    threeStarLessons,
    labsCompleted: completedLabs.size,
    streak: user.streak_current,
    level: user.level,
    bits: user.bits,
    xp: user.xp_total,
    achievementsOwned,
    objectivesDone,
    completedTracks,
    completedModules,
    completedLessons,
    completedLabs,
    hour: userHour(user.timezone, now)
  };
}

function criteriaMatches(criteria: Record<string, unknown>, metrics: Metrics, event: EventContext): boolean {
  const type = String(criteria.type ?? '');
  const value = Number(criteria.value ?? 0);
  switch (type) {
    case 'lessons_completed':
      return metrics.lessonsCompleted >= value;
    case 'perfect_lessons':
    case 'three_star_lessons':
      return metrics.threeStarLessons >= value;
    case 'labs_completed':
    case 'labs_count':
      return metrics.labsCompleted >= value;
    case 'objectives_done':
      return metrics.objectivesDone >= value;
    case 'streak':
      return metrics.streak >= value;
    case 'level':
      return metrics.level >= value;
    case 'bits':
      return metrics.bits >= value;
    case 'xp':
      return metrics.xp >= value;
    case 'achievements_count':
      return metrics.achievementsOwned >= value;
    case 'track_completed':
      return metrics.completedTracks.has(String(criteria.track ?? ''));
    case 'module_completed':
      return metrics.completedModules.has(String(criteria.module ?? ''));
    case 'lab_completed':
      return metrics.completedLabs.has(String(criteria.lab ?? ''));
    case 'lesson_completed':
      return metrics.completedLessons.has(String(criteria.lesson ?? ''));
    case 'no_hints_lab':
      return Boolean(event.labSlug) && (event.hintsUsed ?? 0) === 0;
    case 'time_of_day':
      if (criteria.value === 'night') return metrics.hour >= 23 || metrics.hour < 5;
      if (criteria.value === 'morning') return metrics.hour < 6;
      return false;
    case 'daily_challenge':
      return event.type === 'daily_challenge';
    case 'event_type':
      return event.type === String(criteria.value ?? '');
    default:
      return false;
  }
}

export function evaluateAchievements(
  db: DB,
  userId: number,
  event: EventContext,
  now = new Date()
): AchievementSummary[] {
  const user = getUser(db, userId);
  const metrics = collectMetrics(db, userId, user, now);
  const all = db.prepare('SELECT * FROM achievements').all() as AchievementRow[];
  const owned = new Set(
    (
      db.prepare('SELECT achievement_id FROM user_achievements WHERE user_id = ?').all(userId) as Array<{
        achievement_id: number;
      }>
    ).map((row) => row.achievement_id)
  );
  const unlocked: AchievementSummary[] = [];
  const insert = db.prepare(
    'INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)'
  );
  for (const achievement of all) {
    if (owned.has(achievement.id)) continue;
    let criteria: Record<string, unknown> = {};
    try {
      criteria = JSON.parse(achievement.criteria_json);
    } catch {
      criteria = {};
    }
    if (!criteriaMatches(criteria, metrics, event)) continue;
    const result = insert.run(userId, achievement.id, now.toISOString());
    if (result.changes === 0) continue;
    metrics.achievementsOwned += 1;
    grantBits(db, userId, `achievement_${achievement.slug}`, RARITY_BITS[achievement.rarity] ?? 10, now);
    grantXp(db, userId, 'achievement', achievement.slug, RARITY_XP[achievement.rarity] ?? 20, now);
    unlocked.push({
      slug: achievement.slug,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      rarity: achievement.rarity,
      unlockedAt: now.toISOString()
    });
  }
  if (unlocked.length > 0) {
    logger.info({ userId, achievements: unlocked.map((item) => item.slug) }, 'Conquistas desbloqueadas');
  }
  return unlocked;
}

export function listAchievements(db: DB, userId: number): AchievementSummary[] {
  const rows = db
    .prepare(
      `SELECT a.*, ua.unlocked_at
       FROM achievements a
       LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
       ORDER BY CASE a.rarity WHEN 'lendaria' THEN 0 WHEN 'epica' THEN 1 WHEN 'rara' THEN 2 ELSE 3 END, a.id`
    )
    .all(userId) as Array<AchievementRow & { unlocked_at: string | null }>;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    icon: row.icon,
    rarity: row.rarity,
    unlockedAt: row.unlocked_at
  }));
}

export function weeklyLeaderboard(db: DB, now = new Date()): LeaderboardEntry[] {
  const rows = db
    .prepare(
      `SELECT u.id, u.username, u.display_name, u.avatar_id, u.level, w.xp
       FROM weekly_xp w JOIN users u ON u.id = w.user_id
       WHERE w.week_start = ?
       ORDER BY w.xp DESC, u.xp_total DESC, u.id ASC
       LIMIT 50`
    )
    .all(currentWeekStart(now)) as Array<{
    id: number;
    username: string;
    display_name: string;
    avatar_id: string;
    level: number;
    xp: number;
  }>;
  return rows.map((row, index) => ({
    position: index + 1,
    userId: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarId: row.avatar_id,
    level: row.level,
    xp: row.xp
  }));
}

export function allTimeLeaderboard(db: DB): LeaderboardEntry[] {
  const rows = db
    .prepare(
      `SELECT id, username, display_name, avatar_id, level, xp_total AS xp
       FROM users ORDER BY xp_total DESC, id ASC LIMIT 50`
    )
    .all() as Array<{
    id: number;
    username: string;
    display_name: string;
    avatar_id: string;
    level: number;
    xp: number;
  }>;
  return rows.map((row, index) => ({
    position: index + 1,
    userId: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarId: row.avatar_id,
    level: row.level,
    xp: row.xp
  }));
}

export function xpForLevelInfo(level: number): number {
  return xpForLevel(level);
}

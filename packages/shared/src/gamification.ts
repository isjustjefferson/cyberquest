import { LESSON_XP_BY_DIFFICULTY, LEVEL_TITLES, XP } from './constants';

export function xpForLevel(level: number): number {
  const safe = Math.max(1, Math.floor(level));
  return 50 * safe * (safe - 1);
}

export function levelForXp(xpTotal: number): number {
  const xp = Math.max(0, Math.floor(xpTotal));
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level += 1;
  }
  return level;
}

export function xpIntoLevel(xpTotal: number): number {
  return Math.max(0, Math.floor(xpTotal)) - xpForLevel(levelForXp(xpTotal));
}

export function xpToNextLevel(xpTotal: number): number {
  const level = levelForXp(xpTotal);
  return xpForLevel(level + 1) - Math.max(0, Math.floor(xpTotal));
}

export function levelProgressPercent(xpTotal: number): number {
  const level = levelForXp(xpTotal);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  if (next <= start) return 100;
  return Math.min(100, Math.round((((xpTotal - start) / (next - start)) || 0) * 100));
}

export function rankTitle(level: number): string {
  const found = LEVEL_TITLES.find((entry) => level >= entry.min && level <= entry.max);
  return found ? found.title : LEVEL_TITLES[LEVEL_TITLES.length - 1].title;
}

export function lessonXpForDifficulty(difficulty: number): number {
  return LESSON_XP_BY_DIFFICULTY[difficulty] ?? 40;
}

export function hintAdjustedXp(baseXp: number, hintsUsed: number): number {
  const hints = Math.max(0, Math.floor(hintsUsed));
  const factor = Math.max(XP.hintMinFactor, 1 - XP.hintPenaltyPercent * hints);
  return Math.max(1, Math.floor(baseXp * factor));
}

export function perfectLessonBonus(baseXp: number): number {
  return Math.floor(baseXp * XP.perfectLessonBonusPercent);
}

export function starsForLesson(errors: number, totalExercises: number): 1 | 2 | 3 {
  if (totalExercises <= 0) return 3;
  if (errors <= 0) return 3;
  const ratio = errors / totalExercises;
  if (ratio <= 0.25) return 2;
  return 1;
}

export interface StreakState {
  current: number;
  best: number;
  freezes: number;
  lastActivityDate: string | null;
}

export function dayDiff(fromIsoDate: string, toIsoDate: string): number {
  const from = Date.parse(`${fromIsoDate}T00:00:00Z`);
  const to = Date.parse(`${toIsoDate}T00:00:00Z`);
  if (Number.isNaN(from) || Number.isNaN(to)) return 0;
  return Math.round((to - from) / 86_400_000);
}

export function localDateKey(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

export function applyDailyActivity(state: StreakState, todayKey: string): StreakState {
  if (!state.lastActivityDate) {
    return { ...state, current: 1, best: Math.max(1, state.best), lastActivityDate: todayKey };
  }
  if (state.lastActivityDate === todayKey) return state;
  const gap = dayDiff(state.lastActivityDate, todayKey);
  if (gap === 1) {
    const current = state.current + 1;
    return { ...state, current, best: Math.max(state.best, current), lastActivityDate: todayKey };
  }
  if (gap > 1) {
    const missed = gap - 1;
    if (state.freezes >= missed) {
      const current = state.current + 1;
      return {
        ...state,
        current,
        best: Math.max(state.best, current),
        freezes: state.freezes - missed,
        lastActivityDate: todayKey
      };
    }
    return { ...state, current: 1, freezes: state.freezes, lastActivityDate: todayKey };
  }
  return state;
}

export interface ReviewState {
  intervalDays: number;
  ease: number;
}

export function sm2(previous: ReviewState | null, quality: number): ReviewState {
  const q = Math.min(5, Math.max(0, quality));
  const ease = Math.max(1.3, (previous?.ease ?? 2.5) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  if (q < 3) {
    return { intervalDays: 1, ease };
  }
  const prevInterval = previous?.intervalDays ?? 0;
  const intervalDays = prevInterval <= 0 ? 1 : prevInterval === 1 ? 3 : Math.round(prevInterval * ease);
  return { intervalDays, ease };
}

export function nextReviewDate(from: Date, intervalDays: number): string {
  const next = new Date(from.getTime() + Math.max(1, intervalDays) * 86_400_000);
  return next.toISOString();
}

export function weekStartKey(date: Date): string {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = copy.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + diff);
  return copy.toISOString().slice(0, 10);
}

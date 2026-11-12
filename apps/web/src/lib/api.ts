import type {
  AchievementSummary,
  AnswerResult,
  AreaDetail,
  AreaStats,
  AreaSummary,
  DailyChallenge,
  LabDetail,
  LabSessionPublic,
  LabSummary,
  LeaderboardEntry,
  LessonDetail,
  ReviewItem,
  SqlDatasetSchema,
  SqlResult,
  TrackDetail,
  TrackSummary,
  UserStats,
  CosmeticItem
} from '@cyberquest/shared';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });
  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }
  if (!response.ok) {
    const error = (body as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? 'UNKNOWN',
      error?.message ?? 'Não foi possível concluir a operação. Tente novamente.'
    );
  }
  return body as T;
}

export interface AuthUser extends UserStats {
  email: string;
  role: string;
  timezone: string;
  soundsEnabled: boolean;
  theme: 'dark' | 'light';
  reduceMotion: boolean;
  acceptedLabTermsAt: string | null;
}

export interface DashboardData {
  stats: UserStats;
  continueLesson: {
    slug: string;
    title: string;
    kind: 'lesson' | 'lab' | 'boss';
    trackSlug: string;
    trackTitle: string;
    moduleTitle: string;
    status: string;
  } | null;
  dueCount: number;
  dailyChallenge: DailyChallenge;
  recentAchievements: AchievementSummary[];
  weeklyLeaderboard: LeaderboardEntry[];
}

export interface CosmeticWithOwnership extends CosmeticItem {
  owned: boolean;
}

export interface LessonCompletion {
  lessonSlug: string;
  xpGained: number;
  bonusXp: number;
  bitsGained: number;
  stars: number;
  moduleCompleted: boolean;
  stats: UserStats;
  unlockedAchievements: AchievementSummary[];
}

export const api = {
  register(input: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }) {
    return request<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  login(input: { identifier: string; password: string }) {
    return request<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  logout() {
    return request<{ ok: true }>('/api/auth/logout', { method: 'POST' });
  },
  me() {
    return request<{ user: AuthUser }>('/api/auth/me');
  },
  updateSettings(input: Record<string, unknown>) {
    return request<{ user: AuthUser }>('/api/auth/me/settings', {
      method: 'PATCH',
      body: JSON.stringify(input)
    });
  },
  dashboard() {
    return request<DashboardData>('/api/me/dashboard');
  },
  areas() {
    return request<{ areas: AreaSummary[] }>('/api/areas');
  },
  area(slug: string) {
    return request<{ area: AreaDetail }>(`/api/areas/${slug}`);
  },
  areaStats() {
    return request<{ areas: AreaStats[] }>('/api/me/stats/areas');
  },
  tracks(area?: string) {
    const query = area ? `?area=${encodeURIComponent(area)}` : '';
    return request<{ tracks: TrackSummary[] }>(`/api/tracks${query}`);
  },
  track(slug: string) {
    return request<{ track: TrackDetail }>(`/api/tracks/${slug}`);
  },
  lesson(slug: string) {
    return request<{ lesson: LessonDetail }>(`/api/lessons/${slug}`);
  },
  startLesson(slug: string) {
    return request<{ ok: true }>(`/api/lessons/${slug}/start`, { method: 'POST' });
  },
  completeLesson(slug: string) {
    return request<LessonCompletion>(`/api/lessons/${slug}/complete`, { method: 'POST' });
  },
  answerExercise(id: number, answer: unknown) {
    return request<AnswerResult>(`/api/exercises/${id}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    });
  },
  runSql(id: number, sql: string) {
    return request<SqlResult>(`/api/exercises/${id}/sql/run`, {
      method: 'POST',
      body: JSON.stringify({ sql })
    });
  },
  datasetSchema(name: string) {
    return request<{ schema: SqlDatasetSchema }>(`/api/datasets/${encodeURIComponent(name)}/schema`);
  },
  reviewDue() {
    return request<{ items: ReviewItem[] }>('/api/review/due');
  },
  achievements(area?: string) {
    const query = area ? `?area=${encodeURIComponent(area)}` : '';
    return request<{ achievements: AchievementSummary[] }>(`/api/me/achievements${query}`);
  },
  leaderboard(kind: 'weekly' | 'all-time', area?: string) {
    const query = area ? `?area=${encodeURIComponent(area)}` : '';
    return request<{ leaderboard: LeaderboardEntry[] }>(`/api/leaderboard/${kind}${query}`);
  },
  dailyChallenge() {
    return request<{ challenge: DailyChallenge }>('/api/daily-challenge');
  },
  answerDaily(exerciseId: number, answer: unknown) {
    return request<AnswerResult>('/api/daily-challenge/answer', {
      method: 'POST',
      body: JSON.stringify({ exerciseId, answer })
    });
  },
  cosmetics() {
    return request<{ cosmetics: CosmeticWithOwnership[]; avatarId: string }>('/api/me/cosmetics');
  },
  buyCosmetic(id: string) {
    return request<{ ok: true; stats: UserStats }>(`/api/shop/cosmetics/${id}`, { method: 'POST' });
  },
  buyStreakFreeze() {
    return request<{ stats: UserStats }>('/api/shop/streak-freeze', { method: 'POST' });
  },
  setAvatar(avatarId: string) {
    return request<{ stats: UserStats }>('/api/me/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatarId })
    });
  },
  acceptLabTerms() {
    return request<{ ok: true }>('/api/me/lab-terms', {
      method: 'POST',
      body: JSON.stringify({ accepted: true })
    });
  },
  labs() {
    return request<{ labs: LabSummary[]; dockerAvailable: boolean }>('/api/labs');
  },
  lab(slug: string) {
    return request<{ lab: LabDetail }>(`/api/labs/${slug}`);
  },
  startLab(slug: string) {
    return request<{ session: LabSessionPublic }>(`/api/labs/${slug}/start`, { method: 'POST' });
  },
  labSession(id: string) {
    return request<{ session: LabSessionPublic }>(`/api/lab-sessions/${id}`);
  },
  extendLab(id: string) {
    return request<{ session: LabSessionPublic }>(`/api/lab-sessions/${id}/extend`, { method: 'POST' });
  },
  stopLab(id: string) {
    return request<{ ok: true }>(`/api/lab-sessions/${id}`, { method: 'DELETE' });
  },
  submitFlag(id: string, objectiveId: string, flag: string) {
    return request<{
      objectiveCompleted: boolean;
      alreadyCompleted: boolean;
      xpGained: number;
      bitsGained?: number;
      labCompleted: boolean;
      stats: UserStats;
      unlockedAchievements: AchievementSummary[];
    }>(`/api/lab-sessions/${id}/flag`, {
      method: 'POST',
      body: JSON.stringify({ objectiveId, flag })
    });
  },
  verifyObjective(id: string, objectiveId: string) {
    return request<{
      passed: boolean;
      message: string;
      objectiveCompleted?: boolean;
      alreadyCompleted?: boolean;
      xpGained?: number;
      bitsGained?: number;
      labCompleted?: boolean;
      stats?: UserStats;
      unlockedAchievements?: AchievementSummary[];
    }>(`/api/lab-sessions/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ objectiveId })
    });
  },
  buyHint(id: string, objectiveId: string) {
    return request<{
      hint: { text: string; index: number; costBits: number };
      stats: UserStats;
    }>(`/api/lab-sessions/${id}/hint`, {
      method: 'POST',
      body: JSON.stringify({ objectiveId })
    });
  }
};

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Algo deu errado. Tente novamente.';
}

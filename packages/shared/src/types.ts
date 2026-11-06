import type { ExerciseType, PublicExercise } from './exercises';

export interface TrackSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  status: 'available' | 'coming_soon';
  totalLessons: number;
  completedLessons: number;
  percent: number;
}

export interface LessonListEntry {
  id: number;
  slug: string;
  title: string;
  kind: 'lesson' | 'lab' | 'boss';
  difficulty: number;
  estMinutes: number;
  xp: number;
  status: 'complete' | 'draft';
  progressStatus: 'locked' | 'available' | 'in_progress' | 'completed';
  stars: number;
  labSlug: string | null;
}

export interface ModuleDetail {
  id: number;
  slug: string;
  title: string;
  description: string;
  position: number;
  lessons: LessonListEntry[];
}

export interface TrackDetail extends TrackSummary {
  modules: ModuleDetail[];
}

export interface LessonDetail {
  id: number;
  slug: string;
  title: string;
  kind: 'lesson' | 'lab' | 'boss';
  difficulty: number;
  estMinutes: number;
  xp: number;
  status: 'complete' | 'draft';
  trackSlug: string;
  trackTitle: string;
  moduleSlug: string;
  moduleTitle: string;
  content: string;
  prerequisites: string[];
  progressStatus: 'locked' | 'available' | 'in_progress' | 'completed';
  stars: number;
  bestScore: number | null;
  labSlug: string | null;
  exercises: PublicExercise[];
}

export interface UserStats {
  userId: number;
  username: string;
  displayName: string;
  avatarId: string;
  xpTotal: number;
  level: number;
  levelTitle: string;
  xpIntoLevel: number;
  xpToNextLevel: number;
  levelPercent: number;
  bits: number;
  streakCurrent: number;
  streakBest: number;
  streakFreezes: number;
  lessonsCompleted: number;
  weeklyXp: number;
}

export interface AnswerResult {
  correct: boolean;
  explanation: string;
  xpGained: number;
  totalXp: number;
  level: number;
  levelTitle: string;
  leveledUp: boolean;
  bitsGained: number;
  streak: { current: number; best: number; freezes: number };
  unlockedAchievements: AchievementSummary[];
  reviewScheduled: boolean;
}

export interface AchievementSummary {
  slug: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'comum' | 'rara' | 'epica' | 'lendaria';
  unlockedAt: string | null;
}

export interface LeaderboardEntry {
  position: number;
  userId: number;
  username: string;
  displayName: string;
  avatarId: string;
  level: number;
  xp: number;
}

export interface DailyChallenge {
  date: string;
  exercise: PublicExercise | null;
  bonusXp: number;
  answered: boolean;
}

export interface ReviewItem {
  exercise: PublicExercise;
  nextReviewAt: string;
  intervalDays: number;
}

export interface LabSummary {
  slug: string;
  title: string;
  description: string;
  difficulty: number;
  ttlMinutes: number;
  xpReward: number;
  imageTags?: string[];
}

export interface LabObjectivePublic {
  id: string;
  title: string;
  xp: number;
  hints: Array<{ text: string; costBits: number }>;
  completed: boolean;
  hintsUsed: number;
}

export interface LabDetail extends LabSummary {
  objectives: LabObjectivePublic[];
  writeup: string | null;
  dockerAvailable: boolean;
  activeSession: LabSessionPublic | null;
  termsAccepted: boolean;
}

export interface LabSessionPublic {
  id: string;
  labSlug: string;
  status: 'starting' | 'running' | 'stopped' | 'expired' | 'error';
  startedAt: string;
  expiresAt: string;
  secondsRemaining: number;
  extended: boolean;
  proxyPort: number | null;
  objectives: LabObjectivePublic[];
  errorMessage?: string | null;
}

export interface LabManifestObjective {
  id: string;
  title: string;
  xp: number;
  flag_mode?: 'dynamic' | 'static';
  hints?: Array<{ text: string; cost_bits: number }>;
}

export interface LabManifestContainer {
  name?: string;
  image: string;
  hostname?: string;
  env?: Record<string, string>;
  expose_web_port?: number;
  healthcheck?: { path?: string; timeout_s?: number };
}

export interface LabManifest {
  slug: string;
  title: string;
  description: string;
  difficulty: number;
  ttl_minutes: number;
  xp_reward: number;
  network?: { internal?: boolean };
  containers: {
    attacker: { image: string; hostname?: string };
    targets?: LabManifestContainer[];
  };
  objectives: LabManifestObjective[];
  writeup?: string;
}

export interface ExerciseAnswerMap {
  [exerciseId: string]: { type: ExerciseType; answer: unknown };
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}

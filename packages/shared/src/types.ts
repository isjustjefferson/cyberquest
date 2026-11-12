import type { ExerciseType, PublicExercise } from './exercises';

export interface AreaNextLesson {
  slug: string;
  title: string;
  trackSlug: string;
  trackTitle: string;
  moduleTitle: string;
  status: 'in_progress' | 'available';
}

export interface AreaSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  status: 'active' | 'coming_soon';
  totalLessons: number;
  completedLessons: number;
  percent: number;
  xp: number;
  nextLesson: AreaNextLesson | null;
}

export interface AreaDetail extends AreaSummary {
  tracks: TrackSummary[];
}

export interface AreaStats {
  id: number;
  slug: string;
  title: string;
  icon: string;
  color: string;
  xp: number;
  completedLessons: number;
  totalLessons: number;
  percent: number;
}

export interface TrackSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  status: 'available' | 'coming_soon';
  areaSlug: string;
  areaTitle: string;
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
  areaSlug: string;
  areaTitle: string;
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
  areaSlug: string | null;
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
  mode: 'flag' | 'auto';
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

export interface LabManifestVerify {
  type: 'sql' | 'cmd';
  container: string;
  user?: string;
  database?: string;
  query: string;
  expect: { equals?: string; matches?: string; exit_code?: number };
}

export interface LabManifestObjective {
  id: string;
  title: string;
  xp: number;
  flag_mode?: 'dynamic' | 'static';
  verify?: LabManifestVerify;
  hints?: Array<{ text: string; cost_bits: number }>;
}

export interface LabManifestContainer {
  name?: string;
  image: string;
  hostname?: string;
  env?: Record<string, string>;
  command?: string[];
  init_scripts?: string[];
  files?: Array<{ source: string; destination: string }>;
  ephemeral_volumes?: string[];
  resources?: { memory_mb?: number; cpus?: number };
  expose_web_port?: number;
  healthcheck?: { path?: string; cmd?: string; timeout_s?: number };
}

export interface LabManifestWorkstation {
  image: string;
  hostname?: string;
  env?: Record<string, string>;
}

export interface LabManifestTerminal {
  container?: string;
  user?: string;
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
    attacker?: { image: string; hostname?: string };
    workstation?: LabManifestWorkstation;
    targets?: LabManifestContainer[];
  };
  terminal?: LabManifestTerminal;
  objectives: LabManifestObjective[];
  writeup?: string;
}

export interface ExerciseAnswerMap {
  [exerciseId: string]: { type: ExerciseType; answer: unknown };
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}

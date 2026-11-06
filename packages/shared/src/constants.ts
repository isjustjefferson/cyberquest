export const APP_NAME = 'CyberQuest';
export const APP_TAGLINE = 'Aprenda hacking ético sem sair do terminal.';

export const API_PREFIX = '/api';

export const LEVEL_TITLES: Array<{ min: number; max: number; title: string }> = [
  { min: 1, max: 3, title: 'Curioso(a)' },
  { min: 4, max: 6, title: 'Aprendiz de Shell' },
  { min: 7, max: 10, title: 'Analista Júnior' },
  { min: 11, max: 15, title: 'Caçador(a) de Bugs' },
  { min: 16, max: 22, title: 'Pentester' },
  { min: 23, max: 30, title: 'Red Teamer' },
  { min: 31, max: 999, title: 'Lenda do Kernel' }
];

export const LESSON_XP_BY_DIFFICULTY: Record<number, number> = {
  1: 30,
  2: 40,
  3: 50,
  4: 60,
  5: 70
};

export const BOSS_XP = 100;
export const LAB_XP_BY_DIFFICULTY: Record<number, number> = {
  1: 150,
  2: 200,
  3: 250,
  4: 350,
  5: 500
};

export const XP = {
  firstActivityOfDay: 10,
  perfectLessonBonusPercent: 0.5,
  hintPenaltyPercent: 0.2,
  hintMinFactor: 0.4,
  dailyChallengeBonus: 25,
  streakMilestones: [3, 7, 14, 30, 100],
  bitsPerLesson: 5,
  bitsPerLab: 20,
  bitsStreakMilestone: 25
};

export const SHOP = {
  streakFreezePrice: 50,
  maxStreakFreezes: 2,
  hintPricePerIndex: 10
};

export const LAB_TERMS_TEXT =
  'Pratico apenas nos alvos fornecidos pela plataforma e jamais contra sistemas sem autorização expressa por escrito.';

export const LAB_SECURITY = {
  maxActivePerUser: 1,
  defaultTtlMinutes: 60,
  maxExtendMinutes: 15,
  memoryBytes: 512 * 1024 * 1024,
  nanoCpus: 1_000_000_000,
  pidsLimit: 256
};

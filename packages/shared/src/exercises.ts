import { z } from 'zod';

const base = {
  xp: z.number().int().min(0).max(500).optional().default(10),
  question: z.string().optional(),
  explanation: z.string().optional(),
  ethicsNote: z.string().optional()
};

export const singleChoiceExerciseSchema = z.object({
  type: z.literal('single_choice'),
  ...base,
  question: z.string(),
  options: z.array(z.string()).min(2),
  answerIndex: z.number().int().min(0),
  explanation: z.string()
});

export const multiChoiceExerciseSchema = z.object({
  type: z.literal('multi_choice'),
  ...base,
  question: z.string(),
  options: z.array(z.string()).min(2),
  answerIndexes: z.array(z.number().int().min(0)).min(1),
  explanation: z.string()
});

export const trueFalseExerciseSchema = z.object({
  type: z.literal('true_false'),
  ...base,
  statement: z.string(),
  answer: z.boolean(),
  explanation: z.string()
});

export const orderExerciseSchema = z.object({
  type: z.literal('order'),
  ...base,
  question: z.string(),
  items: z.array(z.string()).min(2),
  correctOrder: z.array(z.number().int().min(0)),
  explanation: z.string()
});

export const matchExerciseSchema = z.object({
  type: z.literal('match'),
  ...base,
  question: z.string(),
  pairs: z.array(z.tuple([z.string(), z.string()])).min(2),
  explanation: z.string()
});

export const fillCommandExerciseSchema = z.object({
  type: z.literal('fill_command'),
  ...base,
  question: z.string(),
  template: z.string(),
  blanks: z.array(z.string()).min(1).optional(),
  accepted: z.array(z.array(z.string()).min(1)).min(1),
  explanation: z.string()
});

export const simTerminalExerciseSchema = z.object({
  type: z.literal('sim_terminal'),
  ...base,
  question: z.string(),
  goal: z.string(),
  scenario: z.string(),
  allowedCommands: z.array(z.string()).optional(),
  checks: z.object({
    historyIncludes: z.array(z.string()).optional(),
    fileExists: z.array(z.string()).optional(),
    cwd: z.string().optional()
  }),
  explanation: z.string()
});

export const codeReviewExerciseSchema = z.object({
  type: z.literal('code_review'),
  ...base,
  question: z.string(),
  code: z.string(),
  vulnerableLines: z.array(z.number().int().min(1)).min(1),
  explanation: z.string()
});

export const flagExerciseSchema = z.object({
  type: z.literal('flag'),
  ...base,
  question: z.string(),
  flagHash: z.string().regex(/^[a-f0-9]{64}$/i),
  explanation: z.string()
});

const sqlGradeSchema = z.object({
  mode: z.enum(['result_match', 'state_check', 'plan_check']),
  expected_sql: z.string().min(1).optional(),
  check_sql: z.string().min(1).optional(),
  ordered: z.boolean().default(true),
  compare_column_names: z.boolean().default(true),
  numeric_tolerance: z.number().min(0).default(0.001),
  must_contain: z.array(z.string()).default([]),
  must_not_contain: z.array(z.string()).default([])
});

export const sqlQueryExerciseSchema = z.object({
  type: z.literal('sql_query'),
  ...base,
  prompt: z.string(),
  dataset: z.string().regex(/^[a-z0-9_]+$/),
  setup: z.string().default(''),
  starter: z.string().default(''),
  grade: sqlGradeSchema,
  hints: z
    .array(
      z.object({
        text: z.string(),
        cost_bits: z.number().int().min(0).default(0)
      })
    )
    .default([])
});

const exerciseUnion = z.discriminatedUnion('type', [
  singleChoiceExerciseSchema,
  multiChoiceExerciseSchema,
  trueFalseExerciseSchema,
  orderExerciseSchema,
  matchExerciseSchema,
  fillCommandExerciseSchema,
  simTerminalExerciseSchema,
  codeReviewExerciseSchema,
  flagExerciseSchema,
  sqlQueryExerciseSchema
]);

export const exerciseSchema = exerciseUnion.superRefine((exercise, ctx) => {
  if (exercise.type !== 'sql_query') return;
  if (
    (exercise.grade.mode === 'result_match' || exercise.grade.mode === 'state_check') &&
    !exercise.grade.expected_sql
  ) {
    ctx.addIssue({ code: 'custom', message: 'expected_sql é obrigatório neste modo', path: ['grade', 'expected_sql'] });
  }
  if (exercise.grade.mode === 'state_check' && !exercise.grade.check_sql) {
    ctx.addIssue({ code: 'custom', message: 'check_sql é obrigatório no modo state_check', path: ['grade', 'check_sql'] });
  }
  if (
    exercise.grade.mode === 'plan_check' &&
    exercise.grade.must_contain.length === 0 &&
    exercise.grade.must_not_contain.length === 0
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'plan_check precisa de must_contain ou must_not_contain',
      path: ['grade', 'must_contain']
    });
  }
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseType = Exercise['type'];

export const lessonFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  kind: z.enum(['lesson', 'lab', 'boss']).default('lesson'),
  difficulty: z.number().int().min(1).max(5).default(1),
  est_minutes: z.number().int().min(1).default(10),
  xp: z.number().int().min(0).default(30),
  status: z.enum(['complete', 'draft']).default('draft'),
  prerequisites: z.array(z.string()).optional().default([]),
  related: z.array(z.string()).optional().default([]),
  lab_slug: z.string().optional().nullable(),
  exercises: z.array(exerciseSchema).default([])
});

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;

export const moduleFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string().optional().default(''),
  position: z.number().int().optional(),
  xp_reward: z.number().int().optional().default(0)
});

export const trackFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string().default(''),
  icon: z.string().default('🛡️'),
  color: z.string().default('verde'),
  area: z.string().regex(/^[a-z0-9-]+$/).optional(),
  position: z.number().int().optional(),
  status: z.enum(['available', 'coming_soon']).default('available')
});

export const areaFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string().default(''),
  icon: z.string().default('📚'),
  color: z.string().default('#00ff9c'),
  position: z.number().int().optional(),
  status: z.enum(['active', 'coming_soon']).default('active')
});

export const achievementFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string(),
  icon: z.string().default('🏅'),
  rarity: z.enum(['comum', 'rara', 'epica', 'lendaria']).default('comum'),
  area: z.string().regex(/^[a-z0-9-]+$/).optional().nullable(),
  criteria: z.record(z.string(), z.unknown())
});

export type TrackFrontmatter = z.infer<typeof trackFrontmatterSchema>;
export type ModuleFrontmatter = z.infer<typeof moduleFrontmatterSchema>;
export type AreaFrontmatter = z.infer<typeof areaFrontmatterSchema>;
export type AchievementFrontmatter = z.infer<typeof achievementFrontmatterSchema>;

export interface PublicExercise {
  id: number;
  lessonSlug: string;
  position: number;
  type: ExerciseType;
  xp: number;
  question?: string;
  payload: Record<string, unknown>;
}

export function publicExercisePayload(exercise: Exercise): Record<string, unknown> {
  switch (exercise.type) {
    case 'single_choice':
      return { question: exercise.question, options: exercise.options };
    case 'multi_choice':
      return { question: exercise.question, options: exercise.options };
    case 'true_false':
      return { statement: exercise.statement };
    case 'order':
      return { question: exercise.question, items: exercise.items };
    case 'match': {
      const left = exercise.pairs.map((pair) => pair[0]);
      const right = exercise.pairs.map((pair) => pair[1]);
      return { question: exercise.question, left, right };
    }
    case 'fill_command':
      return {
        question: exercise.question,
        template: exercise.template,
        blanks: exercise.blanks ?? extractBlanks(exercise.template)
      };
    case 'sim_terminal':
      return {
        question: exercise.question,
        goal: exercise.goal,
        scenario: exercise.scenario,
        allowedCommands: exercise.allowedCommands ?? []
      };
    case 'code_review':
      return { question: exercise.question, code: exercise.code };
    case 'flag':
      return { question: exercise.question };
    case 'sql_query':
      return {
        question: exercise.prompt,
        prompt: exercise.prompt,
        dataset: exercise.dataset,
        starter: exercise.starter,
        hints: exercise.hints.map((hint) => ({ text: hint.text, costBits: hint.cost_bits }))
      };
    default:
      return {};
  }
}

export function extractBlanks(template: string): string[] {
  const matches = template.match(/_{2,}/g);
  return matches ? matches.map(() => '') : ['resposta'];
}

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

export const exerciseSchema = z.discriminatedUnion('type', [
  singleChoiceExerciseSchema,
  multiChoiceExerciseSchema,
  trueFalseExerciseSchema,
  orderExerciseSchema,
  matchExerciseSchema,
  fillCommandExerciseSchema,
  simTerminalExerciseSchema,
  codeReviewExerciseSchema,
  flagExerciseSchema
]);

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
  position: z.number().int().optional(),
  status: z.enum(['available', 'coming_soon']).default('available')
});

export type TrackFrontmatter = z.infer<typeof trackFrontmatterSchema>;
export type ModuleFrontmatter = z.infer<typeof moduleFrontmatterSchema>;

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
    default:
      return {};
  }
}

export function extractBlanks(template: string): string[] {
  const matches = template.match(/_{2,}/g);
  return matches ? matches.map(() => '') : ['resposta'];
}

import { z } from 'zod';

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'O nome de usuário precisa ter ao menos 3 caracteres')
  .max(24, 'O nome de usuário pode ter no máximo 24 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, hífen e sublinhado');

export const passwordSchema = z
  .string()
  .min(10, 'A senha precisa ter ao menos 10 caracteres')
  .max(128, 'A senha pode ter no máximo 128 caracteres');

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.string().trim().email('Informe um e-mail válido').max(160),
  password: passwordSchema,
  displayName: z.string().trim().min(1).max(60).optional()
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Informe usuário ou e-mail'),
  password: z.string().min(1, 'Informe a senha')
});

export const answerSchema = z.object({
  answer: z.unknown()
});

export const labFlagSchema = z.object({
  objectiveId: z.string().min(1),
  flag: z.string().trim().min(1).max(200)
});

export const labHintSchema = z.object({
  objectiveId: z.string().min(1)
});

export const avatarSchema = z.object({
  avatarId: z.string().min(1).max(60)
});

export const settingsSchema = z.object({
  displayName: z.string().trim().min(1).max(60).optional(),
  timezone: z.string().min(1).max(80).optional(),
  soundsEnabled: z.boolean().optional(),
  theme: z.enum(['dark', 'light']).optional(),
  reduceMotion: z.boolean().optional()
});

export const labTermsSchema = z.object({
  accepted: z.literal(true)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

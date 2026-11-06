import { Router } from 'express';
import { registerSchema, loginSchema, settingsSchema } from '@cyberquest/shared';
import { getDb } from '../../db/connection';
import { asyncHandler, AppError } from '../../utils/errors';
import { authLimiter } from '../../middleware/rateLimit';
import { requireAuth } from '../../middleware/auth';
import {
  clearSession,
  createUser,
  ensureUnique,
  findByLogin,
  hashPassword,
  issueSession,
  verifyPassword
} from './service';
import { getUserStats } from '../gamification/service';

export const authRouter = Router();

authRouter.post(
  '/register',
  authLimiter,
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const db = getDb();
    ensureUnique(db, input.username, input.email);
    const passwordHash = await hashPassword(input.password);
    const user = createUser(db, {
      username: input.username,
      email: input.email,
      passwordHash,
      displayName: input.displayName
    });
    issueSession(res, user.id);
    res.status(201).json({ user: getUserStats(db, user.id) });
  })
);

authRouter.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const db = getDb();
    const user = findByLogin(db, input.identifier);
    const valid = user ? await verifyPassword(user.password_hash, input.password) : false;
    if (!user || !valid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Usuário ou senha inválidos.');
    }
    issueSession(res, user.id);
    res.json({ user: getUserStats(db, user.id) });
  })
);

authRouter.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const user = req.user!;
    const stats = getUserStats(db, user.id);
    res.json({
      user: {
        ...stats,
        email: user.email,
        role: user.role,
        timezone: user.timezone,
        soundsEnabled: Boolean(user.sounds_enabled),
        theme: user.theme,
        reduceMotion: Boolean(user.reduce_motion),
        acceptedLabTermsAt: user.accepted_lab_terms_at
      }
    });
  })
);

authRouter.patch(
  '/me/settings',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = settingsSchema.parse(req.body);
    const db = getDb();
    const user = req.user!;
    const updates: string[] = [];
    const values: unknown[] = [];
    if (input.displayName !== undefined) {
      updates.push('display_name = ?');
      values.push(input.displayName);
    }
    if (input.timezone !== undefined) {
      updates.push('timezone = ?');
      values.push(input.timezone);
    }
    if (input.soundsEnabled !== undefined) {
      updates.push('sounds_enabled = ?');
      values.push(input.soundsEnabled ? 1 : 0);
    }
    if (input.theme !== undefined) {
      updates.push('theme = ?');
      values.push(input.theme);
    }
    if (input.reduceMotion !== undefined) {
      updates.push('reduce_motion = ?');
      values.push(input.reduceMotion ? 1 : 0);
    }
    if (updates.length > 0) {
      values.push(user.id);
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }
    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as typeof user;
    res.json({
      user: {
        ...getUserStats(db, user.id),
        email: updated.email,
        timezone: updated.timezone,
        soundsEnabled: Boolean(updated.sounds_enabled),
        theme: updated.theme,
        reduceMotion: Boolean(updated.reduce_motion)
      }
    });
  })
);

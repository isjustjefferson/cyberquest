import { Algorithm, hash, verify } from '@node-rs/argon2';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { config } from '../../config';
import type { DB } from '../../db/connection';
import type { UserRow } from '../gamification/service';
import { AppError } from '../../utils/errors';
import { nowIso } from '../../utils/time';

const ARGON_OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON_OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password, ARGON_OPTIONS);
  } catch {
    return false;
  }
}

export function findByLogin(db: DB, identifier: string): UserRow | undefined {
  return db
    .prepare('SELECT * FROM users WHERE lower(username) = lower(?) OR lower(email) = lower(?)')
    .get(identifier, identifier) as UserRow | undefined;
}

export function ensureUnique(db: DB, username: string, email: string): void {
  const existing = db
    .prepare('SELECT username, email FROM users WHERE lower(username) = lower(?) OR lower(email) = lower(?)')
    .get(username, email) as { username: string; email: string } | undefined;
  if (existing) {
    if (existing.username.toLowerCase() === username.toLowerCase()) {
      throw new AppError(409, 'USERNAME_TAKEN', 'Este nome de usuário já está em uso.');
    }
    throw new AppError(409, 'EMAIL_TAKEN', 'Este e-mail já está cadastrado.');
  }
}

export function createUser(
  db: DB,
  data: { username: string; email: string; passwordHash: string; displayName?: string }
): UserRow {
  const now = nowIso();
  const displayName = data.displayName?.trim() || data.username;
  const result = db
    .prepare(
      `INSERT INTO users (username, email, password_hash, display_name, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(data.username.trim(), data.email.trim().toLowerCase(), data.passwordHash, displayName, now);
  const userId = Number(result.lastInsertRowid);
  const addCosmetic = db.prepare(
    'INSERT OR IGNORE INTO user_cosmetics (user_id, item_id, acquired_at) VALUES (?, ?, ?)'
  );
  addCosmetic.run(userId, 'byte-default', now);
  addCosmetic.run(userId, 'theme-green', now);
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
}

export function issueSession(res: Response, userId: number): void {
  const token = jwt.sign({ sub: String(userId) }, config.JWT_SECRET, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn']
  });
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProduction,
    maxAge: 7 * 86_400_000,
    path: '/'
  });
}

export function clearSession(res: Response): void {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProduction,
    path: '/'
  });
}

export function verifyToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    if (typeof payload === 'string' || !payload.sub) return null;
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

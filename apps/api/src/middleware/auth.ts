import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { getDb } from '../db/connection';
import { verifyToken } from '../modules/auth/service';
import type { UserRow } from '../modules/gamification/service';
import { AppError } from '../utils/errors';

function tokenFromRequest(req: Request): string | null {
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[config.cookieName];
  if (cookieToken) return cookieToken;
  const header = req.header('authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = tokenFromRequest(req);
  if (!token) {
    next();
    return;
  }
  const userId = verifyToken(token);
  if (!userId) {
    next();
    return;
  }
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined;
  if (user) req.user = user;
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AppError(401, 'UNAUTHORIZED', 'Você precisa entrar para acessar este recurso.'));
    return;
  }
  next();
}

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      next(new AppError(403, 'FORBIDDEN', 'Acesso restrito.'));
      return;
    }
    next();
  };
}

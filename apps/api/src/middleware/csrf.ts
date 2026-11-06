import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { AppError } from '../utils/errors';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function csrfProtection(req: Request, _res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }
  const origin = req.header('origin');
  if (!origin) {
    next();
    return;
  }
  if (!config.webOrigin.includes(origin)) {
    next(new AppError(403, 'CSRF_BLOCKED', 'Origem da requisição não autorizada.'));
    return;
  }
  next();
}

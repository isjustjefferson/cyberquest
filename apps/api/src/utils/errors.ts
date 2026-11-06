import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../logger';

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFound(message = 'Recurso não encontrado'): AppError {
  return new AppError(404, 'NOT_FOUND', message);
}

export function forbidden(message = 'Acesso negado'): AppError {
  return new AppError(403, 'FORBIDDEN', message);
}

export function badRequest(code: string, message: string): AppError {
  return new AppError(400, code, message);
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err instanceof ZodError) {
    const first = err.issues[0];
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: first?.message ?? 'Dados inválidos'
      }
    });
    return;
  }
  logger.error({ err, path: req.path }, 'Erro não tratado');
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Algo deu errado no servidor. Tente novamente.' }
  });
}

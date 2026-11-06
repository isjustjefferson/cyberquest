import rateLimit from 'express-rate-limit';
import { config } from '../config';

const skip = () => config.isTest;

export const generalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
  handler: (_req, res) => {
    res.status(429).json({
      error: { code: 'RATE_LIMITED', message: 'Muitas requisições. Aguarde um instante e tente de novo.' }
    });
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Muitas tentativas de autenticação. Aguarde 15 minutos antes de tentar novamente.'
      }
    });
  }
});

export const labLimiter = rateLimit({
  windowMs: 60_000,
  limit: 40,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
  handler: (_req, res) => {
    res.status(429).json({
      error: { code: 'RATE_LIMITED', message: 'Calma, hacker! Muitas ações em pouco tempo. Aguarde um pouco.' }
    });
  }
});

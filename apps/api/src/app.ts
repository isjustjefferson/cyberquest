import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { getDb } from './db/connection';
import { config } from './config';
import { logger } from './logger';
import { optionalAuth } from './middleware/auth';
import { csrfProtection } from './middleware/csrf';
import { generalLimiter } from './middleware/rateLimit';
import { errorHandler } from './utils/errors';
import { authRouter } from './modules/auth/routes';
import { contentRouter } from './modules/content/routes';
import { exercisesRouter } from './modules/exercises/routes';
import { gamificationRouter } from './modules/gamification/routes';
import { labsRouter } from './modules/labs/routes';
import { isDockerAvailable } from './modules/labs/docker';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'ws:', 'wss:', ...config.webOrigin],
          frameAncestors: ["'none'"]
        }
      },
      crossOriginResourcePolicy: { policy: 'same-site' }
    })
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || config.webOrigin.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origem não permitida'));
      },
      credentials: true
    })
  );
  if (!config.isTest) {
    app.use(pinoHttp({ logger }));
  }
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(generalLimiter);
  app.use(csrfProtection);
  app.use(optionalAuth);

  app.get('/api/health', async (_req, res) => {
    let database = false;
    try {
      getDb().prepare('SELECT 1').get();
      database = true;
    } catch {
      database = false;
    }
    const dockerAvailable = await isDockerAvailable();
    res.status(database ? 200 : 503).json({
      status: database ? 'ok' : 'degraded',
      app: 'CyberQuest',
      database,
      docker: dockerAvailable,
      dockerMessage: dockerAvailable
        ? 'Docker disponível. Os labs podem ser iniciados.'
        : 'Docker não encontrado. Instale/inicie o Docker e recarregue. O restante da plataforma continua funcionando.',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api', contentRouter);
  app.use('/api', exercisesRouter);
  app.use('/api', gamificationRouter);
  app.use('/api', labsRouter);

  app.use((req, res) => {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: `Rota não encontrada: ${req.method} ${req.path}` }
    });
  });
  app.use(errorHandler);
  return app;
}

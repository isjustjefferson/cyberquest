import pino from 'pino';
import { config } from './config';

export const logger = pino({
  level: config.isTest ? 'silent' : config.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'res.headers["set-cookie"]',
      '*.password',
      '*.password_hash',
      '*.flag'
    ],
    censor: '[redacted]'
  }
});

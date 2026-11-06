import cron, { type ScheduledTask } from 'node-cron';
import { dayDiff, localDateKey } from '@cyberquest/shared';
import { getDb } from '../db/connection';
import { logger } from '../logger';
import { LabOrchestrator } from '../modules/labs/orchestrator';
import { syncCatalog } from '../db/seed';

export function startJobs(): ScheduledTask[] {
  const db = getDb();
  const orchestrator = new LabOrchestrator(db);

  const labCleanup = cron.schedule('* * * * *', async () => {
    try {
      const expired = await orchestrator.cleanupExpired();
      if (expired > 0) logger.info({ expired }, 'Sessões de lab expiradas encerradas');
    } catch (error) {
      logger.error({ err: error }, 'Falha na limpeza de labs expirados');
    }
  });

  const streakReset = cron.schedule('5 0 * * *', () => {
    const users = db
      .prepare('SELECT id, timezone, streak_current, streak_freezes, last_activity_date FROM users')
      .all() as Array<{
      id: number;
      timezone: string;
      streak_current: number;
      streak_freezes: number;
      last_activity_date: string | null;
    }>;
    const today = new Date();
    for (const user of users) {
      if (!user.last_activity_date) continue;
      const todayKey = localDateKey(today, user.timezone || 'America/Sao_Paulo');
      const gap = dayDiff(user.last_activity_date, todayKey);
      if (gap > 1 && user.streak_freezes < gap - 1 && user.streak_current !== 0) {
        db.prepare('UPDATE users SET streak_current = 0 WHERE id = ?').run(user.id);
      }
    }
    logger.info('Reavaliação diária de streaks concluída');
  });

  const weeklyRefresh = cron.schedule('0 0 * * 1', () => {
    logger.info('Nova semana de ranking iniciada');
  });

  const contentSync = cron.schedule('0 4 * * *', () => {
    try {
      const report = syncCatalog(db);
      logger.info(report, 'Sincronização diária de conteúdo concluída');
    } catch (error) {
      logger.error({ err: error }, 'Falha na sincronização diária de conteúdo');
    }
  });

  return [labCleanup, streakReset, weeklyRefresh, contentSync];
}

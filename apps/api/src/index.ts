import http from 'node:http';
import { config } from './config';
import { app } from './server-app';
import { getDb } from './db/connection';
import { syncCatalog } from './db/seed';
import { logger } from './logger';
import { LabOrchestrator } from './modules/labs/orchestrator';
import { setupTerminalWebSocket } from './modules/labs/terminal';
import { startJobs } from './jobs';

const db = getDb();
const trackCount = (db.prepare('SELECT COUNT(*) AS total FROM tracks').get() as { total: number }).total;
if (trackCount === 0) {
  try {
    const report = syncCatalog(db);
    logger.info(report, 'Conteúdo inicial sincronizado automaticamente');
  } catch (error) {
    logger.error({ err: error }, 'Falha ao sincronizar conteúdo inicial');
  }
}

const server = http.createServer(app);
const wss = setupTerminalWebSocket(server);
const orchestrator = new LabOrchestrator(db);
const tasks = startJobs();

server.listen(config.API_PORT, '0.0.0.0', () => {
  logger.info({ port: config.API_PORT, env: config.NODE_ENV }, 'CyberQuest API no ar');
  orchestrator.cleanupOrphans().catch((error) => logger.warn({ err: error }, 'Falha ao limpar órfãos'));
});

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Encerrando CyberQuest API');
  tasks.forEach((task) => task.stop());
  wss.close();
  server.close(() => {
    logger.info('Servidor HTTP fechado');
  });
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Promise rejeitada sem tratamento');
});

export { app };

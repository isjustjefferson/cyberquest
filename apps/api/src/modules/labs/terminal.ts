import type { IncomingMessage, Server } from 'node:http';
import type { Duplex } from 'node:stream';
import { WebSocket, WebSocketServer } from 'ws';
import { config } from '../../config';
import { getDb } from '../../db/connection';
import { logger } from '../../logger';
import { verifyToken } from '../auth/service';
import { getDocker } from './docker';
import { loadManifest } from './manifest';
import type { SessionRow } from './orchestrator';

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const index = part.indexOf('=');
    if (index === -1) return acc;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

interface ClientMessage {
  type?: string;
  data?: string;
  cols?: number;
  rows?: number;
}

export function setupTerminalWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req: IncomingMessage, socket, head) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const match = url.pathname.match(/^\/ws\/lab-sessions\/([^/]+)\/terminal$/);
    if (!match) {
      socket.destroy();
      return;
    }
    const sessionId = match[1];
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[config.cookieName];
    const userId = token ? verifyToken(token) : null;
    if (!userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    const db = getDb();
    const session = db.prepare('SELECT * FROM lab_sessions WHERE id = ?').get(sessionId) as
      | SessionRow
      | undefined;
    if (!session || session.user_id !== userId || session.status !== 'running') {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req, session);
    });
  });

  wss.on('connection', async (ws: WebSocket, _req: IncomingMessage, session: SessionRow) => {
    let stream: Duplex | null = null;
    try {
      const docker = getDocker();
      loadManifest(session.lab_slug);
      const containers = await docker.listContainers({
        all: true,
        filters: {
          label: [
            `cyberquest.session=${session.id}`,
            'cyberquest.role=attacker',
            'cyberquest.managed=true'
          ]
        }
      });
      const attacker = containers[0];
      if (!attacker) {
        ws.send('\r\n[CyberQuest] Container attacker não encontrado.\r\n');
        ws.close();
        return;
      }
      const container = docker.getContainer(attacker.Id);
      const exec = await container.exec({
        Cmd: ['/bin/bash'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: 'student',
        Env: ['TERM=xterm-256color', 'PS1=student@cyberquest:\\w$ ']
      });
      stream = (await exec.start({ hijack: true, stdin: true, Tty: true })) as unknown as Duplex;
      stream.on('data', (chunk: Buffer) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(chunk.toString('utf8'));
      });
      stream.on('end', () => {
        if (ws.readyState === WebSocket.OPEN) ws.close();
      });
      stream.on('error', (error) => {
        logger.warn({ err: error, sessionId: session.id }, 'Erro no stream do terminal');
        if (ws.readyState === WebSocket.OPEN) ws.close();
      });

      ws.on('message', (raw) => {
        const text = raw.toString();
        let message: ClientMessage | null = null;
        try {
          message = JSON.parse(text) as ClientMessage;
        } catch {
          message = null;
        }
        if (message && message.type === 'resize' && message.cols && message.rows) {
          exec.resize({ w: message.cols, h: message.rows }).catch(() => undefined);
          return;
        }
        if (message && message.type === 'input' && typeof message.data === 'string') {
          stream?.write(message.data);
          return;
        }
        stream?.write(text);
      });
      ws.on('close', () => {
        try {
          stream?.end();
          stream?.destroy();
        } catch {
          // ignore
        }
      });
    } catch (error) {
      logger.error({ err: error, sessionId: session.id }, 'Falha ao abrir terminal do lab');
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('\r\n[CyberQuest] Não foi possível abrir o terminal. Encerre e inicie o lab novamente.\r\n');
        ws.close();
      }
    }
  });

  return wss;
}

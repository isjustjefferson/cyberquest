import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Exercise } from '@cyberquest/shared';

const databasePath = path.join(os.tmpdir(), `cyberquest-test-${Date.now()}-${Math.random()}.db`);
let app: import('express').Express;
let db: import('../src/db/connection').DB;
let close: () => void;
let agent: ReturnType<typeof request.agent>;

function answerFor(exercise: Exercise): unknown {
  switch (exercise.type) {
    case 'single_choice':
      return exercise.answerIndex;
    case 'multi_choice':
      return exercise.answerIndexes;
    case 'true_false':
      return exercise.answer;
    case 'order':
      return exercise.correctOrder;
    case 'match':
      return exercise.pairs;
    case 'fill_command':
      return exercise.accepted.map((options) => options[0]);
    case 'sim_terminal':
      return {
        history: exercise.checks.historyIncludes ?? [],
        files: exercise.checks.fileExists ?? [],
        cwd: exercise.checks.cwd ?? ''
      };
    case 'code_review':
      return exercise.vulnerableLines;
    case 'flag':
      return 'flag-nao-usada-neste-teste';
    default:
      return null;
  }
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_PATH = databasePath;
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.LAB_FLAG_SECRET = 'test-lab-secret';
  process.env.LOG_LEVEL = 'silent';

  const connection = await import('../src/db/connection');
  const seed = await import('../src/db/seed');
  const appModule = await import('../src/app');
  db = connection.getDb();
  seed.syncCatalog(db);
  close = connection.closeDb;
  app = appModule.createApp();
  agent = request.agent(app);
});

afterAll(() => {
  close();
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${databasePath}${suffix}`, { force: true });
  }
});

describe('fluxo ponta a ponta', () => {
  it('bloqueia rotas protegidas sem autenticação', async () => {
    const response = await request(app).get('/api/me/dashboard');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('registra, lista trilhas e conclui a primeira lição', async () => {
    const register = await agent.post('/api/auth/register').send({
      username: 'teste_quest',
      email: 'teste@cyberquest.local',
      password: 'senha-segura-123'
    });
    expect(register.status).toBe(201);
    expect(register.body.user.username).toBe('teste_quest');

    const tracks = await agent.get('/api/tracks');
    expect(tracks.status).toBe(200);
    expect(tracks.body.tracks).toHaveLength(11);
    expect(tracks.body.tracks[0].slug).toBe('00-boas-vindas');

    const track = await agent.get('/api/tracks/00-boas-vindas');
    expect(track.status).toBe(200);
    const firstLesson = track.body.track.modules[0].lessons[0];
    expect(firstLesson.slug).toBe('o-que-e-hacker-etico');
    expect(firstLesson.progressStatus).toBe('available');

    const lesson = await agent.get('/api/lessons/o-que-e-hacker-etico');
    expect(lesson.status).toBe(200);
    expect(lesson.body.lesson.exercises.length).toBeGreaterThan(0);

    const rows = db
      .prepare(
        'SELECT id, payload_json FROM exercises WHERE lesson_id = (SELECT id FROM lessons WHERE slug = ?) ORDER BY position'
      )
      .all('o-que-e-hacker-etico') as Array<{ id: number; payload_json: string }>;
    for (const row of rows) {
      const exercise = JSON.parse(row.payload_json) as Exercise;
      const answer = await agent.post(`/api/exercises/${row.id}/answer`).send({ answer: answerFor(exercise) });
      expect(answer.status, JSON.stringify(answer.body)).toBe(200);
      expect(answer.body.correct).toBe(true);
    }

    const complete = await agent.post('/api/lessons/o-que-e-hacker-etico/complete');
    expect(complete.status).toBe(200);
    expect(complete.body.stars).toBe(3);
    expect(complete.body.stats.xpTotal).toBeGreaterThan(0);
    expect(complete.body.stats.lessonsCompleted).toBe(1);
    const xpAfterCompletion = complete.body.stats.xpTotal;

    const repeated = await agent.post('/api/lessons/o-que-e-hacker-etico/complete');
    expect(repeated.status).toBe(200);
    expect(repeated.body.xpGained).toBe(0);
    expect(repeated.body.stats.xpTotal).toBe(xpAfterCompletion);

    const trackAfter = await agent.get('/api/tracks/00-boas-vindas');
    expect(trackAfter.body.track.modules[0].lessons[0].progressStatus).toBe('completed');
    expect(trackAfter.body.track.modules[0].lessons[1].progressStatus).toBe('available');

    const dashboard = await agent.get('/api/me/dashboard');
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.stats.lessonsCompleted).toBe(1);
    expect(dashboard.body.continueLesson.slug).not.toBe('o-que-e-hacker-etico');

    const leaderboard = await agent.get('/api/leaderboard/weekly');
    expect(leaderboard.status).toBe(200);
    expect(leaderboard.body.leaderboard[0].username).toBe('teste_quest');
  });

  it('bloqueia lição que ainda depende da anterior', async () => {
    const login = await request(app).post('/api/auth/login').send({
      identifier: 'teste_quest',
      password: 'senha-segura-123'
    });
    expect(login.status).toBe(200);
    const logged = request.agent(app);
    logged.set('Cookie', login.headers['set-cookie']);

    const response = await logged.get('/api/lessons/boss-etica');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('LESSON_LOCKED');
  });

  it('mantém o catálogo de conteúdo e labs válido', async () => {
    const counts = db
      .prepare(
        `SELECT (SELECT COUNT(*) FROM tracks) AS tracks,
                (SELECT COUNT(*) FROM modules) AS modules,
                (SELECT COUNT(*) FROM lessons) AS lessons,
                (SELECT COUNT(*) FROM exercises) AS exercises,
                (SELECT COUNT(*) FROM achievements) AS achievements,
                (SELECT COUNT(*) FROM lab_templates) AS labs`
      )
      .get() as Record<string, number>;
    expect(counts.tracks).toBe(11);
    expect(counts.modules).toBe(31);
    expect(counts.lessons).toBe(104);
    expect(counts.exercises).toBeGreaterThanOrEqual(200);
    expect(counts.achievements).toBeGreaterThanOrEqual(25);
    expect(counts.labs).toBe(10);
  });
});

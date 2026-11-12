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
    expect(tracks.body.tracks).toHaveLength(12);
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

  it('corrige uma consulta SQL usada como desafio diário', async () => {
    const dailyAgent = request.agent(app);
    const username = `sql_daily_${Date.now()}`;
    const register = await dailyAgent.post('/api/auth/register').send({
      username,
      email: `${username}@cyberquest.local`,
      password: 'senha-segura-123'
    });
    expect(register.status).toBe(201);
    const row = db
      .prepare(
        `SELECT e.id, e.payload_json FROM exercises e
         JOIN lessons l ON l.id = e.lesson_id
         WHERE l.slug = 'select-where-order-by' AND e.type = 'sql_query'
           AND json_extract(e.payload_json, '$.grade.mode') = 'result_match'
         ORDER BY e.position LIMIT 1`
      )
      .get() as { id: number; payload_json: string } | undefined;
    expect(row).toBeDefined();
    const exercise = JSON.parse(row!.payload_json) as Extract<Exercise, { type: 'sql_query' }>;
    const today = new Date().toISOString().slice(0, 10);
    db.prepare('INSERT OR REPLACE INTO daily_challenges (date, exercise_id, bonus_xp) VALUES (?, ?, ?)').run(
      today,
      row!.id,
      25
    );

    const challenge = await dailyAgent.get('/api/daily-challenge');
    expect(challenge.status).toBe(200);
    expect(challenge.body.challenge.exercise.type).toBe('sql_query');
    expect(challenge.body.challenge.exercise.payload.grade).toBeUndefined();

    const answer = await dailyAgent
      .post('/api/daily-challenge/answer')
      .send({ exerciseId: row!.id, answer: { sql: exercise.grade.expected_sql } });
    expect(answer.status, JSON.stringify(answer.body)).toBe(200);
    expect(answer.body.correct).toBe(true);
    expect(
      answer.body.unlockedAchievements.some((achievement: { slug: string }) => achievement.slug === 'select-from-mundo')
    ).toBe(true);

    const userId = (db.prepare('SELECT id FROM users WHERE username = ?').get(username) as { id: number }).id;
    db.prepare(
      `INSERT INTO review_queue (user_id, exercise_id, next_review_at, interval_days, ease)
       VALUES (?, ?, ?, 1, 2.5)
       ON CONFLICT(user_id, exercise_id) DO UPDATE SET next_review_at = excluded.next_review_at`
    ).run(userId, row!.id, new Date(Date.now() - 60_000).toISOString());
    const reviews = await dailyAgent.get('/api/review/due');
    expect(reviews.status).toBe(200);
    expect(
      reviews.body.items.some(
        (item: { exercise: { id: number; type: string } }) =>
          item.exercise.id === row!.id && item.exercise.type === 'sql_query'
      )
    ).toBe(true);

    const lessonId = (
      db.prepare('SELECT lesson_id FROM exercises WHERE id = ?').get(row!.id) as { lesson_id: number }
    ).lesson_id;
    db.prepare(
      `INSERT INTO user_lessons (user_id, lesson_id, status, attempts, stars, completed_at)
       VALUES (?, ?, 'completed', 0, 3, ?)
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = 'completed'`
    ).run(userId, lessonId, new Date().toISOString());
    const reviewAnswer = await dailyAgent
      .post(`/api/exercises/${row!.id}/answer`)
      .send({ answer: { sql: exercise.grade.expected_sql } });
    expect(reviewAnswer.status, JSON.stringify(reviewAnswer.body)).toBe(200);
    expect(reviewAnswer.body.correct).toBe(true);
    expect(reviewAnswer.body.reviewScheduled).toBe(true);

    const addCorrectAttempt = db.prepare(
      'INSERT INTO exercise_attempts (user_id, exercise_id, correct, answer_json, created_at) VALUES (?, ?, 1, ?, ?)'
    );
    for (let index = 0; index < 50; index += 1) {
      addCorrectAttempt.run(userId, row!.id, JSON.stringify({ sql: exercise.grade.expected_sql }), new Date().toISOString());
    }
    const { evaluateAchievements } = await import('../src/modules/gamification/service');
    const unlocked = evaluateAchievements(db, userId, {
      type: 'exercise_answered',
      exerciseType: 'sql_query',
      correct: true
    });
    expect(unlocked.map((achievement) => achievement.slug)).toContain('dez-de-dez');
    expect(unlocked.map((achievement) => achievement.slug)).toContain('cinquenta-respostas-sql');
  }, 40_000);

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

  it('expõe áreas e mantém trilhas e conquistas filtráveis', async () => {
    const areas = await agent.get('/api/areas');
    expect(areas.status).toBe(200);
    expect(areas.body.areas).toHaveLength(2);
    const cyber = areas.body.areas.find((area: { slug: string }) => area.slug === 'ciberseguranca');
    const dba = areas.body.areas.find((area: { slug: string }) => area.slug === 'bancos-de-dados');
    expect(cyber.totalLessons).toBe(104);
    expect(cyber.nextLesson).not.toBeNull();
    expect(dba.totalLessons).toBe(83);
    expect(dba.nextLesson).not.toBeNull();

    const area = await agent.get('/api/areas/ciberseguranca');
    expect(area.status).toBe(200);
    expect(area.body.area.tracks).toHaveLength(11);
    expect(area.body.area.tracks[0].areaSlug).toBe('ciberseguranca');

    const dbaTracks = await agent.get('/api/tracks?area=bancos-de-dados');
    expect(dbaTracks.status).toBe(200);
    expect(dbaTracks.body.tracks).toHaveLength(1);

    const invalid = await agent.get('/api/tracks?area=inexistente');
    expect(invalid.status).toBe(404);
    expect(invalid.body.error.code).toBe('AREA_NOT_FOUND');

    const stats = await agent.get('/api/me/stats/areas');
    expect(stats.status).toBe(200);
    const cyberStats = stats.body.areas.find((item: { slug: string }) => item.slug === 'ciberseguranca');
    expect(cyberStats.xp).toBeGreaterThan(0);
    expect(cyberStats.completedLessons).toBe(1);

    const achievements = await agent.get('/api/me/achievements?area=ciberseguranca');
    expect(achievements.status).toBe(200);
    expect(achievements.body.achievements.length).toBeGreaterThan(0);
    expect(
      achievements.body.achievements.every(
        (item: { areaSlug: string | null }) => item.areaSlug === null || item.areaSlug === 'ciberseguranca'
      )
    ).toBe(true);

    const cyberRanking = await agent.get('/api/leaderboard/weekly?area=ciberseguranca');
    expect(cyberRanking.status).toBe(200);
    expect(cyberRanking.body.leaderboard[0].username).toBe('teste_quest');
    const dbaRanking = await agent.get('/api/leaderboard/weekly?area=bancos-de-dados');
    expect(dbaRanking.status).toBe(200);
    expect(
      dbaRanking.body.leaderboard.every((entry: { xp: number }) => entry.xp > 0)
    ).toBe(true);

    const unassignedXp = db
      .prepare("SELECT COUNT(*) AS total FROM xp_events WHERE source_type IN ('lesson','exercise','module') AND area_id IS NULL")
      .get() as { total: number };
    expect(unassignedXp.total).toBe(0);
  });

  it('executa e corrige um exercício sql_query ponta a ponta', async () => {
    const lesson = db.prepare('SELECT id FROM lessons WHERE slug = ?').get('o-que-e-hacker-etico') as { id: number };
    const position = db
      .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS position FROM exercises WHERE lesson_id = ?')
      .get(lesson.id) as { position: number };
    const exercise = {
      type: 'sql_query',
      xp: 12,
      prompt: "Liste o nome e o preço dos produtos da categoria 'Pães', do mais caro ao mais barato.",
      dataset: 'padaria_byte',
      setup: '',
      starter: 'SELECT\nFROM produtos;',
      explanation: 'Use WHERE para filtrar e ORDER BY ... DESC para ordenar.',
      hints: [],
      grade: {
        mode: 'result_match',
        expected_sql: "SELECT nome, preco FROM produtos WHERE categoria = 'Pães' ORDER BY preco DESC",
        ordered: true,
        compare_column_names: true,
        numeric_tolerance: 0.001,
        must_contain: [],
        must_not_contain: []
      }
    };
    const inserted = db
      .prepare('INSERT INTO exercises (lesson_id, position, type, payload_json, xp) VALUES (?, ?, ?, ?, ?)')
      .run(lesson.id, position.position, 'sql_query', JSON.stringify(exercise), 12);
    const exerciseId = Number(inserted.lastInsertRowid);

    const lessonResponse = await agent.get('/api/lessons/o-que-e-hacker-etico');
    expect(lessonResponse.status).toBe(200);
    const publicSql = lessonResponse.body.lesson.exercises.find(
      (item: { id: number }) => item.id === exerciseId
    );
    expect(publicSql.type).toBe('sql_query');
    expect(publicSql.payload.dataset).toBe('padaria_byte');
    expect(JSON.stringify(publicSql)).not.toContain('expected_sql');
    expect(publicSql.payload.grade).toBeUndefined();

    const run = await agent.post(`/api/exercises/${exerciseId}/sql/run`).send({
      sql: "SELECT nome, preco FROM produtos WHERE categoria = 'Pães' ORDER BY preco DESC"
    });
    expect(run.status, JSON.stringify(run.body)).toBe(200);
    expect(run.body.rowCount).toBe(5);
    expect(run.body.columns.map((column: { name: string }) => column.name)).toEqual(['nome', 'preco']);

    const schema = await agent.get('/api/datasets/padaria_byte/schema');
    expect(schema.status).toBe(200);
    expect(schema.body.schema.tables.map((table: { name: string }) => table.name)).toContain('pedidos');

    const wrong = await agent.post(`/api/exercises/${exerciseId}/answer`).send({
      answer: { sql: "SELECT nome FROM produtos WHERE categoria = 'Pães'" }
    });
    expect(wrong.status).toBe(200);
    expect(wrong.body.correct).toBe(false);
    expect(wrong.body.explanation).not.toContain('ORDER BY preco DESC');

    const correct = await agent.post(`/api/exercises/${exerciseId}/answer`).send({
      answer: { sql: "SELECT nome, preco FROM produtos WHERE categoria = 'Pães' ORDER BY preco DESC" }
    });
    expect(correct.status, JSON.stringify(correct.body)).toBe(200);
    expect(correct.body.correct).toBe(true);
    expect(correct.body.xpGained).toBeGreaterThan(0);

    const repeated = await agent.post(`/api/exercises/${exerciseId}/answer`).send({
      answer: { sql: "SELECT nome, preco FROM produtos WHERE categoria = 'Pães' ORDER BY preco DESC" }
    });
    expect(repeated.status).toBe(200);
    expect(repeated.body.correct).toBe(true);
    expect(repeated.body.xpGained).toBe(0);
  }, 40_000);

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
    expect(counts.tracks).toBe(12);
    expect(counts.modules).toBe(40);
    expect(counts.lessons).toBe(187);
    expect(counts.exercises).toBeGreaterThanOrEqual(200);
    expect(counts.achievements).toBeGreaterThanOrEqual(25);
    expect(counts.labs).toBe(20);
  });
});

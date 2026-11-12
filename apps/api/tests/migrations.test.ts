import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createDatabase, runMigrations } from '../src/db/connection';

function migration(name: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), 'src/db/migrations', name), 'utf8');
}

describe('migração de áreas', () => {
  it('faz backfill de trilhas e eventos de XP existentes', () => {
    const db = createDatabase(':memory:');
    db.exec(migration('001_initial.sql'));
    db.exec(`
      INSERT INTO users (username, email, password_hash, display_name, created_at)
      VALUES ('legado', 'legado@test.local', 'hash', 'Legado', '2026-01-01T00:00:00.000Z');
      INSERT INTO tracks (slug, title, position) VALUES ('trilha-legada', 'Trilha legada', 0);
      INSERT INTO modules (track_id, slug, title, position)
      VALUES (1, 'modulo-legado', 'Módulo legado', 0);
      INSERT INTO lessons (module_id, slug, title, position, content_path, lab_slug, status)
      VALUES (1, 'licao-legada', 'Lição legada', 0, 'licao.md', 'lab-legado', 'complete');
      INSERT INTO exercises (lesson_id, position, type, payload_json)
      VALUES (1, 0, 'true_false', '{}');
      INSERT INTO daily_challenges (date, exercise_id, bonus_xp)
      VALUES ('2026-01-01', 1, 25);
      INSERT INTO achievements (slug, title, description, criteria_json)
      VALUES ('conquista-legada', 'Conquista legada', 'Teste', '{}');
      INSERT INTO xp_events (user_id, source_type, source_id, amount, created_at) VALUES
        (1, 'lesson', 'licao-legada', 10, '2026-01-01T00:00:00.000Z'),
        (1, 'exercise', '1', 10, '2026-01-01T00:00:00.000Z'),
        (1, 'module', 'modulo-legado', 10, '2026-01-01T00:00:00.000Z'),
        (1, 'lab', 'lab-legado', 10, '2026-01-01T00:00:00.000Z'),
        (1, 'lab_objective', 'lab-legado:objetivo-1', 10, '2026-01-01T00:00:00.000Z'),
        (1, 'daily_challenge', '2026-01-01', 10, '2026-01-01T00:00:00.000Z');
      CREATE TABLE schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL
      );
      INSERT INTO schema_migrations (name, applied_at) VALUES ('001_initial.sql', '2026-01-01T00:00:00.000Z');
    `);

    expect(runMigrations(db)).toEqual(['002_areas.sql']);

    const area = db.prepare("SELECT id FROM areas WHERE slug = 'ciberseguranca'").get() as { id: number };
    expect(area.id).toBeGreaterThan(0);
    const track = db.prepare("SELECT area_id FROM tracks WHERE slug = 'trilha-legada'").get() as {
      area_id: number;
    };
    expect(track.area_id).toBe(area.id);

    const pending = db
      .prepare('SELECT COUNT(*) AS total FROM xp_events WHERE area_id IS NULL')
      .get() as { total: number };
    expect(pending.total).toBe(0);

    const achievement = db
      .prepare("SELECT area_id FROM achievements WHERE slug = 'conquista-legada'")
      .get() as { area_id: number | null };
    expect(achievement.area_id).toBeNull();

    db.close();
  });
});

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT '#00ff9c',
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
);

ALTER TABLE tracks ADD COLUMN area_id INTEGER REFERENCES areas(id);
ALTER TABLE xp_events ADD COLUMN area_id INTEGER REFERENCES areas(id);
ALTER TABLE achievements ADD COLUMN area_id INTEGER REFERENCES areas(id);

INSERT INTO areas (slug, title, description, icon, color, position, status)
SELECT
  'ciberseguranca',
  'Cibersegurança',
  'Do básico ao pentest: redes, web, criptografia, blue team e carreira.',
  '🛡️',
  '#00ff9c',
  1,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM areas WHERE slug = 'ciberseguranca');

UPDATE tracks
SET area_id = (SELECT id FROM areas WHERE slug = 'ciberseguranca')
WHERE area_id IS NULL;

UPDATE xp_events
SET area_id = (
  SELECT t.area_id
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  JOIN tracks t ON t.id = m.track_id
  WHERE l.slug = xp_events.source_id
)
WHERE area_id IS NULL AND source_type = 'lesson';

UPDATE xp_events
SET area_id = (
  SELECT t.area_id
  FROM exercises e
  JOIN lessons l ON l.id = e.lesson_id
  JOIN modules m ON m.id = l.module_id
  JOIN tracks t ON t.id = m.track_id
  WHERE CAST(xp_events.source_id AS INTEGER) = e.id
)
WHERE area_id IS NULL AND source_type = 'exercise';

UPDATE xp_events
SET area_id = (
  SELECT t.area_id
  FROM modules m
  JOIN tracks t ON t.id = m.track_id
  WHERE m.slug = xp_events.source_id
)
WHERE area_id IS NULL AND source_type = 'module';

UPDATE xp_events
SET area_id = (
  SELECT t.area_id
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  JOIN tracks t ON t.id = m.track_id
  WHERE l.lab_slug = xp_events.source_id
  ORDER BY l.id
  LIMIT 1
)
WHERE area_id IS NULL AND source_type = 'lab';

UPDATE xp_events
SET area_id = (
  SELECT t.area_id
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  JOIN tracks t ON t.id = m.track_id
  WHERE l.lab_slug = CASE
      WHEN instr(xp_events.source_id, ':') > 0
        THEN substr(xp_events.source_id, 1, instr(xp_events.source_id, ':') - 1)
      ELSE xp_events.source_id
    END
  ORDER BY l.id
  LIMIT 1
)
WHERE area_id IS NULL AND source_type = 'lab_objective';

UPDATE xp_events
SET area_id = (
  SELECT t.area_id
  FROM daily_challenges d
  JOIN exercises e ON e.id = d.exercise_id
  JOIN lessons l ON l.id = e.lesson_id
  JOIN modules m ON m.id = l.module_id
  JOIN tracks t ON t.id = m.track_id
  WHERE d.date = xp_events.source_id
)
WHERE area_id IS NULL AND source_type = 'daily_challenge';

CREATE INDEX IF NOT EXISTS idx_tracks_area ON tracks(area_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_area ON xp_events(user_id, area_id, created_at);
CREATE INDEX IF NOT EXISTS idx_achievements_area ON achievements(area_id);

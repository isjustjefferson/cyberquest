PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_id TEXT NOT NULL DEFAULT 'byte-default',
  role TEXT NOT NULL DEFAULT 'student',
  xp_total INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  bits INTEGER NOT NULL DEFAULT 0,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_best INTEGER NOT NULL DEFAULT 0,
  streak_freezes INTEGER NOT NULL DEFAULT 0,
  last_activity_date TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  accepted_lab_terms_at TEXT,
  sounds_enabled INTEGER NOT NULL DEFAULT 0,
  theme TEXT NOT NULL DEFAULT 'dark',
  reduce_motion INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🛡️',
  color TEXT NOT NULL DEFAULT 'verde',
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id INTEGER NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'lesson',
  difficulty INTEGER NOT NULL DEFAULT 1,
  est_minutes INTEGER NOT NULL DEFAULT 10,
  xp_reward INTEGER NOT NULL DEFAULT 30,
  position INTEGER NOT NULL DEFAULT 0,
  content_path TEXT NOT NULL,
  lab_slug TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  prerequisites_json TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 10
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_lesson_position ON exercises(lesson_id, position);

CREATE TABLE IF NOT EXISTS user_lessons (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available',
  best_score INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  stars INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS exercise_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  correct INTEGER NOT NULL,
  answer_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user ON exercise_attempts(user_id, exercise_id);

CREATE TABLE IF NOT EXISTS xp_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_events_unique ON xp_events(user_id, source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_user_created ON xp_events(user_id, created_at);

CREATE TABLE IF NOT EXISTS bit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏅',
  rarity TEXT NOT NULL DEFAULT 'comum',
  criteria_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TEXT NOT NULL,
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS weekly_xp (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, week_start)
);

CREATE TABLE IF NOT EXISTS daily_challenges (
  date TEXT PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE SET NULL,
  bonus_xp INTEGER NOT NULL DEFAULT 25
);

CREATE TABLE IF NOT EXISTS review_queue (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  next_review_at TEXT NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 1,
  ease REAL NOT NULL DEFAULT 2.5,
  PRIMARY KEY (user_id, exercise_id)
);
CREATE INDEX IF NOT EXISTS idx_review_due ON review_queue(user_id, next_review_at);

CREATE TABLE IF NOT EXISTS lab_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  ttl_minutes INTEGER NOT NULL DEFAULT 60,
  xp_reward INTEGER NOT NULL DEFAULT 150,
  manifest_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lab_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lab_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'starting',
  network_id TEXT,
  container_ids_json TEXT NOT NULL DEFAULT '[]',
  proxy_ports_json TEXT NOT NULL DEFAULT '{}',
  nonce TEXT NOT NULL,
  started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  stopped_at TEXT,
  extended INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_user ON lab_sessions(user_id, status);

CREATE TABLE IF NOT EXISTS lab_objectives_done (
  session_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  lab_slug TEXT NOT NULL,
  objective_id TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  hints_used INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, lab_slug, objective_id)
);

CREATE TABLE IF NOT EXISTS hint_usage (
  user_id INTEGER NOT NULL,
  scope TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  hint_index INTEGER NOT NULL,
  cost_bits INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, scope, scope_id, hint_index)
);

CREATE TABLE IF NOT EXISTS user_cosmetics (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  acquired_at TEXT NOT NULL,
  PRIMARY KEY (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_modules_track ON modules(track_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_user ON user_lessons(user_id);

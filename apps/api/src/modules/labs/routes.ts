import { Router } from 'express';
import {
  hintAdjustedXp,
  labFlagSchema,
  labHintSchema,
  labVerifySchema,
  XP,
  type LabManifest,
  type LabManifestObjective,
  type LabSummary
} from '@cyberquest/shared';
import type { DB } from '../../db/connection';
import { getDb } from '../../db/connection';
import { requireAuth } from '../../middleware/auth';
import { labLimiter } from '../../middleware/rateLimit';
import { asyncHandler, AppError } from '../../utils/errors';
import { dynamicFlag, safeEqual } from '../../utils/crypto';
import { evaluateAchievements, getUser, getUserStats, grantBits, grantXp } from '../gamification/service';
import { isDockerAvailable } from './docker';
import { loadManifest } from './manifest';
import { LabOrchestrator, type SessionRow } from './orchestrator';
import { nowIso } from '../../utils/time';

export const labsRouter = Router();

function orchestrator() {
  return new LabOrchestrator(getDb());
}

function completeObjective(
  db: DB,
  row: SessionRow,
  manifest: LabManifest,
  objective: LabManifestObjective
) {
  const already = db
    .prepare('SELECT 1 FROM lab_objectives_done WHERE user_id = ? AND lab_slug = ? AND objective_id = ?')
    .get(row.user_id, row.lab_slug, objective.id);
  if (already) {
    return {
      objectiveCompleted: true,
      alreadyCompleted: true,
      xpGained: 0,
      bitsGained: 0,
      labCompleted: false,
      stats: getUserStats(db, row.user_id),
      unlockedAchievements: []
    };
  }
  const hintsUsed = (
    db
      .prepare(
        "SELECT COUNT(*) AS total FROM hint_usage WHERE user_id = ? AND scope = 'lab' AND scope_id = ?"
      )
      .get(row.user_id, `${row.lab_slug}:${objective.id}`) as { total: number }
  ).total;
  const xpAward = hintAdjustedXp(objective.xp, hintsUsed);
  db.prepare(
    `INSERT INTO lab_objectives_done (session_id, user_id, lab_slug, objective_id, completed_at, hints_used)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(row.id, row.user_id, row.lab_slug, objective.id, nowIso(), hintsUsed);
  let xpGained = grantXp(
    db,
    row.user_id,
    'lab_objective',
    `${row.lab_slug}:${objective.id}`,
    xpAward,
    new Date(),
    labAreaIdFor(db, row.lab_slug)
  );

  const remaining = manifest.objectives.filter(
    (item) =>
      !db
        .prepare(
          'SELECT 1 FROM lab_objectives_done WHERE user_id = ? AND lab_slug = ? AND objective_id = ?'
        )
        .get(row.user_id, row.lab_slug, item.id)
  );
  let labCompleted = false;
  let bitsGained = 0;
  if (remaining.length === 0) {
    labCompleted = true;
    const labXp = grantXp(
      db,
      row.user_id,
      'lab',
      row.lab_slug,
      manifest.xp_reward,
      new Date(),
      labAreaIdFor(db, row.lab_slug)
    );
    xpGained += labXp;
    if (labXp > 0) {
      bitsGained = grantBits(db, row.user_id, `lab_${row.lab_slug}`, XP.bitsPerLab);
    }
  }
  const totalHints = (
    db
      .prepare(
        "SELECT COUNT(*) AS total FROM hint_usage WHERE user_id = ? AND scope = 'lab' AND scope_id LIKE ?"
      )
      .get(row.user_id, `${row.lab_slug}:%`) as { total: number }
  ).total;
  const unlockedAchievements = evaluateAchievements(db, row.user_id, {
    type: labCompleted ? 'lab_completed' : 'lab_objective',
    labSlug: row.lab_slug,
    hintsUsed: totalHints
  });
  return {
    objectiveCompleted: true,
    alreadyCompleted: false,
    xpGained,
    bitsGained,
    labCompleted,
    stats: getUserStats(db, row.user_id),
    unlockedAchievements
  };
}

function labAreaIdFor(db: DB, labSlug: string): number | null {
  const area = db
    .prepare(
      `SELECT t.area_id FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN tracks t ON t.id = m.track_id
       WHERE l.lab_slug = ? LIMIT 1`
    )
    .get(labSlug) as { area_id: number } | undefined;
  return area?.area_id ?? null;
}

labsRouter.get(
  '/labs',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const db = getDb();
    const dockerAvailable = await isDockerAvailable();
    const rows = db
      .prepare('SELECT slug, title, difficulty, ttl_minutes, xp_reward FROM lab_templates ORDER BY difficulty, slug')
      .all() as Array<{
      slug: string;
      title: string;
      difficulty: number;
      ttl_minutes: number;
      xp_reward: number;
    }>;
    const labs: LabSummary[] = rows.map((row) => {
      const manifest = loadManifest(row.slug);
      return {
        slug: row.slug,
        title: row.title,
        description: manifest.description,
        difficulty: row.difficulty,
        ttlMinutes: row.ttl_minutes,
        xpReward: row.xp_reward
      };
    });
    res.json({ labs, dockerAvailable });
  })
);

labsRouter.get(
  '/labs/:slug',
  requireAuth,
  asyncHandler(async (req, res) => {
    const dockerAvailable = await isDockerAvailable();
    const detail = orchestrator().labDetail(req.user!.id, req.params.slug, dockerAvailable);
    res.json({ lab: detail });
  })
);

labsRouter.post(
  '/labs/:slug/start',
  requireAuth,
  labLimiter,
  asyncHandler(async (req, res) => {
    const session = await orchestrator().start(req.user!.id, req.params.slug);
    res.status(201).json({ session });
  })
);

labsRouter.get(
  '/lab-sessions/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orch = orchestrator();
    const row = orch.getOwnedSession(req.params.id, req.user!.id);
    if (row.status === 'running' && new Date(row.expires_at).getTime() <= Date.now()) {
      await orch.expire(row.id);
      res.json({ session: orch.publicSession(orch.getSessionRow(row.id)) });
      return;
    }
    res.json({ session: orch.publicSession(row) });
  })
);

labsRouter.post(
  '/lab-sessions/:id/extend',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orch = orchestrator();
    orch.extend(req.params.id, req.user!.id);
    res.json({ session: orch.publicSession(orch.getSessionRow(req.params.id)) });
  })
);

labsRouter.delete(
  '/lab-sessions/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orch = orchestrator();
    await orch.stop(req.params.id, req.user!.id);
    res.json({ ok: true });
  })
);

labsRouter.post(
  '/lab-sessions/:id/flag',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = labFlagSchema.parse(req.body);
    const db = getDb();
    const orch = orchestrator();
    const row = orch.getOwnedSession(req.params.id, req.user!.id);
    if (row.status !== 'running') {
      throw new AppError(400, 'SESSION_NOT_RUNNING', 'A sessão não está ativa.');
    }
    const manifest = loadManifest(row.lab_slug);
    const objective = manifest.objectives.find((item) => item.id === input.objectiveId);
    if (!objective) throw new AppError(404, 'OBJECTIVE_NOT_FOUND', 'Objetivo não encontrado.');
    if (objective.verify) {
      throw new AppError(400, 'NOT_FLAG_OBJECTIVE', 'Este objetivo é validado automaticamente. Use Verificar.');
    }
    const expected = dynamicFlag(row.user_id, objective.id, row.nonce);
    if (!safeEqual(expected, input.flag.trim())) {
      throw new AppError(400, 'INVALID_FLAG', 'Flag incorreta. Verifique o valor e tente novamente.');
    }
    res.json(completeObjective(db, row, manifest, objective));
  })
);

labsRouter.post(
  '/lab-sessions/:id/verify',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = labVerifySchema.parse(req.body);
    const db = getDb();
    const orch = orchestrator();
    const row = orch.getOwnedSession(req.params.id, req.user!.id);
    const outcome = await orch.verify(row.id, row.user_id, input.objectiveId);
    if (!outcome.passed) {
      res.json({ passed: false, message: outcome.message });
      return;
    }
    const manifest = loadManifest(row.lab_slug);
    const result = completeObjective(db, row, manifest, outcome.objective);
    res.json({ passed: true, message: outcome.message, ...result });
  })
);

labsRouter.post(
  '/lab-sessions/:id/hint',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = labHintSchema.parse(req.body);
    const db = getDb();
    const orch = orchestrator();
    const row = orch.getOwnedSession(req.params.id, req.user!.id);
    const manifest = loadManifest(row.lab_slug);
    const objective = manifest.objectives.find((item) => item.id === input.objectiveId);
    if (!objective) throw new AppError(404, 'OBJECTIVE_NOT_FOUND', 'Objetivo não encontrado.');
    const hints = objective.hints ?? [];
    const scopeId = `${row.lab_slug}:${objective.id}`;
    const used = (
      db
        .prepare(
          "SELECT COUNT(*) AS total FROM hint_usage WHERE user_id = ? AND scope = 'lab' AND scope_id = ?"
        )
        .get(row.user_id, scopeId) as { total: number }
    ).total;
    if (used >= hints.length) {
      throw new AppError(400, 'NO_MORE_HINTS', 'Não há mais dicas para este objetivo.');
    }
    const hint = hints[used];
    const user = getUser(db, row.user_id);
    if (user.bits < hint.cost_bits) {
      throw new AppError(400, 'NOT_ENOUGH_BITS', 'Bits insuficientes para comprar esta dica.');
    }
    const transaction = db.transaction(() => {
      const inserted = db
        .prepare(
          `INSERT OR IGNORE INTO hint_usage (user_id, scope, scope_id, hint_index, cost_bits, created_at)
           VALUES (?, 'lab', ?, ?, ?, ?)`
        )
        .run(row.user_id, scopeId, used, hint.cost_bits, nowIso());
      if (inserted.changes === 0) {
        throw new AppError(409, 'HINT_ALREADY_USED', 'Esta dica já foi revelada.');
      }
      grantBits(db, row.user_id, `hint_${row.lab_slug}_${objective.id}_${used}`, -hint.cost_bits);
    });
    transaction();
    res.json({
      hint: { text: hint.text, index: used, costBits: hint.cost_bits },
      stats: getUserStats(db, row.user_id)
    });
  })
);

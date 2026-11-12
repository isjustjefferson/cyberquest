import { Router } from 'express';
import { answerSchema } from '@cyberquest/shared';
import { getDb } from '../../db/connection';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/errors';
import { answerExercise, dueReviews, runSqlExercise } from './service';
import { getDatasetSchema } from './sql/dataset';

export const exercisesRouter = Router();

exercisesRouter.post(
  '/exercises/:id/answer',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { answer } = answerSchema.parse(req.body);
    const exerciseId = Number(req.params.id);
    const db = getDb();
    res.json(await answerExercise(db, req.user!.id, exerciseId, answer));
  })
);

exercisesRouter.post(
  '/exercises/:id/sql/run',
  requireAuth,
  asyncHandler(async (req, res) => {
    const sql = typeof req.body?.sql === 'string' ? req.body.sql : '';
    const exerciseId = Number(req.params.id);
    const db = getDb();
    res.json(await runSqlExercise(db, req.user!.id, exerciseId, sql));
  })
);

exercisesRouter.get(
  '/datasets/:name/schema',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ schema: await getDatasetSchema(req.params.name) });
  })
);

exercisesRouter.get(
  '/review/due',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ items: dueReviews(db, req.user!.id) });
  })
);

import { Router } from 'express';
import { answerSchema } from '@cyberquest/shared';
import { getDb } from '../../db/connection';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/errors';
import { answerExercise, dueReviews } from './service';

export const exercisesRouter = Router();

exercisesRouter.post(
  '/exercises/:id/answer',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { answer } = answerSchema.parse(req.body);
    const exerciseId = Number(req.params.id);
    const db = getDb();
    res.json(answerExercise(db, req.user!.id, exerciseId, answer));
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

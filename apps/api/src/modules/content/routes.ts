import { Router } from 'express';
import { getDb } from '../../db/connection';
import { optionalAuth, requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/errors';
import { getLessonDetail, getTrack, listTracks, markLessonStarted } from './service';

export const contentRouter = Router();

contentRouter.get(
  '/tracks',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ tracks: listTracks(db, req.user?.id) });
  })
);

contentRouter.get(
  '/tracks/:slug',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ track: getTrack(db, req.params.slug, req.user?.id) });
  })
);

contentRouter.get(
  '/lessons/:slug',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ lesson: getLessonDetail(db, req.params.slug, req.user?.id) });
  })
);

contentRouter.post(
  '/lessons/:slug/start',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    markLessonStarted(db, req.user!.id, req.params.slug);
    res.json({ ok: true });
  })
);

contentRouter.post(
  '/lessons/:slug/complete',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const { completeLesson } = await import('../progress/service');
    res.json(completeLesson(db, req.user!.id, req.params.slug));
  })
);

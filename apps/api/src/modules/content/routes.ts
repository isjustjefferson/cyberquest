import { Router } from 'express';
import { getDb } from '../../db/connection';
import { optionalAuth, requireAuth } from '../../middleware/auth';
import { AppError, asyncHandler } from '../../utils/errors';
import {
  areaExists,
  getArea,
  getLessonDetail,
  getTrack,
  getUserAreaStats,
  listAreas,
  listTracks,
  markLessonStarted
} from './service';

export const contentRouter = Router();

function areaFilter(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

contentRouter.get(
  '/areas',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ areas: listAreas(db, req.user?.id) });
  })
);

contentRouter.get(
  '/areas/:slug',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ area: getArea(db, req.params.slug, req.user?.id) });
  })
);

contentRouter.get(
  '/me/stats/areas',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    res.json({ areas: getUserAreaStats(db, req.user!.id) });
  })
);

contentRouter.get(
  '/tracks',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const db = getDb();
    const area = areaFilter(req.query.area);
    if (area && !areaExists(db, area)) {
      throw new AppError(404, 'AREA_NOT_FOUND', 'Área não encontrada.');
    }
    res.json({ tracks: listTracks(db, req.user?.id, area) });
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

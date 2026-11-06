import type { UserRow } from '../modules/gamification/service';

declare global {
  namespace Express {
    interface Request {
      user?: UserRow;
    }
  }
}

export {};

import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../utils/jwt.js';
import { AuthError, ForbiddenError } from './errorHandler.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AuthError('Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);
  try {
    const decoded = verifyJwt(token);
    (req as any).user = decoded;
    next();
  } catch {
    next(new AuthError('Invalid or expired token'));
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if ((req as any).user?.role !== 'admin') {
    return next(new ForbiddenError('Admin only'));
  }
  next();
}

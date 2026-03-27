import type { Request, Response, NextFunction } from 'express';

// Dummy Auth Middleware: inject user
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Simulate authentication, in real world decode JWT etc
  (req as any).user = { id: 'dummy-admin-id', role: 'admin' };
  next();
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if ((req as any).user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'Admin only' });
  }
  next();
}

import type { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger.ts';
import { v4 as uuidv4 } from 'uuid';

const SLOW_REQUEST_THRESHOLD = 1000; // ms

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();
  const requestId = uuidv4();
  (req as any).requestId = requestId;

  // Actor extraction logic
  // IP extraction supporting reverse proxy
   // User agent extraction
   const userAgent = req.headers['user-agent'] || '';


  res.on('finish', () => {
    const diff = process.hrtime(startHrTime);
    const responseTime = Math.round((diff[0] * 1e3) + (diff[1] / 1e6)); // ms
    const meta = {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
       userAgent

    };
    if (responseTime > SLOW_REQUEST_THRESHOLD) {
      logger.warn({ ...meta, slow: true });
    } else {
      logger.info(meta);
    }
  });
  next();
}

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = (req as any).requestId;
   const userAgent = req.headers['user-agent'] || '';


  const meta = {
    requestId,
    statusCode: res.statusCode || 500,
    timestamp: new Date().toISOString(),

    userAgent,
    data: err.data
  };
  logger.error({ ...meta, message: err.message });
  next(err);
}

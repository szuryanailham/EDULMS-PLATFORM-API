import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';


export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, isOperational = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') { super(message, 404); }
}
export class ValidationError extends AppError {
  constructor(message = 'Invalid request data', details?: any) { super(message, 400, true, details); }
}
export class AuthError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') { super(message, 403); }
}
export class DatabaseError extends AppError {
  constructor(message = 'Database error', details?: any) { super(message, 500, true, details); }
}
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') { super(message, 429); }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Request validation failed',
      details: err.issues
    });
  }


  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.constructor.name,
      message: err.message,
      details: err.details ?? undefined
    });
  }


  if (err?.code && err?.clientVersion) {
    return res.status(400).json({
      error: 'PrismaError',
      message: err.message,
      code: err.code,
      meta: err.meta
    });
  }

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'JWTError',
      message: err.message
    });
  }
  
  console.error('[ERROR]', err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack || String(err)
  });
}

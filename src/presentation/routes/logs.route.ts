import { Router } from 'express';
import { getLogsHandler } from '../handlers/logs.handler.ts';
import { adminOnly, authMiddleware } from '../middlewares/authMiddleware.ts';

export const logsRouter = Router();

// Only allow admin
logsRouter.get('/', authMiddleware, adminOnly, getLogsHandler);

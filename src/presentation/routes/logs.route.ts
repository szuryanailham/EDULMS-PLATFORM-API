import { Router } from 'express';
import { getLogsHandler } from '../handlers/logs.handler.js';
import { adminOnly, authMiddleware } from '../middlewares/authMiddleware.js';

export const logsRouter = Router();

// Only allow admin
logsRouter.get('/', authMiddleware, adminOnly, getLogsHandler);

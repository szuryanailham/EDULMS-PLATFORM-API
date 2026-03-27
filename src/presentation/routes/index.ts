import { Router } from 'express';
import healthRoute from './health.route.js';
import authRoute from './auth.route.js';
import { logsRouter } from './logs.route.js';
const router = Router();

router.use('/health', healthRoute);
router.use('/auth', authRoute);
router.use('/logs', logsRouter);

export { router };

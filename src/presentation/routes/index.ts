import { Router } from 'express';
import healthRoute from './health.route.js';
import authRoute from './auth.route.js';
import { logsRouter } from './logs.route.js';
import categoryRoute from './category.route.js';
import transactionRoute from './transaction.route.js';

const router = Router();

router.use('/health', healthRoute);
router.use('/auth', authRoute);
router.use('/logs', logsRouter);
router.use('/categories', categoryRoute);
router.use('/transactions', transactionRoute);

export { router };

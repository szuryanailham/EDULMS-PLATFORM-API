import { Router } from 'express';
import {
  createTransactionHandler,
  deleteTransactionHandler,
  getTransactionHandler,
  updateTransactionHandler,
} from '../handlers/transaction.handler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/one', authMiddleware, getTransactionHandler);
router.post('/one', authMiddleware, createTransactionHandler);
router.patch('/one', authMiddleware, updateTransactionHandler);
router.delete('/one', authMiddleware, deleteTransactionHandler);

export default router;

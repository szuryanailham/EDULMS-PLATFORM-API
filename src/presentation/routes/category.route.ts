import { Router } from 'express';
import { createCategoryHandler } from '../handlers/category.handler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, createCategoryHandler);

export default router;

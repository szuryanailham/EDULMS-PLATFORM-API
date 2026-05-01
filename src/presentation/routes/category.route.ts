import { Router } from 'express';
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  softDeleteCategoryHandler,
} from '../handlers/category.handler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/list', authMiddleware, listCategoriesHandler);
router.get('/one', authMiddleware, getCategoryByIdHandler);
router.post('/one', authMiddleware, createCategoryHandler);
router.patch('/one', authMiddleware, updateCategoryHandler);
router.delete('/one', authMiddleware, softDeleteCategoryHandler);

export default router;

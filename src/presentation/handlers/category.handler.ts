import type { Request, Response } from 'express';
import {
  createCategoryController,
  updateCategoryController,
  softDeleteCategoryController,
} from '../controllers/categoryController.js';
import { CreateCategoryRequestDTO } from '../../application/dtos/CreateCategoryRequestDTO.js';
import { UpdateCategoryRequestDTO } from '../../application/dtos/UpdateCategoryRequestDTO.js';

export async function createCategoryHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const dto = new CreateCategoryRequestDTO(req.body);
  const result = await createCategoryController(userId, dto);

  if ('error' in result) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: null,
      errors: result.error,
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category: result.category },
  });
}

export async function updateCategoryHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const categoryId = String(req.query.category_id_eq ?? '');
  const dto = new UpdateCategoryRequestDTO(req.body);
  const result = await updateCategoryController(userId, categoryId, dto);

  if ('error' in result) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: null,
      errors: result.error,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category: result.category },
  });
}

export async function softDeleteCategoryHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const categoryId = String(req.query.category_id_eq ?? '');

  await softDeleteCategoryController(userId, categoryId);

  return res.status(200).json({
    success: true,
    message: 'Category soft deleted successfully',
    data: null,
  });
}

import type { Request, Response } from 'express';
import { createCategoryController } from '../controllers/categoryController.js';
import { CreateCategoryRequestDTO } from '../../application/dtos/CreateCategoryRequestDTO.js';

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

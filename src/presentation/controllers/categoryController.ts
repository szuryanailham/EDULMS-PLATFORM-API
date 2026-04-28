import { z } from 'zod';
import { CategoryRepository } from '../../application/repositories/CategoryRepository.js';
import { CreateCategoryRequestDTO } from '../../application/dtos/CreateCategoryRequestDTO.js';
import { UpdateCategoryRequestDTO } from '../../application/dtos/UpdateCategoryRequestDTO.js';
import { CategoryResponseDTO } from '../../application/dtos/CategoryResponseDTO.js';
import { CategoryEntity } from '../../application/entities/CategoryEntity.js';
import { DatabaseError, NotFoundError, ValidationError } from '../middlewares/errorHandler.js';

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['income', 'expense']),
  limitAmount: z.number().int().positive().nullable().optional(),
});

const updateCategorySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    type: z.enum(['income', 'expense']).optional(),
    limitAmount: z.number().int().positive().nullable().optional(),
  })
  .refine((d) => d.name !== undefined || d.type !== undefined || d.limitAmount !== undefined, {
    message: 'At least one of name, type, or limitAmount must be provided',
  });

const categoryRepository = new CategoryRepository();

export async function createCategoryController(
  userId: string,
  dto: CreateCategoryRequestDTO,
): Promise<{ category: CategoryResponseDTO } | { error: any }> {
  const parse = createCategorySchema.safeParse(dto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }

  const { name, type, limitAmount } = parse.data;

  const categoryEntity = new CategoryEntity({
    userId,
    name,
    type,
    limitAmount: limitAmount != null ? BigInt(limitAmount) : null,
  });

  let created: CategoryEntity;
  try {
    created = await categoryRepository.create(categoryEntity);
  } catch (err) {
    throw new DatabaseError('Failed to create category', err);
  }

  const categoryDto = new CategoryResponseDTO({
    id: created.id,
    userId: created.userId,
    name: created.name,
    type: created.type,
    limitAmount: created.limitAmount,
    isDeleted: created.isDeleted,
    createdAt: created.createdAt,
  });

  return { category: categoryDto };
}

export async function updateCategoryController(
  userId: string,
  categoryId: string,
  dto: UpdateCategoryRequestDTO,
): Promise<{ category: CategoryResponseDTO } | { error: any }> {
  if (!categoryId || !/^[0-9a-f-]{36}$/i.test(categoryId)) {
    throw new ValidationError('Invalid or missing category_id_eq query parameter');
  }

  const parse = updateCategorySchema.safeParse(dto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }

  const existing = await categoryRepository.findByIdAndUserId(categoryId, userId);
  if (!existing) {
    throw new NotFoundError('Category not found');
  }

  const { name, type, limitAmount } = parse.data;

  const updateData: { name?: string; type?: string; limitAmount?: bigint | null } = {};
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (limitAmount !== undefined) {
    updateData.limitAmount = limitAmount === null ? null : BigInt(limitAmount);
  }

  let updated: CategoryEntity;
  try {
    updated = await categoryRepository.updateById(categoryId, updateData);
  } catch (err) {
    throw new DatabaseError('Failed to update category', err);
  }

  const categoryDto = new CategoryResponseDTO({
    id: updated.id,
    userId: updated.userId,
    name: updated.name,
    type: updated.type,
    limitAmount: updated.limitAmount,
    createdAt: updated.createdAt,
  });

  return { category: categoryDto };
}

export async function softDeleteCategoryController(
  userId: string,
  categoryId: string,
): Promise<void> {
  if (!categoryId || !/^[0-9a-f-]{36}$/i.test(categoryId)) {
    throw new ValidationError('Invalid or missing category_id_eq query parameter');
  }

  const existing = await categoryRepository.findByIdAndUserId(categoryId, userId);
  if (!existing) {
    throw new NotFoundError('Category not found');
  }

  try {
    await categoryRepository.softDeleteByIdAndUserId(categoryId, userId);
  } catch (err) {
    throw new DatabaseError('Failed to soft delete category', err);
  }
}

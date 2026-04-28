import { z } from 'zod';
import { CategoryRepository } from '../../application/repositories/CategoryRepository.js';
import { CreateCategoryRequestDTO } from '../../application/dtos/CreateCategoryRequestDTO.js';
import { CategoryResponseDTO } from '../../application/dtos/CategoryResponseDTO.js';
import { CategoryEntity } from '../../application/entities/CategoryEntity.js';
import { DatabaseError } from '../middlewares/errorHandler.js';

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['income', 'expense']),
  limitAmount: z.number().int().positive().nullable().optional(),
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
    createdAt: created.createdAt,
  });

  return { category: categoryDto };
}

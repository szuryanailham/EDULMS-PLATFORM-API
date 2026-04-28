import prisma from '../../lib/prisma.js';
import { CategoryEntity } from '../entities/CategoryEntity.js';

export class CategoryRepository {
  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const created = await prisma.category.create({
      data: {
        userId: category.userId,
        name: category.name,
        type: category.type,
        limitAmount: category.limitAmount ?? null,
      },
    });
    return new CategoryEntity(created);
  }

  async findByIdAndUserId(id: string, userId: string): Promise<CategoryEntity | null> {
    const found = await prisma.category.findFirst({
      where: { id, userId, isDeleted: false },
    });
    return found ? new CategoryEntity(found) : null;
  }

  async updateById(
    id: string,
    data: { name?: string; type?: string; limitAmount?: bigint | null },
  ): Promise<CategoryEntity> {
    const updated = await prisma.category.update({
      where: { id },
      data,
    });
    return new CategoryEntity(updated);
  }

  async softDeleteByIdAndUserId(id: string, userId: string): Promise<void> {
    const result = await prisma.category.updateMany({
      where: { id, userId, isDeleted: false },
      data: { isDeleted: true },
    });

    if (result.count === 0) {
      throw new Error('Category not found or already deleted');
    }
  }
}

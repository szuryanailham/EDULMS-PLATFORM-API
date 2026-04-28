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
}

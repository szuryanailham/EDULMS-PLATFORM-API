import prisma from '../../lib/prisma.js';
import { TransactionEntity } from '../entities/TransactionEntity.js';

export class TransactionRepository {
  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    const created = await prisma.transaction.create({
      data: {
        userId: transaction.userId,
        categoryId: transaction.categoryId,
        transactionName: transaction.transactionName,
        totalAmount: transaction.totalAmount,
        transactionDate: transaction.transactionDate,
        transactionTime: transaction.transactionTime ?? null,
        type: transaction.type,
        note: transaction.note ?? null,
        attachment: transaction.attachment ?? null,
      },
    });
    return new TransactionEntity(created);
  }

  async findByIdAndUserId(id: string, userId: string): Promise<TransactionEntity | null> {
    const found = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    return found ? new TransactionEntity(found) : null;
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<void> {
    const result = await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new Error('Transaction not found');
    }
  }

  async updateById(
    id: string,
    data: Partial<{
      categoryId: string;
      transactionName: string;
      totalAmount: bigint;
      transactionDate: Date;
      transactionTime: Date | null;
      type: string;
      note: string | null;
      attachment: string | null;
    }>,
  ): Promise<TransactionEntity> {
    const updated = await prisma.transaction.update({
      where: { id },
      data,
    });
    return new TransactionEntity(updated);
  }
}

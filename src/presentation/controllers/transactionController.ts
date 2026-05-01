import { z } from 'zod';
import { TransactionRepository } from '../../application/repositories/TransactionRepository.js';
import { CategoryRepository } from '../../application/repositories/CategoryRepository.js';
import { CreateTransactionRequestDTO } from '../../application/dtos/CreateTransactionRequestDTO.js';
import type { UpdateTransactionRequestDTO } from '../../application/dtos/UpdateTransactionRequestDTO.js';
import { TransactionResponseDTO } from '../../application/dtos/TransactionResponseDTO.js';
import { TransactionEntity } from '../../application/entities/TransactionEntity.js';
import { DatabaseError, NotFoundError, ValidationError } from '../middlewares/errorHandler.js';

const createTransactionSchema = z.object({
  categoryId: z.string().uuid(),
  transactionName: z.string().min(1).max(255),
  totalAmount: z
    .string()
    .regex(/^\d+$/, 'totalAmount must be a non-negative integer string'),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'transactionDate must be YYYY-MM-DD'),
  transactionTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'transactionTime must be HH:mm or HH:mm:ss')
    .nullable()
    .optional(),
  type: z.enum(['income', 'expense']),
  note: z.string().max(2000).nullable().optional(),
  attachment: z.string().max(500).nullable().optional(),
});

const transactionRepository = new TransactionRepository();
const categoryRepository = new CategoryRepository();

export async function createTransactionController(
  userId: string,
  dto: CreateTransactionRequestDTO,
): Promise<{ transaction: TransactionResponseDTO } | { error: any }> {
  const parse = createTransactionSchema.safeParse(dto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }

  const {
    categoryId,
    transactionName,
    totalAmount,
    transactionDate,
    transactionTime,
    type,
    note,
    attachment,
  } = parse.data;

  const category = await categoryRepository.findByIdAndUserId(categoryId, userId);
  if (!category) {
    throw new NotFoundError('Category not found');
  }

  if (type !== category.type) {
    throw new ValidationError(
      `Transaction type '${type}' does not match category type '${category.type}'`,
    );
  }

  const transactionDateValue = new Date(`${transactionDate}T00:00:00.000Z`);
  const transactionTimeValue =
    transactionTime != null
      ? new Date(
          `1970-01-01T${transactionTime.length === 5 ? `${transactionTime}:00` : transactionTime}.000Z`,
        )
      : null;

  const entity = new TransactionEntity({
    userId,
    categoryId,
    transactionName,
    totalAmount: BigInt(totalAmount),
    transactionDate: transactionDateValue,
    transactionTime: transactionTimeValue,
    type,
    note: note ?? null,
    attachment: attachment ?? null,
  });

  let created: TransactionEntity;
  try {
    created = await transactionRepository.create(entity);
  } catch (err) {
    throw new DatabaseError('Failed to create transaction', err);
  }

  const transactionDto = new TransactionResponseDTO({
    id: created.id,
    userId: created.userId,
    categoryId: created.categoryId,
    transactionName: created.transactionName,
    totalAmount: created.totalAmount,
    transactionDate: created.transactionDate,
    transactionTime: created.transactionTime,
    type: created.type,
    note: created.note,
    attachment: created.attachment,
    createdAt: created.createdAt,
  });

  return { transaction: transactionDto };
}

export async function deleteTransactionController(
  userId: string,
  transactionId: string,
): Promise<void> {
  if (!transactionId || !/^[0-9a-f-]{36}$/i.test(transactionId)) {
    throw new ValidationError('Invalid or missing transaction_id_eq query parameter');
  }

  const existing = await transactionRepository.findByIdAndUserId(transactionId, userId);
  if (!existing) {
    throw new NotFoundError('Transaction not found');
  }

  try {
    await transactionRepository.deleteByIdAndUserId(transactionId, userId);
  } catch (err) {
    throw new DatabaseError('Failed to delete transaction', err);
  }
}

const updateTransactionSchema = z
  .object({
    categoryId: z.string().uuid().optional(),
    transactionName: z.string().min(1).max(255).optional(),
    totalAmount: z
      .string()
      .regex(/^\d+$/, 'totalAmount must be a non-negative integer string')
      .optional(),
    transactionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'transactionDate must be YYYY-MM-DD')
      .optional(),
    transactionTime: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'transactionTime must be HH:mm or HH:mm:ss')
      .nullable()
      .optional(),
    type: z.enum(['income', 'expense']).optional(),
    note: z.string().max(2000).nullable().optional(),
    attachment: z.string().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export async function updateTransactionController(
  userId: string,
  transactionId: string,
  dto: UpdateTransactionRequestDTO,
): Promise<{ transaction: TransactionResponseDTO } | { error: any }> {
  if (!transactionId || !/^[0-9a-f-]{36}$/i.test(transactionId)) {
    throw new ValidationError('Invalid or missing transaction_id_eq query parameter');
  }

  const parse = updateTransactionSchema.safeParse(dto);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors };
  }

  const existing = await transactionRepository.findByIdAndUserId(transactionId, userId);
  if (!existing) {
    throw new NotFoundError('Transaction not found');
  }

  const { categoryId, transactionName, totalAmount, transactionDate, transactionTime, type, note, attachment } =
    parse.data;

  if (categoryId !== undefined) {
    const category = await categoryRepository.findByIdAndUserId(categoryId, userId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    const effectiveType = type ?? existing.type;
    if (effectiveType !== category.type) {
      throw new ValidationError(
        `Transaction type '${effectiveType}' does not match category type '${category.type}'`,
      );
    }
  } else if (type !== undefined && type !== existing.type) {
    const category = await categoryRepository.findByIdAndUserId(existing.categoryId, userId);
    if (category && type !== category.type) {
      throw new ValidationError(
        `Transaction type '${type}' does not match category type '${category.type}'`,
      );
    }
  }

  const updateData: Parameters<typeof transactionRepository.updateById>[1] = {};
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (transactionName !== undefined) updateData.transactionName = transactionName;
  if (totalAmount !== undefined) updateData.totalAmount = BigInt(totalAmount);
  if (transactionDate !== undefined)
    updateData.transactionDate = new Date(`${transactionDate}T00:00:00.000Z`);
  if (transactionTime !== undefined)
    updateData.transactionTime =
      transactionTime != null
        ? new Date(
            `1970-01-01T${transactionTime.length === 5 ? `${transactionTime}:00` : transactionTime}.000Z`,
          )
        : null;
  if (type !== undefined) updateData.type = type;
  if (note !== undefined) updateData.note = note;
  if (attachment !== undefined) updateData.attachment = attachment;

  let updated: TransactionEntity;
  try {
    updated = await transactionRepository.updateById(transactionId, updateData);
  } catch (err) {
    throw new DatabaseError('Failed to update transaction', err);
  }

  return {
    transaction: new TransactionResponseDTO({
      id: updated.id,
      userId: updated.userId,
      categoryId: updated.categoryId,
      transactionName: updated.transactionName,
      totalAmount: updated.totalAmount,
      transactionDate: updated.transactionDate,
      transactionTime: updated.transactionTime,
      type: updated.type,
      note: updated.note,
      attachment: updated.attachment,
      createdAt: updated.createdAt,
    }),
  };
}

export async function getTransactionController(
  userId: string,
  transactionId: string,
): Promise<TransactionResponseDTO> {
  if (!transactionId || !/^[0-9a-f-]{36}$/i.test(transactionId)) {
    throw new ValidationError('Invalid or missing transaction_id_eq query parameter');
  }

  const existing = await transactionRepository.findByIdAndUserId(transactionId, userId);
  if (!existing) {
    throw new NotFoundError('Transaction not found');
  }

  return new TransactionResponseDTO({
    id: existing.id,
    userId: existing.userId,
    categoryId: existing.categoryId,
    transactionName: existing.transactionName,
    totalAmount: existing.totalAmount,
    transactionDate: existing.transactionDate,
    transactionTime: existing.transactionTime,
    type: existing.type,
    note: existing.note,
    attachment: existing.attachment,
    createdAt: existing.createdAt,
  });
}

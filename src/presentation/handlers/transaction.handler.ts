import type { Request, Response } from 'express';
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionController,
  updateTransactionController,
} from '../controllers/transactionController.js';
import { CreateTransactionRequestDTO } from '../../application/dtos/CreateTransactionRequestDTO.js';
import type { UpdateTransactionRequestDTO } from '../../application/dtos/UpdateTransactionRequestDTO.js';

export async function createTransactionHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const dto = new CreateTransactionRequestDTO(req.body);
  const result = await createTransactionController(userId, dto);

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
    message: 'Transaction created successfully',
    data: { transaction: result.transaction },
  });
}

export async function deleteTransactionHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const transactionId = String(req.query.transaction_id_eq ?? '');

  await deleteTransactionController(userId, transactionId);

  return res.status(200).json({
    success: true,
    message: 'Transaction deleted successfully',
    data: null,
  });
}

export async function getTransactionHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const transactionId = String(req.query.transaction_id_eq ?? '');

  const transaction = await getTransactionController(userId, transactionId);

  return res.status(200).json({
    success: true,
    message: 'Transaction retrieved successfully',
    data: transaction,
  });
}

export async function updateTransactionHandler(req: Request, res: Response) {
  const userId: string = (req as any).user?.id;
  const transactionId = String(req.query.transaction_id_eq ?? '');
  const dto: UpdateTransactionRequestDTO = req.body;

  const result = await updateTransactionController(userId, transactionId, dto);

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
    message: 'Transaction updated successfully',
    data: result.transaction,
  });
}

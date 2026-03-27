import { AppError } from '../../src/presentation/middlewares/errorHandler.ts';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const err = new AppError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
  });
});
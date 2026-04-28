import { createCategoryController } from '../../src/presentation/controllers/categoryController.js';
import { CategoryRepository } from '../../src/application/repositories/CategoryRepository.js';
import { CategoryEntity } from '../../src/application/entities/CategoryEntity.js';
import { CreateCategoryRequestDTO } from '../../src/application/dtos/CreateCategoryRequestDTO.js';

jest.mock('../../src/application/repositories/CategoryRepository.js');

const MockRepository = CategoryRepository as jest.MockedClass<typeof CategoryRepository>;

const USER_ID = 'user-uuid-123';
const CREATED_AT = new Date('2026-04-27T00:00:00.000Z');

function makeMockCategory(overrides: Partial<CategoryEntity> = {}): CategoryEntity {
  return new CategoryEntity({
    id: 'cat-uuid-123',
    userId: USER_ID,
    name: 'Food',
    type: 'expense',
    limitAmount: BigInt(500000),
    createdAt: CREATED_AT,
    ...overrides,
  });
}

describe('createCategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('happy path', () => {
    it('creates a category with a limit amount', async () => {
      MockRepository.prototype.create.mockResolvedValue(makeMockCategory());

      const dto = new CreateCategoryRequestDTO({ name: 'Food', type: 'expense', limitAmount: 500000 });
      const result = await createCategoryController(USER_ID, dto);

      expect('category' in result).toBe(true);
      if ('category' in result) {
        expect(result.category.name).toBe('Food');
        expect(result.category.type).toBe('expense');
        expect(result.category.limitAmount).toBe('500000');
        expect(result.category.userId).toBe(USER_ID);
      }
      expect(MockRepository.prototype.create).toHaveBeenCalledTimes(1);
    });

    it('creates a category without a limit amount (nullable)', async () => {
      MockRepository.prototype.create.mockResolvedValue(
        makeMockCategory({ limitAmount: null }),
      );

      const dto = new CreateCategoryRequestDTO({ name: 'Salary', type: 'income' });
      const result = await createCategoryController(USER_ID, dto);

      expect('category' in result).toBe(true);
      if ('category' in result) {
        expect(result.category.name).toBe('Salary');
        expect(result.category.type).toBe('income');
        expect(result.category.limitAmount).toBeNull();
      }
    });

    it('creates a category with limitAmount explicitly null', async () => {
      MockRepository.prototype.create.mockResolvedValue(
        makeMockCategory({ name: 'Transport', limitAmount: null }),
      );

      const dto = new CreateCategoryRequestDTO({ name: 'Transport', type: 'expense', limitAmount: null });
      const result = await createCategoryController(USER_ID, dto);

      expect('category' in result).toBe(true);
      if ('category' in result) {
        expect(result.category.limitAmount).toBeNull();
      }
    });
  });

  describe('bad path — validation errors', () => {
    it('returns error when name is missing', async () => {
      const dto = new CreateCategoryRequestDTO({ type: 'expense' });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('name');
      }
      expect(MockRepository.prototype.create).not.toHaveBeenCalled();
    });

    it('returns error when type is invalid', async () => {
      const dto = new CreateCategoryRequestDTO({ name: 'Food', type: 'invalid-type' });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('type');
      }
    });

    it('returns error when name is empty string', async () => {
      const dto = new CreateCategoryRequestDTO({ name: '', type: 'income' });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('name');
      }
    });

    it('returns error when name exceeds 255 characters', async () => {
      const dto = new CreateCategoryRequestDTO({ name: 'a'.repeat(256), type: 'income' });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('name');
      }
    });

    it('returns error when limitAmount is a negative number', async () => {
      const dto = new CreateCategoryRequestDTO({ name: 'Food', type: 'expense', limitAmount: -100 });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('limitAmount');
      }
    });

    it('returns error when limitAmount is zero', async () => {
      const dto = new CreateCategoryRequestDTO({ name: 'Food', type: 'expense', limitAmount: 0 });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('limitAmount');
      }
    });

    it('returns error when type field is missing', async () => {
      const dto = new CreateCategoryRequestDTO({ name: 'Food' });
      const result = await createCategoryController(USER_ID, dto);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toHaveProperty('type');
      }
    });
  });

  describe('repository error', () => {
    it('throws DatabaseError when repository fails', async () => {
      MockRepository.prototype.create.mockRejectedValue(new Error('DB connection lost'));

      const dto = new CreateCategoryRequestDTO({ name: 'Food', type: 'expense' });

      await expect(createCategoryController(USER_ID, dto)).rejects.toThrow('Failed to create category');
    });
  });
});

import { GetCategoryByIdUseCase } from './get-category-by-id.use-case';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetCategoryByIdUseCase', () => {
  let useCase: GetCategoryByIdUseCase;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getPaginated: jest.fn(),
    } as any;

    useCase = new GetCategoryByIdUseCase(categoryRepository);
  });

  describe('execute', () => {
    it('should return a category when found', async () => {
      const mockCategory = Category.reconstitute(
        'category-123',
        'Desserts',
        new Date(),
        new Date(),
        null,
      );

      categoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await useCase.execute('category-123');

      expect(result).toBe(mockCategory);
      expect(categoryRepository.findById).toHaveBeenCalledWith('category-123');
    });

    it('should throw NotFoundException when category not found', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(categoryRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw NotFoundException with correct message', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('category-123')).rejects.toThrow('Category not found');
    });
  });
});

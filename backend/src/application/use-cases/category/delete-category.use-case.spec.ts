import { DeleteCategoryUseCase } from './delete-category.use-case';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<CategoryRepository>;

    useCase = new DeleteCategoryUseCase(categoryRepository);
  });

  it('should delete a category successfully', async () => {
    const categoryId = 'category-123';
    const category = Category.reconstitute(categoryId, 'To Delete', new Date(), new Date(), null);

    categoryRepository.findById.mockResolvedValue(category);
    categoryRepository.delete.mockResolvedValue(undefined);

    await useCase.execute(categoryId);

    expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId);
    expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
  });

  it('should throw NotFoundException when category does not exist', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);

    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should handle repository errors', async () => {
    const categoryId = 'category-123';
    const category = Category.create('Test');

    categoryRepository.findById.mockResolvedValue(category);
    categoryRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(categoryId)).rejects.toThrow('Database error');
  });
});

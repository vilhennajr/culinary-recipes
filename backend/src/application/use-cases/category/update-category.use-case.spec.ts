import { UpdateCategoryUseCase } from './update-category.use-case';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
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

    useCase = new UpdateCategoryUseCase(categoryRepository);
  });

  it('should update a category successfully', async () => {
    const categoryId = 'category-123';
    const oldName = 'Old Name';
    const newName = 'New Name';

    const existingCategory = Category.reconstitute(
      categoryId,
      oldName,
      new Date(),
      new Date(),
      null,
    );

    categoryRepository.findById.mockResolvedValue(existingCategory);
    categoryRepository.findByName.mockResolvedValue(null);
    categoryRepository.update.mockResolvedValue(existingCategory);

    const result = await useCase.execute({ id: categoryId, name: newName });

    expect(result).toBeDefined();
    expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId);
    expect(categoryRepository.findByName).toHaveBeenCalledWith(newName);
    expect(categoryRepository.update).toHaveBeenCalled();
  });

  it('should throw NotFoundException when category does not exist', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'non-existent', name: 'New Name' })).rejects.toThrow(
      NotFoundException,
    );

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when new name already exists', async () => {
    const categoryId = 'category-123';
    const existingCategory = Category.reconstitute(
      categoryId,
      'Original',
      new Date(),
      new Date(),
      null,
    );

    const conflictCategory = Category.reconstitute(
      'category-456',
      'Desserts',
      new Date(),
      new Date(),
      null,
    );

    categoryRepository.findById.mockResolvedValue(existingCategory);
    categoryRepository.findByName.mockResolvedValue(conflictCategory);

    await expect(useCase.execute({ id: categoryId, name: 'Desserts' })).rejects.toThrow(
      ConflictException,
    );

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it('should allow updating to same name (no change)', async () => {
    const categoryId = 'category-123';
    const name = 'Same Name';

    const existingCategory = Category.reconstitute(categoryId, name, new Date(), new Date(), null);

    categoryRepository.findById.mockResolvedValue(existingCategory);
    categoryRepository.findByName.mockResolvedValue(existingCategory);
    categoryRepository.update.mockResolvedValue(existingCategory);

    const result = await useCase.execute({ id: categoryId, name });

    expect(result).toBeDefined();
    expect(categoryRepository.update).toHaveBeenCalled();
  });
});

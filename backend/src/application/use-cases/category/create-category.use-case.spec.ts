import { CreateCategoryUseCase } from './create-category.use-case';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';
import { ConflictException } from '@nestjs/common';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
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

    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should create a category successfully', async () => {
    const name = 'Desserts';
    const createdCategory = Category.create(name);

    categoryRepository.findByName.mockResolvedValue(null);
    categoryRepository.create.mockResolvedValue(createdCategory);

    const result = await useCase.execute({ name });

    expect(result).toBeDefined();
    expect(result.name).toBe(name);
    expect(categoryRepository.findByName).toHaveBeenCalledWith(name);
    expect(categoryRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException when category name already exists', async () => {
    const name = 'Desserts';
    const existingCategory = Category.create(name);

    categoryRepository.findByName.mockResolvedValue(existingCategory);

    await expect(useCase.execute({ name })).rejects.toThrow(ConflictException);
    await expect(useCase.execute({ name })).rejects.toThrow(
      'Category with this name already exists',
    );

    expect(categoryRepository.create).not.toHaveBeenCalled();
  });

  it('should allow creating category with similar but different name', async () => {
    const name = 'Dessert';

    categoryRepository.findByName.mockResolvedValue(null);
    categoryRepository.create.mockResolvedValue(Category.create(name));

    const result = await useCase.execute({ name });

    expect(result).toBeDefined();
    expect(result.name).toBe(name);
  });
});

import { GetAllCategoriesUseCase } from './get-all-categories.use-case';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';

describe('GetAllCategoriesUseCase', () => {
  let useCase: GetAllCategoriesUseCase;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getPaginated: jest.fn(),
    } as any;

    useCase = new GetAllCategoriesUseCase(categoryRepository);
  });

  describe('execute', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        Category.reconstitute('cat-1', 'Desserts', new Date(), new Date(), null),
        Category.reconstitute('cat-2', 'Main Dishes', new Date(), new Date(), null),
        Category.reconstitute('cat-3', 'Salads', new Date(), new Date(), null),
      ];

      categoryRepository.findAll.mockResolvedValue(mockCategories);

      const result = await useCase.execute();

      expect(result).toEqual(mockCategories);
      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no categories exist', async () => {
      categoryRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

import { GetCategoriesPaginatedUseCase } from './get-categories-paginated.use-case';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';

describe('GetCategoriesPaginatedUseCase', () => {
  let useCase: GetCategoriesPaginatedUseCase;
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

    useCase = new GetCategoriesPaginatedUseCase(categoryRepository);
  });

  it('should get categories with pagination', async () => {
    const categories = [
      Category.create('Category 1'),
      Category.create('Category 2'),
      Category.create('Category 3'),
    ];

    const paginatedResult = {
      data: categories,
      total: 3,
      page: 1,
      limit: 10,
    };

    categoryRepository.findAllPaginated.mockResolvedValue(paginatedResult);

    const result = await useCase.execute({}, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it('should apply name filter', async () => {
    const category = Category.create('Desserts');

    categoryRepository.findAllPaginated.mockResolvedValue({
      data: [category],
      total: 1,
      page: 1,
      limit: 10,
    });

    const result = await useCase.execute({ name: 'Desserts' }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Desserts');
    expect(categoryRepository.findAllPaginated).toHaveBeenCalledWith(
      { name: 'Desserts' },
      { page: 1, limit: 10 },
    );
  });

  it('should return empty results when no categories match', async () => {
    categoryRepository.findAllPaginated.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    const result = await useCase.execute({ name: 'NonExistent' }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

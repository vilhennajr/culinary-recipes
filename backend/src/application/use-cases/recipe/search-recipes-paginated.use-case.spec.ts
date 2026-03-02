import { SearchRecipesPaginatedUseCase } from './search-recipes-paginated.use-case';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';

describe('SearchRecipesPaginatedUseCase', () => {
  let useCase: SearchRecipesPaginatedUseCase;
  let recipeRepository: jest.Mocked<RecipeRepository>;

  beforeEach(() => {
    recipeRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      search: jest.fn(),
      searchPaginated: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<RecipeRepository>;

    useCase = new SearchRecipesPaginatedUseCase(recipeRepository);
  });

  it('should search recipes with pagination', async () => {
    const recipes = [
      Recipe.create('user-123', 'Method 1', null, 'Recipe 1'),
      Recipe.create('user-123', 'Method 2', null, 'Recipe 2'),
    ];

    const paginatedResult = {
      data: recipes,
      total: 2,
      page: 1,
      limit: 10,
    };

    recipeRepository.searchPaginated.mockResolvedValue(paginatedResult);

    const result = await useCase.execute({ userId: 'user-123' }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(recipeRepository.searchPaginated).toHaveBeenCalledWith(
      { userId: 'user-123' },
      { page: 1, limit: 10 },
    );
  });

  it('should apply filters correctly', async () => {
    const recipes = [Recipe.create('user-123', 'Method', 'category-456', 'Cake')];

    const paginatedResult = {
      data: recipes,
      total: 1,
      page: 1,
      limit: 10,
    };

    recipeRepository.searchPaginated.mockResolvedValue(paginatedResult);

    const filters = {
      userId: 'user-123',
      categoryId: 'category-456',
      name: 'Cake',
      minPreparationTime: 30,
      maxPreparationTime: 60,
    };

    await useCase.execute(filters, { page: 1, limit: 10 });

    expect(recipeRepository.searchPaginated).toHaveBeenCalledWith(filters, { page: 1, limit: 10 });
  });

  it('should return empty results when no recipes match', async () => {
    recipeRepository.searchPaginated.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    const result = await useCase.execute(
      { userId: 'user-123', name: 'NonExistent' },
      { page: 1, limit: 10 },
    );

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

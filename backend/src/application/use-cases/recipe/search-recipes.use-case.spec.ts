import { SearchRecipesUseCase } from './search-recipes.use-case';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';

describe('SearchRecipesUseCase', () => {
  let useCase: SearchRecipesUseCase;
  let recipeRepository: jest.Mocked<RecipeRepository>;

  beforeEach(() => {
    recipeRepository = {
      findAll: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchPaginated: jest.fn(),
    } as any;

    useCase = new SearchRecipesUseCase(recipeRepository);
  });

  describe('execute', () => {
    it('should return all recipes when no filters provided', async () => {
      const mockRecipes = [
        Recipe.reconstitute(
          'recipe-1',
          'user-1',
          'category-1',
          'Pasta',
          30,
          4,
          'Boil and serve',
          'Pasta, Sauce',
          new Date(),
          new Date(),
          null,
        ),
        Recipe.reconstitute(
          'recipe-2',
          'user-1',
          'category-2',
          'Salad',
          15,
          2,
          'Mix ingredients',
          'Lettuce, Tomato',
          new Date(),
          new Date(),
          null,
        ),
      ];

      recipeRepository.search.mockResolvedValue(mockRecipes);

      const result = await useCase.execute({});

      expect(result).toEqual(mockRecipes);
      expect(recipeRepository.search).toHaveBeenCalledWith({});
    });

    it('should return filtered recipes by categoryId', async () => {
      const mockRecipes = [
        Recipe.reconstitute(
          'recipe-1',
          'user-1',
          'category-123',
          'Pasta',
          30,
          4,
          'Boil and serve',
          'Pasta, Sauce',
          new Date(),
          new Date(),
          null,
        ),
      ];

      recipeRepository.search.mockResolvedValue(mockRecipes);

      const result = await useCase.execute({ categoryId: 'category-123' });

      expect(result).toEqual(mockRecipes);
      expect(recipeRepository.search).toHaveBeenCalledWith({
        categoryId: 'category-123',
      });
    });

    it('should return empty array when no recipes match filters', async () => {
      recipeRepository.search.mockResolvedValue([]);

      const result = await useCase.execute({ categoryId: 'non-existent' });

      expect(result).toEqual([]);
    });
  });
});

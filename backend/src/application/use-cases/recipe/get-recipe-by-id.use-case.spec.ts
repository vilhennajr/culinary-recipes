import { GetRecipeByIdUseCase } from './get-recipe-by-id.use-case';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetRecipeByIdUseCase', () => {
  let useCase: GetRecipeByIdUseCase;
  let recipeRepository: jest.Mocked<RecipeRepository>;

  beforeEach(() => {
    recipeRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchPaginated: jest.fn(),
    } as any;

    useCase = new GetRecipeByIdUseCase(recipeRepository);
  });

  describe('execute', () => {
    it('should return a recipe when found', async () => {
      const mockRecipe = Recipe.reconstitute(
        'recipe-123',
        'user-123',
        'category-123',
        'Chocolate Cake',
        60,
        8,
        'Mix and bake',
        'Flour, Sugar, Chocolate',
        new Date(),
        new Date(),
        null,
      );

      recipeRepository.findById.mockResolvedValue(mockRecipe);

      const result = await useCase.execute({ id: 'recipe-123', userId: 'user-123' });

      expect(result).toBe(mockRecipe);
      expect(recipeRepository.findById).toHaveBeenCalledWith('recipe-123');
    });

    it('should throw NotFoundException when recipe not found', async () => {
      recipeRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute({ id: 'non-existent-id', userId: 'user-123' })).rejects.toThrow(
        NotFoundException,
      );
      expect(recipeRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw NotFoundException with correct message', async () => {
      recipeRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute({ id: 'recipe-123', userId: 'user-123' })).rejects.toThrow(
        'Recipe not found',
      );
    });
  });
});

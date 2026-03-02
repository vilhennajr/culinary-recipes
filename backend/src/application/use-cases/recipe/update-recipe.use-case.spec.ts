import { UpdateRecipeUseCase } from './update-recipe.use-case';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UpdateRecipeUseCase', () => {
  let useCase: UpdateRecipeUseCase;
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

    useCase = new UpdateRecipeUseCase(recipeRepository);
  });

  it('should update a recipe successfully', async () => {
    const userId = 'user-123';
    const recipeId = 'recipe-456';
    const updatedRecipeData = Recipe.reconstitute(
      recipeId,
      userId,
      null,
      'Old Name',
      null,
      null,
      'Old method',
      null,
      new Date(),
      new Date(),
      null,
    );

    recipeRepository.findById.mockResolvedValue(updatedRecipeData);
    recipeRepository.update.mockResolvedValue(updatedRecipeData);

    const command = {
      id: recipeId,
      userId,
      name: 'New Name',
      categoryId: 'category-789',
      preparationTimeMinutes: 45,
      servings: 6,
      preparationMethod: 'New method',
      ingredients: 'New ingredients',
    };

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(recipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(recipeRepository.update).toHaveBeenCalled();
  });

  it('should throw NotFoundException when recipe does not exist', async () => {
    recipeRepository.findById.mockResolvedValue(null);

    const command = {
      id: 'non-existent',
      userId: 'user-123',
      name: 'New Name',
      preparationMethod: 'New method',
    };

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when user does not own the recipe', async () => {
    const recipe = Recipe.reconstitute(
      'recipe-123',
      'other-user',
      null,
      'Recipe Name',
      null,
      null,
      'Method',
      null,
      new Date(),
      new Date(),
      null,
    );

    recipeRepository.findById.mockResolvedValue(recipe);

    const command = {
      id: 'recipe-123',
      userId: 'user-123',
      name: 'New Name',
      preparationMethod: 'New method',
    };

    await expect(useCase.execute(command)).rejects.toThrow(ForbiddenException);
  });
});

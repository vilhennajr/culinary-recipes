import { DeleteRecipeUseCase } from './delete-recipe.use-case';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('DeleteRecipeUseCase', () => {
  let useCase: DeleteRecipeUseCase;
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

    useCase = new DeleteRecipeUseCase(recipeRepository);
  });

  it('should delete a recipe successfully', async () => {
    const userId = 'user-123';
    const recipeId = 'recipe-456';
    const recipe = Recipe.reconstitute(
      recipeId,
      userId,
      null,
      'Recipe to delete',
      null,
      null,
      'Method',
      null,
      new Date(),
      new Date(),
      null,
    );

    recipeRepository.findById.mockResolvedValue(recipe);
    recipeRepository.delete.mockResolvedValue(undefined);

    await useCase.execute({ id: recipeId, userId });

    expect(recipeRepository.findById).toHaveBeenCalledWith(recipeId);
    expect(recipeRepository.delete).toHaveBeenCalledWith(recipeId);
  });

  it('should throw NotFoundException when recipe does not exist', async () => {
    recipeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'non-existent', userId: 'user-123' })).rejects.toThrow(
      NotFoundException,
    );

    expect(recipeRepository.delete).not.toHaveBeenCalled();
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

    await expect(useCase.execute({ id: 'recipe-123', userId: 'user-123' })).rejects.toThrow(
      ForbiddenException,
    );

    expect(recipeRepository.delete).not.toHaveBeenCalled();
  });
});

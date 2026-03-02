import { CreateRecipeUseCase } from './create-recipe.use-case';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';

describe('CreateRecipeUseCase', () => {
  let useCase: CreateRecipeUseCase;
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

    useCase = new CreateRecipeUseCase(recipeRepository);
  });

  it('should create a recipe successfully', async () => {
    const command = {
      userId: 'user-123',
      name: 'Chocolate Cake',
      categoryId: 'category-456',
      preparationTimeMinutes: 60,
      servings: 8,
      preparationMethod: 'Mix ingredients and bake at 180°C',
      ingredients: 'Flour, Sugar, Chocolate, Eggs, Butter',
    };

    const createdRecipe = Recipe.create(
      command.userId,
      command.preparationMethod,
      command.categoryId,
      command.name,
      command.preparationTimeMinutes,
      command.servings,
      command.ingredients,
    );

    recipeRepository.create.mockResolvedValue(createdRecipe);

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(result.userId).toBe(command.userId);
    expect(result.name).toBe(command.name);
    expect(result.preparationMethod).toBe(command.preparationMethod);
    expect(recipeRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should create a recipe with minimal data', async () => {
    const command = {
      userId: 'user-123',
      preparationMethod: 'Just add water',
    };

    const createdRecipe = Recipe.create(command.userId, command.preparationMethod);

    recipeRepository.create.mockResolvedValue(createdRecipe);

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(result.userId).toBe(command.userId);
    expect(result.preparationMethod).toBe(command.preparationMethod);
    expect(result.name).toBeNull();
    expect(result.categoryId).toBeNull();
  });

  it('should propagate repository errors', async () => {
    const command = {
      userId: 'user-123',
      preparationMethod: 'Mix and bake',
    };

    recipeRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(command)).rejects.toThrow('Database error');
  });
});

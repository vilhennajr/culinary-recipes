import { RecipeMapper } from './recipe.mapper';
import { Recipe } from '@domain/entities/recipe.entity';
import { Recipe as PrismaRecipe } from '@prisma/client';

describe('RecipeMapper', () => {
  describe('toDomain', () => {
    it('should map Prisma model to Domain entity', () => {
      const prismaRecipe: PrismaRecipe = {
        id: 'recipe-123',
        userId: 'user-456',
        categoryId: 'category-789',
        name: 'Chocolate Cake',
        preparationTimeMinutes: 60,
        servings: 8,
        preparationMethod: 'Mix and bake',
        ingredients: 'Flour, Sugar, Chocolate',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        deletedAt: null,
      };

      const recipe = RecipeMapper.toDomain(prismaRecipe);

      expect(recipe).toBeInstanceOf(Recipe);
      expect(recipe.id).toBe(prismaRecipe.id);
      expect(recipe.userId).toBe(prismaRecipe.userId);
      expect(recipe.categoryId).toBe(prismaRecipe.categoryId);
      expect(recipe.name).toBe(prismaRecipe.name);
      expect(recipe.preparationTimeMinutes).toBe(prismaRecipe.preparationTimeMinutes);
      expect(recipe.servings).toBe(prismaRecipe.servings);
      expect(recipe.preparationMethod).toBe(prismaRecipe.preparationMethod);
      expect(recipe.ingredients).toBe(prismaRecipe.ingredients);
      expect(recipe.isDeleted).toBe(false);
    });

    it('should handle null values', () => {
      const prismaRecipe: PrismaRecipe = {
        id: 'recipe-123',
        userId: 'user-456',
        categoryId: null,
        name: null,
        preparationTimeMinutes: null,
        servings: null,
        preparationMethod: 'Simple method',
        ingredients: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const recipe = RecipeMapper.toDomain(prismaRecipe);

      expect(recipe.categoryId).toBeNull();
      expect(recipe.name).toBeNull();
      expect(recipe.preparationTimeMinutes).toBeNull();
      expect(recipe.servings).toBeNull();
      expect(recipe.ingredients).toBeNull();
    });

    it('should map deleted recipe', () => {
      const deletedAt = new Date();
      const prismaRecipe: PrismaRecipe = {
        id: 'recipe-123',
        userId: 'user-456',
        categoryId: null,
        name: 'Deleted',
        preparationTimeMinutes: null,
        servings: null,
        preparationMethod: 'Method',
        ingredients: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt,
      };

      const recipe = RecipeMapper.toDomain(prismaRecipe);

      expect(recipe.isDeleted).toBe(true);
      expect(recipe.deletedAt).toBe(deletedAt);
    });
  });

  describe('toDomainList', () => {
    it('should map array of Prisma models to Domain entities', () => {
      const prismaRecipes: PrismaRecipe[] = [
        {
          id: 'recipe-1',
          userId: 'user-1',
          categoryId: null,
          name: 'Recipe 1',
          preparationTimeMinutes: null,
          servings: null,
          preparationMethod: 'Method 1',
          ingredients: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'recipe-2',
          userId: 'user-2',
          categoryId: null,
          name: 'Recipe 2',
          preparationTimeMinutes: null,
          servings: null,
          preparationMethod: 'Method 2',
          ingredients: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const recipes = RecipeMapper.toDomainList(prismaRecipes);

      expect(recipes).toHaveLength(2);
      expect(recipes[0]).toBeInstanceOf(Recipe);
      expect(recipes[1]).toBeInstanceOf(Recipe);
      expect(recipes[0].id).toBe('recipe-1');
      expect(recipes[1].id).toBe('recipe-2');
    });
  });

  describe('toCreateInput', () => {
    it('should map Domain entity to Prisma create input', () => {
      const recipe = Recipe.create(
        'user-123',
        'Mix and bake',
        'category-456',
        'Cake',
        60,
        8,
        'Ingredients',
      );

      const createInput = RecipeMapper.toCreateInput(recipe);

      expect(createInput.name).toBe(recipe.name);
      expect(createInput.preparationTimeMinutes).toBe(recipe.preparationTimeMinutes);
      expect(createInput.servings).toBe(recipe.servings);
      expect(createInput.preparationMethod).toBe(recipe.preparationMethod);
      expect(createInput.ingredients).toBe(recipe.ingredients);
    });
  });

  describe('toUpdateInput', () => {
    it('should map Domain entity to Prisma update input', () => {
      const recipe = Recipe.create('user-123', 'Method');
      recipe.update({
        name: 'Updated Name',
        categoryId: 'category-567',
        preparationTimeMinutes: 45,
      });

      const updateInput = RecipeMapper.toUpdateInput(recipe);

      expect(updateInput.name).toBe('Updated Name');
      expect(updateInput.preparationTimeMinutes).toBe(45);
    });
  });
});

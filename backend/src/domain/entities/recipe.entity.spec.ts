import { Recipe } from '@domain/entities/recipe.entity';
import { InvalidRecipeException } from '@domain/exceptions/domain.exceptions';

describe('Recipe Entity', () => {
  describe('create', () => {
    it('should create a valid recipe', () => {
      const recipe = Recipe.create(
        'user-123',
        'Mix ingredients and bake',
        'category-456',
        'Chocolate Cake',
        60,
        8,
        'Flour, Sugar, Chocolate',
      );

      expect(recipe).toBeDefined();
      expect(recipe.userId).toBe('user-123');
      expect(recipe.preparationMethod).toBe('Mix ingredients and bake');
      expect(recipe.categoryId).toBe('category-456');
      expect(recipe.name).toBe('Chocolate Cake');
      expect(recipe.preparationTimeMinutes).toBe(60);
      expect(recipe.servings).toBe(8);
      expect(recipe.ingredients).toBe('Flour, Sugar, Chocolate');
      expect(recipe.isDeleted).toBe(false);
    });

    it('should throw error when userId is empty', () => {
      expect(() => {
        Recipe.create('', 'Mix ingredients');
      }).toThrow(InvalidRecipeException);
    });

    it('should throw error when preparationMethod is empty', () => {
      expect(() => {
        Recipe.create('user-123', '');
      }).toThrow(InvalidRecipeException);
    });

    it('should throw error when preparationTime is negative', () => {
      expect(() => {
        Recipe.create('user-123', 'Mix ingredients', null, 'Cake', -10);
      }).toThrow(InvalidRecipeException);
    });

    it('should throw error when servings is zero or negative', () => {
      expect(() => {
        Recipe.create('user-123', 'Mix ingredients', null, 'Cake', 30, -1);
      }).toThrow(InvalidRecipeException);
    });

    it('should allow null optional fields', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients');

      expect(recipe.categoryId).toBeNull();
      expect(recipe.name).toBeNull();
      expect(recipe.preparationTimeMinutes).toBeNull();
      expect(recipe.servings).toBeNull();
      expect(recipe.ingredients).toBeNull();
    });
  });

  describe('update', () => {
    it('should update recipe fields', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients', null, 'Old Name');

      recipe.update({
        name: 'New Name',
        categoryId: 'category-789',
        preparationTimeMinutes: 45,
        servings: 10,
        preparationMethod: 'New method',
        ingredients: 'New ingredients',
      });

      expect(recipe.name).toBe('New Name');
      expect(recipe.categoryId).toBe('category-789');
      expect(recipe.preparationTimeMinutes).toBe(45);
      expect(recipe.servings).toBe(10);
      expect(recipe.preparationMethod).toBe('New method');
      expect(recipe.ingredients).toBe('New ingredients');
    });

    it('should throw error when updating preparationMethod to empty', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients');

      expect(() => {
        recipe.update({ preparationMethod: '' });
      }).toThrow(InvalidRecipeException);
    });

    it('should throw error when updating preparationTime to negative', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients');

      expect(() => {
        recipe.update({ preparationTimeMinutes: -5 });
      }).toThrow(InvalidRecipeException);
    });

    it('should throw error when updating servings to zero or negative', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients');

      expect(() => {
        recipe.update({ servings: 0 });
      }).toThrow(InvalidRecipeException);
    });
  });

  describe('softDelete', () => {
    it('should mark recipe as deleted', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients');

      expect(recipe.isDeleted).toBe(false);

      recipe.softDelete();

      expect(recipe.isDeleted).toBe(true);
      expect(recipe.deletedAt).toBeDefined();
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted recipe', () => {
      const recipe = Recipe.create('user-123', 'Mix ingredients');

      recipe.softDelete();
      expect(recipe.isDeleted).toBe(true);

      recipe.restore();
      expect(recipe.isDeleted).toBe(false);
      expect(recipe.deletedAt).toBeNull();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a recipe from persistence', () => {
      const now = new Date();
      const recipe = Recipe.reconstitute(
        'recipe-123',
        'user-456',
        'category-789',
        'Test Recipe',
        30,
        4,
        'Mix and cook',
        'Ingredient list',
        now,
        now,
        null,
      );

      expect(recipe.id).toBe('recipe-123');
      expect(recipe.userId).toBe('user-456');
      expect(recipe.categoryId).toBe('category-789');
      expect(recipe.name).toBe('Test Recipe');
      expect(recipe.preparationTimeMinutes).toBe(30);
      expect(recipe.servings).toBe(4);
      expect(recipe.preparationMethod).toBe('Mix and cook');
      expect(recipe.ingredients).toBe('Ingredient list');
      expect(recipe.isDeleted).toBe(false);
    });
  });
});

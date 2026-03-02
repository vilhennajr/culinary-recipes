import { PrismaRecipeRepository } from './prisma-recipe.repository';
import { PrismaService } from '../database/prisma.service';
import { Recipe } from '@domain/entities/recipe.entity';

describe('PrismaRecipeRepository', () => {
  let repository: PrismaRecipeRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaRecipe = {
    id: 'recipe-123',
    userId: 'user-123',
    categoryId: 'category-123',
    name: 'Chocolate Cake',
    preparationTimeMinutes: 60,
    servings: 8,
    preparationMethod: 'Mix and bake',
    ingredients: 'Flour, Sugar, Chocolate',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  };

  beforeEach(() => {
    prismaService = {
      recipe: {
        create: jest.fn() as jest.Mock,
        findFirst: jest.fn() as jest.Mock,
        findFirstOrThrow: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
        count: jest.fn() as jest.Mock,
        update: jest.fn() as jest.Mock,
        delete: jest.fn() as jest.Mock,
      },
    } as any;

    repository = new PrismaRecipeRepository(prismaService);
  });

  describe('create', () => {
    it('should create a recipe', async () => {
      (prismaService.recipe.create as jest.Mock).mockResolvedValue(mockPrismaRecipe);

      const recipe = Recipe.create(
        'user-123',
        'Mix and bake',
        'category-123',
        'Chocolate Cake',
        60,
        8,
        'Flour, Sugar, Chocolate',
      );
      const result = await repository.create(recipe);

      expect(result).toBeInstanceOf(Recipe);
      expect(result.name).toBe('Chocolate Cake');
    });
  });

  describe('findById', () => {
    it('should return recipe when found', async () => {
      (prismaService.recipe.findFirst as jest.Mock).mockResolvedValue(mockPrismaRecipe);

      const result = await repository.findById('recipe-123');

      expect(result).toBeInstanceOf(Recipe);
      expect(result!.id).toBe('recipe-123');
    });

    it('should return null when not found', async () => {
      (prismaService.recipe.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return recipes for a user', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([mockPrismaRecipe]);

      const result = await repository.findByUserId('user-123');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Recipe);
    });

    it('should return empty array when user has no recipes', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByUserId('user-with-no-recipes');

      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('should return all non-deleted recipes for user', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([mockPrismaRecipe]);

      const result = await repository.search({ userId: 'user-123' });

      expect(result).toHaveLength(1);
    });

    it('should support filtering by name', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([mockPrismaRecipe]);

      const result = await repository.search({ name: 'Chocolate' });

      expect(result).toHaveLength(1);
    });

    it('should support filtering by categoryId', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([mockPrismaRecipe]);

      const result = await repository.search({ categoryId: 'category-123' });

      expect(result).toHaveLength(1);
    });
  });

  describe('searchPaginated', () => {
    it('should return paginated recipes', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([mockPrismaRecipe]);
      (prismaService.recipe.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.searchPaginated(
        { userId: 'user-123' },
        { page: 1, limit: 10 },
      );

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply all range filters', async () => {
      (prismaService.recipe.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.recipe.count as jest.Mock).mockResolvedValue(0);

      await repository.searchPaginated(
        {
          minPreparationTime: 30,
          maxPreparationTime: 90,
          minServings: 2,
          maxServings: 10,
          preparationMethod: 'bake',
          ingredients: 'flour',
          id: 'recipe-123',
        },
        { page: 2, limit: 5, sortBy: 'name', sortOrder: 'desc' },
      );

      expect(prismaService.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      const updatedPrismaRecipe = { ...mockPrismaRecipe, name: 'Updated Cake' };
      (prismaService.recipe.update as jest.Mock).mockResolvedValue(updatedPrismaRecipe);

      const recipe = Recipe.reconstitute(
        'recipe-123',
        'user-123',
        'category-123',
        'Updated Cake',
        60,
        8,
        'Mix and bake',
        'Flour',
        new Date(),
        new Date(),
        null,
      );

      const result = await repository.update(recipe);

      expect(result).toBeInstanceOf(Recipe);
      expect(result.name).toBe('Updated Cake');
    });
  });

  describe('delete', () => {
    it('should soft delete a recipe', async () => {
      (prismaService.recipe.findFirstOrThrow as jest.Mock).mockResolvedValue(mockPrismaRecipe);
      (prismaService.recipe.update as jest.Mock).mockResolvedValue({
        ...mockPrismaRecipe,
        deletedAt: new Date(),
      });

      await repository.delete('recipe-123');

      expect(prismaService.recipe.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 'recipe-123' },
      });
      expect(prismaService.recipe.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'recipe-123' },
          data: expect.objectContaining({
            deletedAt: expect.any(Date),
          }),
        }),
      );
    });
  });
});

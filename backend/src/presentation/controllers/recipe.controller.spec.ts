import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { CreateRecipeUseCase } from '@application/use-cases/recipe/create-recipe.use-case';
import { SearchRecipesUseCase } from '@application/use-cases/recipe/search-recipes.use-case';
import { SearchRecipesPaginatedUseCase } from '@application/use-cases/recipe/search-recipes-paginated.use-case';
import { GetRecipeByIdUseCase } from '@application/use-cases/recipe/get-recipe-by-id.use-case';
import { UpdateRecipeUseCase } from '@application/use-cases/recipe/update-recipe.use-case';
import { DeleteRecipeUseCase } from '@application/use-cases/recipe/delete-recipe.use-case';
import { Recipe } from '@domain/entities/recipe.entity';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';

describe('RecipeController', () => {
  let controller: RecipeController;
  let createRecipeUseCase: jest.Mocked<CreateRecipeUseCase>;
  let _searchRecipesUseCase: jest.Mocked<SearchRecipesUseCase>;
  let searchRecipesPaginatedUseCase: jest.Mocked<SearchRecipesPaginatedUseCase>;
  let getRecipeByIdUseCase: jest.Mocked<GetRecipeByIdUseCase>;
  let updateRecipeUseCase: jest.Mocked<UpdateRecipeUseCase>;
  let deleteRecipeUseCase: jest.Mocked<DeleteRecipeUseCase>;

  const mockRequest = {
    user: { userId: 'user-123', login: 'test@example.com' },
  };

  const mockRecipe = Recipe.reconstitute(
    'recipe-123',
    'user-123',
    'category-123',
    'Chocolate Cake',
    60,
    8,
    'Mix and bake',
    'Flour, Sugar, Chocolate',
    new Date('2024-01-01'),
    new Date('2024-01-02'),
    null,
  );

  beforeEach(async () => {
    const mockCreateRecipeUseCase = { execute: jest.fn() };
    const mockSearchRecipesUseCase = { execute: jest.fn() };
    const mockSearchRecipesPaginatedUseCase = { execute: jest.fn() };
    const mockGetRecipeByIdUseCase = { execute: jest.fn() };
    const mockUpdateRecipeUseCase = { execute: jest.fn() };
    const mockDeleteRecipeUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        { provide: CreateRecipeUseCase, useValue: mockCreateRecipeUseCase },
        { provide: SearchRecipesUseCase, useValue: mockSearchRecipesUseCase },
        { provide: SearchRecipesPaginatedUseCase, useValue: mockSearchRecipesPaginatedUseCase },
        { provide: GetRecipeByIdUseCase, useValue: mockGetRecipeByIdUseCase },
        { provide: UpdateRecipeUseCase, useValue: mockUpdateRecipeUseCase },
        { provide: DeleteRecipeUseCase, useValue: mockDeleteRecipeUseCase },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RecipeController>(RecipeController);
    createRecipeUseCase = module.get(CreateRecipeUseCase);
    _searchRecipesUseCase = module.get(SearchRecipesUseCase);
    searchRecipesPaginatedUseCase = module.get(SearchRecipesPaginatedUseCase);
    getRecipeByIdUseCase = module.get(GetRecipeByIdUseCase);
    updateRecipeUseCase = module.get(UpdateRecipeUseCase);
    deleteRecipeUseCase = module.get(DeleteRecipeUseCase);
  });

  describe('create', () => {
    it('should create a recipe and return response', async () => {
      createRecipeUseCase.execute.mockResolvedValue(mockRecipe);

      const dto = {
        categoryId: 'category-123',
        name: 'Chocolate Cake',
        preparationTimeMinutes: 60,
        servings: 8,
        preparationMethod: 'Mix and bake',
        ingredients: 'Flour, Sugar, Chocolate',
      };

      const result = await controller.create(mockRequest as any, dto);

      expect(result).toMatchObject({
        id: 'recipe-123',
        name: 'Chocolate Cake',
        userId: 'user-123',
      });
      expect(createRecipeUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-123',
        ...dto,
      });
    });
  });

  describe('search', () => {
    it('should return paginated recipes for user', async () => {
      const mockPaginatedResult = {
        data: [mockRecipe],
        total: 1,
        page: 1,
        limit: 10,
      };

      searchRecipesPaginatedUseCase.execute.mockResolvedValue(mockPaginatedResult);

      const result = await controller.search(mockRequest as any, {} as any);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('should return a recipe by id', async () => {
      getRecipeByIdUseCase.execute.mockResolvedValue(mockRecipe);

      const result = await controller.getById(mockRequest as any, 'recipe-123');

      expect(result.id).toBe('recipe-123');
      expect(result.name).toBe('Chocolate Cake');
      expect(getRecipeByIdUseCase.execute).toHaveBeenCalledWith({
        id: 'recipe-123',
        userId: 'user-123',
      });
    });
  });

  describe('update', () => {
    it('should update a recipe and return response', async () => {
      const updatedRecipe = Recipe.reconstitute(
        'recipe-123',
        'user-123',
        'category-123',
        'Updated Cake',
        70,
        8,
        'Mix, bake and cool',
        'Flour, Sugar, Chocolate, Cream',
        new Date(),
        new Date(),
        null,
      );

      updateRecipeUseCase.execute.mockResolvedValue(updatedRecipe);

      const dto = { name: 'Updated Cake' };
      const result = await controller.update(mockRequest as any, 'recipe-123', dto);

      expect(result.name).toBe('Updated Cake');
      expect(updateRecipeUseCase.execute).toHaveBeenCalledWith({
        id: 'recipe-123',
        userId: 'user-123',
        ...dto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a recipe', async () => {
      deleteRecipeUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockRequest as any, 'recipe-123');

      expect(deleteRecipeUseCase.execute).toHaveBeenCalledWith({
        id: 'recipe-123',
        userId: 'user-123',
      });
    });
  });
});

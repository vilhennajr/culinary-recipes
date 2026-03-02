import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { GetCategoriesPaginatedUseCase } from '@application/use-cases/category/get-categories-paginated.use-case';
import { CreateCategoryUseCase } from '@application/use-cases/category/create-category.use-case';
import { GetCategoryByIdUseCase } from '@application/use-cases/category/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from '@application/use-cases/category/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/use-cases/category/delete-category.use-case';
import { Category } from '@domain/entities/category.entity';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';

describe('CategoryController', () => {
  let controller: CategoryController;
  let getCategoriesPaginatedUseCase: jest.Mocked<GetCategoriesPaginatedUseCase>;
  let createCategoryUseCase: jest.Mocked<CreateCategoryUseCase>;
  let getCategoryByIdUseCase: jest.Mocked<GetCategoryByIdUseCase>;
  let updateCategoryUseCase: jest.Mocked<UpdateCategoryUseCase>;
  let deleteCategoryUseCase: jest.Mocked<DeleteCategoryUseCase>;

  const mockCategory = Category.reconstitute(
    'category-123',
    'Italian',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
    null,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: GetCategoriesPaginatedUseCase, useValue: { execute: jest.fn() } },
        { provide: CreateCategoryUseCase, useValue: { execute: jest.fn() } },
        { provide: GetCategoryByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateCategoryUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteCategoryUseCase, useValue: { execute: jest.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
    getCategoriesPaginatedUseCase = module.get(GetCategoriesPaginatedUseCase);
    createCategoryUseCase = module.get(CreateCategoryUseCase);
    getCategoryByIdUseCase = module.get(GetCategoryByIdUseCase);
    updateCategoryUseCase = module.get(UpdateCategoryUseCase);
    deleteCategoryUseCase = module.get(DeleteCategoryUseCase);
  });

  describe('create', () => {
    it('should create a category and return response', async () => {
      createCategoryUseCase.execute.mockResolvedValue(mockCategory);

      const dto = { name: 'Italian' };
      const result = await controller.create(dto);

      expect(result).toMatchObject({
        id: 'category-123',
        name: 'Italian',
      });
      expect(createCategoryUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAll', () => {
    it('should return paginated categories', async () => {
      const paginatedResult = {
        data: [mockCategory],
        total: 1,
        page: 1,
        limit: 10,
      };

      getCategoriesPaginatedUseCase.execute.mockResolvedValue(paginatedResult);

      const result = await controller.getAll({} as any);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('should return a category by id', async () => {
      getCategoryByIdUseCase.execute.mockResolvedValue(mockCategory);

      const result = await controller.getById('category-123');

      expect(result.id).toBe('category-123');
      expect(result.name).toBe('Italian');
      expect(getCategoryByIdUseCase.execute).toHaveBeenCalledWith('category-123');
    });
  });

  describe('update', () => {
    it('should update a category and return response', async () => {
      const updatedCategory = Category.reconstitute(
        'category-123',
        'Mediterranean',
        new Date(),
        new Date(),
        null,
      );

      updateCategoryUseCase.execute.mockResolvedValue(updatedCategory);

      const dto = { name: 'Mediterranean' };
      const result = await controller.update('category-123', dto);

      expect(result.name).toBe('Mediterranean');
      expect(updateCategoryUseCase.execute).toHaveBeenCalledWith({
        id: 'category-123',
        ...dto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      deleteCategoryUseCase.execute.mockResolvedValue(undefined);

      await controller.delete('category-123');

      expect(deleteCategoryUseCase.execute).toHaveBeenCalledWith('category-123');
    });
  });
});

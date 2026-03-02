import { PrismaCategoryRepository } from './prisma-category.repository';
import { PrismaService } from '../database/prisma.service';
import { Category } from '@domain/entities/category.entity';

describe('PrismaCategoryRepository', () => {
  let repository: PrismaCategoryRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaCategory = {
    id: 'category-123',
    name: 'Italian',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  };

  beforeEach(() => {
    prismaService = {
      category: {
        create: jest.fn() as jest.Mock,
        findFirst: jest.fn() as jest.Mock,
        findFirstOrThrow: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
        count: jest.fn() as jest.Mock,
        update: jest.fn() as jest.Mock,
        delete: jest.fn() as jest.Mock,
      },
    } as any;

    repository = new PrismaCategoryRepository(prismaService);
  });

  describe('create', () => {
    it('should create a category', async () => {
      (prismaService.category.create as jest.Mock).mockResolvedValue(mockPrismaCategory);

      const category = Category.create('Italian');
      const result = await repository.create(category);

      expect(result).toBeInstanceOf(Category);
      expect(result.name).toBe('Italian');
      expect(prismaService.category.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted categories', async () => {
      (prismaService.category.findMany as jest.Mock).mockResolvedValue([mockPrismaCategory]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Category);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
      });
    });

    it('should return empty array when no categories', async () => {
      (prismaService.category.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return category when found', async () => {
      (prismaService.category.findFirst as jest.Mock).mockResolvedValue(mockPrismaCategory);

      const result = await repository.findById('category-123');

      expect(result).toBeInstanceOf(Category);
      expect(result!.id).toBe('category-123');
    });

    it('should return null when not found', async () => {
      (prismaService.category.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return category when found by name', async () => {
      (prismaService.category.findFirst as jest.Mock).mockResolvedValue(mockPrismaCategory);

      const result = await repository.findByName('Italian');

      expect(result).toBeInstanceOf(Category);
      expect(result!.name).toBe('Italian');
    });

    it('should return null when not found by name', async () => {
      (prismaService.category.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByName('NonExistent');

      expect(result).toBeNull();
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated categories', async () => {
      (prismaService.category.findMany as jest.Mock).mockResolvedValue([mockPrismaCategory]);
      (prismaService.category.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.findAllPaginated({}, { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply filters when provided', async () => {
      (prismaService.category.findMany as jest.Mock).mockResolvedValue([mockPrismaCategory]);
      (prismaService.category.count as jest.Mock).mockResolvedValue(1);

      await repository.findAllPaginated(
        { name: 'Italian', id: 'category-123' },
        { page: 2, limit: 5, sortBy: 'name', sortOrder: 'desc' },
      );

      expect(prismaService.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updatedPrismaCategory = { ...mockPrismaCategory, name: 'Mediterranean' };
      (prismaService.category.update as jest.Mock).mockResolvedValue(updatedPrismaCategory);

      const category = Category.reconstitute(
        'category-123',
        'Mediterranean',
        new Date(),
        new Date(),
        null,
      );

      const result = await repository.update(category);

      expect(result).toBeInstanceOf(Category);
      expect(result.name).toBe('Mediterranean');
    });
  });

  describe('delete', () => {
    it('should soft delete a category', async () => {
      (prismaService.category.findFirstOrThrow as jest.Mock).mockResolvedValue(mockPrismaCategory);
      (prismaService.category.update as jest.Mock).mockResolvedValue({
        ...mockPrismaCategory,
        deletedAt: new Date(),
      });

      await repository.delete('category-123');

      expect(prismaService.category.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 'category-123' },
      });
      expect(prismaService.category.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'category-123' },
          data: expect.objectContaining({
            deletedAt: expect.any(Date),
          }),
        }),
      );
    });
  });
});

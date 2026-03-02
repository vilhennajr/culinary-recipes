import { CategoryMapper } from './category.mapper';
import { Category } from '@domain/entities/category.entity';

describe('CategoryMapper', () => {
  const mockPrismaCategory = {
    id: 'category-123',
    name: 'Desserts',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    deletedAt: null,
  };

  describe('toDomain', () => {
    it('should map Prisma category to domain entity', () => {
      const result = CategoryMapper.toDomain(mockPrismaCategory);

      expect(result).toBeInstanceOf(Category);
      expect(result.id).toBe('category-123');
      expect(result.name).toBe('Desserts');
      expect(result.createdAt).toEqual(new Date('2024-01-01'));
      expect(result.updatedAt).toEqual(new Date('2024-01-02'));
      expect(result.deletedAt).toBeNull();
    });

    it('should handle null deletedAt', () => {
      const result = CategoryMapper.toDomain(mockPrismaCategory);
      expect(result.deletedAt).toBeNull();
    });

    it('should handle non-null deletedAt', () => {
      const deletedCategory = {
        ...mockPrismaCategory,
        deletedAt: new Date('2024-01-03'),
      };

      const result = CategoryMapper.toDomain(deletedCategory);
      expect(result.deletedAt).toEqual(new Date('2024-01-03'));
    });
  });

  describe('toDomainList', () => {
    it('should map array of Prisma categories to domain entities', () => {
      const prismaCategories = [
        mockPrismaCategory,
        { ...mockPrismaCategory, id: 'category-456', name: 'Main Dishes' },
      ];

      const result = CategoryMapper.toDomainList(prismaCategories);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Category);
      expect(result[0].name).toBe('Desserts');
      expect(result[1].name).toBe('Main Dishes');
    });

    it('should return empty array for empty input', () => {
      const result = CategoryMapper.toDomainList([]);
      expect(result).toEqual([]);
    });
  });

  describe('toCreateInput', () => {
    it('should map domain entity to Prisma create input', () => {
      const category = Category.create('Desserts');

      const result = CategoryMapper.toCreateInput(category);

      expect(result).toEqual({
        name: 'Desserts',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
    });
  });

  describe('toUpdateInput', () => {
    it('should map domain entity to Prisma update input', () => {
      const category = Category.reconstitute(
        'category-123',
        'Updated Name',
        new Date(),
        new Date(),
        null,
      );

      const result = CategoryMapper.toUpdateInput(category);

      expect(result).toEqual({
        name: 'Updated Name',
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
    });

    it('should include deletedAt when soft deleted', () => {
      const category = Category.reconstitute(
        'category-123',
        'Deleted Category',
        new Date(),
        new Date(),
        null,
      );
      category.softDelete();

      const result = CategoryMapper.toUpdateInput(category);

      expect(result.deletedAt).toBeInstanceOf(Date);
    });
  });
});

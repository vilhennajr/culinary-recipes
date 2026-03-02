import { Category } from '@domain/entities/category.entity';
import { InvalidCategoryException } from '@domain/exceptions/domain.exceptions';

describe('Category Entity', () => {
  describe('create', () => {
    it('should create a valid category', () => {
      const category = Category.create('Desserts');

      expect(category).toBeDefined();
      expect(category.name).toBe('Desserts');
      expect(category.isDeleted).toBe(false);
      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        Category.create('');
      }).toThrow(InvalidCategoryException);
    });

    it('should throw error when name is whitespace', () => {
      expect(() => {
        Category.create('   ');
      }).toThrow(InvalidCategoryException);
    });

    it('should throw error when name exceeds 100 characters', () => {
      const longName = 'A'.repeat(101);
      expect(() => {
        Category.create(longName);
      }).toThrow(InvalidCategoryException);
    });

    it('should accept name with exactly 100 characters', () => {
      const maxName = 'A'.repeat(100);
      const category = Category.create(maxName);

      expect(category.name).toBe(maxName);
    });
  });

  describe('updateName', () => {
    it('should update category name', () => {
      jest.useFakeTimers();
      const category = Category.create('Old Name');
      const oldUpdatedAt = category.updatedAt;

      jest.advanceTimersByTime(10);
      category.updateName('New Name');

      expect(category.name).toBe('New Name');
      expect(category.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
      jest.useRealTimers();
    });

    it('should throw error when updating to empty name', () => {
      const category = Category.create('Original');

      expect(() => {
        category.updateName('');
      }).toThrow(InvalidCategoryException);
    });

    it('should throw error when updating to name longer than 100 characters', () => {
      const category = Category.create('Original');
      const longName = 'B'.repeat(101);

      expect(() => {
        category.updateName(longName);
      }).toThrow(InvalidCategoryException);
    });
  });

  describe('softDelete', () => {
    it('should mark category as deleted', () => {
      const category = Category.create('Test Category');

      expect(category.isDeleted).toBe(false);

      category.softDelete();

      expect(category.isDeleted).toBe(true);
      expect(category.deletedAt).toBeDefined();
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted category', () => {
      const category = Category.create('Test Category');

      category.softDelete();
      expect(category.isDeleted).toBe(true);

      category.restore();
      expect(category.isDeleted).toBe(false);
      expect(category.deletedAt).toBeNull();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a category from persistence', () => {
      const now = new Date();
      const category = Category.reconstitute('category-123', 'Beverages', now, now, null);

      expect(category.id).toBe('category-123');
      expect(category.name).toBe('Beverages');
      expect(category.createdAt).toBe(now);
      expect(category.updatedAt).toBe(now);
      expect(category.isDeleted).toBe(false);
    });

    it('should reconstitute a deleted category', () => {
      const now = new Date();
      const deletedAt = new Date();
      const category = Category.reconstitute('category-456', 'Archived', now, now, deletedAt);

      expect(category.isDeleted).toBe(true);
      expect(category.deletedAt).toBe(deletedAt);
    });
  });
});

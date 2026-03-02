import { Category } from '@domain/entities/category.entity';
import { Category as PrismaCategory } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class CategoryMapper {
  static toDomain(prismaCategory: PrismaCategory): Category {
    return Category.reconstitute(
      prismaCategory.id,
      prismaCategory.name,
      prismaCategory.createdAt,
      prismaCategory.updatedAt,
      prismaCategory.deletedAt,
    );
  }

  static toCreateInput(category: Category): Prisma.CategoryCreateInput {
    return {
      id: category.id || undefined,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    };
  }

  static toUpdateInput(category: Category): Prisma.CategoryUpdateInput {
    return {
      name: category.name,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    };
  }

  static toDomainList(prismaCategories: PrismaCategory[]): Category[] {
    return prismaCategories.map((category) => this.toDomain(category));
  }
}

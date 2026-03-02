import { Injectable } from '@nestjs/common';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository, CategorySearchParams } from '@domain/repositories/category.repository';
import { PaginationParams, PaginatedResult } from '@domain/types/pagination';
import { PrismaService } from '../database/prisma.service';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: CategoryMapper.toCreateInput(category),
    });

    return CategoryMapper.toDomain(created);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return CategoryMapper.toDomainList(categories);
  }

  async findAllPaginated(
    filters: CategorySearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Category>> {
    const where: Record<string, unknown> = { deletedAt: null };

    if (filters.id) {
      where.id = filters.id;
    }

    if (filters.name) {
      where.name = {
        contains: filters.name,
      };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const orderBy: Record<string, string> = {};
    if (pagination.sortBy) {
      orderBy[pagination.sortBy] = pagination.sortOrder || 'asc';
    } else {
      orderBy.name = 'asc';
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.category.count({ where }),
    ]);

    const data = CategoryMapper.toDomainList(categories);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) return null;

    return CategoryMapper.toDomain(category);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { name, deletedAt: null },
    });

    if (!category) return null;

    return CategoryMapper.toDomain(category);
  }

  async update(category: Category): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id: category.id! },
      data: CategoryMapper.toUpdateInput(category),
    });

    return CategoryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const category = await this.prisma.category.findFirstOrThrow({ where: { id } });
    const entity = CategoryMapper.toDomain(category);
    entity.softDelete();
    await this.update(entity);
  }
}

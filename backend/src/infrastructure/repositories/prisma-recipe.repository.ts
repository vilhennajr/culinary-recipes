import { Injectable } from '@nestjs/common';
import { Recipe } from '@domain/entities/recipe.entity';
import { RecipeRepository, RecipeSearchParams } from '@domain/repositories/recipe.repository';
import { PaginationParams, PaginatedResult } from '@domain/types/pagination';
import { PrismaService } from '../database/prisma.service';
import { RecipeMapper } from '../mappers/recipe.mapper';

@Injectable()
export class PrismaRecipeRepository implements RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(recipe: Recipe): Promise<Recipe> {
    const created = await this.prisma.recipe.create({
      data: RecipeMapper.toCreateInput(recipe),
    });

    return RecipeMapper.toDomain(created);
  }

  async findById(id: string): Promise<Recipe | null> {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id, deletedAt: null },
    });

    if (!recipe) return null;

    return RecipeMapper.toDomain(recipe);
  }

  async findByUserId(userId: string): Promise<Recipe[]> {
    const recipes = await this.prisma.recipe.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return RecipeMapper.toDomainList(recipes);
  }

  async search(params: RecipeSearchParams): Promise<Recipe[]> {
    const where = this.buildWhereClause(params);

    const recipes = await this.prisma.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return RecipeMapper.toDomainList(recipes);
  }

  /**
   * Builds a reusable Prisma `where` object from the domain search params.
   * Used by both `search` and `searchPaginated` to keep filtering logic DRY.
   */
  private buildWhereClause(params: RecipeSearchParams): Record<string, unknown> {
    const where: Record<string, unknown> = { deletedAt: null };

    if (params.id) where.id = params.id;
    if (params.userId) where.userId = params.userId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.name) where.name = { contains: params.name };
    if (params.preparationMethod) where.preparationMethod = { contains: params.preparationMethod };
    if (params.ingredients) where.ingredients = { contains: params.ingredients };

    if (params.minPreparationTime !== undefined || params.maxPreparationTime !== undefined) {
      const range: Record<string, number> = {};
      if (params.minPreparationTime !== undefined) range.gte = params.minPreparationTime;
      if (params.maxPreparationTime !== undefined) range.lte = params.maxPreparationTime;
      where.preparationTimeMinutes = range;
    }

    if (params.minServings !== undefined || params.maxServings !== undefined) {
      const range: Record<string, number> = {};
      if (params.minServings !== undefined) range.gte = params.minServings;
      if (params.maxServings !== undefined) range.lte = params.maxServings;
      where.servings = range;
    }

    return where;
  }

  async searchPaginated(
    params: RecipeSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Recipe>> {
    const where = this.buildWhereClause(params);

    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const orderBy: Record<string, string> = {};
    if (pagination.sortBy) {
      orderBy[pagination.sortBy] = pagination.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.recipe.count({ where }),
    ]);

    const data = RecipeMapper.toDomainList(recipes);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async update(recipe: Recipe): Promise<Recipe> {
    const updated = await this.prisma.recipe.update({
      where: { id: recipe.id! },
      data: RecipeMapper.toUpdateInput(recipe),
    });

    return RecipeMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({ where: { id } });
    const entity = RecipeMapper.toDomain(recipe);
    entity.softDelete();
    await this.update(entity);
  }
}

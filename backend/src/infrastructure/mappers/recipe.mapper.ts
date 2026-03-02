import { Recipe } from '@domain/entities/recipe.entity';
import { Recipe as PrismaRecipe } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class RecipeMapper {
  static toDomain(prismaRecipe: PrismaRecipe): Recipe {
    return Recipe.reconstitute(
      prismaRecipe.id,
      prismaRecipe.userId,
      prismaRecipe.categoryId,
      prismaRecipe.name,
      prismaRecipe.preparationTimeMinutes,
      prismaRecipe.servings,
      prismaRecipe.preparationMethod,
      prismaRecipe.ingredients,
      prismaRecipe.createdAt,
      prismaRecipe.updatedAt,
      prismaRecipe.deletedAt,
    );
  }

  static toCreateInput(recipe: Recipe): Prisma.RecipeCreateInput {
    return {
      id: recipe.id ?? undefined,
      user: {
        connect: { id: recipe.userId },
      },
      category: recipe.categoryId
        ? {
            connect: { id: recipe.categoryId },
          }
        : undefined,
      name: recipe.name,
      preparationTimeMinutes: recipe.preparationTimeMinutes,
      servings: recipe.servings,
      preparationMethod: recipe.preparationMethod,
      ingredients: recipe.ingredients,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      deletedAt: recipe.deletedAt,
    };
  }

  static toUpdateInput(recipe: Recipe): Prisma.RecipeUpdateInput {
    return {
      category: recipe.categoryId
        ? {
            connect: { id: recipe.categoryId },
          }
        : { disconnect: true },
      name: recipe.name,
      preparationTimeMinutes: recipe.preparationTimeMinutes,
      servings: recipe.servings,
      preparationMethod: recipe.preparationMethod,
      ingredients: recipe.ingredients,
      updatedAt: recipe.updatedAt,
      deletedAt: recipe.deletedAt,
    };
  }

  static toDomainList(prismaRecipes: PrismaRecipe[]): Recipe[] {
    return prismaRecipes.map((recipe) => this.toDomain(recipe));
  }
}

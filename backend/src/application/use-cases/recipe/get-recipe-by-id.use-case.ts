import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from '@domain/entities/recipe.entity';
import { RecipeRepository } from '@domain/repositories/recipe.repository';

export interface GetRecipeByIdQuery {
  id: string;
  userId: string;
}

@Injectable()
export class GetRecipeByIdUseCase {
  constructor(
    @Inject(RecipeRepository)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(query: GetRecipeByIdQuery): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(query.id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== query.userId) {
      throw new ForbiddenException('You can only access your own recipes');
    }

    return recipe;
  }
}

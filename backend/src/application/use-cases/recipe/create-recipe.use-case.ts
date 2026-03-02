import { Inject, Injectable } from '@nestjs/common';
import { Recipe } from '@domain/entities/recipe.entity';
import { RecipeRepository } from '@domain/repositories/recipe.repository';

export interface CreateRecipeCommand {
  userId: string;
  name?: string;
  categoryId?: string;
  preparationTimeMinutes?: number;
  servings?: number;
  preparationMethod: string;
  ingredients?: string;
}

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    @Inject(RecipeRepository)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(command: CreateRecipeCommand): Promise<Recipe> {
    const recipe = Recipe.create(
      command.userId,
      command.preparationMethod,
      command.categoryId,
      command.name,
      command.preparationTimeMinutes,
      command.servings,
      command.ingredients,
    );

    return this.recipeRepository.create(recipe);
  }
}

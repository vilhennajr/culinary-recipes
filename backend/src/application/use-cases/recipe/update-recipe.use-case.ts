import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Recipe } from '@domain/entities/recipe.entity';
import { RecipeRepository } from '@domain/repositories/recipe.repository';

export interface UpdateRecipeCommand {
  id: string;
  userId: string;
  name?: string;
  categoryId?: string;
  preparationTimeMinutes?: number;
  servings?: number;
  preparationMethod?: string;
  ingredients?: string;
}

@Injectable()
export class UpdateRecipeUseCase {
  constructor(
    @Inject(RecipeRepository)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(command: UpdateRecipeCommand): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(command.id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== command.userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    recipe.update({
      name: command.name,
      categoryId: command.categoryId,
      preparationTimeMinutes: command.preparationTimeMinutes,
      servings: command.servings,
      preparationMethod: command.preparationMethod,
      ingredients: command.ingredients,
    });

    return this.recipeRepository.update(recipe);
  }
}

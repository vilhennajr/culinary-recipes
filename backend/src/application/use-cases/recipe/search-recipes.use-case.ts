import { Inject, Injectable } from '@nestjs/common';
import { Recipe } from '@domain/entities/recipe.entity';
import { RecipeRepository, RecipeSearchParams } from '@domain/repositories/recipe.repository';

@Injectable()
export class SearchRecipesUseCase {
  constructor(
    @Inject(RecipeRepository)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(params: RecipeSearchParams): Promise<Recipe[]> {
    return this.recipeRepository.search(params);
  }
}

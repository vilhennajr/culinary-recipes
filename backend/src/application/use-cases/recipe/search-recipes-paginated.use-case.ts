import { Inject, Injectable } from '@nestjs/common';
import {
  RecipeRepository,
  RecipeSearchParams,
  PaginationParams,
  PaginatedResult,
} from '@domain/repositories/recipe.repository';
import { Recipe } from '@domain/entities/recipe.entity';

@Injectable()
export class SearchRecipesPaginatedUseCase {
  constructor(
    @Inject(RecipeRepository)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    params: RecipeSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Recipe>> {
    return this.recipeRepository.searchPaginated(params, pagination);
  }
}

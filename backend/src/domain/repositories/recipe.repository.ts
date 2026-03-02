import { Recipe } from '../entities/recipe.entity';
export { PaginationParams, PaginatedResult } from '../types/pagination';
import { PaginationParams, PaginatedResult } from '../types/pagination';

export interface RecipeSearchParams {
  userId?: string;
  categoryId?: string;
  name?: string;
  id?: string;
  minPreparationTime?: number;
  maxPreparationTime?: number;
  minServings?: number;
  maxServings?: number;
  preparationMethod?: string;
  ingredients?: string;
}

export interface RecipeRepository {
  create(recipe: Recipe): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findByUserId(userId: string): Promise<Recipe[]>;
  search(params: RecipeSearchParams): Promise<Recipe[]>;
  searchPaginated(
    params: RecipeSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Recipe>>;
  update(recipe: Recipe): Promise<Recipe>;
  delete(id: string): Promise<void>;
}

export const RecipeRepository = Symbol('RecipeRepository');

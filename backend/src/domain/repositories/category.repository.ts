import { Category } from '../entities/category.entity';
export { PaginationParams, PaginatedResult } from '../types/pagination';
import { PaginationParams, PaginatedResult } from '../types/pagination';

export interface CategorySearchParams {
  id?: string;
  name?: string;
}

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findAllPaginated(
    filters: CategorySearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Category>>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}

export const CategoryRepository = Symbol('CategoryRepository');

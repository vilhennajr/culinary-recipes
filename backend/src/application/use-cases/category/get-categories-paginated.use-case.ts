import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryRepository,
  CategorySearchParams,
  PaginationParams,
  PaginatedResult,
} from '@domain/repositories/category.repository';
import { Category } from '@domain/entities/category.entity';

@Injectable()
export class GetCategoriesPaginatedUseCase {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    filters: CategorySearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Category>> {
    return this.categoryRepository.findAllPaginated(filters, pagination);
  }
}

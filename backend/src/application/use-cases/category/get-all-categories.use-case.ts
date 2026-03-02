import { Inject, Injectable } from '@nestjs/common';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

@Injectable()
export class GetAllCategoriesUseCase {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}

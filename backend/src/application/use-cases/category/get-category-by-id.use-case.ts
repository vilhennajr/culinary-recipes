import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}

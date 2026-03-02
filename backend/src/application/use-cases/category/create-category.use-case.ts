import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(data: { name: string }): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(data.name);

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = Category.create(data.name);
    return this.categoryRepository.create(category);
  }
}

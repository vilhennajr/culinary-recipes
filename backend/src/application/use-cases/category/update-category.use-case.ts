import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repositories/category.repository';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(data: { id: string; name: string }): Promise<Category> {
    const category = await this.categoryRepository.findById(data.id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory && existingCategory.id !== data.id) {
      throw new ConflictException('Category with this name already exists');
    }

    category.updateName(data.name);
    return this.categoryRepository.update(category);
  }
}

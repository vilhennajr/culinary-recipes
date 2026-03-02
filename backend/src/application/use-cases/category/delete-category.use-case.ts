import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '@domain/repositories/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.delete(id);
  }
}

import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RecipeRepository } from '@domain/repositories/recipe.repository';

export interface DeleteRecipeCommand {
  id: string;
  userId: string;
}

@Injectable()
export class DeleteRecipeUseCase {
  constructor(
    @Inject(RecipeRepository)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(command: DeleteRecipeCommand): Promise<void> {
    const recipe = await this.recipeRepository.findById(command.id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== command.userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.recipeRepository.delete(command.id);
  }
}

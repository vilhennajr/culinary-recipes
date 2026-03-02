import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRecipeUseCase } from '@application/use-cases/recipe/create-recipe.use-case';
import { SearchRecipesUseCase } from '@application/use-cases/recipe/search-recipes.use-case';
import { SearchRecipesPaginatedUseCase } from '@application/use-cases/recipe/search-recipes-paginated.use-case';
import { GetRecipeByIdUseCase } from '@application/use-cases/recipe/get-recipe-by-id.use-case';
import { UpdateRecipeUseCase } from '@application/use-cases/recipe/update-recipe.use-case';
import { DeleteRecipeUseCase } from '@application/use-cases/recipe/delete-recipe.use-case';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  RecipeResponseDto,
  SearchRecipesDto,
} from '../dtos/recipe.dto';
import { PaginatedResponseDto } from '../dtos/pagination.dto';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';
import { Recipe } from '@domain/entities/recipe.entity';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    login: string;
  };
}

@ApiTags('Recipes')
@Controller('recipes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecipeController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly searchRecipesUseCase: SearchRecipesUseCase,
    private readonly searchRecipesPaginatedUseCase: SearchRecipesPaginatedUseCase,
    private readonly getRecipeByIdUseCase: GetRecipeByIdUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully', type: RecipeResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() req: RequestWithUser, @Body() dto: CreateRecipeDto) {
    const recipe = await this.createRecipeUseCase.execute({
      userId: req.user.userId,
      ...dto,
    });

    return this.mapRecipeToResponse(recipe);
  }

  @Get()
  @ApiOperation({ summary: 'Search recipes with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return paginated recipes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async search(@Request() req: RequestWithUser, @Query() query: SearchRecipesDto) {
    const result = await this.searchRecipesPaginatedUseCase.execute(
      {
        userId: req.user.userId,
        id: query.id,
        categoryId: query.categoryId,
        name: query.name,
        minPreparationTime: query.minPreparationTime,
        maxPreparationTime: query.maxPreparationTime,
        minServings: query.minServings,
        maxServings: query.maxServings,
        preparationMethod: query.preparationMethod,
        ingredients: query.ingredients,
      },
      {
        page: query.page || 1,
        limit: query.limit || 10,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder || 'asc',
      },
    );

    return new PaginatedResponseDto(
      result.data.map((recipe) => this.mapRecipeToResponse(recipe)),
      result.page,
      result.limit,
      result.total,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiResponse({ status: 200, description: 'Return recipe', type: RecipeResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async getById(@Request() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    const recipe = await this.getRecipeByIdUseCase.execute({
      id,
      userId: req.user.userId,
    });

    return this.mapRecipeToResponse(recipe);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully', type: RecipeResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not recipe owner' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    const recipe = await this.updateRecipeUseCase.execute({
      id,
      userId: req.user.userId,
      ...dto,
    });

    return this.mapRecipeToResponse(recipe);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiResponse({ status: 204, description: 'Recipe deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not recipe owner' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.deleteRecipeUseCase.execute({
      id,
      userId: req.user.userId,
    });
  }

  private mapRecipeToResponse(recipe: Recipe): RecipeResponseDto {
    return {
      id: recipe.id!,
      userId: recipe.userId,
      categoryId: recipe.categoryId,
      name: recipe.name,
      preparationTimeMinutes: recipe.preparationTimeMinutes,
      servings: recipe.servings,
      preparationMethod: recipe.preparationMethod,
      ingredients: recipe.ingredients,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    };
  }
}

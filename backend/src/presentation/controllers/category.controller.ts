import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';
import { GetCategoriesPaginatedUseCase } from '@application/use-cases/category/get-categories-paginated.use-case';
import { CreateCategoryUseCase } from '@application/use-cases/category/create-category.use-case';
import { GetCategoryByIdUseCase } from '@application/use-cases/category/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from '@application/use-cases/category/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/use-cases/category/delete-category.use-case';
import {
  SearchCategoriesDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from '../dtos/category.dto';
import { PaginatedResponseDto } from '../dtos/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(
    private readonly getCategoriesPaginatedUseCase: GetCategoriesPaginatedUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.createCategoryUseCase.execute(dto);

    return {
      id: category.id!,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return paginated categories' })
  async getAll(@Query() query: SearchCategoriesDto) {
    const result = await this.getCategoriesPaginatedUseCase.execute(
      {
        id: query.id,
        name: query.name,
      },
      {
        page: query.page || 1,
        limit: query.limit || 10,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder || 'asc',
      },
    );

    return new PaginatedResponseDto(
      result.data.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })),
      result.page,
      result.limit,
      result.total,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Return category', type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid UUID' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryResponseDto> {
    const category = await this.getCategoryByIdUseCase.execute(id);

    return {
      id: category.id!,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or invalid UUID' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.updateCategoryUseCase.execute({
      id,
      ...dto,
    });

    return {
      id: category.id!,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category (soft delete)' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid UUID' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteCategoryUseCase.execute(id);
  }
}

import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class CreateRecipeDto {
  @ApiPropertyOptional({ example: 'Chocolate Cake' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 45 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  preparationTimeMinutes?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  servings?: number;

  @ApiProperty({ example: 'Mix all ingredients and bake at 180°C for 30 minutes' })
  @IsString()
  @IsNotEmpty()
  preparationMethod: string;

  @ApiPropertyOptional({ example: '2 cups flour, 1 cup sugar, 3 eggs, 1/2 cup cocoa powder' })
  @IsString()
  @IsOptional()
  ingredients?: string;
}

export class UpdateRecipeDto {
  @ApiPropertyOptional({ example: 'Chocolate Cake - Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  preparationTimeMinutes?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  servings?: number;

  @ApiPropertyOptional({ example: 'Updated preparation method' })
  @IsString()
  @IsOptional()
  preparationMethod?: string;

  @ApiPropertyOptional({ example: 'Updated ingredients list' })
  @IsString()
  @IsOptional()
  ingredients?: string;
}

export class RecipeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  categoryId: string | null;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  preparationTimeMinutes: number | null;

  @ApiProperty()
  servings: number | null;

  @ApiProperty()
  preparationMethod: string;

  @ApiProperty()
  ingredients: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * Client-facing search filters for recipes.
 * Note: `userId` is intentionally absent — it is injected server-side from the JWT token
 * to ensure users can only search their own recipes.
 */
export class RecipeFilterDto {
  @ApiPropertyOptional({ description: 'Filter by recipe ID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by recipe name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum preparation time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPreparationTime?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum preparation time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPreparationTime?: number;

  @ApiPropertyOptional({ description: 'Filter by minimum servings' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minServings?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum servings' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxServings?: number;

  @ApiPropertyOptional({ description: 'Filter by preparation method (partial match)' })
  @IsOptional()
  @IsString()
  preparationMethod?: string;

  @ApiPropertyOptional({ description: 'Filter by ingredients (partial match)' })
  @IsOptional()
  @IsString()
  ingredients?: string;
}

export class SearchRecipesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by recipe ID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by recipe name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum preparation time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPreparationTime?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum preparation time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPreparationTime?: number;

  @ApiPropertyOptional({ description: 'Filter by minimum servings' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minServings?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum servings' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxServings?: number;

  @ApiPropertyOptional({ description: 'Filter by preparation method (partial match)' })
  @IsOptional()
  @IsString()
  preparationMethod?: string;

  @ApiPropertyOptional({ description: 'Filter by ingredients (partial match)' })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional({
    enum: ['name', 'createdAt', 'updatedAt', 'preparationTimeMinutes', 'servings'],
    description: 'Sort field',
  })
  @IsOptional()
  @IsIn(['name', 'createdAt', 'updatedAt', 'preparationTimeMinutes', 'servings'])
  override sortBy?: string;
}

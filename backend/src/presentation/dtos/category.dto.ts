import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsNotEmpty, IsIn } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Italian Cuisine' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Italian Cuisine - Updated' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CategoryFilterDto {
  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter by category name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class SearchCategoriesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter by category name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: ['name', 'createdAt', 'updatedAt'], description: 'Sort field' })
  @IsOptional()
  @IsIn(['name', 'createdAt', 'updatedAt'])
  override sortBy?: string;
}

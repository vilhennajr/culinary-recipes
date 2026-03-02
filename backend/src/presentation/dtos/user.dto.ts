import { IsString, IsNotEmpty, IsOptional, MinLength, IsEmail, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class RegisterUserDto {
  @ApiProperty({ example: 'joao.santos@example.com' })
  @IsEmail()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Carlos Souza' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'joao.santos@example.com' })
  @IsEmail()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  login: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Carlos Souza' })
  @IsString()
  @IsOptional()
  name?: string | null;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}

export class SearchUsersDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by user name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by login (partial match)' })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiPropertyOptional({
    enum: ['name', 'login', 'createdAt', 'updatedAt'],
    description: 'Sort field',
  })
  @IsOptional()
  @IsIn(['name', 'login', 'createdAt', 'updatedAt'])
  override sortBy?: string;
}

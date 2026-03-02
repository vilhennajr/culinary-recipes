import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';
import { GetUsersPaginatedUseCase } from '@application/use-cases/user/get-users-paginated.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/user/delete-user.use-case';
import { UpdateUserDto, UserResponseDto, SearchUsersDto } from '../dtos/user.dto';
import { PaginatedResponseDto } from '../dtos/pagination.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    login: string;
  };
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly getUsersPaginatedUseCase: GetUsersPaginatedUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List users with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return paginated users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAll(@Query() query: SearchUsersDto) {
    const result = await this.getUsersPaginatedUseCase.execute(
      { name: query.name, login: query.login },
      {
        page: query.page || 1,
        limit: query.limit || 10,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder || 'asc',
      },
    );

    return new PaginatedResponseDto(
      result.data.map((user) => ({
        id: user.id!,
        name: user.name,
        login: user.login,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      result.page,
      result.limit,
      result.total,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return user', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);

    return {
      id: user.id!,
      name: user.name,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - cannot modify another user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (req.user.userId !== id) {
      throw new ForbiddenException('You can only modify your own account');
    }
    const user = await this.updateUserUseCase.execute({ id, ...dto });

    return {
      id: user.id!,
      name: user.name,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - cannot delete another user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    if (req.user.userId !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    await this.deleteUserUseCase.execute(id);
  }
}

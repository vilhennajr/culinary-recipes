import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserUseCase } from '@application/use-cases/user/register-user.use-case';
import { LoginUserUseCase } from '@application/use-cases/user/login-user.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { RegisterUserDto, LoginUserDto, UserResponseDto } from '../dtos/user.dto';
import { AuthService } from '@infrastructure/auth/auth.service';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';

interface RequestWithUser {
  user: { userId: string; login: string };
  headers: Record<string, string | undefined>;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly authService: AuthService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return {
      id: user.id,
      name: user.name,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginUserDto) {
    const user = await this.loginUserUseCase.execute(dto);
    const token = await this.authService.generateToken(user);
    return {
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
      },
      accessToken: token,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Return current user', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Request() req: RequestWithUser): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(req.user.userId);

    return {
      id: user.id!,
      name: user.name,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user (revoke token)' })
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Request() req: RequestWithUser): void {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (token) {
      this.authService.revokeToken(token);
    }
  }
}

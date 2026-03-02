import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as Joi from 'joi';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { PrismaCategoryRepository } from '@infrastructure/repositories/prisma-category.repository';
import { PrismaRecipeRepository } from '@infrastructure/repositories/prisma-recipe.repository';
import { UserRepository } from '@domain/repositories/user.repository';
import { CategoryRepository } from '@domain/repositories/category.repository';
import { RecipeRepository } from '@domain/repositories/recipe.repository';
import { RegisterUserUseCase } from '@application/use-cases/user/register-user.use-case';
import { LoginUserUseCase } from '@application/use-cases/user/login-user.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '@application/use-cases/user/get-all-users.use-case';
import { GetUsersPaginatedUseCase } from '@application/use-cases/user/get-users-paginated.use-case';
import { UpdateUserUseCase } from '@application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/user/delete-user.use-case';
import { CreateRecipeUseCase } from '@application/use-cases/recipe/create-recipe.use-case';
import { SearchRecipesUseCase } from '@application/use-cases/recipe/search-recipes.use-case';
import { SearchRecipesPaginatedUseCase } from '@application/use-cases/recipe/search-recipes-paginated.use-case';
import { GetRecipeByIdUseCase } from '@application/use-cases/recipe/get-recipe-by-id.use-case';
import { UpdateRecipeUseCase } from '@application/use-cases/recipe/update-recipe.use-case';
import { DeleteRecipeUseCase } from '@application/use-cases/recipe/delete-recipe.use-case';
import { GetCategoriesPaginatedUseCase } from '@application/use-cases/category/get-categories-paginated.use-case';
import { CreateCategoryUseCase } from '@application/use-cases/category/create-category.use-case';
import { GetCategoryByIdUseCase } from '@application/use-cases/category/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from '@application/use-cases/category/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/use-cases/category/delete-category.use-case';
import { AuthController } from '@presentation/controllers/auth.controller';
import { RecipeController } from '@presentation/controllers/recipe.controller';
import { CategoryController } from '@presentation/controllers/category.controller';
import { HealthController } from '@presentation/controllers/health.controller';
import { UserController } from '@presentation/controllers/user.controller';
import { AuthService } from '@infrastructure/auth/auth.service';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
        PORT: Joi.number().default(3000),
        CORS_ORIGIN: Joi.string().default('http://localhost:8080'),
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 10 },
        { name: 'medium', ttl: 60_000, limit: 100 },
      ],
      // Disable rate limiting during automated tests to avoid false throttle failures
      skipIf: () => process.env.NODE_ENV === 'test',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    HealthController,
    AuthController,
    RecipeController,
    CategoryController,
    UserController,
  ],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: RecipeRepository,
      useClass: PrismaRecipeRepository,
    },
    RegisterUserUseCase,
    LoginUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    GetUsersPaginatedUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateRecipeUseCase,
    SearchRecipesUseCase,
    SearchRecipesPaginatedUseCase,
    GetRecipeByIdUseCase,
    UpdateRecipeUseCase,
    DeleteRecipeUseCase,
    GetCategoriesPaginatedUseCase,
    CreateCategoryUseCase,
    GetCategoryByIdUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}

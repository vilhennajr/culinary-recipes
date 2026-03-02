import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '@application/use-cases/user/register-user.use-case';
import { LoginUserUseCase } from '@application/use-cases/user/login-user.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { AuthService } from '@infrastructure/auth/auth.service';
import { User } from '@domain/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUserUseCase: jest.Mocked<RegisterUserUseCase>;
  let loginUserUseCase: jest.Mocked<LoginUserUseCase>;
  let authService: jest.Mocked<AuthService>;
  let getUserByIdUseCase: jest.Mocked<GetUserByIdUseCase>;

  const mockUser = User.reconstitute(
    'user-123',
    'Pedro Alves',
    'pedro.alves@example.com',
    'hashedPassword',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RegisterUserUseCase, useValue: { execute: jest.fn() } },
        { provide: LoginUserUseCase, useValue: { execute: jest.fn() } },
        { provide: AuthService, useValue: { generateToken: jest.fn(), revokeToken: jest.fn() } },
        { provide: GetUserByIdUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    registerUserUseCase = module.get(RegisterUserUseCase);
    loginUserUseCase = module.get(LoginUserUseCase);
    authService = module.get(AuthService);
    getUserByIdUseCase = module.get(GetUserByIdUseCase);
  });

  describe('register', () => {
    it('should register a user and return user data', async () => {
      registerUserUseCase.execute.mockResolvedValue(mockUser);

      const dto = {
        login: 'pedro.alves@example.com',
        password: 'password123',
        name: 'Pedro Alves',
      };

      const result = await controller.register(dto);

      expect(result).toMatchObject({
        id: 'user-123',
        login: 'pedro.alves@example.com',
        name: 'Pedro Alves',
      });
      expect(registerUserUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login and return access token', async () => {
      loginUserUseCase.execute.mockResolvedValue(mockUser);
      authService.generateToken.mockResolvedValue('jwt-token-abc123');

      const dto = { login: 'pedro.alves@example.com', password: 'password123' };
      const result = await controller.login(dto);

      expect(result).toMatchObject({
        user: {
          id: 'user-123',
          login: 'pedro.alves@example.com',
          name: 'Pedro Alves',
        },
        accessToken: 'jwt-token-abc123',
      });
      expect(loginUserUseCase.execute).toHaveBeenCalledWith(dto);
      expect(authService.generateToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('logout', () => {
    it('should revoke the token and return void', () => {
      const mockReq = {
        user: { userId: 'user-123', login: 'pedro.alves@example.com' },
        headers: { authorization: 'Bearer test-token' },
      } as any;

      authService.revokeToken = jest.fn();

      controller.logout(mockReq);

      expect(authService.revokeToken).toHaveBeenCalledWith('test-token');
    });
  });

  describe('me', () => {
    it('should return the current authenticated user profile', async () => {
      getUserByIdUseCase.execute.mockResolvedValue(mockUser);

      const mockReq = {
        user: { userId: 'user-123', login: 'pedro.alves@example.com' },
        headers: {},
      } as any;

      const result = await controller.me(mockReq);

      expect(getUserByIdUseCase.execute).toHaveBeenCalledWith('user-123');
      expect(result).toMatchObject({
        id: 'user-123',
        login: 'pedro.alves@example.com',
        name: 'Pedro Alves',
      });
    });
  });
});

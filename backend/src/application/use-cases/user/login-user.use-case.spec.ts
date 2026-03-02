import { LoginUserUseCase } from './login-user.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByLogin: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new LoginUserUseCase(userRepository);
  });

  describe('execute', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = User.reconstitute(
        'user-123',
        'Pedro Alves',
        'pedro.alves@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      );

      userRepository.findByLogin.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await useCase.execute({
        login: 'pedro.alves@example.com',
        password: 'password123',
      });

      expect(result).toBe(mockUser);
      expect(userRepository.findByLogin).toHaveBeenCalledWith('pedro.alves@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepository.findByLogin.mockResolvedValue(null);

      await expect(
        useCase.execute({
          login: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByLogin).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = User.reconstitute(
        'user-123',
        'Pedro Alves',
        'pedro.alves@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      );

      userRepository.findByLogin.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        useCase.execute({
          login: 'pedro.alves@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with correct message', async () => {
      userRepository.findByLogin.mockResolvedValue(null);

      await expect(
        useCase.execute({
          login: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});

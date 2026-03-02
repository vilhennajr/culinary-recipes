import { RegisterUserUseCase } from '@application/use-cases/user/register-user.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { ConflictException } from '@nestjs/common';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByLogin: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new RegisterUserUseCase(userRepository);
  });

  it('should register a new user successfully', async () => {
    const command = {
      login: 'test@example.com',
      password: 'password123',
      name: 'Pedro Alves',
    };

    const createdUser = User.create(command.login, 'hashedPassword', command.name);
    userRepository.findByLogin.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(createdUser);

    const result = await useCase.execute(command);

    expect(userRepository.findByLogin).toHaveBeenCalledWith(command.login);
    expect(userRepository.create).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw ConflictException if user already exists', async () => {
    const command = {
      login: 'existing@example.com',
      password: 'password123',
    };

    const existingUser = User.create(command.login, 'hashedPassword');
    userRepository.findByLogin.mockResolvedValue(existingUser);

    await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
  });
});

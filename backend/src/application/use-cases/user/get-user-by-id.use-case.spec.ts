import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = User.reconstitute(
    'user-123',
    'Carlos Souza',
    'carlos.souza@example.com',
    'hashedPassword',
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByLogin: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new GetUserByIdUseCase(userRepository);
  });

  it('should return user when found', async () => {
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute('user-123');

    expect(result).toBe(mockUser);
    expect(userRepository.findById).toHaveBeenCalledWith('user-123');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
  });
});

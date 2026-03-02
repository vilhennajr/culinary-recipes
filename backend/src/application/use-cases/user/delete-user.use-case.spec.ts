import { DeleteUserUseCase } from '@application/use-cases/user/delete-user.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
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

    useCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete user successfully', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('user-123');

    expect(userRepository.findById).toHaveBeenCalledWith('user-123');
    expect(userRepository.delete).toHaveBeenCalledWith('user-123');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});

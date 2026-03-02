import { UpdateUserUseCase } from '@application/use-cases/user/update-user.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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

    useCase = new UpdateUserUseCase(userRepository);
  });

  it('should update user name successfully', async () => {
    const updatedUser = User.reconstitute(
      'user-123',
      'Ana Lima',
      'carlos.souza@example.com',
      'hashedPassword',
      new Date(),
      new Date(),
    );
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute({ id: 'user-123', name: 'Ana Lima' });

    expect(userRepository.findById).toHaveBeenCalledWith('user-123');
    expect(userRepository.update).toHaveBeenCalled();
    expect(result.name).toBe('Ana Lima');
  });

  it('should update user password successfully', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.update.mockResolvedValue(mockUser);

    await useCase.execute({ id: 'user-123', password: 'newPassword123' });

    expect(userRepository.update).toHaveBeenCalled();
  });

  it('should update both name and password', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.update.mockResolvedValue(mockUser);

    await useCase.execute({ id: 'user-123', name: 'New Name', password: 'newpass123' });

    expect(userRepository.update).toHaveBeenCalled();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'non-existent', name: 'Test' })).rejects.toThrow(
      NotFoundException,
    );
  });
});

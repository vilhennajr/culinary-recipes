import { GetAllUsersUseCase } from './get-all-users.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = User.reconstitute(
    'user-123',
    'Carlos Souza',
    'carlos.souza@example.com',
    'hashedPassword',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
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
    };

    useCase = new GetAllUsersUseCase(userRepository as any);
  });

  it('should return all users', async () => {
    userRepository.findAll.mockResolvedValue([mockUser]);

    const result = await useCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].login).toBe('carlos.souza@example.com');
  });

  it('should return empty array when no users exist', async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

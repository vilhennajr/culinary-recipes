import { GetUsersPaginatedUseCase } from './get-users-paginated.use-case';
import { UserRepository } from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user.entity';

describe('GetUsersPaginatedUseCase', () => {
  let useCase: GetUsersPaginatedUseCase;
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

    useCase = new GetUsersPaginatedUseCase(userRepository as any);
  });

  it('should return paginated users', async () => {
    const mockResult = { data: [mockUser], total: 1, page: 1, limit: 10 };
    userRepository.findAllPaginated.mockResolvedValue(mockResult);

    const result = await useCase.execute({}, { page: 1, limit: 10, sortOrder: 'asc' });

    expect(userRepository.findAllPaginated).toHaveBeenCalledWith(
      {},
      { page: 1, limit: 10, sortOrder: 'asc' },
    );
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.data[0].login).toBe('carlos.souza@example.com');
  });

  it('should pass filters to repository', async () => {
    const mockResult = { data: [mockUser], total: 1, page: 1, limit: 5 };
    userRepository.findAllPaginated.mockResolvedValue(mockResult);

    await useCase.execute(
      { name: 'Carlos', login: 'carlos' },
      { page: 1, limit: 5, sortBy: 'name', sortOrder: 'desc' },
    );

    expect(userRepository.findAllPaginated).toHaveBeenCalledWith(
      { name: 'Carlos', login: 'carlos' },
      { page: 1, limit: 5, sortBy: 'name', sortOrder: 'desc' },
    );
  });
});

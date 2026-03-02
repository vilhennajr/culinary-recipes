import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { GetUsersPaginatedUseCase } from '@application/use-cases/user/get-users-paginated.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/user/delete-user.use-case';
import { User } from '@domain/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let getUsersPaginatedUseCase: jest.Mocked<GetUsersPaginatedUseCase>;
  let getUserByIdUseCase: jest.Mocked<GetUserByIdUseCase>;
  let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;

  const mockUser = User.reconstitute(
    'user-123',
    'Carlos Souza',
    'carlos.souza@example.com',
    'hashedPassword',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: GetUsersPaginatedUseCase, useValue: { execute: jest.fn() } },
        { provide: GetUserByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteUserUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    getUsersPaginatedUseCase = module.get(GetUsersPaginatedUseCase);
    getUserByIdUseCase = module.get(GetUserByIdUseCase);
    updateUserUseCase = module.get(UpdateUserUseCase);
    deleteUserUseCase = module.get(DeleteUserUseCase);
  });

  describe('getAll', () => {
    it('should return a paginated list of users', async () => {
      getUsersPaginatedUseCase.execute.mockResolvedValue({
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.getAll({});

      expect(getUsersPaginatedUseCase.execute).toHaveBeenCalledWith(
        { name: undefined, login: undefined },
        { page: 1, limit: 10, sortBy: undefined, sortOrder: 'asc' },
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({ id: 'user-123', login: 'carlos.souza@example.com' });
      expect(result.meta).toMatchObject({ page: 1, limit: 10, total: 1, totalPages: 1 });
    });
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      getUserByIdUseCase.execute.mockResolvedValue(mockUser);

      const result = await controller.getById('user-123');

      expect(getUserByIdUseCase.execute).toHaveBeenCalledWith('user-123');
      expect(result).toMatchObject({
        id: 'user-123',
        login: 'carlos.souza@example.com',
        name: 'Carlos Souza',
      });
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updatedUser = User.reconstitute(
        'user-123',
        'Ana Lima',
        'carlos.souza@example.com',
        'hashedPassword',
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      );
      updateUserUseCase.execute.mockResolvedValue(updatedUser);

      const mockReq = { user: { userId: 'user-123', login: 'carlos.souza@example.com' } } as any;
      const result = await controller.update(mockReq, 'user-123', { name: 'Ana Lima' });

      expect(updateUserUseCase.execute).toHaveBeenCalledWith({ id: 'user-123', name: 'Ana Lima' });
      expect(result.name).toBe('Ana Lima');
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      deleteUserUseCase.execute.mockResolvedValue(undefined);

      const mockReq = { user: { userId: 'user-123', login: 'carlos.souza@example.com' } } as any;
      await controller.delete(mockReq, 'user-123');

      expect(deleteUserUseCase.execute).toHaveBeenCalledWith('user-123');
    });
  });
});

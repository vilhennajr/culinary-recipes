import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from '../database/prisma.service';
import { User } from '@domain/entities/user.entity';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaUser = {
    id: 'user-123',
    name: 'Pedro Alves',
    login: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    prismaService = {
      user: {
        create: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
        findUnique: jest.fn() as jest.Mock,
        findFirst: jest.fn() as jest.Mock,
        update: jest.fn() as jest.Mock,
        delete: jest.fn() as jest.Mock,
        count: jest.fn() as jest.Mock,
      },
      recipe: {
        updateMany: jest.fn() as jest.Mock,
      },
      $transaction: jest.fn() as jest.Mock,
    } as any;

    repository = new PrismaUserRepository(prismaService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockPrismaUser);

      const user = User.create('test@example.com', 'hashedPassword', 'Pedro Alves');
      const result = await repository.create(user);

      expect(result).toBeInstanceOf(User);
      expect(result.login).toBe('test@example.com');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue([mockPrismaUser]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].login).toBe('test@example.com');
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockPrismaUser);

      const result = await repository.findById('user-123');

      expect(result).toBeInstanceOf(User);
      expect(result!.id).toBe('user-123');
    });

    it('should return null when not found', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByLogin', () => {
    it('should return user when found by login', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockPrismaUser);

      const result = await repository.findByLogin('test@example.com');

      expect(result).toBeInstanceOf(User);
      expect(result!.login).toBe('test@example.com');
    });

    it('should return null when not found by login', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByLogin('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedPrismaUser = { ...mockPrismaUser, name: 'Ana Lima' };
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedPrismaUser);

      const user = User.reconstitute(
        'user-123',
        'Ana Lima',
        'test@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      );

      const result = await repository.update(user);

      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('Ana Lima');
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated users', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue([mockPrismaUser]);
      (prismaService.user.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.findAllPaginated(
        {},
        { page: 1, limit: 10, sortOrder: 'asc' },
      );

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data[0]).toBeInstanceOf(User);
    });

    it('should apply name and login filters', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue([mockPrismaUser]);
      (prismaService.user.count as jest.Mock).mockResolvedValue(1);

      await repository.findAllPaginated(
        { name: 'Pedro', login: 'test' },
        { page: 2, limit: 5, sortBy: 'name', sortOrder: 'desc' },
      );

      const findManyCall = (prismaService.user.findMany as jest.Mock).mock.calls[0][0];
      expect(findManyCall.where).toMatchObject({
        name: { contains: 'Pedro' },
        login: { contains: 'test' },
      });
      expect(findManyCall.skip).toBe(5);
      expect(findManyCall.take).toBe(5);
    });
  });

  describe('delete', () => {
    it('should soft-delete a user and cascade to recipes', async () => {
      (prismaService.$transaction as jest.Mock).mockResolvedValue(undefined);

      await repository.delete('user-123');

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
      const txArgs = (prismaService.$transaction as jest.Mock).mock.calls[0][0] as unknown[];
      expect(txArgs).toHaveLength(2);
    });
  });
});

import { UserMapper } from './user.mapper';
import { User } from '@domain/entities/user.entity';

describe('UserMapper', () => {
  const mockPrismaUser = {
    id: 'user-123',
    login: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Pedro Alves',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    deletedAt: null,
  };

  describe('toDomain', () => {
    it('should map Prisma user to domain entity', () => {
      const result = UserMapper.toDomain(mockPrismaUser);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('user-123');
      expect(result.login).toBe('test@example.com');
      expect(result.password).toBe('hashedPassword123');
      expect(result.name).toBe('Pedro Alves');
      expect(result.createdAt).toEqual(new Date('2024-01-01'));
      expect(result.updatedAt).toEqual(new Date('2024-01-02'));
    });

    it('should handle null name', () => {
      const userWithoutName = {
        ...mockPrismaUser,
        name: null,
      };

      const result = UserMapper.toDomain(userWithoutName);
      expect(result.name).toBeNull();
    });
  });

  describe('toDomainList', () => {
    it('should map array of Prisma users to domain entities', () => {
      const prismaUsers = [
        mockPrismaUser,
        { ...mockPrismaUser, id: 'user-456', login: 'another@example.com' },
      ];

      const result = UserMapper.toDomainList(prismaUsers);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].login).toBe('test@example.com');
      expect(result[1].login).toBe('another@example.com');
    });

    it('should return empty array for empty input', () => {
      const result = UserMapper.toDomainList([]);
      expect(result).toEqual([]);
    });
  });

  describe('toCreateInput', () => {
    it('should map domain entity to Prisma create input', () => {
      const user = User.create('test@example.com', 'hashedPass', 'Pedro Alves');

      const result = UserMapper.toCreateInput(user);

      expect(result).toEqual({
        id: undefined,
        login: 'test@example.com',
        password: 'hashedPass',
        name: 'Pedro Alves',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should include id when entity is reconstituted', () => {
      const user = User.reconstitute(
        'user-789',
        'Pedro Alves',
        'test@example.com',
        'hashedPass',
        new Date(),
        new Date(),
      );

      const result = UserMapper.toCreateInput(user);

      expect(result.id).toBe('user-789');
    });

    it('should handle null name', () => {
      const user = User.create('test@example.com', 'hashedPass', null);

      const result = UserMapper.toCreateInput(user);

      expect(result.name).toBeNull();
    });
  });

  describe('toUpdateInput', () => {
    it('should map domain entity to Prisma update input', () => {
      const user = User.reconstitute(
        'user-123',
        'Ana Lima',
        'test@example.com',
        'newHashedPassword',
        new Date('2024-01-01'),
        new Date('2024-01-03'),
      );

      const result = UserMapper.toUpdateInput(user);

      expect(result).toEqual({
        name: 'Ana Lima',
        password: 'newHashedPassword',
        updatedAt: new Date('2024-01-03'),
      });
    });

    it('should not include id or login in update input', () => {
      const user = User.reconstitute(
        'user-123',
        'Pedro Alves',
        'test@example.com',
        'hashedPass',
        new Date(),
        new Date(),
      );

      const result = UserMapper.toUpdateInput(user);

      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('login');
    });
  });
});

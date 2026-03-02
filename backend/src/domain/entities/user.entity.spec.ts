import { User } from '@domain/entities/user.entity';
import { InvalidUserException } from '@domain/exceptions/domain.exceptions';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user', () => {
      const user = User.create('john@example.com', 'password123', 'John Doe');

      expect(user).toBeDefined();
      expect(user.login).toBe('john@example.com');
      expect(user.name).toBe('John Doe');
      expect(user.isDeleted).toBe(false);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with no name', () => {
      const user = User.create('john@example.com', 'password123');

      expect(user.name).toBeNull();
    });

    it('should throw when login is empty', () => {
      expect(() => {
        User.create('', 'password123');
      }).toThrow(InvalidUserException);
    });

    it('should throw when login is whitespace', () => {
      expect(() => {
        User.create('   ', 'password123');
      }).toThrow(InvalidUserException);
    });

    it('should throw when password is empty', () => {
      expect(() => {
        User.create('john@example.com', '');
      }).toThrow(InvalidUserException);
    });

    it('should throw when password is whitespace', () => {
      expect(() => {
        User.create('john@example.com', '   ');
      }).toThrow(InvalidUserException);
    });
  });

  describe('updateName', () => {
    it('should update the user name', () => {
      const user = User.create('john@example.com', 'password123', 'Old Name');

      user.updateName('New Name');

      expect(user.name).toBe('New Name');
    });

    it('should allow setting name to null', () => {
      const user = User.create('john@example.com', 'password123', 'Old Name');

      user.updateName(null);

      expect(user.name).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update the password', () => {
      const user = User.create('john@example.com', 'oldpassword');

      user.updatePassword('newpassword');

      expect(user.password).toBe('newpassword');
    });
  });

  describe('softDelete', () => {
    it('should mark user as deleted', () => {
      const user = User.create('john@example.com', 'password123');

      expect(user.isDeleted).toBe(false);

      user.softDelete();

      expect(user.isDeleted).toBe(true);
      expect(user.deletedAt).toBeDefined();
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted user', () => {
      const user = User.create('john@example.com', 'password123');

      user.softDelete();
      expect(user.isDeleted).toBe(true);

      user.restore();
      expect(user.isDeleted).toBe(false);
      expect(user.deletedAt).toBeNull();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a user from persisted data', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const now = new Date();

      const user = User.reconstitute(id, 'John Doe', 'john@example.com', 'hashed', now, now, null);

      expect(user.id).toBe(id);
      expect(user.name).toBe('John Doe');
      expect(user.login).toBe('john@example.com');
      expect(user.isDeleted).toBe(false);
    });

    it('should reconstitute a soft-deleted user', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const now = new Date();
      const deletedAt = new Date();

      const user = User.reconstitute(id, null, 'john@example.com', 'hashed', now, now, deletedAt);

      expect(user.isDeleted).toBe(true);
    });
  });
});

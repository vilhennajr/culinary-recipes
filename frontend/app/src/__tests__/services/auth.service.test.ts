jest.mock('../../database', () => ({ getDatabase: jest.fn(), closeDatabase: jest.fn() }));
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(),
  randomUUID: jest.fn(),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import { authService } from '../../services/auth.service';
import { getDatabase } from '../../database';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const mockDb = {
  runAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
  withTransactionAsync: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (getDatabase as jest.Mock).mockResolvedValue(mockDb);
  (Crypto.digestStringAsync as jest.Mock).mockResolvedValue('hashed_pw');
  (Crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid');
  mockDb.runAsync.mockResolvedValue({ changes: 1 });
  mockDb.getAllAsync.mockResolvedValue([]);
  mockDb.withTransactionAsync.mockImplementation(async (cb: () => Promise<void>) => {
    await cb();
  });
  (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
  (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
});

describe('register', () => {
  it('creates user and returns AuthUser', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    const user = await authService.register('john', 'secret', 'John');

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining(['test-uuid', 'john', 'hashed_pw', 'John']),
    );
    expect(user).toEqual({ id: 'test-uuid', login: 'john', name: 'John' });
  });

  it('wraps seed in a transaction', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    await authService.register('newuser', 'pass123');

    expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO recipes'),
      expect.any(Array),
    );
  });

  it('throws if login already exists', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'existing' });

    await expect(authService.register('john', 'secret')).rejects.toThrow(
      'Este login já está em uso.',
    );
  });
});

describe('login', () => {
  it('returns AuthUser and persists session on valid credentials', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'uid-1',
      login: 'john',
      name: 'John',
      password: 'hashed_pw',
    });

    const user = await authService.login('john', 'secret');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('culinary_user_id', 'uid-1');
    expect(user).toEqual({ id: 'uid-1', login: 'john', name: 'John' });
  });

  it('throws if user not found', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    await expect(authService.login('ghost', 'pass')).rejects.toThrow('Login ou senha inválidos.');
  });

  it('throws if password does not match', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'uid-1',
      login: 'john',
      name: 'John',
      password: 'other_hash',
    });

    await expect(authService.login('john', 'wrong')).rejects.toThrow('Login ou senha inválidos.');
  });
});

describe('me', () => {
  it('returns user from active session', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('uid-1');
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'uid-1', login: 'john', name: 'John' });

    const user = await authService.me();

    expect(user).toEqual({ id: 'uid-1', login: 'john', name: 'John' });
  });

  it('throws when no session exists', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    await expect(authService.me()).rejects.toThrow('Não autenticado.');
  });

  it('throws when user row is missing', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('uid-gone');
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    await expect(authService.me()).rejects.toThrow('Usuário não encontrado.');
  });
});

describe('logout', () => {
  it('removes session key from secure store', async () => {
    await authService.logout();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('culinary_user_id');
  });
});

describe('getStoredUserId', () => {
  it('delegates to SecureStore and returns value', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('uid-42');

    const id = await authService.getStoredUserId();

    expect(id).toBe('uid-42');
  });
});

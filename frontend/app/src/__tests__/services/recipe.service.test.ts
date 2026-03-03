jest.mock('../../database', () => ({ getDatabase: jest.fn(), closeDatabase: jest.fn() }));
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(),
}));
jest.mock('../../services/auth.service', () => ({
  authService: { getStoredUserId: jest.fn() },
}));

import { recipeService } from '../../services/recipe.service';
import { getDatabase } from '../../database';
import * as Crypto from 'expo-crypto';
import { authService } from '../../services/auth.service';

const mockDb = {
  runAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

const mockRow = {
  id: 'r-1',
  user_id: 'u-1',
  category_id: 'cat-1',
  name: 'Lasanha',
  preparation_time_minutes: 60,
  servings: 4,
  preparation_method: 'Camada a camada.',
  ingredients: 'Massa, molho, queijo',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  (getDatabase as jest.Mock).mockResolvedValue(mockDb);
  (authService.getStoredUserId as jest.Mock).mockResolvedValue('u-1');
  (Crypto.randomUUID as jest.Mock).mockReturnValue('new-uuid');
  mockDb.runAsync.mockResolvedValue({ changes: 1 });
});

describe('getAll', () => {
  it('returns paginated recipes for the current user', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ count: 1 });
    mockDb.getAllAsync.mockResolvedValueOnce([mockRow]);

    const result = await recipeService.getAll({ page: 1, limit: 5 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toMatchObject({
      id: 'r-1',
      name: 'Lasanha',
      userId: 'u-1',
      preparationTimeMinutes: 60,
    });
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('filters by name using LIKE', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ count: 0 });
    mockDb.getAllAsync.mockResolvedValueOnce([]);

    await recipeService.getAll({ name: 'bolo' });

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining('LIKE'),
      expect.arrayContaining(['u-1', '%bolo%']),
    );
  });

  it('calculates correct totalPages', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ count: 11 });
    mockDb.getAllAsync.mockResolvedValueOnce([]);

    const result = await recipeService.getAll({ page: 1, limit: 5 });

    expect(result.totalPages).toBe(3);
  });

  it('throws when user is not authenticated', async () => {
    (authService.getStoredUserId as jest.Mock).mockResolvedValueOnce(null);

    await expect(recipeService.getAll()).rejects.toThrow('Não autenticado.');
  });
});

describe('getById', () => {
  it('returns mapped recipe', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(mockRow);

    const recipe = await recipeService.getById('r-1');

    expect(recipe.id).toBe('r-1');
    expect(recipe.name).toBe('Lasanha');
    expect(recipe.categoryId).toBe('cat-1');
  });

  it('throws when recipe is not found', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    await expect(recipeService.getById('ghost')).rejects.toThrow('Receita não encontrada.');
  });
});

describe('create', () => {
  it('inserts recipe and returns it', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ ...mockRow, id: 'new-uuid' });

    const recipe = await recipeService.create({
      name: 'Lasanha',
      preparationMethod: 'Camada a camada.',
      categoryId: 'cat-1',
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO recipes'),
      expect.arrayContaining(['new-uuid', 'u-1', 'cat-1']),
    );
    expect(recipe.id).toBe('new-uuid');
  });

  it('throws when user is not authenticated', async () => {
    (authService.getStoredUserId as jest.Mock).mockResolvedValueOnce(null);

    await expect(recipeService.create({ preparationMethod: 'Camada a camada.' })).rejects.toThrow(
      'Não autenticado.',
    );
  });
});

describe('update', () => {
  it('patches recipe fields and returns updated recipe', async () => {
    const updated = { ...mockRow, name: 'Lasanha Vegana' };
    mockDb.getFirstAsync.mockResolvedValueOnce(updated);

    const recipe = await recipeService.update('r-1', { name: 'Lasanha Vegana' });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE recipes SET'),
      expect.arrayContaining(['Lasanha Vegana', 'r-1']),
    );
    expect(recipe.name).toBe('Lasanha Vegana');
  });
});

describe('remove', () => {
  it('deletes recipe by id', async () => {
    await recipeService.remove('r-1');

    expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM recipes WHERE id = ?', ['r-1']);
  });
});

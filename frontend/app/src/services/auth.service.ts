import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { getDatabase } from '../database';
import { RECIPES_SEED } from '../constants/recipesSeed';
import type { AuthUser } from '../types';

const SESSION_KEY = 'culinary_user_id';

interface UserRow {
  id: string;
  login: string;
  password: string;
  name: string | null;
}

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export const authService = {
  async register(login: string, password: string, name?: string): Promise<AuthUser> {
    const db = await getDatabase();

    const existing = await db.getFirstAsync<UserRow>('SELECT id FROM users WHERE login = ?', [
      login,
    ]);
    if (existing) throw new Error('Este login já está em uso.');

    const hashedPassword = await hashPassword(password);
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      'INSERT INTO users (id, login, password, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, login, hashedPassword, name ?? null, now, now],
    );

    await db.withTransactionAsync(async () => {
      for (const recipe of RECIPES_SEED) {
        const recipeId = Crypto.randomUUID();
        await db.runAsync(
          `INSERT INTO recipes
            (id, user_id, category_id, name, preparation_time_minutes, servings,
             preparation_method, ingredients, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            recipeId,
            id,
            recipe.categoryId ?? null,
            recipe.name ?? null,
            recipe.preparationTimeMinutes ?? null,
            recipe.servings ?? null,
            recipe.preparationMethod,
            recipe.ingredients ?? null,
            now,
            now,
          ],
        );
      }
    });

    return { id, login, name: name ?? null };
  },

  async login(login: string, password: string): Promise<AuthUser> {
    const db = await getDatabase();

    const user = await db.getFirstAsync<UserRow>(
      'SELECT id, login, name, password FROM users WHERE login = ?',
      [login],
    );
    if (!user) throw new Error('Login ou senha inválidos.');

    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) throw new Error('Login ou senha inválidos.');

    await SecureStore.setItemAsync(SESSION_KEY, user.id);
    return { id: user.id, login: user.login, name: user.name };
  },

  async me(): Promise<AuthUser> {
    const userId = await SecureStore.getItemAsync(SESSION_KEY);
    if (!userId) throw new Error('Não autenticado.');

    const db = await getDatabase();
    const user = await db.getFirstAsync<UserRow>('SELECT id, login, name FROM users WHERE id = ?', [
      userId,
    ]);
    if (!user) throw new Error('Usuário não encontrado.');

    return { id: user.id, login: user.login, name: user.name };
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },

  async getStoredUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(SESSION_KEY);
  },
};

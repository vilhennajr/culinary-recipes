import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database';
import { authService } from './auth.service';
import type {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
  PaginatedResponse,
  SearchRecipesParams,
} from '../types';

interface RecipeRow {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string | null;
  preparation_time_minutes: number | null;
  servings: number | null;
  preparation_method: string;
  ingredients: string | null;
  created_at: string;
  updated_at: string;
}

function mapToRecipe(r: RecipeRow): Recipe {
  return {
    id: r.id,
    userId: r.user_id,
    categoryId: r.category_id,
    name: r.name,
    preparationTimeMinutes: r.preparation_time_minutes,
    servings: r.servings,
    preparationMethod: r.preparation_method,
    ingredients: r.ingredients,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function fetchRecipeById(id: string): Promise<Recipe> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<RecipeRow>('SELECT * FROM recipes WHERE id = ?', [id]);
  if (!row) throw new Error('Receita não encontrada.');
  return mapToRecipe(row);
}

export const recipeService = {
  async getAll(params?: SearchRecipesParams): Promise<PaginatedResponse<Recipe>> {
    const userId = await authService.getStoredUserId();
    if (!userId) throw new Error('Não autenticado.');

    const db = await getDatabase();
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const offset = (page - 1) * limit;

    const sortCol = params?.sortBy === 'name' ? 'name' : 'created_at';
    const sortDir = params?.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const baseWhere = params?.name ? 'WHERE user_id = ? AND name LIKE ?' : 'WHERE user_id = ?';
    const baseArgs: (string | number)[] = params?.name ? [userId, `%${params.name}%`] : [userId];

    const countRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM recipes ${baseWhere}`,
      baseArgs,
    );
    const total = countRow?.count ?? 0;

    const rows = await db.getAllAsync<RecipeRow>(
      `SELECT * FROM recipes ${baseWhere} ORDER BY ${sortCol} ${sortDir} LIMIT ? OFFSET ?`,
      [...baseArgs, limit, offset],
    );

    return {
      data: rows.map(mapToRecipe),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  async getById(id: string): Promise<Recipe> {
    return fetchRecipeById(id);
  },

  async create(payload: CreateRecipePayload): Promise<Recipe> {
    const userId = await authService.getStoredUserId();
    if (!userId) throw new Error('Não autenticado.');

    const db = await getDatabase();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO recipes
        (id, user_id, category_id, name, preparation_time_minutes, servings,
         preparation_method, ingredients, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        payload.categoryId ?? null,
        payload.name ?? null,
        payload.preparationTimeMinutes ?? null,
        payload.servings ?? null,
        payload.preparationMethod,
        payload.ingredients ?? null,
        now,
        now,
      ],
    );

    return fetchRecipeById(id);
  },

  async update(id: string, payload: UpdateRecipePayload): Promise<Recipe> {
    const db = await getDatabase();
    const now = new Date().toISOString();

    const fields: string[] = ['updated_at = ?'];
    const args: (string | number | null)[] = [now];

    if (payload.name !== undefined) {
      fields.push('name = ?');
      args.push(payload.name ?? null);
    }
    if (payload.categoryId !== undefined) {
      fields.push('category_id = ?');
      args.push(payload.categoryId ?? null);
    }
    if (payload.preparationTimeMinutes !== undefined) {
      fields.push('preparation_time_minutes = ?');
      args.push(payload.preparationTimeMinutes ?? null);
    }
    if (payload.servings !== undefined) {
      fields.push('servings = ?');
      args.push(payload.servings ?? null);
    }
    if (payload.preparationMethod !== undefined) {
      fields.push('preparation_method = ?');
      args.push(payload.preparationMethod);
    }
    if (payload.ingredients !== undefined) {
      fields.push('ingredients = ?');
      args.push(payload.ingredients ?? null);
    }

    args.push(id);
    await db.runAsync(`UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`, args);

    return fetchRecipeById(id);
  },

  async remove(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
  },
};

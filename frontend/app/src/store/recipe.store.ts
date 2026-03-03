import { create } from 'zustand';
import { recipeService } from '../services/recipe.service';
import type {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
  SearchRecipesParams,
} from '../types';
import { getErrorMessage } from '../utils/errors';

const devSleep = (ms: number): Promise<void> =>
  __DEV__ ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  isFetchingMore: boolean;
  isSaving: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;

  fetchRecipes: (params?: SearchRecipesParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (payload: CreateRecipePayload) => Promise<Recipe | null>;
  update: (id: string, payload: UpdateRecipePayload) => Promise<Recipe | null>;
  remove: (id: string) => Promise<void>;
  clearCurrent: () => void;
  clearError: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  currentRecipe: null,
  isLoading: false,
  isFetchingMore: false,
  isSaving: false,
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,

  fetchRecipes: async (params) => {
    set({ isLoading: true, error: null, page: 1 });
    try {
      const [result] = await Promise.all([
        recipeService.getAll({ ...params, page: 1, limit: 5 }),
        devSleep(1200),
      ]);
      set({
        recipes: result.data,
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
        isLoading: false,
      });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchNextPage: async () => {
    const { page, totalPages, isLoading, isFetchingMore } = get();
    if (isLoading || isFetchingMore || page >= totalPages) return;
    const nextPage = page + 1;
    set({ isFetchingMore: true });
    try {
      const [result] = await Promise.all([
        recipeService.getAll({ page: nextPage, limit: 5 }),
        devSleep(800),
      ]);
      set((state) => {
        const existingIds = new Set(state.recipes.map((r) => r.id));
        const newItems = result.data.filter((r) => !existingIds.has(r.id));
        return {
          recipes: [...state.recipes, ...newItems],
          page: result.page,
          totalPages: result.totalPages,
          isFetchingMore: false,
        };
      });
    } catch (err) {
      set({ error: getErrorMessage(err), isFetchingMore: false });
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null, currentRecipe: null });
    try {
      const recipe = await recipeService.getById(id);
      set({ currentRecipe: recipe, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  create: async (payload) => {
    set({ isSaving: true, error: null });
    try {
      const recipe = await recipeService.create(payload);
      set((s) => ({ recipes: [recipe, ...s.recipes], isSaving: false }));
      return recipe;
    } catch (err) {
      set({ error: getErrorMessage(err), isSaving: false });
      return null;
    }
  },

  update: async (id, payload) => {
    set({ isSaving: true, error: null });
    try {
      const recipe = await recipeService.update(id, payload);
      set((s) => ({
        recipes: s.recipes.map((r) => (r.id === id ? recipe : r)),
        currentRecipe: recipe,
        isSaving: false,
      }));
      return recipe;
    } catch (err) {
      set({ error: getErrorMessage(err), isSaving: false });
      return null;
    }
  },

  remove: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await recipeService.remove(id);
      set((s) => ({
        recipes: s.recipes.filter((r) => r.id !== id),
        isSaving: false,
      }));
    } catch (err) {
      set({ error: getErrorMessage(err), isSaving: false });
    }
  },

  clearCurrent: () => set({ currentRecipe: null }),
  clearError: () => set({ error: null }),
}));

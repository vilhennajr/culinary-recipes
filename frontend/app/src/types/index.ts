export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  login: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: string;
  name: string | null;
  login: string;
}

export interface Recipe {
  id: string;
  userId: string;
  categoryId: string | null;
  name: string | null;
  preparationTimeMinutes: number | null;
  servings: number | null;
  preparationMethod: string;
  ingredients: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipePayload {
  name?: string;
  categoryId?: string | null;
  preparationTimeMinutes?: number;
  servings?: number;
  preparationMethod: string;
  ingredients?: string;
}

export interface UpdateRecipePayload {
  name?: string;
  categoryId?: string | null;
  preparationTimeMinutes?: number;
  servings?: number;
  preparationMethod?: string;
  ingredients?: string;
}

export interface SearchRecipesParams {
  page?: number;
  limit?: number;
  name?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { id: string };
  RecipeCreate: undefined;
  RecipeEdit: { id: string };
};

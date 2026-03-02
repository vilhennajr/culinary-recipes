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

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface User {
  id: string;
  name: string | null;
  login: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  name?: string | null;
  password?: string;
}

export interface SearchUsersParams extends PaginationParams {
  name?: string;
  login?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}

export interface SearchCategoriesParams extends PaginationParams {
  name?: string;
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
  categoryId?: string;
  preparationTimeMinutes?: number;
  servings?: number;
  preparationMethod: string;
  ingredients?: string;
}

export interface UpdateRecipePayload {
  name?: string;
  categoryId?: string;
  preparationTimeMinutes?: number;
  servings?: number;
  preparationMethod?: string;
  ingredients?: string;
}

export interface SearchRecipesParams extends PaginationParams {
  name?: string;
  categoryId?: string;
  minPreparationTime?: number;
  maxPreparationTime?: number;
  minServings?: number;
  maxServings?: number;
}

/**
 * Raw shape returned by the backend paginated endpoints before being normalised
 * into the flat `PaginatedResponse<T>` used throughout the app.
 */
export type ApiPagedResponse<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

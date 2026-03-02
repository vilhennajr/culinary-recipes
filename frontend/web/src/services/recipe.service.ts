import api from "./api";
import type {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
  PaginatedResponse,
  SearchRecipesParams,
  ApiPagedResponse,
} from "@/types";

export const recipeService = {
  async getAll(params?: SearchRecipesParams): Promise<PaginatedResponse<Recipe>> {
    const { data } = await api.get<ApiPagedResponse<Recipe>>("/recipes", { params });
    return {
      data: data.data,
      page: data.meta.page,
      limit: data.meta.limit,
      total: data.meta.total,
      totalPages: data.meta.totalPages,
    };
  },

  async getById(id: string): Promise<Recipe> {
    const { data } = await api.get<Recipe>(`/recipes/${id}`);
    return data;
  },

  async create(payload: CreateRecipePayload): Promise<Recipe> {
    const { data } = await api.post<Recipe>("/recipes", payload);
    return data;
  },

  async update(id: string, payload: UpdateRecipePayload): Promise<Recipe> {
    const { data } = await api.put<Recipe>(`/recipes/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },
};

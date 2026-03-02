import api from "./api";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  PaginatedResponse,
  SearchCategoriesParams,
  ApiPagedResponse,
} from "@/types";

export const categoryService = {
  async getAll(params?: SearchCategoriesParams): Promise<PaginatedResponse<Category>> {
    const { data } = await api.get<ApiPagedResponse<Category>>("/categories", { params });
    return {
      data: data.data,
      page: data.meta.page,
      limit: data.meta.limit,
      total: data.meta.total,
      totalPages: data.meta.totalPages,
    };
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const { data } = await api.put<Category>(`/categories/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

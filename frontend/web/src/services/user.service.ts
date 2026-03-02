import api from "./api";
import type {
  User,
  UpdateUserPayload,
  PaginatedResponse,
  SearchUsersParams,
  ApiPagedResponse,
} from "@/types";

export const userService = {
  async getAll(params?: SearchUsersParams): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<ApiPagedResponse<User>>("/users", { params });
    return {
      data: data.data,
      page: data.meta.page,
      limit: data.meta.limit,
      total: data.meta.total,
      totalPages: data.meta.totalPages,
    };
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

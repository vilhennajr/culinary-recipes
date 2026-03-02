import api from "./api";
import type { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post<User>("/auth/register", payload);
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};

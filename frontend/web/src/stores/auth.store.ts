import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService } from "@/services/auth.service";
import { extractApiError } from "@/utils/error";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem("authUser") ?? "null"));
  const token = ref<string | null>(localStorage.getItem("accessToken"));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(accessToken: string, authUser: AuthUser) {
    token.value = accessToken;
    user.value = authUser;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("authUser", JSON.stringify(authUser));
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
  }

  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const resp = await authService.login(payload);
      setAuth(resp.accessToken, resp.user);
    } catch (err: unknown) {
      error.value = extractApiError(err, "Credenciais inválidas");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true;
    error.value = null;
    try {
      await authService.register(payload);
    } catch (err: unknown) {
      error.value = extractApiError(err, "Erro ao registrar");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
});

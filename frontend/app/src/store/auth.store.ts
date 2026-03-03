import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types';
import { getErrorMessage } from '../utils/errors';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    try {
      const user = await authService.me();
      set({ user, isInitializing: false });
    } catch {
      set({ user: null, isInitializing: false });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(payload.login, payload.password);
      set({ user, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(payload.login, payload.password, payload.name);
      set({ isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout().catch(() => undefined);
    set({ user: null, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));

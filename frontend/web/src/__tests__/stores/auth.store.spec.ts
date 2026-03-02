import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth.store";

vi.mock("@/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authService } from "@/services/auth.service";

const mockUser = { id: "1", name: "Test User", login: "testuser", role: "user" as const };
const mockToken = "fake-jwt-token";

const makeLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

const localStorageMock = makeLocalStorageMock();
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

describe("auth.store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("isAuthenticated is false when no token is stored", () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it("isAuthenticated is true when token exists in localStorage", () => {
    localStorage.setItem("accessToken", mockToken);
    localStorage.setItem("authUser", JSON.stringify(mockUser));
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(true);
  });

  it("loading starts as false", () => {
    const store = useAuthStore();
    expect(store.loading).toBe(false);
  });

  it("login — calls authService.login with the payload", async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: mockToken,
      user: mockUser,
    });
    const store = useAuthStore();
    await store.login({ login: "testuser", password: "123456" });
    expect(authService.login).toHaveBeenCalledWith({ login: "testuser", password: "123456" });
  });

  it("login — sets token and user after success", async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: mockToken,
      user: mockUser,
    });
    const store = useAuthStore();
    await store.login({ login: "testuser", password: "123456" });
    expect(store.token).toBe(mockToken);
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
  });

  it("login — persists token to localStorage", async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: mockToken,
      user: mockUser,
    });
    const store = useAuthStore();
    await store.login({ login: "testuser", password: "123456" });
    expect(localStorage.getItem("accessToken")).toBe(mockToken);
  });

  it("login — sets error and rethrows on failure", async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(new Error("Unauthorized"));
    const store = useAuthStore();
    await expect(store.login({ login: "bad", password: "bad" })).rejects.toThrow();
    expect(store.error).not.toBeNull();
  });

  it("login — resets loading to false after success", async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: mockToken,
      user: mockUser,
    });
    const store = useAuthStore();
    await store.login({ login: "testuser", password: "123456" });
    expect(store.loading).toBe(false);
  });

  it("login — resets loading to false after failure", async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(new Error("Unauthorized"));
    const store = useAuthStore();
    try {
      await store.login({ login: "bad", password: "bad" });
    } catch {
      /* expected */
    }
    expect(store.loading).toBe(false);
  });

  it("register — calls authService.register with the payload", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce(undefined);
    const store = useAuthStore();
    await store.register({ name: "New User", login: "newuser", password: "123456" });
    expect(authService.register).toHaveBeenCalledWith({
      name: "New User",
      login: "newuser",
      password: "123456",
    });
  });

  it("register — sets error and rethrows on failure", async () => {
    vi.mocked(authService.register).mockRejectedValueOnce(new Error("Conflict"));
    const store = useAuthStore();
    await expect(store.register({ name: "X", login: "x", password: "x" })).rejects.toThrow();
    expect(store.error).not.toBeNull();
  });

  it("logout — calls clearAuth and removes localStorage entries", async () => {
    vi.mocked(authService.logout).mockResolvedValueOnce(undefined);
    localStorage.setItem("accessToken", mockToken);
    localStorage.setItem("authUser", JSON.stringify(mockUser));
    const store = useAuthStore();
    await store.logout();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("logout — clears auth even if authService.logout throws", async () => {
    vi.mocked(authService.logout).mockRejectedValueOnce(new Error("Network"));
    localStorage.setItem("accessToken", mockToken);
    const store = useAuthStore();
    try {
      await store.logout();
    } catch {
      /* expected — try/finally re-throws after clearAuth() */
    }
    expect(store.token).toBeNull();
  });
});

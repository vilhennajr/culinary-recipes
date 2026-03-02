import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "@/stores/user.store";

vi.mock("@/services/user.service", () => ({
  userService: {
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { userService } from "@/services/user.service";

const makeUser = (id: string, name = "Usuário") => ({
  id,
  name,
  login: `user${id}`,
  role: "user" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const makePaginatedResponse = (data: ReturnType<typeof makeUser>[]) => ({
  data,
  total: data.length,
  page: 1,
  totalPages: 1,
  limit: 10,
});

describe("user.store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("items is empty initially", () => {
    const store = useUserStore();
    expect(store.items).toEqual([]);
  });

  it("loading is false initially", () => {
    const store = useUserStore();
    expect(store.loading).toBe(false);
  });

  it("fetchAll — calls userService.getAll", async () => {
    vi.mocked(userService.getAll).mockResolvedValueOnce(makePaginatedResponse([]));
    const store = useUserStore();
    await store.fetchAll();
    expect(userService.getAll).toHaveBeenCalledOnce();
  });

  it("fetchAll — sets items from response", async () => {
    const users = [makeUser("1", "Ana"), makeUser("2", "Bruno")];
    vi.mocked(userService.getAll).mockResolvedValueOnce(makePaginatedResponse(users));
    const store = useUserStore();
    await store.fetchAll();
    expect(store.items).toEqual(users);
  });

  it("fetchAll — sets total, page and totalPages", async () => {
    vi.mocked(userService.getAll).mockResolvedValueOnce({
      data: [],
      total: 30,
      page: 3,
      totalPages: 3,
      limit: 10,
    });
    const store = useUserStore();
    await store.fetchAll();
    expect(store.total).toBe(30);
    expect(store.page).toBe(3);
    expect(store.totalPages).toBe(3);
  });

  it("fetchAll — sets error on failure", async () => {
    vi.mocked(userService.getAll).mockRejectedValueOnce(new Error());
    const store = useUserStore();
    await store.fetchAll();
    expect(store.error).toBe("Erro ao carregar usuários");
  });

  it("fetchAll — resets loading to false after success", async () => {
    vi.mocked(userService.getAll).mockResolvedValueOnce(makePaginatedResponse([]));
    const store = useUserStore();
    await store.fetchAll();
    expect(store.loading).toBe(false);
  });

  it("fetchAll — resets loading to false after failure", async () => {
    vi.mocked(userService.getAll).mockRejectedValueOnce(new Error());
    const store = useUserStore();
    await store.fetchAll();
    expect(store.loading).toBe(false);
  });

  it("update — calls userService.update and replaces item in list", async () => {
    const original = makeUser("1", "Original");
    const updated = { ...original, name: "Atualizado" };
    vi.mocked(userService.update).mockResolvedValueOnce(updated);
    const store = useUserStore();
    store.items = [original];
    await store.update("1", { name: "Atualizado" });
    expect(store.items[0].name).toBe("Atualizado");
  });

  it("update — returns the updated user", async () => {
    const original = makeUser("1");
    const updated = { ...original, name: "Novo" };
    vi.mocked(userService.update).mockResolvedValueOnce(updated);
    const store = useUserStore();
    store.items = [original];
    const result = await store.update("1", { name: "Novo" });
    expect(result).toEqual(updated);
  });

  it("update — does not crash when item is not found in list", async () => {
    const user = makeUser("99");
    vi.mocked(userService.update).mockResolvedValueOnce(user);
    const store = useUserStore();
    store.items = [];
    await expect(store.update("99", { name: "x" })).resolves.toEqual(user);
  });

  it("remove — calls userService.remove and removes item from list", async () => {
    vi.mocked(userService.remove).mockResolvedValueOnce(undefined);
    const store = useUserStore();
    store.items = [makeUser("1"), makeUser("2")];
    store.total = 2;
    await store.remove("1");
    expect(store.items.find((u) => u.id === "1")).toBeUndefined();
    expect(store.total).toBe(1);
  });

  it("remove — only removes the targeted user", async () => {
    vi.mocked(userService.remove).mockResolvedValueOnce(undefined);
    const store = useUserStore();
    store.items = [makeUser("1"), makeUser("2")];
    store.total = 2;
    await store.remove("1");
    expect(store.items).toHaveLength(1);
    expect(store.items[0].id).toBe("2");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRecipeStore } from "@/stores/recipe.store";

vi.mock("@/services/recipe.service", () => ({
  recipeService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { recipeService } from "@/services/recipe.service";

const makeRecipe = (id: string, name = "Receita") => ({
  id,
  name,
  categoryId: null,
  preparationMethod: "Modo de preparo",
  preparationTimeMinutes: null,
  servings: null,
  ingredients: null,
  userId: "u1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const makePaginatedResponse = (data: ReturnType<typeof makeRecipe>[]) => ({
  data,
  total: data.length,
  page: 1,
  totalPages: 1,
  limit: 10,
});

describe("recipe.store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("items is empty initially", () => {
    const store = useRecipeStore();
    expect(store.items).toEqual([]);
  });

  it("loading is false initially", () => {
    const store = useRecipeStore();
    expect(store.loading).toBe(false);
  });

  it("fetchAll — calls recipeService.getAll", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce(makePaginatedResponse([]));
    const store = useRecipeStore();
    await store.fetchAll();
    expect(recipeService.getAll).toHaveBeenCalledOnce();
  });

  it("fetchAll — sets items from response", async () => {
    const recipes = [makeRecipe("1", "Bolo"), makeRecipe("2", "Sopa")];
    vi.mocked(recipeService.getAll).mockResolvedValueOnce(makePaginatedResponse(recipes));
    const store = useRecipeStore();
    await store.fetchAll();
    expect(store.items).toEqual(recipes);
  });

  it("fetchAll — sets total, page and totalPages from response", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce({
      data: [],
      total: 50,
      page: 2,
      totalPages: 5,
      limit: 10,
    });
    const store = useRecipeStore();
    await store.fetchAll();
    expect(store.total).toBe(50);
    expect(store.page).toBe(2);
    expect(store.totalPages).toBe(5);
  });

  it("fetchAll — sets error on failure", async () => {
    vi.mocked(recipeService.getAll).mockRejectedValueOnce(new Error("Network error"));
    const store = useRecipeStore();
    await store.fetchAll();
    expect(store.error).toBe("Erro ao carregar receitas");
  });

  it("fetchAll — resets loading to false after success", async () => {
    vi.mocked(recipeService.getAll).mockResolvedValueOnce(makePaginatedResponse([]));
    const store = useRecipeStore();
    await store.fetchAll();
    expect(store.loading).toBe(false);
  });

  it("fetchAll — resets loading to false after failure", async () => {
    vi.mocked(recipeService.getAll).mockRejectedValueOnce(new Error());
    const store = useRecipeStore();
    await store.fetchAll();
    expect(store.loading).toBe(false);
  });

  it("create — calls recipeService.create and adds item at the start", async () => {
    const existing = makeRecipe("1", "Antiga");
    const newRecipe = makeRecipe("2", "Nova");
    vi.mocked(recipeService.create).mockResolvedValueOnce(newRecipe);
    const store = useRecipeStore();
    store.items = [existing];
    store.total = 1;
    await store.create({ preparationMethod: "Modo", name: "Nova" });
    expect(store.items[0]).toEqual(newRecipe);
    expect(store.items[1]).toEqual(existing);
    expect(store.total).toBe(2);
  });

  it("update — calls recipeService.update and replaces item in list", async () => {
    const original = makeRecipe("1", "Original");
    const updated = { ...original, name: "Atualizada" };
    vi.mocked(recipeService.update).mockResolvedValueOnce(updated);
    const store = useRecipeStore();
    store.items = [original];
    await store.update("1", { name: "Atualizada" });
    expect(store.items[0].name).toBe("Atualizada");
  });

  it("update — returns the updated recipe", async () => {
    const original = makeRecipe("1");
    const updated = { ...original, name: "Novo nome" };
    vi.mocked(recipeService.update).mockResolvedValueOnce(updated);
    const store = useRecipeStore();
    store.items = [original];
    const result = await store.update("1", { name: "Novo nome" });
    expect(result).toEqual(updated);
  });

  it("remove — calls recipeService.remove and removes item from list", async () => {
    vi.mocked(recipeService.remove).mockResolvedValueOnce(undefined);
    const store = useRecipeStore();
    store.items = [makeRecipe("1"), makeRecipe("2")];
    store.total = 2;
    await store.remove("1");
    expect(store.items.find((r) => r.id === "1")).toBeUndefined();
    expect(store.total).toBe(1);
  });
});

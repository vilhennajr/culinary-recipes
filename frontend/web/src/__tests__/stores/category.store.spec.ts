import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCategoryStore } from "@/stores/category.store";

vi.mock("@/services/category.service", () => ({
  categoryService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { categoryService } from "@/services/category.service";

const makeCategory = (id: string, name = "Categoria") => ({
  id,
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const makePaginatedResponse = (data: ReturnType<typeof makeCategory>[]) => ({
  data,
  total: data.length,
  page: 1,
  totalPages: 1,
  limit: 10,
});

describe("category.store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("items is empty initially", () => {
    const store = useCategoryStore();
    expect(store.items).toEqual([]);
  });

  it("allCategories is empty initially", () => {
    const store = useCategoryStore();
    expect(store.allCategories).toEqual([]);
  });

  it("fetchAll — sets items from response", async () => {
    const cats = [makeCategory("1", "Italiana"), makeCategory("2", "Brasileira")];
    vi.mocked(categoryService.getAll).mockResolvedValueOnce(makePaginatedResponse(cats));
    const store = useCategoryStore();
    await store.fetchAll();
    expect(store.items).toEqual(cats);
  });

  it("fetchAll — sets error on failure", async () => {
    vi.mocked(categoryService.getAll).mockRejectedValueOnce(new Error());
    const store = useCategoryStore();
    await store.fetchAll();
    expect(store.error).toBe("Erro ao carregar categorias");
  });

  it("fetchAll — resets loading to false after success", async () => {
    vi.mocked(categoryService.getAll).mockResolvedValueOnce(makePaginatedResponse([]));
    const store = useCategoryStore();
    await store.fetchAll();
    expect(store.loading).toBe(false);
  });

  it("fetchOptions — calls getAll with limit:500", async () => {
    vi.mocked(categoryService.getAll).mockResolvedValueOnce(makePaginatedResponse([]));
    const store = useCategoryStore();
    await store.fetchOptions();
    expect(categoryService.getAll).toHaveBeenCalledWith({
      limit: 500,
      sortBy: "name",
      sortOrder: "asc",
    });
  });

  it("fetchOptions — populates allCategories", async () => {
    const cats = [makeCategory("1", "Vegana")];
    vi.mocked(categoryService.getAll).mockResolvedValueOnce(makePaginatedResponse(cats));
    const store = useCategoryStore();
    await store.fetchOptions();
    expect(store.allCategories).toEqual(cats);
  });

  it("fetchOptions — does not re-fetch if allCategories already populated", async () => {
    vi.mocked(categoryService.getAll).mockResolvedValue(makePaginatedResponse([]));
    const store = useCategoryStore();
    store.allCategories = [makeCategory("1")];
    await store.fetchOptions();
    expect(categoryService.getAll).not.toHaveBeenCalled();
  });

  it("create — adds new category at the start of items and increments total", async () => {
    const existing = makeCategory("1", "Existente");
    const newCat = makeCategory("2", "Nova");
    vi.mocked(categoryService.create).mockResolvedValueOnce(newCat);
    const store = useCategoryStore();
    store.items = [existing];
    store.total = 1;
    await store.create({ name: "Nova" });
    expect(store.items[0]).toEqual(newCat);
    expect(store.total).toBe(2);
  });

  it("create — invalidates allCategories cache", async () => {
    vi.mocked(categoryService.create).mockResolvedValueOnce(makeCategory("x"));
    const store = useCategoryStore();
    store.allCategories = [makeCategory("1")];
    await store.create({ name: "Nova" });
    expect(store.allCategories).toEqual([]);
  });

  it("update — replaces item in list", async () => {
    const original = makeCategory("1", "Original");
    const updated = { ...original, name: "Atualizada" };
    vi.mocked(categoryService.update).mockResolvedValueOnce(updated);
    const store = useCategoryStore();
    store.items = [original];
    await store.update("1", { name: "Atualizada" });
    expect(store.items[0].name).toBe("Atualizada");
  });

  it("update — invalidates allCategories cache", async () => {
    const cat = makeCategory("1");
    vi.mocked(categoryService.update).mockResolvedValueOnce(cat);
    const store = useCategoryStore();
    store.items = [cat];
    store.allCategories = [cat];
    await store.update("1", { name: "x" });
    expect(store.allCategories).toEqual([]);
  });

  it("remove — removes category from items and decrements total", async () => {
    vi.mocked(categoryService.remove).mockResolvedValueOnce(undefined);
    const store = useCategoryStore();
    store.items = [makeCategory("1"), makeCategory("2")];
    store.total = 2;
    await store.remove("1");
    expect(store.items.find((c) => c.id === "1")).toBeUndefined();
    expect(store.total).toBe(1);
  });

  it("remove — invalidates allCategories cache", async () => {
    vi.mocked(categoryService.remove).mockResolvedValueOnce(undefined);
    const store = useCategoryStore();
    store.allCategories = [makeCategory("1")];
    store.items = [makeCategory("1")];
    await store.remove("1");
    expect(store.allCategories).toEqual([]);
  });
});

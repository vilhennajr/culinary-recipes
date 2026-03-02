import { defineStore } from "pinia";
import { ref } from "vue";
import { categoryService } from "@/services/category.service";
import { cleanParams } from "@/utils/params";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  SearchCategoriesParams,
} from "@/types";

export const useCategoryStore = defineStore("category", () => {
  const items = ref<Category[]>([]);
  const allCategories = ref<Category[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const _params = ref<SearchCategoriesParams>({
    page: 1,
    limit: 10,
    sortOrder: "asc",
    sortBy: "name",
  });

  async function fetchAll(overrides?: SearchCategoriesParams) {
    if (overrides) _params.value = { ..._params.value, ...overrides };
    loading.value = true;
    error.value = null;
    try {
      const resp = await categoryService.getAll(
        cleanParams(_params.value) as SearchCategoriesParams,
      );
      items.value = resp.data;
      total.value = resp.total;
      totalPages.value = resp.totalPages;
      page.value = resp.page;
    } catch {
      error.value = "Erro ao carregar categorias";
    } finally {
      loading.value = false;
    }
  }

  async function fetchOptions() {
    if (allCategories.value.length > 0) return;
    try {
      const resp = await categoryService.getAll({
        limit: 500,
        sortBy: "name",
        sortOrder: "asc",
      });
      allCategories.value = resp.data;
    } catch {
      /* noop */
    }
  }

  function _invalidateOptionsCache() {
    allCategories.value = [];
  }

  async function create(payload: CreateCategoryPayload) {
    const category = await categoryService.create(payload);
    items.value.unshift(category);
    total.value++;
    _invalidateOptionsCache();
    return category;
  }

  async function update(id: string, payload: UpdateCategoryPayload) {
    const updated = await categoryService.update(id, payload);
    const idx = items.value.findIndex((c) => c.id === id);
    if (idx !== -1) items.value[idx] = updated;
    _invalidateOptionsCache();
    return updated;
  }

  async function remove(id: string) {
    await categoryService.remove(id);
    items.value = items.value.filter((c) => c.id !== id);
    total.value--;
    _invalidateOptionsCache();
  }

  return {
    items,
    allCategories,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    fetchAll,
    fetchOptions,
    create,
    update,
    remove,
  };
});

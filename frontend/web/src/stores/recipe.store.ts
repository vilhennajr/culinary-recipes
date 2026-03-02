import { defineStore } from "pinia";
import { ref } from "vue";
import { recipeService } from "@/services/recipe.service";
import { cleanParams } from "@/utils/params";
import type {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
  SearchRecipesParams,
} from "@/types";

export const useRecipeStore = defineStore("recipe", () => {
  const items = ref<Recipe[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const _params = ref<SearchRecipesParams>({
    page: 1,
    limit: 10,
    sortOrder: "asc",
    sortBy: "name",
  });

  async function fetchAll(overrides?: SearchRecipesParams) {
    if (overrides) _params.value = { ..._params.value, ...overrides };
    loading.value = true;
    error.value = null;
    try {
      const resp = await recipeService.getAll(cleanParams(_params.value) as SearchRecipesParams);
      items.value = resp.data;
      total.value = resp.total;
      totalPages.value = resp.totalPages;
      page.value = resp.page;
    } catch {
      error.value = "Erro ao carregar receitas";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateRecipePayload) {
    const recipe = await recipeService.create(payload);
    items.value.unshift(recipe);
    total.value++;
    return recipe;
  }

  async function update(id: string, payload: UpdateRecipePayload) {
    const updated = await recipeService.update(id, payload);
    const idx = items.value.findIndex((r) => r.id === id);
    if (idx !== -1) items.value[idx] = updated;
    return updated;
  }

  async function remove(id: string) {
    await recipeService.remove(id);
    items.value = items.value.filter((r) => r.id !== id);
    total.value--;
  }

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
});

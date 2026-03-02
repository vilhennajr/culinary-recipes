import { defineStore } from "pinia";
import { ref } from "vue";
import { userService } from "@/services/user.service";
import { cleanParams } from "@/utils/params";
import type { User, UpdateUserPayload, SearchUsersParams } from "@/types";

export const useUserStore = defineStore("user", () => {
  const items = ref<User[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const _params = ref<SearchUsersParams>({
    page: 1,
    limit: 10,
    sortOrder: "asc",
  });

  async function fetchAll(overrides?: SearchUsersParams) {
    if (overrides) _params.value = { ..._params.value, ...overrides };
    loading.value = true;
    error.value = null;
    try {
      const resp = await userService.getAll(cleanParams(_params.value) as SearchUsersParams);
      items.value = resp.data;
      total.value = resp.total;
      totalPages.value = resp.totalPages;
      page.value = resp.page;
    } catch {
      error.value = "Erro ao carregar usuários";
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, payload: UpdateUserPayload) {
    const updated = await userService.update(id, payload);
    const idx = items.value.findIndex((u) => u.id === id);
    if (idx !== -1) items.value[idx] = updated;
    return updated;
  }

  async function remove(id: string) {
    await userService.remove(id);
    items.value = items.value.filter((u) => u.id !== id);
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
    update,
    remove,
  };
});

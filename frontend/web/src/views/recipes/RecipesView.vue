<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRecipeStore } from "@/stores/recipe.store";
import { useCategoryStore } from "@/stores/category.store";
import BaseTable from "@/components/organisms/BaseTable.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import BaseModal from "@/components/organisms/BaseModal.vue";
import BaseInput from "@/components/atoms/BaseInput.vue";
import BasePagination from "@/components/molecules/BasePagination.vue";
import BaseAlert from "@/components/atoms/BaseAlert.vue";
import { extractApiError } from "@/utils/error";
import { formatDate } from "@/utils/format";
import { useToast } from "@/composables/useToast";
import type { Recipe, CreateRecipePayload, UpdateRecipePayload } from "@/types";

const store = useRecipeStore();
const categoryStore = useCategoryStore();
const toast = useToast();

const columns = [
  { key: "name", label: "Nome" },
  { key: "category", label: "Categoria" },
  { key: "preparationTimeMinutes", label: "Tempo (min)" },
  { key: "servings", label: "Porções" },
  { key: "createdAt", label: "Criado em" },
  { key: "actions", label: "", class: "w-44 text-right" },
];

const showModal = ref(false);
const showDetailModal = ref(false);
const editingId = ref<string | null>(null);
const detailRecipe = ref<Recipe | null>(null);
const saving = ref(false);
const formError = ref<string | null>(null);
const deleteTarget = ref<Recipe | null>(null);
const deleting = ref(false);

const searchName = ref("");
const searchCategoryId = ref("");

type RecipeForm = {
  name: string;
  categoryId: string;
  preparationTimeMinutes: string;
  servings: string;
  preparationMethod: string;
  ingredients: string;
};

const form = reactive<RecipeForm>({
  name: "",
  categoryId: "",
  preparationTimeMinutes: "",
  servings: "",
  preparationMethod: "",
  ingredients: "",
});

onMounted(() => {
  store.fetchAll();
  categoryStore.fetchOptions();
});

function openCreate() {
  editingId.value = null;
  Object.assign(form, {
    name: "",
    categoryId: "",
    preparationTimeMinutes: "",
    servings: "",
    preparationMethod: "",
    ingredients: "",
  });
  formError.value = null;
  showModal.value = true;
}

function openEdit(recipe: Recipe) {
  editingId.value = recipe.id;
  Object.assign(form, {
    name: recipe.name ?? "",
    categoryId: recipe.categoryId ?? "",
    preparationTimeMinutes: recipe.preparationTimeMinutes?.toString() ?? "",
    servings: recipe.servings?.toString() ?? "",
    preparationMethod: recipe.preparationMethod,
    ingredients: recipe.ingredients ?? "",
  });
  formError.value = null;
  showModal.value = true;
}

function viewDetail(recipe: Recipe) {
  detailRecipe.value = recipe;
  showDetailModal.value = true;
}

function buildPayload(): CreateRecipePayload | UpdateRecipePayload {
  return {
    name: form.name || undefined,
    categoryId: form.categoryId || undefined,
    preparationTimeMinutes: form.preparationTimeMinutes
      ? Number(form.preparationTimeMinutes)
      : undefined,
    servings: form.servings ? Number(form.servings) : undefined,
    preparationMethod: form.preparationMethod,
    ingredients: form.ingredients || undefined,
  };
}

async function save() {
  if (!form.preparationMethod.trim()) {
    formError.value = "Modo de preparo é obrigatório";
    return;
  }
  saving.value = true;
  formError.value = null;
  try {
    if (editingId.value) {
      await store.update(editingId.value, buildPayload());
      toast.success("Receita atualizada com sucesso!");
    } else {
      await store.create(buildPayload() as CreateRecipePayload);
      toast.success("Receita criada com sucesso!");
    }
    showModal.value = false;
  } catch (err: unknown) {
    formError.value = extractApiError(err, "Erro ao salvar");
  } finally {
    saving.value = false;
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await store.remove(deleteTarget.value.id);
    toast.success("Receita excluída com sucesso!");
    deleteTarget.value = null;
  } catch {
    toast.error("Erro ao excluir receita");
    deleteTarget.value = null;
  } finally {
    deleting.value = false;
  }
}

function categoryName(id: string | null) {
  if (!id) return "—";
  return categoryStore.allCategories.find((c) => c.id === id)?.name ?? "—";
}

function search() {
  store.fetchAll({
    page: 1,
    name: searchName.value || undefined,
    categoryId: searchCategoryId.value || undefined,
  });
}

function onPageChange(p: number) {
  store.fetchAll({ page: p });
}

function printRecipe(recipe: Recipe) {
  const catName = categoryName(recipe.categoryId);
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>${recipe.name ?? "Receita"}</title>
      <style>
        body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; color: #111; }
        h1 { font-size: 1.8rem; margin-bottom: 4px; }
        .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; font-size: 0.9rem; color: #555; }
        .meta span { display: block; font-weight: 600; color: #111; font-size: 1rem; }
        section { margin-top: 20px; }
        section h2 { font-size: 1.1rem; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: 0.95rem; line-height: 1.6; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <h1>${recipe.name ?? "Receita"}</h1>
      <div class="meta">
        <div>Categoria<span>${catName}</span></div>
        <div>Porções<span>${recipe.servings ?? "—"}</span></div>
        <div>Tempo de preparo<span>${recipe.preparationTimeMinutes != null ? recipe.preparationTimeMinutes + " min" : "—"}</span></div>
        <div>Criado em<span>${formatDate(recipe.createdAt)}</span></div>
      </div>
      ${recipe.ingredients ? `<section><h2>Ingredientes</h2><pre>${recipe.ingredients}</pre></section>` : ""}
      <section><h2>Modo de Preparo</h2><pre>${recipe.preparationMethod}</pre></section>
    </body>
    </html>
  `;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap gap-3 items-start sm:items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Receitas</h2>
        <p class="text-gray-500 text-sm mt-0.5">Suas receitas culinárias</p>
      </div>
      <BaseButton @click="openCreate">+ Nova Receita</BaseButton>
    </div>

    <BaseAlert
      v-if="store.error"
      type="error"
      :message="store.error"
      dismissible
      @dismiss="store.error = null"
    />

    <form class="flex gap-3 items-end flex-wrap" @submit.prevent="search">
      <BaseInput
        v-model="searchName"
        label="Nome"
        placeholder="Buscar por nome"
        class="w-full sm:max-w-xs"
      />
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Categoria</label>
        <select
          v-model="searchCategoryId"
          class="block rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todas</option>
          <option v-for="cat in categoryStore.allCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <BaseButton type="submit" variant="secondary">Buscar</BaseButton>
      <BaseButton
        v-if="searchName || searchCategoryId"
        variant="ghost"
        @click="
          searchName = '';
          searchCategoryId = '';
          store.fetchAll({ page: 1 });
        "
        >Limpar</BaseButton
      >
    </form>

    <BaseTable :columns="columns" :rows="store.items" :loading="store.loading">
      <template #name="{ row }">
        <button
          class="text-primary-600 hover:underline text-left"
          @click="viewDetail(row as unknown as Recipe)"
        >
          {{ (row as unknown as Recipe).name ?? "—" }}
        </button>
      </template>
      <template #category="{ row }">
        {{ categoryName((row as unknown as Recipe).categoryId) }}
      </template>
      <template #preparationTimeMinutes="{ row }">
        {{
          (row as unknown as Recipe).preparationTimeMinutes != null
            ? `${(row as unknown as Recipe).preparationTimeMinutes} min`
            : "—"
        }}
      </template>
      <template #servings="{ row }">
        {{ (row as unknown as Recipe).servings ?? "—" }}
      </template>
      <template #createdAt="{ row }">
        {{ formatDate((row as unknown as Recipe).createdAt) }}
      </template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" size="sm" @click="printRecipe(row as unknown as Recipe)"
            >Imprimir</BaseButton
          >
          <BaseButton variant="ghost" size="sm" @click="openEdit(row as unknown as Recipe)"
            >Editar</BaseButton
          >
          <BaseButton variant="danger" size="sm" @click="deleteTarget = row as unknown as Recipe"
            >Excluir</BaseButton
          >
        </div>
      </template>
    </BaseTable>

    <BasePagination
      v-if="store.total > 0"
      :page="store.page"
      :total-pages="store.totalPages"
      :total="store.total"
      :limit="store.limit"
      @change="onPageChange"
    />
  </div>

  <BaseModal
    v-if="showModal"
    :title="editingId ? 'Editar Receita' : 'Nova Receita'"
    size="lg"
    @close="showModal = false"
  >
    <form class="space-y-4" @submit.prevent="save">
      <BaseAlert
        v-if="formError"
        type="error"
        :message="formError"
        dismissible
        @dismiss="formError = null"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput v-model="form.name" label="Nome" placeholder="Ex: Bolo de Chocolate" />

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Categoria</label>
          <select
            v-model="form.categoryId"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Nenhuma</option>
            <option v-for="cat in categoryStore.allCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <BaseInput
          v-model="form.preparationTimeMinutes"
          type="number"
          label="Tempo de Preparo (min)"
          placeholder="Ex: 45"
        />
        <BaseInput v-model="form.servings" type="number" label="Porções" placeholder="Ex: 8" />
      </div>

      <BaseInput
        v-model="form.ingredients"
        label="Ingredientes"
        placeholder="Ex: 2 xícaras de farinha, 3 ovos..."
        :rows="3"
      />
      <BaseInput
        v-model="form.preparationMethod"
        label="Modo de Preparo"
        placeholder="Descreva o passo a passo..."
        :rows="5"
        required
      />
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="showModal = false">Cancelar</BaseButton>
      <BaseButton :loading="saving" @click="save">Salvar</BaseButton>
    </template>
  </BaseModal>

  <BaseModal
    v-if="showDetailModal && detailRecipe"
    :title="detailRecipe.name ?? 'Receita'"
    size="lg"
    @close="showDetailModal = false"
  >
    <div class="space-y-4 text-sm text-gray-700">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span class="font-semibold text-gray-500 block">Categoria</span>
          {{ categoryName(detailRecipe.categoryId) }}
        </div>
        <div>
          <span class="font-semibold text-gray-500 block">Porções</span>
          {{ detailRecipe.servings ?? "—" }}
        </div>
        <div>
          <span class="font-semibold text-gray-500 block">Tempo de Preparo</span>
          {{
            detailRecipe.preparationTimeMinutes != null
              ? `${detailRecipe.preparationTimeMinutes} min`
              : "—"
          }}
        </div>
        <div>
          <span class="font-semibold text-gray-500 block">Criado em</span>
          {{ formatDate(detailRecipe.createdAt) }}
        </div>
      </div>
      <div v-if="detailRecipe.ingredients">
        <span class="font-semibold text-gray-700 block mb-1">Ingredientes</span>
        <p class="whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border">
          {{ detailRecipe.ingredients }}
        </p>
      </div>
      <div>
        <span class="font-semibold text-gray-700 block mb-1">Modo de Preparo</span>
        <p class="whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border">
          {{ detailRecipe.preparationMethod }}
        </p>
      </div>
    </div>
    <template #footer>
      <BaseButton variant="secondary" @click="showDetailModal = false">Fechar</BaseButton>
      <BaseButton variant="secondary" @click="printRecipe(detailRecipe!)">Imprimir</BaseButton>
      <BaseButton
        @click="
          openEdit(detailRecipe!);
          showDetailModal = false;
        "
        >Editar</BaseButton
      >
    </template>
  </BaseModal>

  <BaseModal v-if="deleteTarget" title="Confirmar Exclusão" size="sm" @close="deleteTarget = null">
    <p class="text-gray-700">
      Deseja excluir a receita
      <strong>{{ deleteTarget.name ?? "sem nome" }}</strong
      >?
    </p>
    <template #footer>
      <BaseButton variant="secondary" @click="deleteTarget = null">Cancelar</BaseButton>
      <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">Excluir</BaseButton>
    </template>
  </BaseModal>
</template>

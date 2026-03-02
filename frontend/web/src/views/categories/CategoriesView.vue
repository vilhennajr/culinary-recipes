<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
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
import type { Category } from "@/types";

const store = useCategoryStore();
const toast = useToast();

const columns = [
  { key: "name", label: "Nome" },
  { key: "createdAt", label: "Criado em" },
  { key: "actions", label: "", class: "w-32 text-right" },
];

const showModal = ref(false);
const editingId = ref<string | null>(null);
const form = reactive({ name: "" });
const saving = ref(false);
const formError = ref<string | null>(null);

const deleteTarget = ref<Category | null>(null);
const deleting = ref(false);

const searchName = ref("");

onMounted(() => store.fetchAll());

function openCreate() {
  editingId.value = null;
  form.name = "";
  formError.value = null;
  showModal.value = true;
}

function openEdit(category: Category) {
  editingId.value = category.id;
  form.name = category.name;
  formError.value = null;
  showModal.value = true;
}

async function save() {
  if (!form.name.trim()) {
    formError.value = "Nome é obrigatório";
    return;
  }
  saving.value = true;
  formError.value = null;
  try {
    if (editingId.value) {
      await store.update(editingId.value, { name: form.name });
      toast.success("Categoria atualizada com sucesso!");
    } else {
      await store.create({ name: form.name });
      toast.success("Categoria criada com sucesso!");
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
    toast.success("Categoria excluída com sucesso!");
    deleteTarget.value = null;
  } catch {
    toast.error("Erro ao excluir categoria");
    deleteTarget.value = null;
  } finally {
    deleting.value = false;
  }
}

function search() {
  store.fetchAll({ page: 1, name: searchName.value || undefined });
}

function onPageChange(p: number) {
  store.fetchAll({ page: p });
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap gap-3 items-start sm:items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Categorias</h2>
        <p class="text-gray-500 text-sm mt-0.5">Gerencie as categorias de receitas</p>
      </div>
      <BaseButton @click="openCreate">+ Nova Categoria</BaseButton>
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
        label="Buscar por nome"
        placeholder="Ex: Italiana"
        class="w-full sm:max-w-xs"
      />
      <BaseButton type="submit" variant="secondary">Buscar</BaseButton>
      <BaseButton
        v-if="searchName"
        variant="ghost"
        @click="
          searchName = '';
          store.fetchAll({ page: 1 });
        "
        >Limpar</BaseButton
      >
    </form>

    <BaseTable :columns="columns" :rows="store.items" :loading="store.loading">
      <template #createdAt="{ row }">
        {{ formatDate((row as unknown as Category).createdAt) }}
      </template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" size="sm" @click="openEdit(row as unknown as Category)"
            >Editar</BaseButton
          >
          <BaseButton variant="danger" size="sm" @click="deleteTarget = row as unknown as Category"
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
    :title="editingId ? 'Editar Categoria' : 'Nova Categoria'"
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
      <BaseInput v-model="form.name" label="Nome" placeholder="Ex: Italiana" required />
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="showModal = false">Cancelar</BaseButton>
      <BaseButton :loading="saving" @click="save">Salvar</BaseButton>
    </template>
  </BaseModal>

  <BaseModal v-if="deleteTarget" title="Confirmar Exclusão" size="sm" @close="deleteTarget = null">
    <p class="text-gray-700">
      Deseja excluir a categoria <strong>{{ deleteTarget.name }}</strong
      >? Esta ação não pode ser desfeita.
    </p>
    <template #footer>
      <BaseButton variant="secondary" @click="deleteTarget = null">Cancelar</BaseButton>
      <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">Excluir</BaseButton>
    </template>
  </BaseModal>
</template>

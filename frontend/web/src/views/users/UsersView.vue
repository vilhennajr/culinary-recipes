<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import BaseTable from "@/components/organisms/BaseTable.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import BaseModal from "@/components/organisms/BaseModal.vue";
import BaseInput from "@/components/atoms/BaseInput.vue";
import BasePagination from "@/components/molecules/BasePagination.vue";
import BaseAlert from "@/components/atoms/BaseAlert.vue";
import PasswordStrengthBar from "@/components/molecules/PasswordStrengthBar.vue";
import { extractApiError } from "@/utils/error";
import { formatDate } from "@/utils/format";
import { useToast } from "@/composables/useToast";
import type { User } from "@/types";

const store = useUserStore();
const authStore = useAuthStore();
const toast = useToast();

const columns = [
  { key: "name", label: "Nome" },
  { key: "login", label: "Login" },
  { key: "createdAt", label: "Criado em" },
  { key: "actions", label: "", class: "w-40 text-right" },
];

const showCreateModal = ref(false);
const createForm = reactive({
  login: "",
  password: "",
  confirmPassword: "",
  name: "",
});
const createSaving = ref(false);
const createError = ref<string | null>(null);

function openCreate() {
  createForm.login = "";
  createForm.password = "";
  createForm.confirmPassword = "";
  createForm.name = "";
  createError.value = null;
  showCreateModal.value = true;
}

async function saveCreate() {
  if (!createForm.login.trim()) {
    createError.value = "Login é obrigatório";
    return;
  }
  if (createForm.password.length < 6) {
    createError.value = "Senha deve ter no mínimo 6 caracteres";
    return;
  }
  if (createForm.password !== createForm.confirmPassword) {
    createError.value = "As senhas não coincidem";
    return;
  }
  createSaving.value = true;
  createError.value = null;
  try {
    await authService.register({
      login: createForm.login,
      password: createForm.password,
      name: createForm.name || undefined,
    });
    showCreateModal.value = false;
    toast.success("Usuário criado com sucesso!");
    await store.fetchAll({ page: 1 });
  } catch (err: unknown) {
    createError.value = extractApiError(err, "Erro ao criar usuário");
  } finally {
    createSaving.value = false;
  }
}

const showModal = ref(false);
const editingUser = ref<User | null>(null);
const form = reactive({ name: "", password: "", confirmPassword: "" });
const saving = ref(false);
const formError = ref<string | null>(null);
const deleteTarget = ref<User | null>(null);
const deleting = ref(false);

const searchName = ref("");
const searchLogin = ref("");

onMounted(() => store.fetchAll());

function openEdit(user: User) {
  editingUser.value = user;
  form.name = user.name ?? "";
  form.password = "";
  form.confirmPassword = "";
  formError.value = null;
  showModal.value = true;
}

async function save() {
  if (!editingUser.value) return;
  if (form.password && form.password !== form.confirmPassword) {
    formError.value = "As senhas não coincidem";
    return;
  }
  if (form.password && form.password.length < 6) {
    formError.value = "A nova senha deve ter no mínimo 6 caracteres";
    return;
  }
  saving.value = true;
  formError.value = null;
  try {
    await store.update(editingUser.value.id, {
      name: form.name || null,
      password: form.password || undefined,
    });
    toast.success("Usuário atualizado com sucesso!");
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
    toast.success("Usuário excluído com sucesso!");
    deleteTarget.value = null;
  } catch {
    toast.error("Erro ao excluir usuário");
    deleteTarget.value = null;
  } finally {
    deleting.value = false;
  }
}

function search() {
  store.fetchAll({
    page: 1,
    name: searchName.value || undefined,
    login: searchLogin.value || undefined,
  });
}

function onPageChange(p: number) {
  store.fetchAll({ page: p });
}

function isCurrentUser(user: User) {
  return user.id === authStore.user?.id;
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap gap-3 items-start sm:items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Usuários</h2>
        <p class="text-gray-500 text-sm mt-0.5">Gerencie os usuários do sistema</p>
      </div>
      <BaseButton @click="openCreate">+ Novo Usuário</BaseButton>
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
      <BaseInput
        v-model="searchLogin"
        label="Login"
        placeholder="Buscar por login"
        class="w-full sm:max-w-xs"
      />
      <BaseButton type="submit" variant="secondary">Buscar</BaseButton>
      <BaseButton
        v-if="searchName || searchLogin"
        variant="ghost"
        @click="
          searchName = '';
          searchLogin = '';
          store.fetchAll({ page: 1 });
        "
        >Limpar</BaseButton
      >
    </form>

    <BaseTable :columns="columns" :rows="store.items" :loading="store.loading">
      <template #name="{ row }">
        <span class="flex items-center gap-2">
          {{ (row as unknown as User).name ?? "—" }}
          <span
            v-if="isCurrentUser(row as unknown as User)"
            class="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded"
            >você</span
          >
        </span>
      </template>
      <template #createdAt="{ row }">
        {{ formatDate((row as unknown as User).createdAt) }}
      </template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" size="sm" @click="openEdit(row as unknown as User)"
            >Editar</BaseButton
          >
          <BaseButton
            variant="danger"
            size="sm"
            :disabled="isCurrentUser(row as unknown as User)"
            @click="deleteTarget = row as unknown as User"
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

  <BaseModal v-if="showCreateModal" title="Novo Usuário" @close="showCreateModal = false">
    <form class="space-y-4" @submit.prevent="saveCreate">
      <BaseAlert
        v-if="createError"
        type="error"
        :message="createError"
        dismissible
        @dismiss="createError = null"
      />
      <BaseInput
        v-model="createForm.login"
        label="Login"
        placeholder="Ex: joao@email.com"
        required
      />
      <div>
        <BaseInput
          v-model="createForm.password"
          type="password"
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          required
        />
        <PasswordStrengthBar :password="createForm.password" />
      </div>
      <BaseInput
        v-model="createForm.confirmPassword"
        type="password"
        label="Confirmar Senha"
        placeholder="Repita a senha"
        :error="
          createForm.confirmPassword && createForm.confirmPassword !== createForm.password
            ? 'As senhas não coincidem'
            : undefined
        "
        required
      />
      <BaseInput v-model="createForm.name" label="Nome" placeholder="Nome do usuário (opcional)" />
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="showCreateModal = false">Cancelar</BaseButton>
      <BaseButton :loading="createSaving" @click="saveCreate">Criar</BaseButton>
    </template>
  </BaseModal>

  <BaseModal v-if="showModal" title="Editar Usuário" @close="showModal = false">
    <form class="space-y-4" @submit.prevent="save">
      <BaseAlert
        v-if="formError"
        type="error"
        :message="formError"
        dismissible
        @dismiss="formError = null"
      />
      <BaseInput v-model="form.name" label="Nome" placeholder="Nome do usuário" />
      <div>
        <BaseInput
          v-model="form.password"
          type="password"
          label="Nova Senha"
          placeholder="Deixe vazio para manter"
        />
        <PasswordStrengthBar :password="form.password" />
      </div>
      <BaseInput
        v-if="form.password.length > 0"
        v-model="form.confirmPassword"
        type="password"
        label="Confirmar Nova Senha"
        placeholder="Repita a nova senha"
        :error="
          form.confirmPassword && form.confirmPassword !== form.password
            ? 'As senhas não coincidem'
            : undefined
        "
      />
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="showModal = false">Cancelar</BaseButton>
      <BaseButton :loading="saving" @click="save">Salvar</BaseButton>
    </template>
  </BaseModal>

  <BaseModal v-if="deleteTarget" title="Confirmar Exclusão" size="sm" @close="deleteTarget = null">
    <p class="text-gray-700">
      Deseja excluir o usuário
      <strong>{{ deleteTarget.name ?? deleteTarget.login }}</strong
      >?
    </p>
    <template #footer>
      <BaseButton variant="secondary" @click="deleteTarget = null">Cancelar</BaseButton>
      <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">Excluir</BaseButton>
    </template>
  </BaseModal>
</template>

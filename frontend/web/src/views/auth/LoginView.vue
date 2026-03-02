<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import BaseInput from "@/components/atoms/BaseInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import BaseAlert from "@/components/atoms/BaseAlert.vue";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({ login: "joao.santos@example.com", password: "password123" });
const localError = ref<string | null>(null);

async function submit() {
  localError.value = null;
  try {
    await auth.login(form);
    router.push("/recipes");
  } catch {
    localError.value = auth.error ?? "Erro ao fazer login";
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="text-4xl mb-3">🍽</div>
        <h1 class="text-2xl font-bold text-gray-800">Receitas Culinárias</h1>
        <p class="text-gray-500 text-sm mt-1">Faça login para continuar</p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <BaseAlert
          v-if="localError"
          type="error"
          :message="localError"
          dismissible
          @dismiss="localError = null"
        />

        <BaseInput v-model="form.login" label="Login" placeholder="seu@email.com" required />

        <BaseInput
          v-model="form.password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          required
        />

        <BaseButton type="submit" size="lg" :loading="auth.loading" class="w-full mt-1">
          Entrar
        </BaseButton>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Não tem conta?
        <RouterLink to="/register" class="text-primary-600 font-medium hover:underline">
          Registre-se
        </RouterLink>
      </p>
    </div>
  </div>
</template>

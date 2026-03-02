<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import BaseInput from "@/components/atoms/BaseInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import BaseAlert from "@/components/atoms/BaseAlert.vue";
import PasswordStrengthBar from "@/components/molecules/PasswordStrengthBar.vue";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  login: "",
  password: "",
  confirmPassword: "",
  name: "",
});
const localError = ref<string | null>(null);
const success = ref(false);

async function submit() {
  localError.value = null;
  if (form.password !== form.confirmPassword) {
    localError.value = "As senhas não coincidem";
    return;
  }
  if (form.password.length < 6) {
    localError.value = "A senha deve ter no mínimo 6 caracteres";
    return;
  }
  try {
    await auth.register({
      login: form.login,
      password: form.password,
      name: form.name || undefined,
    });
    success.value = true;
    setTimeout(() => router.push("/login"), 1500);
  } catch {
    localError.value = auth.error ?? "Erro ao registrar";
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
        <h1 class="text-2xl font-bold text-gray-800">Criar Conta</h1>
        <p class="text-gray-500 text-sm mt-1">Junte-se à comunidade de receitas</p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <BaseAlert
          v-if="success"
          type="success"
          message="Conta criada! Redirecionando para o login..."
        />

        <BaseAlert
          v-if="localError"
          type="error"
          :message="localError"
          dismissible
          @dismiss="localError = null"
        />

        <BaseInput v-model="form.name" label="Nome" placeholder="Seu nome (opcional)" />

        <BaseInput v-model="form.login" label="Login" placeholder="seu@email.com" required />

        <div>
          <BaseInput
            v-model="form.password"
            type="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            required
          />
          <PasswordStrengthBar :password="form.password" />
        </div>

        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="Confirmar Senha"
          placeholder="Repita a senha"
          :error="
            form.confirmPassword && form.confirmPassword !== form.password
              ? 'As senhas não coincidem'
              : undefined
          "
          required
        />

        <BaseButton type="submit" size="lg" :loading="auth.loading" class="w-full mt-1">
          Criar conta
        </BaseButton>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Já tem conta?
        <RouterLink to="/login" class="text-primary-600 font-medium hover:underline">
          Entrar
        </RouterLink>
      </p>
    </div>
  </div>
</template>

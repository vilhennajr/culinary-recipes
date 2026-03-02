<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

defineEmits<{ (e: "toggle-sidebar"): void }>();

const auth = useAuthStore();
const router = useRouter();

async function logout() {
  await auth.logout();
  router.push("/login");
}
</script>

<template>
  <header
    class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm shrink-0"
  >
    <div class="flex items-center gap-3">
      <button
        class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
        aria-label="Abrir menu"
        @click="$emit('toggle-sidebar')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-xl font-bold text-primary-600 tracking-tight">🍽 Receitas Culinárias</h1>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600 hidden sm:block">
        Olá, <strong>{{ auth.user?.name ?? auth.user?.login }}</strong>
      </span>
      <button
        class="text-sm text-gray-500 hover:text-red-600 transition font-medium"
        @click="logout"
      >
        Sair
      </button>
    </div>
  </header>
</template>

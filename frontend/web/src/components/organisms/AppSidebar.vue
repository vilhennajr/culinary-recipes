<script setup lang="ts">
defineProps<{ open?: boolean }>();
defineEmits<{ (e: "close"): void }>();

const nav = [
  { to: "/recipes", label: "Receitas", icon: "📋" },
  { to: "/categories", label: "Categorias", icon: "🏷" },
  { to: "/users", label: "Usuários", icon: "👤" },
];
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col py-6 gap-1 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center justify-between px-5 mb-3">
      <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Navegação</span>
      <button
        class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
        aria-label="Fechar menu"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <RouterLink
      v-for="item in nav"
      :key="item.to"
      :to="item.to"
      class="mx-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-600 hover:bg-gray-100"
      active-class="bg-primary-50 text-primary-700 font-semibold"
      @click="$emit('close')"
    >
      <span>{{ item.icon }}</span>
      {{ item.label }}
    </RouterLink>
  </aside>

  <aside
    class="hidden md:flex w-56 shrink-0 bg-white border-r border-gray-200 flex-col py-6 gap-1 shadow-sm"
  >
    <RouterLink
      v-for="item in nav"
      :key="item.to"
      :to="item.to"
      class="mx-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-600 hover:bg-gray-100"
      active-class="bg-primary-50 text-primary-700 font-semibold"
    >
      <span>{{ item.icon }}</span>
      {{ item.label }}
    </RouterLink>
  </aside>
</template>

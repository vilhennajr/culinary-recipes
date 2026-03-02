<script setup lang="ts">
defineProps<{ title?: string; size?: "sm" | "md" | "lg" }>();
defineEmits<{ (e: "close"): void }>();

const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="$emit('close')"
    >
      <div
        class="relative w-full bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
        :class="widths[size ?? 'md']"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
          <button
            class="text-gray-400 hover:text-gray-600 transition rounded focus:outline-none focus:ring-2 focus:ring-gray-400 p-0.5"
            aria-label="Fechar"
            @click="$emit('close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto flex-1 px-6 py-5">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

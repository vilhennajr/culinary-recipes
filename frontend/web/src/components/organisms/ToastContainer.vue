<script setup lang="ts">
import { useToast } from "@/composables/useToast";

const { toasts, dismiss } = useToast();

const icons: Record<string, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const styles: Record<string, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500",
  info: "bg-blue-600",
};
</script>

<template>
  <Teleport to="body">
    <div
      aria-live="polite"
      class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
    >
      <TransitionGroup
        tag="div"
        class="flex flex-col gap-3 items-end"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-12 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-12 opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 min-w-[280px] max-w-sm w-full rounded-xl shadow-lg text-white text-sm px-4 py-3 pointer-events-auto cursor-default select-none"
          :class="styles[toast.type]"
          @click="dismiss(toast.id)"
        >
          <span
            class="shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mt-0.5"
          >
            {{ icons[toast.type] }}
          </span>

          <p class="flex-1 leading-snug">{{ toast.message }}</p>

          <button
            class="shrink-0 opacity-70 hover:opacity-100 transition text-base leading-none mt-0.5"
            aria-label="Fechar"
            @click.stop="dismiss(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

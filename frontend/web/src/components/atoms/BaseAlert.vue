<script setup lang="ts">
type AlertType = "success" | "error" | "warning" | "info";

withDefaults(defineProps<{ type?: AlertType; message: string; dismissible?: boolean }>(), {
  type: "info",
});
defineEmits<{ (e: "dismiss"): void }>();

const styles: Record<AlertType, string> = {
  success: "bg-green-50 text-green-800 border-green-300",
  error: "bg-red-50 text-red-800 border-red-300",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-300",
  info: "bg-blue-50 text-blue-800 border-blue-300",
};
</script>

<template>
  <div class="flex items-start gap-3 rounded-lg border p-4 text-sm" :class="styles[type ?? 'info']">
    <p class="flex-1">{{ message }}</p>
    <button
      v-if="dismissible"
      class="opacity-60 hover:opacity-100 transition mt-0.5"
      @click="$emit('dismiss')"
    >
      ✕
    </button>
  </div>
</template>

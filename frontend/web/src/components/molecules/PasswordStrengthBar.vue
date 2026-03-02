<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ password: string }>();

const score = computed(() => {
  const p = props.password;
  if (!p) return 0;
  if (p.length < 6) return 1;

  let classes = 0;
  if (/[a-z]/.test(p)) classes++;
  if (/[A-Z]/.test(p)) classes++;
  if (/[0-9]/.test(p)) classes++;
  if (/[^A-Za-z0-9]/.test(p)) classes++;

  if (p.length >= 8 && classes >= 3) return 4;
  if (classes >= 2) return 3;
  return 2;
});

const levels = [
  null,
  { label: "Muito fraca", barColor: "bg-red-500", text: "text-red-500" },
  { label: "Fraca", barColor: "bg-orange-400", text: "text-orange-500" },
  { label: "Média", barColor: "bg-yellow-400", text: "text-yellow-600" },
  { label: "Forte", barColor: "bg-green-500", text: "text-green-600" },
] as const;

// score is always >= 1 when password.length > 0 (the outer v-if guard ensures this),
// but we keep an explicit computed so TypeScript doesn't require non-null assertions.
const info = computed(() => (score.value > 0 ? levels[score.value] : null));
</script>

<template>
  <div v-if="password.length > 0 && info" class="mt-1.5 space-y-1">
    <div class="flex gap-1">
      <div
        v-for="i in 4"
        :key="i"
        class="h-1.5 flex-1 rounded-full transition-all duration-300"
        :class="i <= score ? info.barColor : 'bg-gray-200'"
      />
    </div>
    <p class="text-xs font-medium transition-colors duration-300" :class="info.text">
      {{ info.label }}
    </p>
  </div>
</template>

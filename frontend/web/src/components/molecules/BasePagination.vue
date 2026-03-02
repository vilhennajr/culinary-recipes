<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}>();

const emit = defineEmits<{ (e: "change", page: number): void }>();

function goTo(p: number) {
  if (p >= 1 && p <= props.totalPages) emit("change", p);
}

const pageList = computed((): (number | "...")[] => {
  const list: (number | "...")[] = [];
  const { page, totalPages } = props;
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) list.push(i);
  } else {
    list.push(1);
    if (page > 3) list.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) list.push(i);
    if (page < totalPages - 2) list.push("...");
    list.push(totalPages);
  }
  return list;
});

const start = computed(() => (props.page - 1) * props.limit + 1);
const end = computed(() => Math.min(props.page * props.limit, props.total));
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 text-sm text-gray-600"
  >
    <span>Mostrando {{ start }}–{{ end }} de {{ total }}</span>
    <div class="flex items-center gap-1">
      <button
        class="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
        :disabled="page === 1"
        @click="goTo(page - 1)"
      >
        «
      </button>

      <template v-for="p in pageList" :key="p">
        <span v-if="p === '...'" class="px-2">…</span>
        <button
          v-else
          class="w-8 h-8 rounded transition"
          :class="p === page ? 'bg-primary-600 text-white font-semibold' : 'hover:bg-gray-100'"
          @click="goTo(p as number)"
        >
          {{ p }}
        </button>
      </template>

      <button
        class="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
        :disabled="page === totalPages"
        @click="goTo(page + 1)"
      >
        »
      </button>
    </div>
  </div>
</template>

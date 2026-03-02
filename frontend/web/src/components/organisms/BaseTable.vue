<script setup lang="ts" generic="T extends Record<string, unknown>">
defineProps<{
  columns: { key: string; label: string; class?: string }[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <table class="min-w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            :class="col.class"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 bg-white">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-400">
            <div class="flex justify-center">
              <svg class="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-400">
            {{ emptyMessage ?? "Nenhum registro encontrado" }}
          </td>
        </tr>
        <tr
          v-for="row in rows"
          v-else
          :key="(row.id as string) ?? JSON.stringify(row)"
          class="hover:bg-gray-50 transition"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-gray-700 whitespace-nowrap"
            :class="col.class"
          >
            <slot :name="col.key" :row="row">
              {{ row[col.key] ?? "—" }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

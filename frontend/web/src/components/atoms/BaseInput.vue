<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string;
  modelValue?: string | number | null;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}>();

defineEmits<{ (e: "update:modelValue", value: string): void }>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <textarea
      v-if="rows"
      :rows="rows"
      :value="(modelValue as string) ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2"
      :class="
        error
          ? 'border-red-400 focus:ring-red-400'
          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
      "
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <input
      v-else
      :type="type ?? 'text'"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2"
      :class="
        error
          ? 'border-red-400 focus:ring-red-400'
          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
      "
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

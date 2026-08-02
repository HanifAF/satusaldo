<template>
  <div class="w-full">
    <label v-if="label" class="form-label">
      {{ label }}<span v-if="required" class="text-error ml-0.5">*</span>
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        :disabled="disabled"
        class="form-select pr-10"
        :class="{ 'border-error focus:ring-error': error, 'cursor-not-allowed opacity-60': disabled }"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.icon ? opt.icon + ' ' : '' }}{{ opt.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center">
        <svg class="h-4 w-4 text-on-surface-secondary" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-xs text-error font-jakarta">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String,  default: '' },
  placeholder: { type: String,  default: 'Pilih...' },
  options:     { type: Array,   default: () => [] },
  error:       { type: String,  default: '' },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

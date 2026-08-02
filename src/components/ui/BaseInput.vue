<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}<span v-if="required" class="text-error ml-0.5">*</span>
    </label>
    <div class="relative">
      <span v-if="prefix" class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-secondary text-sm font-jakarta">{{ prefix }}</span>
      <input
        :id="inputId"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="form-input"
        :class="{ 'pl-10': prefix, 'border-error focus:ring-error': error, 'cursor-not-allowed opacity-60': disabled }"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-xs text-error font-jakarta">{{ error }}</p>
    <p v-if="hint && !error" class="mt-1.5 text-xs text-on-surface-secondary font-jakarta">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String,  default: '' },
  type:        { type: String,  default: 'text' },
  placeholder: { type: String,  default: '' },
  prefix:      { type: String,  default: '' },
  error:       { type: String,  default: '' },
  hint:        { type: String,  default: '' },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
  id:          { type: String,  default: '' },
})
defineEmits(['update:modelValue', 'blur'])
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 font-jakarta font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    :class="[variantClass, sizeClass]"
    v-bind="$attrs"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant:  { type: String,  default: 'primary' },
  size:     { type: String,  default: 'md' },
  type:     { type: String,  default: 'button' },
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const variantClass = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger' }[props.variant] ?? 'btn-primary'
const sizeClass    = { sm: 'text-xs px-4 py-2 rounded-full', md: 'text-sm px-6 py-3 rounded-full', lg: 'text-base px-8 py-4 rounded-full' }[props.size] ?? 'text-sm px-6 py-3 rounded-full'
</script>

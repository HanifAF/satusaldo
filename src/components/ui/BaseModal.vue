<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal-content">
        <div class="flex items-center justify-between p-6 border-b border-white/30">
          <h2 class="font-outfit font-semibold text-lg text-on-surface">{{ title }}</h2>
          <button @click="$emit('update:modelValue', false)" class="p-2 rounded-full hover:bg-white/30 transition-colors">
            <svg class="w-5 h-5 text-on-surface-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6"><slot /></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({ modelValue: { type: Boolean, default: false }, title: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-enter-from .modal-content { transform: translateY(16px); opacity: 0; }
.modal-leave-to .modal-content { transform: translateY(8px); opacity: 0; }
</style>

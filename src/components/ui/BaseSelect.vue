<template>
  <div class="w-full relative" ref="dropdownRef">
    <label v-if="label" class="form-label mb-1.5 block text-xs font-semibold font-jakarta text-on-surface">
      {{ label }}<span v-if="required" class="text-error ml-0.5">*</span>
    </label>
    
    <!-- Trigger Button -->
    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        :disabled="disabled"
        class="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-white border text-left font-jakarta text-sm transition-all duration-200 shadow-sm"
        :class="[
          error ? 'border-error ring-1 ring-error' : isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'
        ]"
      >
        <span :class="selectedOption ? 'text-on-surface font-medium' : 'text-gray-400'">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>
        
        <svg
          class="w-4 h-4 text-gray-400 transition-transform duration-200 ml-2 flex-shrink-0"
          :class="{ 'rotate-180 text-primary': isOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Custom Dropdown Menu Panel -->
      <transition name="dropdown-fade">
        <div
          v-if="isOpen"
          class="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 max-h-56 overflow-y-auto"
        >
          <div
            v-for="opt in options"
            :key="opt.value"
            @click="selectOption(opt)"
            class="py-2.5 px-4 text-sm font-jakarta transition-colors cursor-pointer flex items-center justify-between"
            :class="opt.value === modelValue ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-gray-50'"
          >
            <span>{{ opt.label }}</span>
            <svg
              v-if="opt.value === modelValue"
              class="w-4 h-4 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <div v-if="!options.length" class="py-3 px-4 text-xs text-gray-400 text-center font-jakarta">
            Tidak ada pilihan
          </div>
        </div>
      </transition>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-error font-jakarta">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String,  default: '' },
  placeholder: { type: String,  default: 'Pilih...' },
  options:     { type: Array,   default: () => [] },
  error:       { type: String,  default: '' },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(opt) {
  emit('update:modelValue', opt.value)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.15s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

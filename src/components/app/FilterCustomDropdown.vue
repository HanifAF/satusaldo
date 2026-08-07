<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleOpen"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border text-left font-jakarta text-xs sm:text-sm font-medium transition-all duration-200 shadow-2xs cursor-pointer"
      :class="isOpen ? 'border-primary ring-2 ring-primary/20 shadow-xs' : isFiltered ? 'border-emerald-400 bg-emerald-50/50 text-emerald-950 font-semibold' : 'border-gray-200 text-gray-700'"
    >
      <!-- Trigger Icon -->
      <div
        class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
        :class="activeIconBg"
      >
        <component :is="resolveIcon(activeIconName)" class="w-3 h-3" />
      </div>

      <!-- Selected Label -->
      <span class="truncate max-w-[110px] sm:max-w-[160px]" :class="isFiltered ? 'text-emerald-950 font-semibold' : 'text-gray-700'">
        {{ selectedLabel }}
      </span>

      <!-- Chevron -->
      <svg
        class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ml-0.5 flex-shrink-0"
        :class="{ 'rotate-180 text-primary': isOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Dropdown Panel -->
    <transition name="dropdown-fade">
      <div
        v-if="isOpen"
        class="absolute mt-2 z-50 bg-white border border-gray-100/90 rounded-2xl shadow-xl p-1.5 min-w-[220px] sm:min-w-[250px] max-h-80 overflow-y-auto"
        :class="placement === 'right' ? 'right-0' : 'left-0'"
      >
        <!-- Header title if any -->
        <div v-if="title" class="px-3 py-1.5 border-b border-gray-100 mb-1">
          <p class="font-jakarta text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ title }}</p>
        </div>

        <!-- Options List -->
        <div class="space-y-0.5">
          <template v-for="item in options" :key="item.value || item.header">
            <!-- Group Header -->
            <div v-if="item.isHeader" class="px-3 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-jakarta">
              {{ item.header }}
            </div>

            <!-- Option Item -->
            <button
              v-else
              type="button"
              @click="handleSelect(item)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-jakarta transition-all duration-150 group text-left cursor-pointer"
              :class="item.value === modelValue ? 'bg-emerald-50 text-emerald-900 font-bold shadow-2xs' : 'text-gray-700 hover:bg-gray-50/90 font-medium'"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <!-- Item Icon -->
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                  :class="item.iconBg || (item.value === modelValue ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')"
                >
                  <component :is="resolveIcon(item.icon)" class="w-3.5 h-3.5" />
                </div>

                <!-- Item Text -->
                <div class="truncate">
                  <p class="truncate text-xs leading-tight" :class="item.value === modelValue ? 'text-emerald-950 font-bold' : 'text-gray-800'">
                    {{ item.label }}
                  </p>
                  <p v-if="item.sublabel" class="text-[10px] text-gray-400 truncate mt-0.5 font-normal">
                    {{ item.sublabel }}
                  </p>
                </div>
              </div>

              <!-- Selected Checkmark -->
              <svg
                v-if="item.value === modelValue"
                class="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </template>
        </div>

        <!-- Custom Date Section (if Atur Tanggal Langsung selected) -->
        <div v-if="allowCustomDate && modelValue === 'custom'" class="mt-2 pt-2 border-t border-gray-100 px-3 pb-2">
          <label class="block text-[11px] font-bold text-gray-600 mb-1.5 font-jakarta">Pilih Tanggal:</label>
          <div class="flex items-center gap-1.5">
            <input
              type="date"
              :value="customDateValue"
              @input="$emit('update:customDate', $event.target.value)"
              class="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-jakarta font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="button"
              @click="isOpen = false"
              class="px-2.5 py-1.5 bg-primary text-white rounded-xl text-xs font-jakarta font-bold hover:bg-primary-dark transition-colors shadow-2xs"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: 'all' },
  customDateValue: { type: String, default: '' },
  allowCustomDate: { type: Boolean, default: false },
  title: { type: String, default: '' },
  placeholder: { type: String, default: 'Pilih...' },
  defaultIcon: { type: String, default: 'grid' },
  defaultIconBg: { type: String, default: 'bg-emerald-50 text-emerald-600' },
  placement: { type: String, default: 'left' },
  options: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'update:customDate', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const isFiltered = computed(() => props.modelValue !== 'all' && props.modelValue !== '')

const currentOption = computed(() => {
  return props.options.find(opt => !opt.isHeader && opt.value === props.modelValue)
})

const selectedLabel = computed(() => {
  if (props.modelValue === 'custom') {
    return props.customDateValue ? `Tgl: ${props.customDateValue}` : 'Atur Tanggal'
  }
  return currentOption.value ? currentOption.value.label : props.placeholder
})

const activeIconName = computed(() => {
  return currentOption.value?.icon || props.defaultIcon
})

const activeIconBg = computed(() => {
  if (currentOption.value?.iconBg) {
    return currentOption.value.iconBg
  }
  return isFiltered.value ? 'bg-emerald-100 text-emerald-700' : props.defaultIconBg
})

// SVG Icons Mapping
const icons = {
  // Date & General
  clock: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polyline', { points: '12 6 12 12 16 14' }),
  ]),
  calendar: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
    h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
    h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
    h('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
  ]),
  'calendar-edit': () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
    h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' }),
  ]),
  grid: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '3', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '14', width: '7', height: '7' }),
    h('rect', { x: '3', y: '14', width: '7', height: '7' }),
  ]),
  expense: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('line', { x1: '7', y1: '7', x2: '17', y2: '17' }),
    h('polyline', { points: '17 7 17 17 7 17' }),
  ]),
  income: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('line', { x1: '7', y1: '17', x2: '17', y2: '7' }),
    h('polyline', { points: '7 7 17 7 17 17' }),
  ]),
  transfer: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('polyline', { points: '17 1 21 5 17 9' }),
    h('path', { d: 'M3 5h18' }),
    h('polyline', { points: '7 23 3 19 7 15' }),
    h('path', { d: 'M21 19H3' }),
  ]),
  bank: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M3 21h18' }),
    h('path', { d: 'M3 10h18' }),
    h('path', { d: 'M5 6l7-3 7 3' }),
    h('path', { d: 'M4 10v11' }),
    h('path', { d: 'M20 10v11' }),
    h('path', { d: 'M8 14v4' }),
    h('path', { d: 'M12 14v4' }),
    h('path', { d: 'M16 14v4' }),
  ]),
  ewallet: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }),
    h('circle', { cx: '12', cy: '12', r: '2' }),
    h('path', { d: 'M6 12h.01M18 12h.01' }),
  ]),
  cash: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
    h('circle', { cx: '12', cy: '12', r: '2' }),
    h('path', { d: 'M6 12h.01M18 12h.01' }),
  ]),
  wallet: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M21 12V7H5a2 2 0 0 1 0-4h14v4' }),
    h('path', { d: 'M3 5v14a2 2 0 0 0 2 2h16v-5' }),
    h('path', { d: 'M18 12a2 2 0 0 0 0 4h4v-4Z' }),
  ]),
  food: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M18 8h1a4 4 0 0 1 0 8h-1' }),
    h('path', { d: 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' }),
    h('line', { x1: '6', y1: '1', x2: '6', y2: '4' }),
    h('line', { x1: '10', y1: '1', x2: '10', y2: '4' }),
    h('line', { x1: '14', y1: '1', x2: '14', y2: '4' }),
  ]),
  transport: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '1', y: '3', width: '15', height: '13' }),
    h('polygon', { points: '16 8 20 8 23 11 23 16 16 16 16 8' }),
    h('circle', { cx: '5.5', cy: '18.5', r: '2.5' }),
    h('circle', { cx: '18.5', cy: '18.5', r: '2.5' }),
  ]),
  shopping: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }),
    h('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
    h('path', { d: 'M16 10a4 4 0 0 1-8 0' }),
  ]),
  bill: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    h('polyline', { points: '14 2 14 8 20 8' }),
    h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
    h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
    h('polyline', { points: '10 9 9 9 8 9' }),
  ]),
  entertainment: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('polygon', { points: '5 3 19 12 5 21 5 3' }),
  ]),
  health: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' }),
  ]),
  education: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
    h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }),
  ]),
  salary: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
    h('circle', { cx: '12', cy: '12', r: '2' }),
    h('path', { d: 'M6 12h.01M18 12h.01' }),
  ]),
  freelance: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2', ry: '2' }),
    h('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' }),
  ]),
  bonus: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }),
  ]),
  other: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('circle', { cx: '12', cy: '12', r: '1' }),
    h('circle', { cx: '19', cy: '12', r: '1' }),
    h('circle', { cx: '5', cy: '12', r: '1' }),
  ]),
}

function resolveIcon(name) {
  return icons[name] || icons.grid
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function handleSelect(item) {
  emit('update:modelValue', item.value)
  emit('change', item.value)
  if (item.value !== 'custom') {
    isOpen.value = false
  }
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
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
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>

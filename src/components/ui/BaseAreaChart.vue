<template>
  <div class="base-area-chart" ref="chartContainer">
    <!-- Header Section -->
    <div class="chart-header">
      <div>
        <h2 class="chart-title">{{ computedTitle }}</h2>
        <div class="chart-value">
          <span class="value-number">{{ displayBalance }}</span>
        </div>
      </div>

      <!-- Time Toggle Tabs -->
      <div v-if="showTimeToggle" class="toggle-pill">
        <button
          v-for="tab in timeTabs"
          :key="tab.id"
          :class="['toggle-btn', { active: currentTab === tab.id }]"
          @click="onSelectTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Optional Badge -->
      <div v-else-if="badge" class="chart-badge">
        <span class="badge-text">{{ badge }}</span>
      </div>
    </div>

    <!-- Decorative Scatter Dots -->
    <div class="scatter-dots" v-if="showDots">
      <div
        v-for="(dot, i) in decorativeDots"
        :key="'dot-' + i"
        class="dot"
        :style="{
          width: dot.size + 'px',
          height: dot.size + 'px',
          top: dot.top + '%',
          left: dot.left + '%',
        }"
      />
    </div>

    <!-- Chart Graphic Area -->
    <div
      class="chart-graphic"
      ref="chartGraphic"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- Grid Lines -->
      <div class="grid-line" style="top: 25%;" />
      <div class="grid-line" style="top: 50%;" />
      <div class="grid-line" style="top: 75%;" />
      <div class="grid-line" style="top: 100%;" />

      <!-- SVG Area Chart -->
      <svg
        class="svg-chart"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            v-for="(dataset, dIdx) in normalizedDatasets"
            :key="'grad-' + dIdx"
            :id="'areaGrad-' + chartId + '-' + dIdx"
            x1="0%" y1="0%" x2="0%" y2="100%"
          >
            <stop offset="0%" :stop-color="dataset.color || '#17c662'" stop-opacity="0.18" />
            <stop offset="100%" :stop-color="dataset.color || '#17c662'" stop-opacity="0.01" />
          </linearGradient>
        </defs>

        <!-- Area + Line for each dataset -->
        <template v-for="(dataset, dIdx) in normalizedDatasets" :key="'ds-' + dIdx">
          <!-- Area Fill -->
          <path
            :d="dataset.areaPath"
            :fill="`url(#areaGrad-${chartId}-${dIdx})`"
          />
          <!-- Line -->
          <path
            :d="dataset.linePath"
            fill="none"
            :stroke="dataset.color || '#17c662'"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </template>
      </svg>

      <!-- Permanent Default Dot on Today / Latest Point (Single Source of Truth anchor) -->
      <div
        v-if="defaultIndex >= 0"
        class="permanent-dot"
        :class="{ 'is-hovered-elsewhere': hoveredIndex >= 0 && hoveredIndex !== defaultIndex }"
        :style="{
          left: defaultPointXPercent + '%',
          top: defaultPointYPercent + '%',
          borderColor: activeColor,
        }"
      >
        <span class="permanent-dot-ping" :style="{ backgroundColor: activeColor }" />
      </div>

      <!-- Active / Hover Vertical Dashed Line (shown on hover interaction) -->
      <div
        v-if="hoveredIndex >= 0"
        class="hover-line"
        :style="{
          left: activeXPercent + '%',
          top: activeYPercent + '%',
          height: (100 - activeYPercent) + '%',
        }"
      />

      <!-- Hover Point Circle on Curve -->
      <div
        v-if="hoveredIndex >= 0"
        class="hover-dot"
        :style="{
          left: activeXPercent + '%',
          top: activeYPercent + '%',
          borderColor: activeColor,
        }"
      />

      <!-- Pill Tooltip (shown on hover interaction) -->
      <div
        v-if="hoveredIndex >= 0 && showTooltip"
        class="chart-tooltip"
        :style="{
          left: activeXPercent + '%',
          top: activeYPercent + '%',
        }"
      >
        <div class="tooltip-bubble" :style="{ backgroundColor: activeColor || '#17c662' }">
          {{ formattedTooltipValue }}
        </div>
        <div class="tooltip-arrow" :style="{ backgroundColor: activeColor || '#17c662' }" />
      </div>
    </div>

    <!-- X-Axis Labels -->
    <div class="x-axis-labels">
      <span
        v-for="(label, i) in labels"
        :key="'label-' + i"
        :class="['x-label', { 'x-label-active': i === effectiveActiveIndex }]"
        @click="onLabelClick(i)"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  /** Chart title */
  title: { type: String, default: 'Total Saldo Terkini' },
  /** Function to format dynamic title based on active/hovered index */
  titleFormatter: { type: Function, default: null },
  /** Default / Total balance text */
  defaultBalance: { type: [String, Number], default: '' },
  /** Show time toggle tabs (All Time, Per Bulan, Per Hari) */
  showTimeToggle: { type: Boolean, default: true },
  /** Initial selected time tab */
  activeTab: { type: String, default: 'all' },
  /** Badge text (if not using time toggle) */
  badge: { type: String, default: '' },
  /** X-axis labels */
  labels: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  /**
   * Array of datasets:
   * [{ label: 'Total Saldo', data: [100, 200, ...], color: '#17C662' }]
   */
  datasets: { type: Array, default: () => [] },
  /** Index of currently selected month / active index (-1 for latest, 0..N) */
  activeIndex: { type: Number, default: -1 },
  /** Show decorative scatter dots */
  showDots: { type: Boolean, default: true },
  /** Always show tooltip even when idle (default false for clean idle chart) */
  alwaysShowTooltip: { type: Boolean, default: false },
  /** Show tooltip */
  showTooltip: { type: Boolean, default: true },
  /** Value formatter */
  formatter: { type: Function, default: null },
  /** Unique chart ID */
  chartId: { type: String, default: 'area' },
})

const emit = defineEmits(['select', 'tab-change'])

const chartGraphic = ref(null)
const hoveredIndex = ref(-1)
const currentTab = ref(props.activeTab)

watch(() => props.activeTab, (newTab) => {
  if (newTab) currentTab.value = newTab
})

watch(() => props.labels, () => {
  hoveredIndex.value = -1
})

const timeTabs = [
  { id: 'today', label: 'Today' },
  { id: 'month', label: 'Month' },
  { id: 'all', label: 'All Time' },
]

function onSelectTab(tabId) {
  currentTab.value = tabId
  emit('tab-change', tabId)
}

function onLabelClick(index) {
  emit('select', index)
}

const effectiveActiveIndex = computed(() => {
  if (hoveredIndex.value >= 0) return hoveredIndex.value
  if (props.activeIndex >= 0) return props.activeIndex
  if (props.labels && props.labels.length > 0) return props.labels.length - 1
  return -1
})

const isInteractiveActive = computed(() => {
  if (props.alwaysShowTooltip) return effectiveActiveIndex.value >= 0
  return hoveredIndex.value >= 0
})

const computedTitle = computed(() => {
  if (props.titleFormatter) {
    const idx = effectiveActiveIndex.value
    const label = props.labels && props.labels[idx] !== undefined ? props.labels[idx] : ''
    const val = activeValue.value
    const isLatest = idx === (props.labels.length - 1)
    return props.titleFormatter({
      index: idx,
      label,
      value: val,
      isLatest,
      tab: currentTab.value,
      isHovered: hoveredIndex.value >= 0
    })
  }
  return props.title || 'TOTAL SALDO TERKINI'
})

const svgWidth = 1000
const svgHeight = 280
const paddingTop = 25
const paddingBottom = 15

// Find bounds
const primaryData = computed(() => {
  if (props.datasets.length > 0) return props.datasets[0].data || []
  return []
})

const maxVal = computed(() => {
  let max = 0
  props.datasets.forEach(ds => {
    ;(ds.data || []).forEach(v => { if (v > max) max = v })
  })
  return max || 1
})

const minVal = computed(() => {
  let min = Infinity
  props.datasets.forEach(ds => {
    ;(ds.data || []).forEach(v => { if (v < min && v > 0) min = v })
  })
  if (min === Infinity) min = 0
  return Math.max(0, min * 0.7) // give breathing room below curve
})

function getX(index) {
  const count = props.labels.length || 12
  const spacing = svgWidth / (count - 1)
  return index * spacing
}

function getY(value) {
  const usableHeight = svgHeight - paddingTop - paddingBottom
  const range = (maxVal.value - minVal.value) || 1
  const ratio = (value - minVal.value) / range
  return svgHeight - paddingBottom - (ratio * usableHeight)
}

// Cubic Bezier smoothing
function generatePath(data, close = false) {
  if (!data || data.length === 0) return ''

  const points = data.map((v, i) => ({ x: getX(i), y: getY(v) }))
  let path = `M${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const tension = 0.35
    const dx = (p1.x - p0.x) * tension
    path += ` C${p0.x + dx},${p0.y} ${p1.x - dx},${p1.y} ${p1.x},${p1.y}`
  }

  if (close) {
    const last = points[points.length - 1]
    path += ` L${last.x},${svgHeight} L${points[0].x},${svgHeight} Z`
  }

  return path
}

const normalizedDatasets = computed(() => {
  return props.datasets.map(ds => ({
    ...ds,
    linePath: generatePath(ds.data, false),
    areaPath: generatePath(ds.data, true),
  }))
})

// Current value at active index
const activeValue = computed(() => {
  const idx = effectiveActiveIndex.value
  if (idx < 0 || !primaryData.value.length) return null
  return primaryData.value[idx] || 0
})

const activeColor = computed(() => {
  if (props.datasets.length > 0) {
    return props.datasets[0].color || '#17c662'
  }
  return '#17c662'
})

const activeXPercent = computed(() => {
  const idx = effectiveActiveIndex.value
  if (idx < 0) return 0
  const count = props.labels.length || 12
  return (idx / (count - 1)) * 100
})

const activeYPercent = computed(() => {
  const val = activeValue.value
  if (val === null) return 50
  const usable = svgHeight - paddingTop - paddingBottom
  const range = (maxVal.value - minVal.value) || 1
  const ratio = (val - minVal.value) / range
  const svgY = svgHeight - paddingBottom - (ratio * usable)
  return (svgY / svgHeight) * 100
})

// Default point (Today / Latest point - visual anchor)
const defaultIndex = computed(() => {
  if (props.activeIndex >= 0) return props.activeIndex
  if (props.labels && props.labels.length > 0) return props.labels.length - 1
  return -1
})

const defaultPointValue = computed(() => {
  const idx = defaultIndex.value
  if (idx < 0 || !primaryData.value.length) return null
  return primaryData.value[idx] || 0
})

const defaultPointXPercent = computed(() => {
  const idx = defaultIndex.value
  if (idx < 0) return 100
  const count = props.labels.length || 12
  return (idx / (count - 1)) * 100
})

const defaultPointYPercent = computed(() => {
  const val = defaultPointValue.value
  if (val === null) return 50
  const usable = svgHeight - paddingTop - paddingBottom
  const range = (maxVal.value - minVal.value) || 1
  const ratio = (val - minVal.value) / range
  const svgY = svgHeight - paddingBottom - (ratio * usable)
  return (svgY / svgHeight) * 100
})

function formatCurrency(val) {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string' && (val.startsWith('IDR') || val.startsWith('RP') || val.startsWith('Rp'))) return val
  if (props.formatter) return props.formatter(val)
  return 'IDR ' + Number(val).toLocaleString('id-ID')
}

const displayBalance = computed(() => {
  if (effectiveActiveIndex.value >= 0 && activeValue.value !== null) {
    return formatCurrency(activeValue.value)
  }
  if (props.defaultBalance) {
    return typeof props.defaultBalance === 'number'
      ? formatCurrency(props.defaultBalance)
      : props.defaultBalance
  }
  return 'IDR 0'
})

const formattedTooltipValue = computed(() => {
  return formatCurrency(activeValue.value)
})

// Mouse hover handlers
function handleMouseMove(e) {
  if (!chartGraphic.value) return
  const rect = chartGraphic.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const count = props.labels.length || 12
  const ratio = mouseX / rect.width
  const floatIdx = ratio * (count - 1)
  const idx = Math.round(Math.max(0, Math.min(count - 1, floatIdx)))
  hoveredIndex.value = idx
}

function handleMouseLeave() {
  hoveredIndex.value = -1
}

// Decorative dots
const decorativeDots = [
  { size: 4, top: 12, left: 16 },
  { size: 3, top: 22, left: 35 },
  { size: 2, top: 10, left: 45 },
  { size: 4, top: 18, left: 55 },
  { size: 3, top: 30, left: 60 },
  { size: 3, top: 14, left: 70 },
]
</script>

<style scoped>
.base-area-chart {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f0f1f3;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
  padding: 2rem 2.25rem;
  position: relative;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 20;
  margin-bottom: 0.5rem;
}

.chart-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  color: #6b7280;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.chart-value {
  display: flex;
  align-items: baseline;
  margin-top: 0.25rem;
}

.value-number {
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #17c662;
  line-height: 1.1;
  transition: color 0.15s ease;
}

/* Time Toggle Pill */
.toggle-pill {
  background-color: #f3f4f6;
  border-radius: 9999px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.toggle-btn {
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #17c662 0%, #15803d 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(23, 198, 98, 0.35);
}

.toggle-btn:not(.active):hover {
  color: #111827;
}

.chart-badge {
  background: rgba(243, 244, 246, 0.8);
  border-radius: 20px;
  padding: 0.35rem 0.85rem;
  border: 1px solid rgba(229, 231, 235, 0.6);
}

.badge-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

/* Scatter dots */
.scatter-dots {
  position: absolute;
  top: 1.5rem;
  left: 0;
  width: 100%;
  height: 140px;
  pointer-events: none;
  z-index: 5;
}

.dot {
  position: absolute;
  background-color: #17c662;
  border-radius: 50%;
  opacity: 0.55;
}

/* Chart graphic area */
.chart-graphic {
  position: relative;
  width: 100%;
  height: 280px;
  margin-top: 1rem;
  cursor: crosshair;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #f3f4f6;
  z-index: 1;
}

.svg-chart {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  z-index: 10;
}

/* Permanent Default Point Dot on Today / Latest Point */
.permanent-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #17c662;
  border: 2.5px solid #ffffff;
  box-shadow: 0 0 0 2px rgba(23, 198, 98, 0.4), 0 2px 6px rgba(0, 0, 0, 0.12);
  transform: translate(-50%, -50%);
  z-index: 18;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.permanent-dot.is-hovered-elsewhere {
  opacity: 0.35;
  transform: translate(-50%, -50%) scale(0.85);
}

.permanent-dot-ping {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: #17c662;
  opacity: 0.25;
  animation: pulse-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  pointer-events: none;
}

@keyframes pulse-ping {
  0% {
    transform: scale(0.9);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
  }
}

/* Hover vertical dashed line */
.hover-line {
  position: absolute;
  width: 1.5px;
  bottom: 0;
  z-index: 15;
  pointer-events: none;
  transition: left 0.15s cubic-bezier(0.4, 0, 0.2, 1), top 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  background: repeating-linear-gradient(
    to bottom,
    #9ca3af 0px,
    #9ca3af 4px,
    transparent 4px,
    transparent 8px
  );
}

/* Hover point dot on curve */
.hover-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #bbf7d0;
  border: 2px solid #17c662;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
  transform: translate(-50%, -50%);
  z-index: 20;
  pointer-events: none;
  transition: left 0.15s cubic-bezier(0.4, 0, 0.2, 1), top 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tooltip pill */
.chart-tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  z-index: 30;
  pointer-events: none;
  margin-top: -12px;
  transition: left 0.15s cubic-bezier(0.4, 0, 0.2, 1), top 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-bubble {
  background: #17c662;
  color: #ffffff;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  box-shadow: 0 4px 14px rgba(23, 198, 98, 0.4);
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-align: center;
}

.tooltip-arrow {
  width: 7px;
  height: 7px;
  background: #17c662;
  margin: -3.5px auto 0;
  transform: rotate(45deg);
  border-radius: 1px;
}

/* X-axis labels */
.x-axis-labels {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0.25rem 0;
}

.x-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease, font-weight 0.15s ease;
  padding: 0.2rem 0;
}

.x-label:hover {
  color: #111827;
}

.x-label-active,
.x-label.x-label-active {
  color: #17c662 !important;
  font-weight: 500 !important;
}
</style>

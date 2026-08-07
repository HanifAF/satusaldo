<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-outfit font-extrabold text-3xl text-on-surface tracking-tight">Laporan</h1>
        <p class="font-jakarta text-sm text-on-surface-secondary mt-1">Ringkasan keuangan bulanan kamu</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="prevMonth" class="p-2 rounded-full hover:bg-white/40 transition-colors">
          <svg class="w-5 h-5 text-on-surface" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-outfit font-semibold text-base text-on-surface min-w-[140px] text-center">{{ months[selectedMonth - 1] }} {{ selectedYear }}</span>
        <button @click="nextMonth" class="p-2 rounded-full hover:bg-white/40 transition-colors">
          <svg class="w-5 h-5 text-on-surface" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="glass-card p-5">
        <p class="font-jakarta text-xs text-on-surface-secondary mb-1">Total Pemasukan</p>
        <p class="font-outfit font-extrabold text-2xl text-primary currency">{{ formatRupiah(totalIncome) }}</p>
      </div>
      <div class="glass-card p-5">
        <p class="font-jakarta text-xs text-on-surface-secondary mb-1">Total Pengeluaran</p>
        <p class="font-outfit font-extrabold text-2xl text-error currency">{{ formatRupiah(totalExpense) }}</p>
      </div>
      <div class="glass-card p-5">
        <p class="font-jakarta text-xs text-on-surface-secondary mb-1">Saldo Bersih</p>
        <p class="font-outfit font-extrabold text-2xl currency" :class="netBalance >= 0 ? 'text-primary' : 'text-error'">
          {{ netBalance >= 0 ? '+' : '' }}{{ formatRupiah(netBalance) }}
        </p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Bar Chart -->
      <div class="lg:col-span-2 glass-card p-6">
        <h2 class="font-outfit font-semibold text-base text-on-surface mb-5">Pemasukan vs Pengeluaran</h2>
        <div v-if="loading" class="h-64 skeleton rounded-md" />
        <div v-else-if="!monthlyData.length" class="h-64 flex items-center justify-center">
          <div class="text-center">
            <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-on-surface-secondary mx-auto mb-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <p class="font-jakarta text-sm text-on-surface-secondary">Belum ada transaksi bulan ini</p>
          </div>
        </div>
        <Bar v-else :data="barChartData" :options="barChartOptions" class="max-h-64" />
      </div>

      <!-- Donut Chart -->
      <div class="glass-card p-6">
        <h2 class="font-outfit font-semibold text-base text-on-surface mb-5">Pengeluaran per Kategori</h2>
        <div v-if="loading" class="h-48 skeleton rounded-full mx-auto w-48" />
        <div v-else-if="!expenseByCategory.length" class="flex items-center justify-center h-48">
          <p class="font-jakarta text-xs text-on-surface-secondary text-center">Belum ada pengeluaran</p>
        </div>
        <div v-else>
          <Doughnut :data="donutChartData" :options="donutOptions" class="max-h-48 mx-auto" />
          <div class="mt-4 space-y-1.5">
            <div v-for="(item, i) in expenseByCategory.slice(0, 5)" :key="item.name" class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: chartColors[i % chartColors.length] }" />
              <span class="font-jakarta text-xs text-on-surface flex-1 truncate">{{ item.name }}</span>
              <span class="font-outfit font-semibold text-xs text-on-surface currency">{{ formatRupiah(item.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="glass-card p-6 mt-6">
      <h2 class="font-outfit font-semibold text-base text-on-surface mb-5">Semua Transaksi Bulan Ini</h2>
      <div v-if="loading" class="space-y-3"><div v-for="i in 5" :key="i" class="skeleton h-14 rounded-md" /></div>
      <div v-else-if="!monthlyData.length" class="text-center py-10">
        <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-on-surface-secondary mx-auto mb-2">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p class="font-jakarta text-sm text-on-surface-secondary">Tidak ada transaksi di bulan ini</p>
      </div>
      <div v-else class="space-y-3">
        <TransactionRow v-for="tx in monthlyData" :key="tx.id" :transaction="tx" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTransactionStore } from '@/stores/transaction'
import { useFormatRupiah, useFormatDate } from '@/composables/useFormat'
import TransactionRow from '@/components/app/TransactionRow.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const transactionStore = useTransactionStore()
const { formatRupiah } = useFormatRupiah()
const { months } = useFormatDate()

const now = new Date()
const selectedYear  = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)
const monthlyData   = ref([])
const loading       = ref(false)

const chartColors = ['#17C662','#F5FF6C','#06B6D4','#8B5CF6','#F59E0B','#F43F5E','#10B981','#3B82F6']

const totalIncome  = computed(() => monthlyData.value.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0))
const totalExpense = computed(() => monthlyData.value.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0))
const netBalance   = computed(() => totalIncome.value - totalExpense.value)

const expenseByCategory = computed(() => {
  const map = {}
  monthlyData.value.filter(t => t.type === 'expense').forEach(t => {
    const key = t.category?.id || 'lainnya'
    if (!map[key]) map[key] = { name: t.category?.name || 'Lainnya', total: 0 }
    map[key].total += t.amount
  })
  return Object.values(map).sort((a,b) => b.total - a.total)
})

const barChartData = computed(() => ({
  labels: ['Bulan ini'],
  datasets: [
    { label: 'Pemasukan',   data: [totalIncome.value],  backgroundColor: 'rgba(23,198,98,0.7)',  borderRadius: 8 },
    { label: 'Pengeluaran', data: [totalExpense.value], backgroundColor: 'rgba(244,63,94,0.7)', borderRadius: 8 },
  ]
}))

const barChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: { y: { ticks: { callback: v => `IDR ${(v/1000000).toFixed(1)}jt` } } }
}

const donutChartData = computed(() => ({
  labels: expenseByCategory.value.map(c => c.name),
  datasets: [{ data: expenseByCategory.value.map(c => c.total), backgroundColor: chartColors, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' }]
}))

const donutOptions = { responsive: true, plugins: { legend: { display: false } }, cutout: '65%' }

async function loadData() {
  loading.value = true
  try { monthlyData.value = await transactionStore.fetchMonthlyReport(selectedYear.value, selectedMonth.value) }
  finally { loading.value = false }
}

function prevMonth() { if (selectedMonth.value === 1) { selectedMonth.value = 12; selectedYear.value-- } else selectedMonth.value-- }
function nextMonth() { if (selectedMonth.value === 12) { selectedMonth.value = 1; selectedYear.value++ } else selectedMonth.value++ }

watch([selectedMonth, selectedYear], loadData)
onMounted(loadData)
</script>

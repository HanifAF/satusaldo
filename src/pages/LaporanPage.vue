<template>
  <div class="animate-fade-in space-y-8 max-w-6xl mx-auto pb-12">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="font-outfit font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight">
          Laporan
        </h1>
        <p class="font-jakarta text-sm text-on-surface-secondary mt-1">
          Ringkasan keuangan bulanan kamu
        </p>
      </div>
    </div>

    <!-- Main Grid Section (Left: Total Saldo Terkini Chart, Right: Uang Masuk, Uang Keluar & Breakdown) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Left Column (Total Saldo Terkini Chart) -->
      <div class="lg:col-span-8 flex flex-col">
        <BaseAreaChart
          :show-time-toggle="true"
          :active-tab="currentTimeRange"
          :labels="currentTrendLabels"
          :datasets="currentTrendDatasets"
          :active-index="currentActiveIndex"
          :title-formatter="formatChartTitle"
          chart-id="laporan-trend"
          class="h-full flex flex-col justify-between"
          @tab-change="onTimeRangeChange"
          @select="onSelectTimeIndex"
        />
      </div>

      <!-- Right Column (Uang Masuk/Keluar + Category Breakdown Progress Bars) -->
      <div class="lg:col-span-4 flex flex-col gap-4">
        <!-- Card Uang Masuk & Uang Keluar -->
        <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-4">
          <!-- Uang Masuk -->
          <div class="pb-3 border-b border-gray-100/80">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <p class="font-jakarta text-xs text-gray-500 font-medium">Uang Masuk</p>
            </div>
            <p class="font-outfit font-extrabold text-2xl text-emerald-600 tracking-tight currency">
              IDR {{ totalIncome.toLocaleString('id-ID') }}
            </p>
          </div>

          <!-- Uang Keluar -->
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
              <p class="font-jakarta text-xs text-gray-500 font-medium">Uang Keluar</p>
            </div>
            <p class="font-outfit font-extrabold text-2xl text-rose-500 tracking-tight currency">
              IDR {{ totalExpense.toLocaleString('id-ID') }}
            </p>
          </div>
        </div>

        <!-- Card Breakdown Pengeluaran per Kategori -->
        <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex-1 flex flex-col justify-between">
          <div class="mb-2">
            <p class="font-jakarta text-xs text-gray-500 font-medium">Pengeluaran per Kategori</p>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="skeleton h-8 rounded-lg" />
          </div>

          <div v-else-if="!formattedCategoryBreakdown.length" class="text-center py-6 text-gray-400 font-jakarta text-xs">
            Belum ada data pengeluaran
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in formattedCategoryBreakdown"
              :key="item.name"
              @click="toggleCategoryFilter(item.name)"
              :class="[
                'p-2 -mx-2 rounded-xl transition-all duration-200 cursor-pointer space-y-1.5',
                selectedCategoryFilter === item.name
                  ? 'bg-emerald-50/80 ring-1 ring-emerald-300'
                  : 'hover:bg-gray-50/80'
              ]"
              :title="`Klik untuk memfilter transaksi ${item.name}`"
            >
              <!-- Info Bar: Dot + Name + Amount -->
              <div class="flex items-center justify-between text-xs font-jakarta">
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: item.color }"
                  />
                  <span class="font-medium text-gray-700 truncate">{{ item.name }}</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="font-outfit font-bold text-gray-900">IDR {{ Number(item.total).toLocaleString('id-ID') }}</span>
                </div>
              </div>

              <!-- Horizontal Progress Bar (Visual Comparison) -->
              <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500 ease-out"
                  :style="{
                    width: `${item.total > 0 ? Math.max(item.percentage, 3) : 0}%`,
                    backgroundColor: item.color
                  }"
                />
              </div>
            </div>

            <!-- Reconciliation Total Footer -->
            <div class="mt-2 pt-2.5 border-t border-gray-100/90 flex items-center justify-between text-[11px] font-jakarta text-gray-400">
              <span>Total dari Uang Keluar</span>
              <span class="font-bold text-gray-700">IDR {{ totalExpense.toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Section -->
    <div class="pt-2">
      <!-- Section Header with Title, Legend & Export Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <!-- Left: Title & Shared Legend -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 class="font-outfit font-bold text-xl sm:text-2xl text-on-surface tracking-tight">
            Riwayat Transaksi
          </h2>
          <TransactionLegend />
        </div>

        <!-- Right: Export CSV / Excel Button (Top-Right Action) -->
        <button
          @click="exportToCSV"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 font-jakarta text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs cursor-pointer active:scale-95 self-start sm:self-auto"
          title="Ekspor Laporan Transaksi ke CSV / Excel"
        >
          <svg class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export CSV / Excel</span>
        </button>
      </div>

      <!-- Main Card Container -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <!-- Deep-Dive Filter Bar inside Card -->
        <div class="p-4 sm:p-5 flex flex-col gap-3 border-b border-gray-100">
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
            <!-- Left: Search Input -->
            <div class="relative flex-1 min-w-[200px]">
              <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari transaksi..."
                class="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-gray-700 placeholder-gray-400 transition-colors"
              />
            </div>

            <!-- Right: Filter Dropdowns Suite -->
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Month Filter Dropdown -->
              <FilterCustomDropdown
                v-model="selectedMonth"
                :options="monthOptions"
                title="Pilih Bulan"
                placeholder="Bulan"
                defaultIcon="calendar"
                defaultIconBg="bg-emerald-50 text-emerald-600"
              />

              <!-- Year Filter Dropdown -->
              <FilterCustomDropdown
                v-model="selectedYear"
                :options="yearOptions"
                title="Pilih Tahun"
                placeholder="Tahun"
                defaultIcon="clock"
                defaultIconBg="bg-blue-50 text-blue-600"
              />

              <!-- Type Filter (Jenis Transaksi) -->
              <FilterCustomDropdown
                v-model="selectedTypeFilter"
                :options="typeFilterOptions"
                title="Jenis Transaksi"
                placeholder="Semua Jenis"
                defaultIcon="grid"
                defaultIconBg="bg-gray-100 text-gray-700"
              />

              <!-- Category Filter (Kategori) -->
              <FilterCustomDropdown
                v-model="selectedCategoryFilter"
                :options="categoryFilterOptions"
                title="Kategori Transaksi"
                placeholder="Kategori"
                defaultIcon="grid"
                defaultIconBg="bg-purple-50 text-purple-600"
              />

              <!-- Wallet Filter (Dompet) -->
              <FilterCustomDropdown
                v-model="selectedWalletFilter"
                :options="walletFilterOptions"
                title="Dompet / Akun"
                placeholder="Dompet"
                defaultIcon="wallet"
                defaultIconBg="bg-emerald-50 text-emerald-600"
                placement="right"
              />

              <!-- Reset Button (Shown when filters are active) -->
              <button
                v-if="isAnyFilterActive"
                @click="resetLaporanFilters"
                class="px-3 py-2 text-xs sm:text-sm font-jakarta font-medium border border-gray-200 rounded-xl bg-white hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 cursor-pointer shadow-2xs transition-colors"
                title="Reset / Atur Ulang Filter"
              >
                <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                <span>Filter</span>
              </button>
            </div>
          </div>

          <!-- Active Filter Tags Row (Shown only when multi-filter is active) -->
          <div v-if="activeFilterTags.length > 1" class="flex items-center gap-2 flex-wrap pt-0.5">
            <div
              v-for="tag in activeFilterTags"
              :key="tag.key"
              class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium shadow-2xs"
            >
              <span>{{ tag.label }}</span>
              <button @click="tag.remove" class="hover:text-emerald-900 cursor-pointer flex items-center justify-center">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Reset Link -->
            <button
              @click="resetLaporanFilters"
              class="text-xs font-jakarta font-semibold text-gray-400 hover:text-gray-700 ml-1 cursor-pointer transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Active Category Filter Banner (when single category clicked from chart panel) -->
        <div
          v-if="selectedCategoryFilter && selectedCategoryFilter !== 'all' && activeFilterTags.length <= 1"
          class="bg-emerald-50/70 px-4 sm:px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between gap-3 text-xs font-jakarta text-emerald-900"
        >
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Menampilkan transaksi kategori: <strong>{{ selectedCategoryFilter }}</strong></span>
          </div>
          <button
            @click="selectedCategoryFilter = 'all'"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 text-xs transition-colors cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Hapus Filter Kategori</span>
          </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="p-6 space-y-3">
          <div v-for="i in 4" :key="i" class="skeleton h-14 rounded-xl" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredMonthlyTransactions.length" class="text-center py-14 px-4">
          <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-2.5">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 class="font-outfit font-bold text-sm text-gray-800 mb-1">Tidak Ada Transaksi</h3>
          <p class="font-jakarta text-xs text-gray-500 max-w-sm mx-auto">
            Tidak ada riwayat transaksi pada {{ months[selectedMonth - 1] }} {{ selectedYear }}.
          </p>
        </div>

        <!-- Grouped Transactions by Date inside Card -->
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="group in groupedMonthlyTransactions"
            :key="group.date"
            class="w-full"
          >
            <!-- Date Section Header Bar -->
            <div class="bg-gray-50/80 px-4 sm:px-6 py-2.5 border-y border-gray-100/90 flex items-center justify-between">
              <!-- Left: Calendar icon + Date label -->
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span class="font-jakarta font-semibold text-xs text-gray-800">
                  {{ group.dateLabel }}
                </span>
              </div>

              <!-- Right: Transaction count with transfer details & Net sum -->
              <div class="flex items-center gap-3">
                <span class="font-jakarta text-xs text-gray-400 font-normal">
                  {{ group.countLabel }}
                </span>
                <span :class="group.summary.class">
                  {{ group.summary.text }}
                </span>
              </div>
            </div>

            <!-- Transaction Rows inside this Date Group -->
            <div>
              <TransactionRow
                v-for="tx in group.transactions"
                :key="tx.id"
                :transaction="tx"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah, useFormatDate } from '@/composables/useFormat'
import TransactionRow from '@/components/app/TransactionRow.vue'
import TransactionLegend from '@/components/app/TransactionLegend.vue'
import BaseAreaChart from '@/components/ui/BaseAreaChart.vue'
import FilterCustomDropdown from '@/components/app/FilterCustomDropdown.vue'

const transactionStore = useTransactionStore()
const walletStore = useWalletStore()
const { formatRupiah } = useFormatRupiah()
const { months, formatGroupDate } = useFormatDate()

const now = new Date()
const selectedYear  = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)
const searchQuery   = ref('')
const selectedTypeFilter = ref('all')
const selectedCategoryFilter = ref('all')
const selectedWalletFilter = ref('all')
const monthlyData   = ref([])
const loading       = ref(false)

function toggleCategoryFilter(categoryName) {
  if (selectedCategoryFilter.value === categoryName) {
    selectedCategoryFilter.value = 'all'
  } else {
    selectedCategoryFilter.value = categoryName
  }
}

// Month Options for dropdown
const monthOptions = [
  { value: 1, label: 'Januari', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 2, label: 'Februari', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 3, label: 'Maret', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 4, label: 'April', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 5, label: 'Mei', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 6, label: 'Juni', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 7, label: 'Juli', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 8, label: 'Agustus', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 9, label: 'September', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 10, label: 'Oktober', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 11, label: 'November', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 12, label: 'Desember', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
]

// Year Options for dropdown
const yearOptions = [
  { value: 2024, label: '2024', icon: 'clock', iconBg: 'bg-blue-50 text-blue-600' },
  { value: 2025, label: '2025', icon: 'clock', iconBg: 'bg-blue-50 text-blue-600' },
  { value: 2026, label: '2026', icon: 'clock', iconBg: 'bg-blue-50 text-blue-600' },
  { value: 2027, label: '2027', icon: 'clock', iconBg: 'bg-blue-50 text-blue-600' },
]

// Type Filter Options
const typeFilterOptions = [
  { value: 'all', label: 'Semua Jenis', sublabel: 'Semua tipe transaksi', icon: 'grid', iconBg: 'bg-gray-100 text-gray-700' },
  { value: 'expense', label: 'Pengeluaran', sublabel: 'Transaksi uang keluar', icon: 'expense', iconBg: 'bg-rose-50 text-rose-600' },
  { value: 'income', label: 'Pemasukan', sublabel: 'Transaksi uang masuk', icon: 'income', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 'transfer', label: 'Transfer', sublabel: 'Pindah saldo antar dompet', icon: 'transfer', iconBg: 'bg-blue-50 text-blue-600' },
]

// Category Filter Options
const categoryFilterOptions = [
  { value: 'all', label: 'Semua Kategori', sublabel: 'Semua kategori', icon: 'grid', iconBg: 'bg-gray-100 text-gray-700' },
  { isHeader: true, header: 'Pengeluaran' },
  { value: 'Tagihan', label: 'Tagihan', sublabel: 'Listrik, kos & tagihan', icon: 'bill', iconBg: 'bg-amber-50 text-amber-600' },
  { value: 'Belanja', label: 'Belanja', sublabel: 'Kebutuhan mingguan/bulanan', icon: 'shopping', iconBg: 'bg-pink-50 text-pink-600' },
  { value: 'Makanan & Minuman', label: 'Makanan & Minuman', sublabel: 'Makan & minum harian', icon: 'food', iconBg: 'bg-orange-50 text-orange-600' },
  { value: 'Hiburan', label: 'Hiburan', sublabel: 'Nonton, game & streaming', icon: 'entertainment', iconBg: 'bg-indigo-50 text-indigo-600' },
  { value: 'Transport', label: 'Transport', sublabel: 'Bensin, ojek & parkir', icon: 'transport', iconBg: 'bg-cyan-50 text-cyan-600' },
  { value: 'Biaya Admin', label: 'Biaya Admin / Fee', sublabel: 'Fee transfer internal', icon: 'other', iconBg: 'bg-gray-100 text-gray-600' },
  { isHeader: true, header: 'Pemasukan' },
  { value: 'Gaji', label: 'Gaji', sublabel: 'Pendapatan bulanan', icon: 'salary', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 'Freelance', label: 'Freelance', sublabel: 'Proyek sampingan', icon: 'freelance', iconBg: 'bg-violet-50 text-violet-600' },
]

// Wallet Filter Options
const walletFilterOptions = computed(() => {
  const bankName = walletStore.bankWallet?.name || 'Bank BCA'
  const ewalletName = walletStore.ewalletWallet?.name || 'Gopay'
  const cashName = walletStore.cashWallet?.name || 'Tunai'

  return [
    { value: 'all', label: 'Semua Dompet', sublabel: 'Semua akun dompet', icon: 'wallet', iconBg: 'bg-gray-100 text-gray-700' },
    { value: 'bank', label: bankName, sublabel: 'Rekening bank', icon: 'bank', iconBg: 'bg-blue-50 text-blue-600' },
    { value: 'ewallet', label: ewalletName, sublabel: 'E-Wallet digital', icon: 'ewallet', iconBg: 'bg-emerald-50 text-emerald-600' },
    { value: 'cash', label: cashName, sublabel: 'Uang tunai fisik', icon: 'cash', iconBg: 'bg-amber-50 text-amber-600' },
  ]
})

function resetLaporanFilters() {
  searchQuery.value = ''
  selectedTypeFilter.value = 'all'
  selectedCategoryFilter.value = 'all'
  selectedWalletFilter.value = 'all'
}

const isAnyFilterActive = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    selectedTypeFilter.value !== 'all' ||
    (selectedCategoryFilter.value && selectedCategoryFilter.value !== 'all') ||
    selectedWalletFilter.value !== 'all'
  )
})

const activeFilterTags = computed(() => {
  const tags = []

  if (searchQuery.value.trim()) {
    tags.push({
      key: 'search',
      label: `"${searchQuery.value.trim()}"`,
      remove: () => { searchQuery.value = '' }
    })
  }

  if (selectedTypeFilter.value !== 'all') {
    const map = { expense: 'Pengeluaran', income: 'Pemasukan', transfer: 'Transfer' }
    tags.push({
      key: 'type',
      label: map[selectedTypeFilter.value] || selectedTypeFilter.value,
      remove: () => { selectedTypeFilter.value = 'all' }
    })
  }

  if (selectedCategoryFilter.value && selectedCategoryFilter.value !== 'all') {
    tags.push({
      key: 'category',
      label: selectedCategoryFilter.value,
      remove: () => { selectedCategoryFilter.value = 'all' }
    })
  }

  if (selectedWalletFilter.value !== 'all') {
    const map = { bank: 'Bank BCA', ewallet: 'Gopay', cash: 'Tunai' }
    tags.push({
      key: 'wallet',
      label: map[selectedWalletFilter.value] || selectedWalletFilter.value,
      remove: () => { selectedWalletFilter.value = 'all' }
    })
  }

  return tags
})

// ============================================================
// DATASETS FOR AREA CHART (Today, Month, All Time)
// ============================================================
const currentTimeRange = ref('month')

// 1. Drill-down harian 24 jam (Today)
const todayLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Sekarang']
const todayBalanceData = [
  11_250_000,
  11_250_000,
  11_800_000,
  11_650_000,
  11_500_000,
  11_500_000,
  11_500_000,
]

// 2. Drill-down harian di bulan berjalan (Agustus: 1–8 Agu konsisten per hari)
const monthDayLabels = ['1 Agu', '2 Agu', '3 Agu', '4 Agu', '5 Agu', '6 Agu', '7 Agu', '8 Agu']
const monthDayBalanceData = [
  4_740_000,  // 1 Agu (awal bulan)
  4_740_000,  // 2 Agu
  4_740_000,  // 3 Agu
  4_740_000,  // 4 Agu
  3_540_000,  // 5 Agu (bayar kos -1.2M)
  3_286_000,  // 6 Agu (netflix -54k, topup ewallet -200k, fee -1k)
  11_500_000, // 7 Agu (gaji +8.5M masuk, belanja, makan, transport)
  11_500_000, // 8 Agu (Hari ini - Saldo Terkini)
]

// 3. Trend tahun berjalan (All Time / Year-to-Date Jan–Agu 2026)
const allTimeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu']
const allTimeBalanceData = [
  6_200_000,  // Jan
  5_850_000,  // Feb
  6_600_000,  // Mar
  8_400_000,  // Apr
  8_100_000,  // Mei
  7_200_000,  // Jun
  6_450_000,  // Jul (akhir Juli)
  11_500_000, // Agu (Saldo Terkini)
]

const selectedTodayHourIndex = ref(todayLabels.length - 1)
const selectedMonthDayIndex = ref(monthDayLabels.length - 1)
const selectedAllTimeIndex = ref(allTimeLabels.length - 1)

const currentTrendLabels = computed(() => {
  if (currentTimeRange.value === 'today') return todayLabels
  if (currentTimeRange.value === 'month') return monthDayLabels
  return allTimeLabels
})

const currentTrendDatasets = computed(() => {
  let data = monthDayBalanceData
  if (currentTimeRange.value === 'today') {
    data = todayBalanceData
  } else if (currentTimeRange.value === 'all') {
    data = allTimeBalanceData
  }
  return [
    { label: 'Total Saldo', data, color: '#17C662' },
  ]
})

const currentActiveIndex = computed(() => {
  if (currentTimeRange.value === 'today') return selectedTodayHourIndex.value
  if (currentTimeRange.value === 'month') return selectedMonthDayIndex.value
  return selectedAllTimeIndex.value
})

function onTimeRangeChange(tabId) {
  currentTimeRange.value = tabId
  if (tabId === 'today') {
    selectedTodayHourIndex.value = todayLabels.length - 1
  } else if (tabId === 'month') {
    selectedMonthDayIndex.value = monthDayLabels.length - 1
  } else if (tabId === 'all') {
    selectedAllTimeIndex.value = allTimeLabels.length - 1
  }
}

function onSelectTimeIndex(index) {
  if (currentTimeRange.value === 'today') {
    selectedTodayHourIndex.value = index
  } else if (currentTimeRange.value === 'month') {
    selectedMonthDayIndex.value = index
  } else {
    selectedAllTimeIndex.value = index
  }
}

function formatChartTitle({ index, label, isLatest, tab }) {
  if (isLatest || index === -1) {
    return 'TOTAL SALDO TERKINI'
  }
  if (tab === 'today') {
    if (label === 'Sekarang') return 'TOTAL SALDO TERKINI'
    return `SALDO PUKUL ${label} WIB`
  }
  if (tab === 'month') {
    return `SALDO PER ${label.toUpperCase()} 2026`
  }
  // All Time / Jan-Agu
  const monthMap = {
    'Jan': 'JANUARI', 'Feb': 'FEBRUARI', 'Mar': 'MARET', 'Apr': 'APRIL',
    'Mei': 'MEI', 'Jun': 'JUNI', 'Jul': 'JULI', 'Agu': 'AGUSTUS'
  }
  const monthName = monthMap[label] || (label ? label.toUpperCase() : '')
  return `SALDO PER AKHIR ${monthName} 2026`
}

// ============================================================
// FINANCIAL SUMMARY COMPUTATIONS (Filter: Bulan Terpilih)
// ============================================================
const totalIncome = computed(() => {
  return monthlyData.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

const totalExpense = computed(() => {
  return monthlyData.value.reduce((sum, t) => {
    if (t.type === 'expense') return sum + (t.amount || 0)
    if (t.type === 'transfer') return sum + (t.admin_fee || 0)
    return sum
  }, 0)
})

function formatShortAmount(amount) {
  if (!amount) return '0'
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + 'k'
  }
  return String(amount)
}

const categoryColorMap = {
  'Tagihan': '#10B981',           // Emerald green
  'Belanja': '#F59E0B',           // Warm Amber / Gold
  'Makanan & Minuman': '#3B82F6', // Blue
  'Makan & Minum': '#3B82F6',
  'Hiburan': '#8B5CF6',           // Purple
  'Transport': '#06B6D4',         // Cyan / Teal (Distinct from Belanja amber)
  'Transportasi': '#06B6D4',
  'Biaya Admin / Fee': '#64748B', // Slate
  'Biaya Admin': '#64748B',
  'Lainnya': '#94A3B8',
}

const fallbackColors = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#F97316', '#EC4899', '#06B6D4', '#64748B']

// Largest Remainder Method (Hare-Niemeyer) for 100% exact percentage distribution
function calculatePercentages(items, total) {
  if (!total || total <= 0 || !items.length) {
    return items.map(it => ({ ...it, percentage: 0 }))
  }

  // 1. Calculate raw percentage, floor, and remainder
  const processed = items.map((it, idx) => {
    const raw = it.total > 0 ? (it.total / total) * 100 : 0
    const floor = Math.floor(raw)
    const remainder = raw - floor
    return {
      ...it,
      originalIndex: idx,
      raw,
      floor,
      remainder,
      percentage: floor,
    }
  })

  // 2. Total floor sum and remaining diff
  const sumFloors = processed.reduce((s, it) => s + it.floor, 0)
  const diff = 100 - sumFloors

  // 3. Sort items with total > 0 by remainder descending and distribute remaining +1%
  const positiveItems = [...processed]
    .filter(it => it.total > 0)
    .sort((a, b) => b.remainder - a.remainder)

  for (let i = 0; i < diff && i < positiveItems.length; i++) {
    const target = processed.find(p => p.originalIndex === positiveItems[i].originalIndex)
    if (target) {
      target.percentage += 1
    }
  }

  // 4. Restore original sort order
  processed.sort((a, b) => a.originalIndex - b.originalIndex)

  return processed
}

const formattedCategoryBreakdown = computed(() => {
  const map = {}
  let totalAdminFee = 0

  monthlyData.value.forEach(t => {
    if (t.type === 'expense') {
      const name = t.category?.name || 'Lainnya'
      if (!map[name]) map[name] = 0
      map[name] += (t.amount || 0)
    } else if (t.type === 'transfer') {
      totalAdminFee += (t.admin_fee || 0)
    }
  })

  // Selalu tampilkan baris fee, termasuk saat IDR 0
  map['Biaya Admin / Fee'] = totalAdminFee

  const list = Object.entries(map).map(([name, total]) => ({
    name: name === 'Makanan & Minuman' ? 'Makan & Minum' : name,
    total,
  })).sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total
    }
    // Jika nominal sama (misal 0), tempatkan Biaya Admin / Fee di paling bawah
    if (a.name === 'Biaya Admin / Fee') return 1
    if (b.name === 'Biaya Admin / Fee') return -1
    return a.name.localeCompare(b.name)
  })

  const expTotal = totalExpense.value || 1
  const listWithPercentages = calculatePercentages(list, expTotal)

  return listWithPercentages.map((item, idx) => ({
    ...item,
    formattedShortAmount: formatShortAmount(item.total),
    color: categoryColorMap[item.name] || fallbackColors[idx % fallbackColors.length]
  }))
})

// ============================================================
// FILTERED & GROUPED TRANSACTIONS
// ============================================================
const filteredMonthlyTransactions = computed(() => {
  let list = monthlyData.value || []

  // 1. Search Query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(tx => {
      const title = (tx.category?.name || (tx.type === 'transfer' ? 'transfer saldo' : tx.type === 'income' ? 'pemasukan' : 'pengeluaran')).toLowerCase()
      const note = (tx.note || '').toLowerCase()
      return title.includes(q) || note.includes(q)
    })
  }

  // 2. Type Filter
  if (selectedTypeFilter.value !== 'all') {
    list = list.filter(tx => tx.type === selectedTypeFilter.value)
  }

  // 3. Category Filter
  if (selectedCategoryFilter.value && selectedCategoryFilter.value !== 'all') {
    const catName = selectedCategoryFilter.value.toLowerCase()
    list = list.filter(tx => {
      if (catName.includes('biaya admin') || catName.includes('fee')) {
        return tx.type === 'transfer'
      }
      const name = (tx.category?.name || '').toLowerCase()
      if (catName === 'makan & minum' || catName === 'makanan & minuman') {
        return name.includes('makan') || name.includes('minum')
      }
      return name.includes(catName)
    })
  }

  // 4. Wallet Filter
  if (selectedWalletFilter.value !== 'all') {
    list = list.filter(tx => {
      const srcType = tx.wallet?.type || tx.wallet_type
      const toType = tx.to_wallet?.type || tx.to_wallet_type
      return srcType === selectedWalletFilter.value || toType === selectedWalletFilter.value
    })
  }

  return list
})

function formatGroupDateLabel(dateStr) {
  return formatGroupDate(dateStr)
}

function calculateGroupSummary(transactions) {
  let net = 0
  let hasTransfer = false
  let transferAmount = 0
  let expenseSum = 0
  let incomeSum = 0
  let feeSum = 0

  transactions.forEach(t => {
    if (t.type === 'income') {
      net += (t.amount || 0)
      incomeSum += (t.amount || 0)
    } else if (t.type === 'expense') {
      net -= (t.amount || 0)
      expenseSum += (t.amount || 0)
    } else if (t.type === 'transfer') {
      hasTransfer = true
      transferAmount += (t.amount || 0)
      if ((t.admin_fee || 0) > 0) {
        net -= t.admin_fee
        feeSum += t.admin_fee
      }
    }
  })

  // If there are only internal transfers with 0 net change (no fee)
  if (hasTransfer && incomeSum === 0 && expenseSum === 0 && feeSum === 0) {
    return {
      text: `IDR ${transferAmount.toLocaleString('id-ID')}`,
      class: 'text-gray-500 font-bold font-jakarta text-xs sm:text-sm'
    }
  }

  const totalOut = expenseSum + feeSum
  if (incomeSum === 0 && totalOut > 0) {
    return {
      text: `-IDR ${totalOut.toLocaleString('id-ID')}`,
      class: 'text-gray-700 font-bold font-jakarta text-xs sm:text-sm'
    }
  }

  if (net < 0) {
    return {
      text: `-IDR ${Math.abs(net).toLocaleString('id-ID')}`,
      class: 'text-gray-700 font-bold font-jakarta text-xs sm:text-sm'
    }
  } else if (net > 0) {
    return {
      text: `+IDR ${net.toLocaleString('id-ID')}`,
      class: 'text-emerald-600 font-bold font-jakarta text-xs sm:text-sm'
    }
  } else {
    return {
      text: `IDR ${transferAmount.toLocaleString('id-ID')}`,
      class: 'text-gray-500 font-bold font-jakarta text-xs sm:text-sm'
    }
  }
}

const groupedMonthlyTransactions = computed(() => {
  const list = filteredMonthlyTransactions.value
  if (!list.length) return []

  const groups = {}
  list.forEach(tx => {
    const d = tx.date
    if (!groups[d]) groups[d] = []
    groups[d].push(tx)
  })

  const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a))

  return sortedDates.map(d => {
    const txs = groups[d]
    const totalCount = txs.length
    const transferCount = txs.filter(t => t.type === 'transfer').length

    let countLabel = `${totalCount} transaksi`
    if (transferCount > 0) {
      if (totalCount === transferCount) {
        countLabel = `${totalCount} transfer internal`
      } else {
        countLabel = `${totalCount} transaksi (${transferCount} transfer internal)`
      }
    }

    return {
      date: d,
      dateLabel: formatGroupDateLabel(d),
      transactions: txs,
      countLabel,
      summary: calculateGroupSummary(txs)
    }
  })
})

// ============================================================
// EXPORT TO CSV / EXCEL
// ============================================================
function exportToCSV() {
  const data = filteredMonthlyTransactions.value || []
  if (!data.length) {
    alert('Tidak ada data transaksi untuk diekspor.')
    return
  }

  const headers = ['ID', 'Tanggal', 'Waktu', 'Tipe', 'Kategori', 'Catatan', 'Dompet Asal', 'Dompet Tujuan', 'Nominal (IDR)', 'Biaya Admin (IDR)']
  
  const rows = data.map(tx => [
    tx.id,
    tx.date,
    tx.time || '-',
    tx.type === 'income' ? 'Pemasukan' : tx.type === 'expense' ? 'Pengeluaran' : 'Transfer',
    tx.category?.name || (tx.type === 'transfer' ? 'Transfer Saldo' : '-'),
    `"${(tx.note || '').replace(/"/g, '""')}"`,
    tx.wallet?.type || tx.wallet_type || '-',
    tx.to_wallet?.type || tx.to_wallet_type || '-',
    tx.amount || 0,
    tx.admin_fee || 0
  ])

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const monthName = months[selectedMonth.value - 1] || selectedMonth.value
  link.setAttribute('href', url)
  link.setAttribute('download', `SatuSaldo_Laporan_${monthName}_${selectedYear.value}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function loadData() {
  loading.value = true
  try {
    monthlyData.value = await transactionStore.fetchMonthlyReport(selectedYear.value, selectedMonth.value)
  } finally {
    loading.value = false
  }
}

watch([selectedMonth, selectedYear], loadData)
onMounted(loadData)
</script>


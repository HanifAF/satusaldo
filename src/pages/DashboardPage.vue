<template>
  <div class="animate-fade-in space-y-8 max-w-6xl mx-auto pb-12">
    <!-- Top Greeting Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="font-jakarta text-sm text-on-surface-secondary mb-1">
          Selamat datang kembali, {{ userFirstName }}
        </p>
        <h1 class="font-outfit font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight">
          Ringkasan Keuangan
        </h1>
      </div>
    </div>

    <!-- Main Grid Section (Left: AKSI CEPAT + Wallets, Right: Card Total Saldo) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- Left Column (AKSI CEPAT & Wallets) -->
      <div class="lg:col-span-4 flex flex-col justify-between gap-3 sm:gap-4">
        
        <!-- Card AKSI CEPAT -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 class="font-outfit font-bold text-xs uppercase tracking-wider text-on-surface-secondary">
              AKSI CEPAT
            </h3>
          </div>
          <button 
            @click="showModal = true"
            class="mt-3 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-on-surface font-jakarta font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>+ Tambah Transaksi</span>
          </button>
        </div>

        <!-- Stacked Wallet Cards (BCA, Gopay, Tunai) with Sub-header -->
        <div class="space-y-2.5">
          <div class="px-1 pt-0.5">
            <h3 class="font-outfit font-bold text-xs uppercase tracking-wider text-on-surface-secondary">
              Saldo per Dompet
            </h3>
          </div>
          <!-- BCA -->
          <div class="bg-white hover:bg-gray-50/80 border border-gray-200/80 px-4 sm:px-5 py-3 rounded-2xl transition-all flex items-center justify-between shadow-sm">
            <span class="font-outfit font-bold text-sm sm:text-base text-gray-800">BCA</span>
            <span class="font-outfit font-semibold text-sm text-gray-700 currency">
              {{ walletStore.balanceHidden ? 'IDR ***' : formatRupiah(walletStore.bankWallet?.balance || 0) }}
            </span>
          </div>

          <!-- Gopay -->
          <div class="bg-white hover:bg-gray-50/80 border border-gray-200/80 px-4 sm:px-5 py-3 rounded-2xl transition-all flex items-center justify-between shadow-sm">
            <span class="font-outfit font-bold text-sm sm:text-base text-gray-800">Gopay</span>
            <span class="font-outfit font-semibold text-sm text-gray-700 currency">
              {{ walletStore.balanceHidden ? 'IDR ***' : formatRupiah(walletStore.ewalletWallet?.balance || 0) }}
            </span>
          </div>

          <!-- Tunai -->
          <div class="bg-white hover:bg-gray-50/80 border border-gray-200/80 px-4 sm:px-5 py-3 rounded-2xl transition-all flex items-center justify-between shadow-sm">
            <span class="font-outfit font-bold text-sm sm:text-base text-gray-800">Tunai</span>
            <span class="font-outfit font-semibold text-sm text-gray-700 currency">
              {{ walletStore.balanceHidden ? 'IDR ***' : formatRupiah(walletStore.cashWallet?.balance || 0) }}
            </span>
          </div>
        </div>

      </div>

      <!-- Right Column (Card Total Saldo) -->
      <div class="lg:col-span-8 flex">
        <HeroCard class="w-full" />
      </div>

    </div>

    <!-- Transactions Section (Clean Modern List with Date & Service Filters) -->
    <div class="pt-2">
      <!-- Section Title & Subtitle + Legend outside Card -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 class="font-outfit font-bold text-xl sm:text-2xl text-on-surface tracking-tight">
            Aktivitas Terakhir
          </h2>
          <p class="font-jakarta text-xs sm:text-sm text-on-surface-secondary mt-0.5">
            Pantau transaksi masuk, keluar, dan perpindahan saldo dalam satu riwayat yang mudah dipindai.
          </p>
        </div>

        <!-- Shared Transaction Legend -->
        <TransactionLegend />
      </div>

      <!-- Main Card Container -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <!-- Top Filter Bar inside Card -->
        <div class="p-4 sm:p-5 flex flex-col gap-3 border-b border-gray-100">
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
            <!-- Search Input -->
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

            <!-- Dropdowns & Filter Controls -->
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Date Filter (30 Hari) -->
              <FilterCustomDropdown
                v-model="selectedDateFilter"
                v-model:customDate="customDate"
                :options="dateFilterOptions"
                :allowCustomDate="true"
                title="Rentang Waktu"
                placeholder="Semua Waktu"
                defaultIcon="clock"
                defaultIconBg="bg-blue-50 text-blue-600"
              />

              <!-- Type Filter (Semua Jenis) -->
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

              <!-- Filter Button -->
              <button
                @click="resetAllFilters"
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
              @click="resetAllFilters"
              class="text-xs font-jakarta font-semibold text-gray-400 hover:text-gray-700 ml-1 cursor-pointer transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="transactionStore.loading" class="p-6 space-y-3">
          <div v-for="i in 4" :key="i" class="skeleton h-14 rounded-xl" />
        </div>

        <!-- Global Empty State -->
        <div v-else-if="!transactionStore.transactions.length" class="text-center py-16 px-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h3 class="font-outfit font-bold text-base text-gray-800 mb-1">Belum Ada Transaksi</h3>
          <p class="font-jakarta text-xs text-gray-500 max-w-sm mx-auto mb-5">
            Mulai catat transaksi pemasukan atau pengeluaran pertama Anda.
          </p>
          <BaseButton variant="primary" size="sm" @click="showModal = true" class="!rounded-full !px-5">
            Catat Transaksi Sekarang
          </BaseButton>
        </div>

        <!-- Filtered Empty State -->
        <div v-else-if="!filteredTransactions.length" class="text-center py-12 px-4">
          <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-2.5">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <h3 class="font-outfit font-bold text-sm text-gray-800 mb-1">Tidak Ada Transaksi Ditemukan</h3>
          <p class="font-jakarta text-xs text-gray-500 max-w-sm mx-auto mb-3">
            Tidak ada riwayat transaksi yang cocok dengan filter yang dipilih.
          </p>
          <button
            @click="resetAllFilters"
            class="text-xs font-jakarta font-semibold text-emerald-600 hover:underline cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>

        <!-- Grouped Transactions by Date inside Card -->
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="group in groupedTransactions"
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

              <!-- Right: Transaction count & Net sum -->
              <div class="flex items-center gap-3">
                <span class="font-jakarta text-xs text-gray-400 font-normal">
                  {{ group.transactions.length }} transaksi
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

    <!-- Modal Transaksi -->
    <ModalTransaksi v-model="showModal" @success="handleTransactionSuccess" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'
import { useWalletStore } from '@/stores/wallet'
import { useBillStore } from '@/stores/bill'
import { useDebtStore } from '@/stores/debt'
import { useCategoryStore } from '@/stores/category'
import { useFormatRupiah, useFormatDate } from '@/composables/useFormat'
import HeroCard from '@/components/app/HeroCard.vue'
import TransactionRow from '@/components/app/TransactionRow.vue'
import TransactionLegend from '@/components/app/TransactionLegend.vue'
import ModalTransaksi from '@/components/app/ModalTransaksi.vue'
import FilterCustomDropdown from '@/components/app/FilterCustomDropdown.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const walletStore = useWalletStore()
const transactionStore = useTransactionStore()
const billStore = useBillStore()
const debtStore = useDebtStore()
const categoryStore = useCategoryStore()
const { formatRupiah } = useFormatRupiah()
const { formatGroupDate } = useFormatDate()

const showModal = ref(false)

// Filters State
const searchQuery = ref('')
const selectedDateFilter = ref('30d')
const customDate = ref('')
const selectedTypeFilter = ref('all')
const selectedCategoryFilter = ref('all')
const selectedWalletFilter = ref('all')

const dateFilterOptions = [
  { value: 'all', label: 'Semua Waktu', sublabel: 'Seluruh riwayat transaksi', icon: 'clock', iconBg: 'bg-blue-50 text-blue-600' },
  { value: '7d', label: '7 Hari', sublabel: '7 hari terakhir', icon: 'calendar', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: '30d', label: '30 Hari', sublabel: '30 hari terakhir', icon: 'calendar', iconBg: 'bg-purple-50 text-purple-600' },
  { value: '90d', label: '90 Hari', sublabel: '90 hari terakhir', icon: 'calendar', iconBg: 'bg-amber-50 text-amber-600' },
  { value: 'custom', label: 'Atur Tanggal Langsung', sublabel: 'Pilih tanggal spesifik', icon: 'calendar-edit', iconBg: 'bg-rose-50 text-rose-600' },
]

const typeFilterOptions = [
  { value: 'all', label: 'Semua Jenis', sublabel: 'Semua tipe transaksi', icon: 'grid', iconBg: 'bg-gray-100 text-gray-700' },
  { value: 'expense', label: 'Pengeluaran', sublabel: 'Transaksi uang keluar', icon: 'expense', iconBg: 'bg-rose-50 text-rose-600' },
  { value: 'income', label: 'Pemasukan', sublabel: 'Transaksi uang masuk', icon: 'income', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 'transfer', label: 'Transfer', sublabel: 'Pindah saldo antar dompet', icon: 'transfer', iconBg: 'bg-blue-50 text-blue-600' },
]

const categoryFilterOptions = [
  { value: 'all', label: 'Semua Kategori', sublabel: 'Semua kategori', icon: 'grid', iconBg: 'bg-gray-100 text-gray-700' },
  { isHeader: true, header: 'Pengeluaran' },
  { value: 'Makanan & Minuman', label: 'Makanan & Minuman', sublabel: 'Makan, jajan & kafe', icon: 'food', iconBg: 'bg-orange-50 text-orange-600' },
  { value: 'Transport', label: 'Transport', sublabel: 'Bensin, ojek & tiket', icon: 'transport', iconBg: 'bg-cyan-50 text-cyan-600' },
  { value: 'Belanja', label: 'Belanja', sublabel: 'Kebutuhan & pakaian', icon: 'shopping', iconBg: 'bg-pink-50 text-pink-600' },
  { value: 'Tagihan', label: 'Tagihan', sublabel: 'Listrik, pulsa & wifi', icon: 'bill', iconBg: 'bg-amber-50 text-amber-600' },
  { value: 'Hiburan', label: 'Hiburan', sublabel: 'Nonton, game & streaming', icon: 'entertainment', iconBg: 'bg-indigo-50 text-indigo-600' },
  { value: 'Kesehatan', label: 'Kesehatan', sublabel: 'Obat, dokter & vitamin', icon: 'health', iconBg: 'bg-red-50 text-red-600' },
  { value: 'Pendidikan', label: 'Pendidikan', sublabel: 'Buku, kursus & spp', icon: 'education', iconBg: 'bg-teal-50 text-teal-600' },
  { isHeader: true, header: 'Pemasukan' },
  { value: 'Gaji', label: 'Gaji', sublabel: 'Pendapatan utama bulanan', icon: 'salary', iconBg: 'bg-emerald-50 text-emerald-600' },
  { value: 'Freelance', label: 'Freelance', sublabel: 'Proyek sampingan', icon: 'freelance', iconBg: 'bg-violet-50 text-violet-600' },
  { value: 'Bonus', label: 'Bonus', sublabel: 'Insentif & komisi', icon: 'bonus', iconBg: 'bg-yellow-50 text-yellow-600' },
  { value: 'Lainnya', label: 'Lainnya', sublabel: 'Kategori lainnya', icon: 'other', iconBg: 'bg-gray-100 text-gray-600' },
]

const walletFilterOptions = computed(() => {
  const bankName = walletStore.bankWallet?.name || 'Bank'
  const ewalletName = walletStore.ewalletWallet?.name || 'E-Wallet'
  const cashName = walletStore.cashWallet?.name || 'Tunai'

  return [
    { value: 'all', label: 'Semua Dompet', sublabel: 'Semua akun dompet', icon: 'wallet', iconBg: 'bg-gray-100 text-gray-700' },
    { value: 'bank', label: bankName, sublabel: 'Rekening bank utama', icon: 'bank', iconBg: 'bg-blue-50 text-blue-600' },
    { value: 'ewallet', label: ewalletName, sublabel: 'Dompet digital / e-money', icon: 'ewallet', iconBg: 'bg-emerald-50 text-emerald-600' },
    { value: 'cash', label: cashName, sublabel: 'Uang fisik tunai', icon: 'cash', iconBg: 'bg-amber-50 text-amber-600' },
  ]
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

  if (selectedDateFilter.value !== 'all') {
    const map = {
      '7d': '7 Hari Terakhir',
      '30d': '30 Hari Terakhir',
      '90d': '90 Hari Terakhir',
      'custom': customDate.value ? `Tanggal: ${customDate.value}` : 'Atur Tanggal'
    }
    tags.push({
      key: 'date',
      label: map[selectedDateFilter.value] || selectedDateFilter.value,
      remove: () => { selectedDateFilter.value = 'all'; customDate.value = '' }
    })
  }

  if (selectedTypeFilter.value !== 'all') {
    const map = {
      'expense': 'Pengeluaran',
      'income': 'Pemasukan',
      'transfer': 'Transfer'
    }
    tags.push({
      key: 'type',
      label: map[selectedTypeFilter.value] || selectedTypeFilter.value,
      remove: () => { selectedTypeFilter.value = 'all' }
    })
  }

  if (selectedCategoryFilter.value !== 'all') {
    tags.push({
      key: 'category',
      label: selectedCategoryFilter.value,
      remove: () => { selectedCategoryFilter.value = 'all' }
    })
  }

  if (selectedWalletFilter.value !== 'all') {
    const map = {
      'bank': 'Bank',
      'ewallet': 'E-Wallet',
      'cash': 'Tunai'
    }
    tags.push({
      key: 'wallet',
      label: map[selectedWalletFilter.value] || selectedWalletFilter.value,
      remove: () => { selectedWalletFilter.value = 'all' }
    })
  }

  return tags
})

function resetAllFilters() {
  searchQuery.value = ''
  selectedDateFilter.value = 'all'
  customDate.value = ''
  selectedTypeFilter.value = 'all'
  selectedCategoryFilter.value = 'all'
  selectedWalletFilter.value = 'all'
}

function getAnchorDate(txList) {
  if (!txList || !txList.length) return new Date()
  const timestamps = txList.map(t => new Date(t.date).getTime()).filter(t => !isNaN(t))
  if (!timestamps.length) return new Date()
  const maxTx = Math.max(...timestamps)
  const now = Date.now()
  if (now - maxTx > 60 * 24 * 60 * 60 * 1000) {
    return new Date(maxTx)
  }
  return new Date()
}

const filteredTransactions = computed(() => {
  let list = transactionStore.transactions

  // 0. Search Query Filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(tx => {
      const title = (tx.category?.name || (tx.type === 'transfer' ? 'transfer saldo' : tx.type === 'income' ? 'pemasukan' : 'pengeluaran')).toLowerCase()
      const note = (tx.note || '').toLowerCase()
      return title.includes(q) || note.includes(q)
    })
  }

  // 1. Filter by Date (7 Hari, 30 Hari, 90 Hari, Atur Tanggal Langsung)
  if (selectedDateFilter.value === '7d') {
    const anchor = getAnchorDate(list)
    const cutoff = new Date(anchor)
    cutoff.setDate(cutoff.getDate() - 7)
    list = list.filter(tx => new Date(tx.date) >= cutoff)
  } else if (selectedDateFilter.value === '30d') {
    const anchor = getAnchorDate(list)
    const cutoff = new Date(anchor)
    cutoff.setDate(cutoff.getDate() - 30)
    list = list.filter(tx => new Date(tx.date) >= cutoff)
  } else if (selectedDateFilter.value === '90d') {
    const anchor = getAnchorDate(list)
    const cutoff = new Date(anchor)
    cutoff.setDate(cutoff.getDate() - 90)
    list = list.filter(tx => new Date(tx.date) >= cutoff)
  } else if (selectedDateFilter.value === 'custom' && customDate.value) {
    list = list.filter(tx => tx.date === customDate.value)
  }

  // 2. Filter by Type
  if (selectedTypeFilter.value !== 'all') {
    list = list.filter(tx => tx.type === selectedTypeFilter.value)
  }

  // 3. Filter by Category
  if (selectedCategoryFilter.value !== 'all') {
    const cat = selectedCategoryFilter.value.toLowerCase()
    list = list.filter(tx => {
      const catName = (tx.category?.name || '').toLowerCase()
      const note = (tx.note || '').toLowerCase()
      return catName === cat || note.includes(cat)
    })
  }

  // 4. Filter by Wallet
  if (selectedWalletFilter.value !== 'all') {
    list = list.filter(tx => {
      const srcType = tx.wallet?.type || tx.wallet_type
      const toType = tx.to_wallet?.type || tx.to_wallet_type
      return srcType === selectedWalletFilter.value || toType === selectedWalletFilter.value
    })
  }

  return list
})

function formatDateLabel(dateStr) {
  return formatGroupDate(dateStr)
}

function calculateGroupSummary(transactions) {
  let net = 0
  let hasTransfer = false
  let transferAmount = 0
  let expenseSum = 0
  let incomeSum = 0

  transactions.forEach(t => {
    if (t.type === 'income') {
      net += t.amount
      incomeSum += t.amount
    } else if (t.type === 'expense') {
      net -= t.amount
      expenseSum += t.amount
    } else if (t.type === 'transfer') {
      hasTransfer = true
      transferAmount += t.amount
    }
  })

  // If there are only expenses
  if (incomeSum === 0 && expenseSum > 0 && !hasTransfer) {
    return {
      text: `-IDR ${expenseSum.toLocaleString('id-ID')}`,
      class: 'text-gray-600 font-bold font-jakarta text-xs sm:text-sm'
    }
  }

  // If only transfer
  if (hasTransfer && incomeSum === 0 && expenseSum === 0) {
    return {
      text: `IDR ${transferAmount.toLocaleString('id-ID')}`,
      class: 'text-gray-600 font-bold font-jakarta text-xs sm:text-sm'
    }
  }

  if (net < 0) {
    return {
      text: `-IDR ${Math.abs(net).toLocaleString('id-ID')}`,
      class: 'text-gray-600 font-bold font-jakarta text-xs sm:text-sm'
    }
  } else if (net > 0) {
    return {
      text: `+IDR ${net.toLocaleString('id-ID')}`,
      class: 'text-gray-600 font-bold font-jakarta text-xs sm:text-sm'
    }
  } else {
    return {
      text: `IDR ${transferAmount.toLocaleString('id-ID')}`,
      class: 'text-gray-600 font-bold font-jakarta text-xs sm:text-sm'
    }
  }
}

const groupedTransactions = computed(() => {
  const list = filteredTransactions.value
  if (!list.length) return []

  const map = new Map()
  list.forEach(tx => {
    const d = tx.date
    if (!map.has(d)) {
      map.set(d, {
        date: d,
        dateLabel: formatGroupDate(d),
        transactions: []
      })
    }
    map.get(d).transactions.push(tx)
  })

  const groups = Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date))
  groups.forEach(g => {
    g.summary = calculateGroupSummary(g.transactions)
  })

  return groups
})

const userFirstName = computed(() => {
  const name = authStore.userName || 'Pengguna'
  return name.split(' ')[0]
})

onMounted(async () => {
  await Promise.all([
    walletStore.fetchWallets(),
    transactionStore.fetchTransactions(30),
    billStore.fetchBills(),
    debtStore.fetchDebts(),
    categoryStore.fetchCategories(),
  ])
})

async function handleTransactionSuccess() {
  await walletStore.fetchWallets()
  await transactionStore.fetchTransactions(30)
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-jakarta text-sm text-on-surface-secondary mb-1">Selamat datang, {{ authStore.userName.split(' ')[0] }} 👋</p>
        <h1 class="font-outfit font-extrabold text-3xl text-on-surface tracking-tight">Dashboard</h1>
      </div>
      <BaseButton variant="secondary" size="sm" @click="showModal = true">+ Transaksi</BaseButton>
    </div>

    <!-- Bento Grid: 2/3 + 1/3 -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- LEFT (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <HeroCard />
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-outfit font-semibold text-lg text-on-surface">Riwayat Transaksi</h2>
            <button @click="showModal = true" class="text-xs font-jakarta text-primary hover:underline">+ Catat Baru</button>
          </div>
          <!-- Loading -->
          <div v-if="transactionStore.loading" class="space-y-3">
            <div v-for="i in 4" :key="i" class="skeleton h-16 rounded-md" />
          </div>
          <!-- Empty -->
          <div v-else-if="!transactionStore.transactions.length" class="text-center py-12">
            <p class="text-4xl mb-3">📭</p>
            <p class="font-outfit font-semibold text-on-surface mb-1">Belum ada transaksi</p>
            <p class="font-jakarta text-sm text-on-surface-secondary mb-5">Mulai catat pemasukan atau pengeluaran pertamamu</p>
            <BaseButton variant="primary" size="sm" @click="showModal = true">Catat Transaksi</BaseButton>
          </div>
          <!-- List -->
          <div v-else class="space-y-3">
            <TransactionRow v-for="tx in transactionStore.transactions.slice(0, 8)" :key="tx.id" :transaction="tx" />
            <div v-if="transactionStore.transactions.length > 8" class="text-center pt-2">
              <router-link to="/laporan" class="text-sm font-jakarta text-primary hover:underline">Lihat semua di Laporan →</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT (1/3) -->
      <div class="space-y-6">
        <!-- Tagihan Mendatang -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-outfit font-semibold text-base text-on-surface">📅 Tagihan Mendatang</h2>
            <router-link to="/tagihan" class="text-xs font-jakarta text-primary hover:underline">Kelola</router-link>
          </div>
          <div v-if="billStore.loading" class="space-y-2"><div v-for="i in 3" :key="i" class="skeleton h-12 rounded-md" /></div>
          <div v-else-if="!billStore.upcomingBills.length" class="text-center py-6">
            <p class="text-2xl mb-2">✅</p>
            <p class="font-jakarta text-xs text-on-surface-secondary">Tidak ada tagihan mendatang</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="bill in billStore.upcomingBills.slice(0, 4)" :key="bill.id"
              class="flex items-center gap-3 p-3 rounded-md"
              :class="bill.daysLeft <= 1 ? 'bg-error/10' : 'bg-white/30'"
            >
              <div class="flex-1 min-w-0">
                <p class="font-jakarta font-semibold text-xs text-on-surface truncate">{{ bill.name }}</p>
                <p class="font-jakarta text-xs mt-0.5" :class="bill.daysLeft <= 1 ? 'text-error font-semibold' : 'text-on-surface-secondary'">
                  {{ bill.daysLeft === 0 ? 'Hari ini!' : bill.daysLeft === 1 ? 'Besok!' : `${bill.daysLeft} hari lagi` }}
                </p>
              </div>
              <p class="font-outfit font-bold text-xs text-on-surface currency">{{ formatRupiah(bill.amount) }}</p>
            </div>
          </div>
        </div>

        <!-- Utang & Piutang Summary -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-outfit font-semibold text-base text-on-surface">🤝 Utang & Piutang</h2>
            <router-link to="/utang" class="text-xs font-jakarta text-primary hover:underline">Kelola</router-link>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 rounded-md bg-error/10">
              <div>
                <p class="font-jakarta text-xs text-on-surface-secondary">Utang Saya</p>
                <p class="font-outfit font-bold text-sm text-error currency">{{ formatRupiah(debtStore.totalOwe) }}</p>
              </div>
              <span class="text-xl">😬</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-md bg-primary/10">
              <div>
                <p class="font-jakarta text-xs text-on-surface-secondary">Piutang Saya</p>
                <p class="font-outfit font-bold text-sm text-primary currency">{{ formatRupiah(debtStore.totalLend) }}</p>
              </div>
              <span class="text-xl">🙂</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card p-6">
          <h2 class="font-outfit font-semibold text-base text-on-surface mb-4">⚡ Aksi Cepat</h2>
          <div class="space-y-2">
            <button @click="showModal = true" class="w-full text-left p-3 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-3">
              <span class="text-lg">➕</span><span class="font-jakarta font-medium text-sm text-on-surface">Catat Transaksi</span>
            </button>
            <router-link to="/tagihan" class="w-full text-left p-3 rounded-md bg-white/30 hover:bg-white/50 transition-colors flex items-center gap-3 block">
              <span class="text-lg">📅</span><span class="font-jakarta font-medium text-sm text-on-surface">Tambah Tagihan</span>
            </router-link>
            <router-link to="/utang" class="w-full text-left p-3 rounded-md bg-white/30 hover:bg-white/50 transition-colors flex items-center gap-3 block">
              <span class="text-lg">🤝</span><span class="font-jakarta font-medium text-sm text-on-surface">Catat Utang/Piutang</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <ModalTransaksi v-model="showModal" @success="handleTransactionSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'
import { useWalletStore } from '@/stores/wallet'
import { useBillStore } from '@/stores/bill'
import { useDebtStore } from '@/stores/debt'
import { useCategoryStore } from '@/stores/category'
import { useFormatRupiah } from '@/composables/useFormat'
import HeroCard from '@/components/app/HeroCard.vue'
import TransactionRow from '@/components/app/TransactionRow.vue'
import ModalTransaksi from '@/components/app/ModalTransaksi.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const walletStore = useWalletStore()
const transactionStore = useTransactionStore()
const billStore = useBillStore()
const debtStore = useDebtStore()
const categoryStore = useCategoryStore()
const { formatRupiah } = useFormatRupiah()

const showModal = ref(false)

onMounted(async () => {
  await Promise.all([
    walletStore.fetchWallets(),
    transactionStore.fetchTransactions(10),
    billStore.fetchBills(),
    debtStore.fetchDebts(),
    categoryStore.fetchCategories(),
  ])
})

async function handleTransactionSuccess() {
  await walletStore.fetchWallets()
  await transactionStore.fetchTransactions(10)
}
</script>

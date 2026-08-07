<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-outfit font-extrabold text-3xl text-on-surface tracking-tight">Tagihan Rutin</h1>
        <p class="font-jakarta text-sm text-on-surface-secondary mt-1">Kelola tagihan bulanan agar tidak terlewat</p>
      </div>
      <BaseButton variant="primary" size="sm" @click="showAddModal = true">+ Tambah Tagihan</BaseButton>
    </div>

    <!-- Urgent Alert -->
    <div v-if="billStore.urgentBills.length" class="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3">
      <div class="w-6 h-6 text-error flex-shrink-0 mt-0.5">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      <div>
        <p class="font-outfit font-semibold text-sm text-error mb-1">Tagihan jatuh tempo hari ini / besok!</p>
        <p class="font-jakarta text-xs text-on-surface-secondary">{{ billStore.urgentBills.map(b => b.name).join(', ') }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="billStore.loading" class="grid md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="skeleton h-28 rounded-md" />
    </div>

    <!-- Cards Grid -->
    <div v-else-if="billStore.bills.length" class="grid md:grid-cols-2 gap-4">
      <div v-for="bill in billStore.bills" :key="bill.id" class="glass-card p-5 transition-all duration-300" :class="{ 'opacity-50': !bill.is_active }">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-jakarta font-semibold text-sm text-on-surface">{{ bill.name }}</p>
              <span v-if="getUpcomingInfo(bill)" class="badge-warning text-xs">{{ getUpcomingInfo(bill) }}</span>
            </div>
            <p class="font-outfit font-bold text-lg text-on-surface currency mt-1">{{ formatRupiah(bill.amount) }}</p>
            <p class="font-jakarta text-xs text-on-surface-secondary mt-0.5">
              Jatuh tempo setiap tanggal {{ bill.due_day }} · {{ walletStore.getWalletLabel(bill.wallet?.type) }}
            </p>
          </div>
          <div class="flex flex-col gap-2 items-end flex-shrink-0">
            <BaseButton v-if="bill.is_active" variant="primary" size="sm" @click="handlePayBill(bill.id)" :loading="payingId === bill.id">Bayar</BaseButton>
            <button @click="billStore.toggleBill(bill.id, !bill.is_active)" class="text-xs font-jakarta text-on-surface-secondary hover:text-on-surface transition-colors">
              {{ bill.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
            </button>
            <button @click="billStore.deleteBill(bill.id)" class="text-xs font-jakarta text-error hover:underline">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <p class="font-outfit font-semibold text-on-surface mb-1">Belum ada tagihan terdaftar</p>
      <p class="font-jakarta text-sm text-on-surface-secondary mb-5">Tambahkan tagihan rutin seperti kos, internet, atau langganan.</p>
      <BaseButton variant="primary" size="sm" @click="showAddModal = true">+ Tambah Tagihan</BaseButton>
    </div>

    <!-- Add Bill Modal -->
    <BaseModal v-model="showAddModal" title="Tambah Tagihan Rutin">
      <form @submit.prevent="handleAdd" class="space-y-4">
        <BaseInput v-model="form.name" label="Nama Tagihan" placeholder="Contoh: Kos, Netflix, Internet" :required="true" />
        <BaseInput v-model="form.amountStr" label="Nominal" type="text" placeholder="0" prefix="IDR" :required="true" @input="(e) => form.amountStr = formatInput(e.target.value)" />
        <BaseInput v-model="form.dueDay" label="Tanggal Jatuh Tempo Setiap Bulan" type="number" placeholder="1–31" hint="Contoh: 10 → jatuh tempo setiap tanggal 10 tiap bulan" :required="true" />
        <BaseSelect v-model="form.walletId" label="Dompet Default untuk Bayar" :options="walletOptions" :required="true" />
        <p v-if="formError" class="text-sm text-error font-jakarta">{{ formError }}</p>
        <div class="flex gap-3">
          <BaseButton type="button" variant="secondary" class="flex-1" @click="showAddModal = false">Batal</BaseButton>
          <BaseButton type="submit" variant="primary" class="flex-1" :loading="billStore.submitting">Simpan</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBillStore } from '@/stores/bill'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah } from '@/composables/useFormat'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const billStore   = useBillStore()
const walletStore = useWalletStore()
const { formatRupiah, parseRupiah } = useFormatRupiah()

const showAddModal = ref(false)
const formError    = ref('')
const payingId     = ref(null)
const form = ref({ name: '', amountStr: '', dueDay: '', walletId: '' })

const walletOptions = computed(() =>
  walletStore.wallets.map(w => ({ value: w.id, label: walletStore.getWalletLabel(w.type) }))
)

function formatInput(val) { const n = parseRupiah(val); return n ? n.toLocaleString('id-ID') : '' }

function getUpcomingInfo(bill) {
  const upcoming = billStore.upcomingBills.find(b => b.id === bill.id)
  if (!upcoming) return null
  if (upcoming.daysLeft === 0) return 'Hari ini!'
  if (upcoming.daysLeft === 1) return 'Besok!'
  return `${upcoming.daysLeft} hari lagi`
}

async function handlePayBill(billId) {
  payingId.value = billId
  try {
    await billStore.payBill(billId)
    await walletStore.fetchWallets()
  } catch (err) {
    alert('Gagal bayar tagihan: ' + err.message)
  } finally { payingId.value = null }
}

async function handleAdd() {
  formError.value = ''
  const amount = parseRupiah(form.value.amountStr)
  if (!amount || amount <= 0) { formError.value = 'Masukkan nominal yang valid'; return }
  const dueDay = parseInt(form.value.dueDay)
  if (!dueDay || dueDay < 1 || dueDay > 31) { formError.value = 'Masukkan tanggal 1–31'; return }
  if (!form.value.walletId) { formError.value = 'Pilih dompet'; return }
  if (!form.value.name) { formError.value = 'Nama tagihan wajib diisi'; return }
  try {
    await billStore.addBill({ name: form.value.name, amount, dueDay, walletId: form.value.walletId })
    showAddModal.value = false
    form.value = { name: '', amountStr: '', dueDay: '', walletId: '' }
  } catch (err) { formError.value = err.message }
}

onMounted(async () => { await Promise.all([billStore.fetchBills(), walletStore.fetchWallets()]) })
</script>

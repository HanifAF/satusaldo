<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-outfit font-extrabold text-3xl text-on-surface tracking-tight">Utang & Piutang</h1>
        <p class="font-jakarta text-sm text-on-surface-secondary mt-1">Pantau semua pinjam-meminjam kamu</p>
      </div>
      <BaseButton variant="primary" size="sm" @click="showModal = true">+ Catat Baru</BaseButton>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="glass-card p-5">
        <p class="font-jakarta text-xs text-on-surface-secondary mb-1">Total Utang Saya</p>
        <p class="font-outfit font-extrabold text-2xl text-error currency">{{ formatRupiah(debtStore.totalOwe) }}</p>
        <p class="font-jakarta text-xs text-on-surface-secondary mt-1">{{ debtStore.activeDebts.length }} utang aktif</p>
      </div>
      <div class="glass-card p-5">
        <p class="font-jakarta text-xs text-on-surface-secondary mb-1">Total Piutang Saya</p>
        <p class="font-outfit font-extrabold text-2xl text-primary currency">{{ formatRupiah(debtStore.totalLend) }}</p>
        <p class="font-jakarta text-xs text-on-surface-secondary mt-1">{{ debtStore.activeLendings.length }} piutang aktif</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex bg-white/30 rounded-md p-1 mb-6 w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="px-5 py-2 rounded text-sm font-jakarta font-semibold transition-all duration-200"
        :class="activeTab === tab.key ? 'bg-primary text-white shadow-btn' : 'text-on-surface-secondary hover:text-on-surface'"
      >{{ tab.label }}</button>
    </div>

    <!-- Loading -->
    <div v-if="debtStore.loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="skeleton h-20 rounded-md" />
    </div>

    <!-- List -->
    <div v-else-if="filteredDebts.length" class="space-y-4">
      <div v-for="debt in filteredDebts" :key="debt.id" class="glass-card p-5" :class="{ 'opacity-60': debt.is_settled }">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-md flex items-center justify-center text-xl flex-shrink-0"
            :class="debt.direction === 'owe' ? 'bg-error/10' : 'bg-primary/10'">
            {{ debt.direction === 'owe' ? '😬' : '🙂' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-jakarta font-semibold text-sm text-on-surface">{{ debt.person_name }}</p>
              <span class="badge-neutral text-xs">{{ debt.direction === 'owe' ? 'Hutang ke mereka' : 'Piutang dari mereka' }}</span>
              <span v-if="debt.is_settled" class="badge-success">Lunas ✓</span>
            </div>
            <p v-if="debt.note" class="font-jakarta text-xs text-on-surface-secondary mt-0.5 truncate">{{ debt.note }}</p>
            <div class="flex items-center gap-3 mt-2">
              <div>
                <p class="font-jakarta text-xs text-on-surface-secondary">Sisa</p>
                <p class="font-outfit font-bold text-sm currency" :class="debt.direction === 'owe' ? 'text-error' : 'text-primary'">{{ formatRupiah(debt.remaining_amount) }}</p>
              </div>
              <div class="text-on-surface-secondary">|</div>
              <div>
                <p class="font-jakarta text-xs text-on-surface-secondary">Awal</p>
                <p class="font-outfit text-sm text-on-surface-secondary currency">{{ formatRupiah(debt.original_amount) }}</p>
              </div>
              <div class="flex-1">
                <div class="h-1.5 bg-white/40 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500"
                    :class="debt.direction === 'owe' ? 'bg-error' : 'bg-primary'"
                    :style="{ width: `${((debt.original_amount - debt.remaining_amount) / debt.original_amount * 100)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex-shrink-0" v-if="!debt.is_settled">
            <BaseButton variant="primary" size="sm" @click="openPayModal(debt)">Bayar</BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <p class="text-4xl mb-3">🤝</p>
      <p class="font-outfit font-semibold text-on-surface mb-1">Tidak ada {{ activeTab === 'owe' ? 'utang' : 'piutang' }} aktif</p>
      <p class="font-jakarta text-sm text-on-surface-secondary mb-5">{{ activeTab === 'owe' ? 'Wah, keuanganmu bersih!' : 'Kamu belum meminjamkan uang ke siapapun.' }}</p>
      <BaseButton variant="primary" size="sm" @click="showModal = true">+ Catat Baru</BaseButton>
    </div>

    <!-- Add Modal -->
    <BaseModal v-model="showModal" title="Catat Utang / Piutang">
      <form @submit.prevent="handleAdd" class="space-y-4">
        <div class="flex bg-white/30 rounded-md p-1 mb-2">
          <button type="button" v-for="t in tabs" :key="t.key" @click="form.direction = t.key"
            class="flex-1 py-2 rounded text-xs font-jakarta font-semibold transition-all duration-200"
            :class="form.direction === t.key ? 'bg-primary text-white' : 'text-on-surface-secondary'"
          >{{ t.label }}</button>
        </div>
        <BaseInput v-model="form.personName" label="Nama Orang / Pihak" placeholder="Contoh: Budi" :required="true" />
        <BaseInput v-model="form.amountStr" label="Nominal" type="text" placeholder="0" prefix="Rp" :required="true" @input="(e) => form.amountStr = formatInput(e.target.value)" />
        <BaseSelect v-model="form.walletId" label="Dompet" :options="walletOptions" :required="true" />
        <BaseInput v-model="form.dueDate" label="Jatuh Tempo (opsional)" type="date" />
        <BaseInput v-model="form.note" label="Catatan (opsional)" placeholder="Untuk keperluan apa..." />
        <p v-if="formError" class="text-sm text-error font-jakarta">{{ formError }}</p>
        <div class="flex gap-3">
          <BaseButton type="button" variant="secondary" class="flex-1" @click="showModal = false">Batal</BaseButton>
          <BaseButton type="submit" variant="primary" class="flex-1" :loading="debtStore.submitting">Simpan</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Pay Modal -->
    <BaseModal v-model="showPayModal" title="Bayar Sebagian / Lunas">
      <form @submit.prevent="handlePay" class="space-y-4" v-if="selectedDebt">
        <div class="glass-card p-4">
          <p class="font-jakarta text-sm text-on-surface-secondary">Sisa {{ selectedDebt.direction === 'owe' ? 'Utang' : 'Piutang' }}</p>
          <p class="font-outfit font-bold text-2xl currency" :class="selectedDebt.direction === 'owe' ? 'text-error' : 'text-primary'">{{ formatRupiah(selectedDebt.remaining_amount) }}</p>
        </div>
        <BaseInput v-model="payAmountStr" label="Nominal Pembayaran" type="text" placeholder="0" prefix="Rp" :required="true" @input="(e) => payAmountStr = formatInput(e.target.value)" />
        <BaseSelect v-model="payWalletId" label="Bayar dari Dompet" :options="walletOptions" :required="true" />
        <p v-if="payError" class="text-sm text-error font-jakarta">{{ payError }}</p>
        <div class="flex gap-3">
          <BaseButton type="button" variant="secondary" class="flex-1" @click="showPayModal = false">Batal</BaseButton>
          <BaseButton type="submit" variant="primary" class="flex-1" :loading="debtStore.submitting">Konfirmasi</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebtStore } from '@/stores/debt'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah } from '@/composables/useFormat'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const debtStore = useDebtStore()
const walletStore = useWalletStore()
const { formatRupiah, parseRupiah } = useFormatRupiah()

const activeTab    = ref('owe')
const showModal    = ref(false)
const showPayModal = ref(false)
const selectedDebt = ref(null)
const formError    = ref('')
const payError     = ref('')

const tabs = [
  { key: 'owe',  label: '😬 Utang Saya' },
  { key: 'lend', label: '🙂 Piutang Saya' },
]

const form = ref({ direction: 'owe', personName: '', amountStr: '', walletId: '', note: '', dueDate: '' })
const payAmountStr = ref('')
const payWalletId  = ref('')

const walletOptions = computed(() =>
  walletStore.wallets.map(w => ({ value: w.id, label: `${walletStore.getWalletIcon(w.type)} ${walletStore.getWalletLabel(w.type)}` }))
)
const filteredDebts = computed(() => debtStore.debts.filter(d => d.direction === activeTab.value))

function formatInput(val) { const n = parseRupiah(val); return n ? n.toLocaleString('id-ID') : '' }

function openPayModal(debt) {
  selectedDebt.value = debt
  payAmountStr.value = ''
  payWalletId.value  = debt.wallet_id || ''
  payError.value     = ''
  showPayModal.value = true
}

async function handleAdd() {
  formError.value = ''
  const amount = parseRupiah(form.value.amountStr)
  if (!amount || amount <= 0) { formError.value = 'Masukkan nominal yang valid'; return }
  if (!form.value.personName) { formError.value = 'Nama wajib diisi'; return }
  if (!form.value.walletId)   { formError.value = 'Pilih dompet'; return }
  try {
    await debtStore.addDebt({ direction: form.value.direction, walletId: form.value.walletId, personName: form.value.personName, amount, note: form.value.note, dueDate: form.value.dueDate || null })
    showModal.value = false
    form.value = { direction: 'owe', personName: '', amountStr: '', walletId: '', note: '', dueDate: '' }
  } catch (err) { formError.value = err.message }
}

async function handlePay() {
  payError.value = ''
  const amount = parseRupiah(payAmountStr.value)
  if (!amount || amount <= 0) { payError.value = 'Masukkan nominal yang valid'; return }
  if (!payWalletId.value) { payError.value = 'Pilih dompet'; return }
  if (amount > selectedDebt.value.remaining_amount) { payError.value = `Tidak bisa melebihi sisa (${formatRupiah(selectedDebt.value.remaining_amount)})`; return }
  try {
    await debtStore.payDebt(selectedDebt.value.id, amount, payWalletId.value)
    showPayModal.value = false
  } catch (err) { payError.value = err.message }
}

onMounted(async () => { await Promise.all([debtStore.fetchDebts(), walletStore.fetchWallets()]) })
</script>

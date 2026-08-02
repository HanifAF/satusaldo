<template>
  <BaseModal v-model="show" :title="modalTitle">
    <div class="flex bg-white/30 rounded-md p-1 mb-6">
      <button
        v-for="tab in tabs" :key="tab.type"
        @click="activeType = tab.type"
        class="flex-1 py-2 px-3 rounded text-xs font-jakarta font-semibold transition-all duration-200"
        :class="activeType === tab.type ? 'bg-primary text-white shadow-btn' : 'text-on-surface-secondary hover:text-on-surface'"
      >{{ tab.label }}</button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseSelect v-model="form.walletId" label="Dompet" :options="walletOptions" placeholder="Pilih dompet" :required="true" :error="errors.walletId" />
      <BaseSelect v-if="activeType === 'transfer'" v-model="form.toWalletId" label="Dompet Tujuan" :options="destinationWalletOptions" placeholder="Pilih dompet tujuan" :required="true" :error="errors.toWalletId" />
      <BaseInput v-model="form.amountStr" label="Nominal" type="text" placeholder="0" prefix="Rp" :required="true" :error="errors.amount" @input="formatAmountInput" />
      <BaseInput v-if="activeType === 'transfer'" v-model="form.adminFeeStr" label="Biaya Admin (opsional)" type="text" placeholder="0" prefix="Rp" hint="Biaya transfer bank / top up e-wallet" @input="formatAdminFeeInput" />
      <BaseSelect v-if="activeType !== 'transfer'" v-model="form.categoryId" label="Kategori" :options="categoryOptions" placeholder="Pilih kategori" />
      <BaseInput v-model="form.date" label="Tanggal" type="date" :required="true" />
      <div>
        <label class="form-label">Catatan (opsional)</label>
        <textarea v-model="form.note" rows="2" placeholder="Tambahkan catatan..." class="form-input resize-none" />
      </div>
      <p v-if="submitError" class="text-sm text-error font-jakarta">{{ submitError }}</p>
      <div class="flex gap-3 pt-2">
        <BaseButton variant="secondary" class="flex-1" @click="show = false" type="button">Batal</BaseButton>
        <BaseButton variant="primary" class="flex-1" type="submit" :loading="transactionStore.submitting">Simpan</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { useFormatRupiah } from '@/composables/useFormat'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'success'])

const show = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })

const walletStore = useWalletStore()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const { parseRupiah } = useFormatRupiah()

const today = new Date().toISOString().split('T')[0]
const activeType = ref('expense')
const submitError = ref('')
const errors = ref({})

const tabs = [
  { type: 'expense',  label: 'Pengeluaran' },
  { type: 'income',   label: 'Pemasukan' },
  { type: 'transfer', label: 'Transfer' },
]

const form = ref({ walletId: '', toWalletId: '', amountStr: '', adminFeeStr: '', categoryId: '', note: '', date: today })

const modalTitle = computed(() => ({ income: 'Catat Pemasukan', transfer: 'Transfer Saldo', expense: 'Catat Pengeluaran' }[activeType.value]))

const walletOptions = computed(() =>
  walletStore.wallets.map(w => ({ value: w.id, label: `${walletStore.getWalletIcon(w.type)} ${walletStore.getWalletLabel(w.type)}` }))
)
const destinationWalletOptions = computed(() =>
  walletStore.wallets.filter(w => w.id !== form.value.walletId).map(w => ({ value: w.id, label: `${walletStore.getWalletIcon(w.type)} ${walletStore.getWalletLabel(w.type)}` }))
)
const categoryOptions = computed(() => {
  const cats = activeType.value === 'income' ? categoryStore.incomeCategories : categoryStore.expenseCategories
  return cats.map(c => ({ value: c.id, label: c.name, icon: c.icon }))
})

function formatAmountInput(e)   { const n = parseRupiah(e.target.value); form.value.amountStr   = n ? n.toLocaleString('id-ID') : '' }
function formatAdminFeeInput(e) { const n = parseRupiah(e.target.value); form.value.adminFeeStr = n ? n.toLocaleString('id-ID') : '' }

function validate() {
  errors.value = {}
  if (!form.value.walletId) errors.value.walletId = 'Pilih dompet'
  if (activeType.value === 'transfer' && !form.value.toWalletId) errors.value.toWalletId = 'Pilih dompet tujuan'
  const amount = parseRupiah(form.value.amountStr)
  if (!amount || amount <= 0) errors.value.amount = 'Masukkan nominal yang valid'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitError.value = ''
  try {
    await transactionStore.addTransaction({
      type: activeType.value,
      walletId: form.value.walletId,
      toWalletId: form.value.toWalletId || null,
      amount: parseRupiah(form.value.amountStr),
      adminFee: parseRupiah(form.value.adminFeeStr) || 0,
      categoryId: form.value.categoryId || null,
      note: form.value.note,
      date: form.value.date,
    })
    emit('success')
    show.value = false
  } catch (err) { submitError.value = err.message || 'Gagal menyimpan' }
}

watch(show, (v) => { if (!v) { form.value = { walletId: '', toWalletId: '', amountStr: '', adminFeeStr: '', categoryId: '', note: '', date: today }; errors.value = {}; submitError.value = '' } })
watch(activeType, () => { form.value.categoryId = '' })
</script>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_DEBTS } from '@/lib/mockData'
import { useWalletStore } from './wallet'

export const useDebtStore = defineStore('debt', () => {
  const debts = ref(JSON.parse(JSON.stringify(MOCK_DEBTS)))
  const loading = ref(false)
  const submitting = ref(false)

  const activeDebts    = computed(() => debts.value.filter(d => !d.is_settled && d.direction === 'owe'))
  const activeLendings = computed(() => debts.value.filter(d => !d.is_settled && d.direction === 'lend'))
  const totalOwe       = computed(() => activeDebts.value.reduce((s, d) => s + d.remaining_amount, 0))
  const totalLend      = computed(() => activeLendings.value.reduce((s, d) => s + d.remaining_amount, 0))

  async function fetchDebts() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    debts.value = JSON.parse(JSON.stringify(MOCK_DEBTS))
    loading.value = false
  }

  async function addDebt({ direction, walletId, personName, amount, note, dueDate }) {
    const walletStore = useWalletStore()
    submitting.value = true
    await new Promise(r => setTimeout(r, 600))
    const wallet = walletStore.getWalletById(walletId)
    const newDebt = {
      id: `debt-${Date.now()}`, user_id: 'mock-user-001', wallet_id: walletId,
      direction, person_name: personName,
      original_amount: amount, remaining_amount: amount,
      note: note || null, due_date: dueDate || null, is_settled: false, wallet,
    }
    if (wallet) {
      const newBal = direction === 'owe' ? wallet.balance + amount : wallet.balance - amount
      await walletStore.updateBalance(walletId, newBal)
    }
    debts.value.unshift(newDebt)
    submitting.value = false
    return newDebt
  }

  async function payDebt(debtId, payAmount, walletId) {
    const walletStore = useWalletStore()
    submitting.value = true
    await new Promise(r => setTimeout(r, 500))
    const debt = debts.value.find(d => d.id === debtId)
    if (!debt) { submitting.value = false; return }
    const newRemaining = Math.max(0, debt.remaining_amount - payAmount)
    debt.remaining_amount = newRemaining
    debt.is_settled = newRemaining === 0
    const wallet = walletStore.getWalletById(walletId)
    if (wallet) {
      const newBal = debt.direction === 'owe' ? wallet.balance - payAmount : wallet.balance + payAmount
      await walletStore.updateBalance(walletId, newBal)
    }
    submitting.value = false
  }

  return { debts, loading, submitting, activeDebts, activeLendings, totalOwe, totalLend, fetchDebts, addDebt, payDebt }
})

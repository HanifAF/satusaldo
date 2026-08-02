import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { useWalletStore } from './wallet'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref(JSON.parse(JSON.stringify(MOCK_TRANSACTIONS)))
  const loading = ref(false)
  const submitting = ref(false)

  async function fetchTransactions(limit = 20) {
    loading.value = true
    await new Promise(r => setTimeout(r, 400))
    transactions.value = JSON.parse(JSON.stringify(MOCK_TRANSACTIONS)).slice(0, limit)
    loading.value = false
  }

  async function addTransaction({ type, walletId, toWalletId, amount, adminFee = 0, categoryId, note, date }) {
    const walletStore = useWalletStore()
    submitting.value = true
    await new Promise(r => setTimeout(r, 600))

    const newTx = {
      id: `tx-${Date.now()}`,
      user_id: 'mock-user-001',
      wallet_id: walletId,
      to_wallet_id: toWalletId || null,
      type, amount, admin_fee: adminFee,
      category: null,
      note: note || null,
      date: date || new Date().toISOString().split('T')[0],
      wallet: walletStore.getWalletById(walletId),
      to_wallet: toWalletId ? walletStore.getWalletById(toWalletId) : null,
    }

    const src = walletStore.getWalletById(walletId)
    if (type === 'income')    await walletStore.updateBalance(walletId, src.balance + amount)
    if (type === 'expense')   await walletStore.updateBalance(walletId, src.balance - amount)
    if (type === 'transfer') {
      const dst = walletStore.getWalletById(toWalletId)
      await walletStore.updateBalance(walletId, src.balance - amount - adminFee)
      await walletStore.updateBalance(toWalletId, dst.balance + amount)
    }

    transactions.value.unshift(newTx)
    submitting.value = false
    return newTx
  }

  async function fetchMonthlyReport(year, month) {
    await new Promise(r => setTimeout(r, 300))
    return MOCK_TRANSACTIONS.filter(t => {
      const d = new Date(t.date)
      return d.getFullYear() === year && (d.getMonth() + 1) === month
    })
  }

  return { transactions, loading, submitting, fetchTransactions, addTransaction, fetchMonthlyReport }
})

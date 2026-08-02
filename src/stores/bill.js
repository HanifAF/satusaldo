import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_BILLS } from '@/lib/mockData'
import { useWalletStore } from './wallet'
import { useTransactionStore } from './transaction'

export const useBillStore = defineStore('bill', () => {
  const bills = ref(JSON.parse(JSON.stringify(MOCK_BILLS)))
  const loading = ref(false)
  const submitting = ref(false)

  const upcomingBills = computed(() => {
    const today = new Date()
    const todayDay = today.getDate()
    return bills.value
      .filter(b => b.is_active)
      .map(b => {
        let daysLeft = b.due_day - todayDay
        if (daysLeft < 0) {
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
          daysLeft = daysInMonth - todayDay + b.due_day
        }
        return { ...b, daysLeft }
      })
      .filter(b => b.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  })

  const urgentBills = computed(() => upcomingBills.value.filter(b => b.daysLeft <= 1))

  async function fetchBills() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    bills.value = JSON.parse(JSON.stringify(MOCK_BILLS))
    loading.value = false
  }

  async function addBill({ name, amount, dueDay, walletId }) {
    const walletStore = useWalletStore()
    submitting.value = true
    await new Promise(r => setTimeout(r, 500))
    const wallet = walletStore.getWalletById(walletId)
    const newBill = { id: `bill-${Date.now()}`, user_id: 'mock-user-001', name, amount, due_day: dueDay, wallet_id: walletId, is_active: true, wallet }
    bills.value.push(newBill)
    bills.value.sort((a, b) => a.due_day - b.due_day)
    submitting.value = false
    return newBill
  }

  async function payBill(billId) {
    const transactionStore = useTransactionStore()
    submitting.value = true
    const bill = bills.value.find(b => b.id === billId)
    if (!bill) { submitting.value = false; return }
    await transactionStore.addTransaction({
      type: 'expense', walletId: bill.wallet_id, amount: bill.amount,
      note: `Bayar tagihan: ${bill.name}`, date: new Date().toISOString().split('T')[0]
    })
    submitting.value = false
  }

  async function toggleBill(billId, isActive) {
    const bill = bills.value.find(b => b.id === billId)
    if (bill) bill.is_active = isActive
  }

  async function deleteBill(billId) {
    bills.value = bills.value.filter(b => b.id !== billId)
  }

  return { bills, loading, submitting, upcomingBills, urgentBills, fetchBills, addBill, payBill, toggleBill, deleteBill }
})

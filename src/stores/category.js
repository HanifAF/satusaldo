import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_CATEGORIES } from '@/lib/mockData'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref(JSON.parse(JSON.stringify(MOCK_CATEGORIES)))
  const loading = ref(false)

  const incomeCategories  = computed(() => categories.value.filter(c => c.type === 'income'))
  const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense'))

  async function fetchCategories() {
    loading.value = true
    await new Promise(r => setTimeout(r, 200))
    categories.value = JSON.parse(JSON.stringify(MOCK_CATEGORIES))
    loading.value = false
  }

  async function addCategory({ name, icon, type }) {
    const newCat = { id: `cat-custom-${Date.now()}`, user_id: 'mock-user-001', name, icon: icon || '📦', type }
    categories.value.push(newCat)
    return newCat
  }

  return { categories, loading, incomeCategories, expenseCategories, fetchCategories, addCategory }
})

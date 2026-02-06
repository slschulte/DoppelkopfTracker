import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cardsApi } from '../services/api'
import type { Card } from '../types'

export const useCardsStore = defineStore('cards', () => {
  const cards = ref<Card[]>([])
  const unpaidCards = ref<Card[]>([])
  const totalUnpaid = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const yellowCards = computed(() => cards.value.filter(c => c.card_type === 'yellow'))
  const redCards = computed(() => cards.value.filter(c => c.card_type === 'red'))
  const unpaidRedCards = computed(() => cards.value.filter(c => c.card_type === 'red' && !c.paid))

  // Actions
  async function fetchCards(params?: { player_id?: number; card_type?: string; paid?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const response = await cardsApi.getAll(params)
      cards.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch cards'
    } finally {
      loading.value = false
    }
  }

  async function fetchUnpaidCards() {
    loading.value = true
    error.value = null
    try {
      const response = await cardsApi.getUnpaid()
      unpaidCards.value = response.data.cards
      totalUnpaid.value = response.data.total_unpaid
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch unpaid cards'
    } finally {
      loading.value = false
    }
  }

  async function createCard(card: Partial<Card>) {
    loading.value = true
    error.value = null
    try {
      const response = await cardsApi.create(card)
      cards.value.unshift(response.data)
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to create card'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCard(id: number, card: Partial<Card>) {
    loading.value = true
    error.value = null
    try {
      const response = await cardsApi.update(id, card)
      const index = cards.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cards.value[index] = response.data
      }
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to update card'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCard(id: number) {
    loading.value = true
    error.value = null
    try {
      await cardsApi.delete(id)
      cards.value = cards.value.filter(c => c.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete card'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function markAsPaid(id: number) {
    return updateCard(id, { paid: true })
  }

  return {
    cards,
    unpaidCards,
    totalUnpaid,
    loading,
    error,
    yellowCards,
    redCards,
    unpaidRedCards,
    fetchCards,
    fetchUnpaidCards,
    createCard,
    updateCard,
    deleteCard,
    markAsPaid
  }
})

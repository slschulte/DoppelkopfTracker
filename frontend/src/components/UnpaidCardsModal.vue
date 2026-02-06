<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-red-900">Offene Strafen</h2>
          <p class="text-red-700 text-lg font-semibold mt-1">
            Gesamt: {{ total }}€
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cards by Player -->
      <div class="space-y-4">
        <div v-for="(playerCards, playerName) in cardsByPlayer" :key="playerName" class="border-2 border-red-200 rounded-lg p-4 bg-red-50">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-lg text-red-900">{{ playerName }}</h3>
            <span class="text-red-700 font-bold">{{ playerCards.length }}€</span>
          </div>
          
          <div class="space-y-2">
            <div v-for="card in playerCards" :key="card.id" class="bg-white rounded p-3">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-600">{{ formatDate(card.date) }}</p>
                  <p v-if="card.reason" class="text-sm text-gray-700 mt-1">{{ card.reason }}</p>
                </div>
                <button
                  @click="$emit('mark-paid', card)"
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ✓ Bezahlt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../types'

const props = defineProps<{
  cards: Card[]
  total: number
}>()

defineEmits<{
  close: []
  markPaid: [card: Card]
}>()

const cardsByPlayer = computed(() => {
  const grouped: Record<string, Card[]> = {}
  
  props.cards.forEach(card => {
    const name = card.player_name || 'Unbekannt'
    if (!grouped[name]) {
      grouped[name] = []
    }
    grouped[name].push(card)
  })
  
  return grouped
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

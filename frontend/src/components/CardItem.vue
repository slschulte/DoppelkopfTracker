<template>
  <div class="card" :class="cardClass">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Card Icon -->
        <div class="text-4xl">
          {{ card.card_type === 'yellow' ? '🟨' : '🟥' }}
        </div>

        <!-- Player Info -->
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
          :style="{ backgroundColor: card.avatar_color }"
        >
          {{ card.player_name?.charAt(0).toUpperCase() }}
        </div>

        <div>
          <h3 class="font-bold text-lg text-gray-900">{{ card.player_name }}</h3>
          <p class="text-sm text-gray-600">{{ formatDate(card.date) }}</p>
          <p v-if="card.reason" class="text-sm text-gray-700 mt-1">
            <span class="font-medium">Grund:</span> {{ card.reason }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- Payment Status -->
        <div v-if="card.card_type === 'red'" class="text-right mr-4">
          <div v-if="card.paid" class="text-green-600 font-semibold">
            ✓ Bezahlt
          </div>
          <div v-else class="text-red-600 font-semibold">
            1€ offen
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2">
          <button
            v-if="card.card_type === 'red' && !card.paid"
            @click="$emit('mark-paid', card)"
            class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Als bezahlt markieren
          </button>
          <button
            @click="$emit('delete', card)"
            class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../types'

const props = defineProps<{
  card: Card
}>()

defineEmits<{
  markPaid: [card: Card]
  delete: [card: Card]
}>()

const cardClass = computed(() => {
  if (props.card.card_type === 'yellow') {
    return 'border-l-4 border-yellow-400 bg-yellow-50'
  }
  if (props.card.paid) {
    return 'border-l-4 border-green-400 bg-green-50'
  }
  return 'border-l-4 border-red-400 bg-red-50'
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

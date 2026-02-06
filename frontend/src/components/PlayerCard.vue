<template>
  <div class="card hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
          :style="{ backgroundColor: player.avatar_color }"
        >
          {{ player.name.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ player.name }}</h3>
          <p class="text-sm text-gray-500">
            Mitglied seit {{ formatDate(player.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        @click="$emit('view-stats', player)"
        class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
      >
        Statistiken
      </button>
      <button
        @click="$emit('edit', player)"
        class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Bearbeiten
      </button>
      <button
        @click="$emit('delete', player)"
        class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
      >
        Löschen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '../types'

defineProps<{
  player: Player
}>()

defineEmits<{
  edit: [player: Player]
  delete: [player: Player]
  viewStats: [player: Player]
}>()

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'short'
  })
}
</script>

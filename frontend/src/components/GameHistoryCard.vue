<template>
  <div class="card" :class="compact ? 'p-4' : ''">
    <div class="flex items-center justify-between">
      <div class="flex-grow">
        <div class="flex items-center space-x-3 mb-2">
          <span class="text-sm font-medium text-gray-500">
            {{ formatDate(game.date) }}
          </span>
          <span class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="gameTypeClass">
            {{ gameTypeLabel }}
          </span>
          <span v-if="game.bock_round" class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
            Bock
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Re Team -->
          <div class="flex items-center space-x-2">
            <span class="font-semibold text-blue-700">Re:</span>
            <div class="flex -space-x-2">
              <div
                v-for="player in rePlayers"
                :key="player.player_id"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                :style="{ backgroundColor: player.avatar_color }"
                :title="player.name"
              >
                {{ player.name?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span class="font-bold" :class="game.winner_team === 're' ? 'text-green-600' : 'text-red-600'">
              {{ game.points_re }}
            </span>
          </div>

          <span class="text-gray-400">vs</span>

          <!-- Kontra Team -->
          <div class="flex items-center space-x-2">
            <span class="font-semibold text-red-700">Kontra:</span>
            <div class="flex -space-x-2">
              <div
                v-for="player in kontraPlayers"
                :key="player.player_id"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                :style="{ backgroundColor: player.avatar_color }"
                :title="player.name"
              >
                {{ player.name?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span class="font-bold" :class="game.winner_team === 'kontra' ? 'text-green-600' : 'text-red-600'">
              {{ game.points_kontra }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!compact" class="flex space-x-2">
        <button
          @click="$emit('edit', game)"
          class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Bearbeiten
        </button>
        <button
          @click="$emit('delete', game)"
          class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Löschen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Game } from '../types'

const props = defineProps<{
  game: Game
  compact?: boolean
}>()

defineEmits<{
  edit: [game: Game]
  delete: [game: Game]
}>()

const rePlayers = computed(() => 
  props.game.participations?.filter(p => p.team === 're') || []
)

const kontraPlayers = computed(() => 
  props.game.participations?.filter(p => p.team === 'kontra') || []
)

const gameTypeLabel = computed(() => {
  const types: Record<string, string> = {
    'normal': 'Normal',
    'dame': 'Dame',
    'bube': 'Bube',
    'trumpf': 'Trumpf',
    'hochzeit': 'Hochzeit'
  }
  return types[props.game.game_type] || props.game.game_type
})

const gameTypeClass = computed(() => {
  if (props.game.game_type === 'normal') {
    return 'bg-gray-100 text-gray-800'
  }
  return 'bg-purple-100 text-purple-800'
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

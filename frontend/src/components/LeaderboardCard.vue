<template>
  <div 
    class="card hover:shadow-xl transition-all cursor-pointer"
    :class="rankClass"
    @click="$emit('click')"
  >
    <div class="flex items-center">
      <!-- Rank -->
      <div class="flex-shrink-0 w-16 text-center">
        <div v-if="rank <= 3" class="text-4xl">{{ rankEmoji }}</div>
        <div v-else class="text-2xl font-bold text-gray-600">{{ rank }}</div>
      </div>

      <!-- Player Info -->
      <div class="flex-grow flex items-center space-x-4 ml-4">
        <div 
          class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
          :style="{ backgroundColor: entry.player.avatar_color }"
        >
          {{ entry.player.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-grow">
          <h3 class="text-xl font-bold text-gray-900">{{ entry.player.name }}</h3>
          <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <span>{{ entry.games_played }} Spiele</span>
            <span>•</span>
            <span :class="winRateClass">{{ entry.win_rate }}% Gewonnen</span>
            <span>•</span>
            <span>Ø {{ entry.average_points }} Pkt</span>
          </div>
        </div>
      </div>

      <!-- Points -->
      <div class="text-right ml-4">
        <div class="text-3xl font-bold" :class="pointsColor">
          {{ entry.total_points > 0 ? '+' : '' }}{{ entry.total_points }}
        </div>
        <div class="text-sm text-gray-500">Punkte</div>
      </div>

      <!-- Trend Indicator -->
      <div class="ml-6">
        <div v-if="entry.total_points > 0" class="text-green-500 text-2xl">↑</div>
        <div v-else-if="entry.total_points < 0" class="text-red-500 text-2xl">↓</div>
        <div v-else class="text-gray-400 text-2xl">•</div>
      </div>
    </div>

    <!-- Additional Stats (on hover/mobile always visible) -->
    <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-sm">
      <div>
        <div class="text-gray-500">Siege</div>
        <div class="font-bold text-green-600">{{ entry.games_won }}</div>
      </div>
      <div>
        <div class="text-gray-500">Niederlagen</div>
        <div class="font-bold text-red-600">{{ entry.games_lost }}</div>
      </div>
      <div>
        <div class="text-gray-500">Solo-Spiele</div>
        <div class="font-bold text-blue-600">{{ entry.solo_games }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerStats } from '../types'

const props = defineProps<{
  entry: PlayerStats
  rank: number
}>()

defineEmits<{
  click: []
}>()

const rankEmoji = computed(() => {
  switch (props.rank) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return ''
  }
})

const rankClass = computed(() => {
  switch (props.rank) {
    case 1: return 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-white'
    case 2: return 'border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-white'
    case 3: return 'border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-white'
    default: return ''
  }
})

const pointsColor = computed(() => {
  if (props.entry.total_points > 0) return 'text-green-600'
  if (props.entry.total_points < 0) return 'text-red-600'
  return 'text-gray-600'
})

const winRateClass = computed(() => {
  const rate = parseFloat(props.entry.win_rate.toString())
  if (rate >= 60) return 'text-green-600 font-semibold'
  if (rate >= 40) return 'text-gray-600'
  return 'text-red-600'
})
</script>

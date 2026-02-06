<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center space-x-3">
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            :style="{ backgroundColor: stats.player.avatar_color }"
          >
            {{ stats.player.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ stats.player.name }}</h2>
            <p class="text-gray-500">Spielerstatistiken</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Gesamtpunkte"
          :value="stats.total_points"
          icon="🏆"
        />
        <StatCard
          title="Spiele"
          :value="stats.games_played"
          icon="🎮"
        />
        <StatCard
          title="Gewonnen"
          :value="stats.games_won"
          icon="✅"
          :sub-value="`${stats.win_rate}%`"
        />
        <StatCard
          title="Verloren"
          :value="stats.games_lost"
          icon="❌"
        />
        <StatCard
          title="Ø Punkte"
          :value="stats.average_points"
          icon="📊"
        />
        <StatCard
          title="Solo-Spiele"
          :value="stats.solo_games"
          icon="🎯"
        />
        <StatCard
          title="Gelbe Karten"
          :value="stats.yellow_cards"
          icon="🟨"
        />
        <StatCard
          title="Rote Karten"
          :value="stats.red_cards"
          icon="🟥"
        />
        <StatCard
          v-if="stats.unpaid_red_cards > 0"
          title="Offene Strafen"
          :value="`${stats.unpaid_red_cards}€`"
          icon="💶"
          class="col-span-2 md:col-span-1 bg-red-50"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerStats } from '../types'
import StatCard from './StatCard.vue'

defineProps<{
  stats: PlayerStats
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="stats-view">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Statistiken & Historie</h1>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-4 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Global Statistics Tab -->
    <div v-if="activeTab === 'global'" class="space-y-6">
      <div v-if="globalStatsLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else-if="globalStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gesamt Spiele"
          :value="globalStats.total_games"
          icon="🎮"
        />
        <StatCard
          title="Ø Punkte"
          :value="globalStats.average_points"
          icon="📊"
        />
        <StatCard
          title="Bock-Runden"
          :value="globalStats.bock_rounds"
          icon="🔥"
        />
        <StatCard
          title="Solo-Spiele"
          :value="soloGamesTotal"
          icon="🎯"
        />
      </div>

      <!-- Solo Games Breakdown -->
      <div v-if="globalStats && globalStats.solo_games.length > 0" class="card">
        <h3 class="text-xl font-bold mb-4">Solo-Spiele Verteilung</h3>
        <div class="space-y-2">
          <div
            v-for="solo in globalStats.solo_games"
            :key="solo.game_type"
            class="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <span class="font-medium capitalize">{{ solo.game_type }}</span>
            <span class="font-bold text-blue-600">{{ solo.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game History Tab -->
    <div v-if="activeTab === 'history'">
      <GameHistory />
    </div>

    <!-- Cards Tab -->
    <div v-if="activeTab === 'cards'">
      <CardSystem />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGamesStore } from '../stores/games'
import { storeToRefs } from 'pinia'
import StatCard from '../components/StatCard.vue'
import GameHistory from '../components/GameHistory.vue'
import CardSystem from '../components/CardSystem.vue'

const gamesStore = useGamesStore()
const { globalStats, loading: globalStatsLoading } = storeToRefs(gamesStore)

const tabs = [
  { id: 'global', label: 'Globale Statistiken' },
  { id: 'history', label: 'Spielverlauf' },
  { id: 'cards', label: 'Gelbe/Rote Karten' }
]

const activeTab = ref('global')

onMounted(() => {
  gamesStore.fetchGlobalStats()
})

const soloGamesTotal = computed(() => {
  if (!globalStats.value || !globalStats.value.solo_games) return 0
  return globalStats.value.solo_games.reduce((sum, solo) => sum + solo.count, 0)
})
</script>

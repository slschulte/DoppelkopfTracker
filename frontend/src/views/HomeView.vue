<template>
  <div class="home-view">
    <div class="mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Rangliste</h1>
          <p class="text-gray-600">Spieler-Rankings nach Punkten</p>
        </div>
        
        <!-- Game Day Filter -->
        <div class="flex flex-col items-end space-y-2">
          <label class="text-sm font-medium text-gray-700">Ansicht:</label>
          <select 
            v-model="selectedGameDay" 
            @change="loadPlayerStats"
            class="input max-w-xs"
          >
            <option value="">📊 Absolut (Alle Spiele)</option>
            <option 
              v-for="day in gameDays" 
              :key="day.game_day" 
              :value="day.game_day"
            >
              📅 {{ formatGameDay(day.game_day) }} ({{ day.game_count }} Spiele)
            </option>
          </select>
          <p v-if="selectedGameDay" class="text-xs text-blue-600">
            Relativ zum {{ formatGameDay(selectedGameDay) }}
          </p>
          <p v-else class="text-xs text-gray-500">
            Gesamtpunkte über alle Spieltage
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Leaderboard -->
    <div v-if="!loading && leaderboard.length > 0" class="space-y-4">
      <LeaderboardCard
        v-for="(entry, index) in leaderboard"
        :key="entry.player.id"
        :entry="entry"
        :rank="index + 1"
        @click="viewPlayerDetails(entry.player)"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && leaderboard.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🎴</div>
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Noch keine Spiele</h2>
      <p class="text-gray-500 mb-6">Lege zuerst Spieler an und erfasse dann dein erstes Spiel!</p>
      <div class="flex justify-center space-x-4">
        <router-link to="/players" class="btn btn-primary">
          Spieler verwalten
        </router-link>
        <router-link to="/game" class="btn btn-secondary">
          Spiel erfassen
        </router-link>
      </div>
    </div>

    <!-- Recent Games -->
    <div v-if="recentGames.length > 0" class="mt-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Letzte Spiele</h2>
      <div class="space-y-3">
        <GameHistoryCard
          v-for="game in recentGames.slice(0, 5)"
          :key="game.id"
          :game="game"
          compact
        />
      </div>
      <router-link 
        to="/stats" 
        class="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
      >
        Alle Spiele anzeigen →
      </router-link>
    </div>

    <!-- Player Details Modal -->
    <PlayerStatsModal
      v-if="showPlayerModal && selectedPlayerStats"
      :stats="selectedPlayerStats"
      @close="showPlayerModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayersStore } from '../stores/players'
import { useGamesStore } from '../stores/games'
import { storeToRefs } from 'pinia'
import LeaderboardCard from '../components/LeaderboardCard.vue'
import GameHistoryCard from '../components/GameHistoryCard.vue'
import PlayerStatsModal from '../components/PlayerStatsModal.vue'
import type { Player, PlayerStats } from '../types'

const playersStore = usePlayersStore()
const gamesStore = useGamesStore()
const { players, loading, error, currentPlayerStats } = storeToRefs(playersStore)
const { recentGames, gameDays } = storeToRefs(gamesStore)

const playerStats = ref<PlayerStats[]>([])
const showPlayerModal = ref(false)
const selectedPlayerStats = ref<PlayerStats | null>(null)
const selectedGameDay = ref<string>('')

onMounted(async () => {
  await playersStore.fetchPlayers()
  await gamesStore.fetchGames({ limit: 10 })
  await gamesStore.fetchGameDays()
  await loadPlayerStats()
})

function formatGameDay(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const leaderboard = computed(() => {
  return [...playerStats.value].sort((a, b) => b.total_points - a.total_points)
})

async function loadPlayerStats() {
  playerStats.value = []
  for (const player of players.value) {
    try {
      await playersStore.fetchPlayerStats(player.id, selectedGameDay.value || undefined)
      if (playersStore.currentPlayerStats) {
        playerStats.value.push(playersStore.currentPlayerStats)
      }
    } catch (e) {
      console.error(`Failed to load stats for player ${player.id}`, e)
    }
  }
}

async function viewPlayerDetails(player: Player) {
  await playersStore.fetchPlayerStats(player.id, selectedGameDay.value || undefined)
  selectedPlayerStats.value = playersStore.currentPlayerStats
  showPlayerModal.value = true
}
</script>

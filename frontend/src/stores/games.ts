import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gamesApi } from '../services/api'
import type { Game, GlobalStats, GameDay } from '../types'

export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const currentGame = ref<Game | null>(null)
  const globalStats = ref<GlobalStats | null>(null)
  const gameDays = ref<GameDay[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const recentGames = computed(() => {
    return [...games.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  })

  // Actions
  async function fetchGames(params?: { limit?: number; offset?: number; player_id?: number; game_type?: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await gamesApi.getAll(params)
      games.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch games'
    } finally {
      loading.value = false
    }
  }

  async function fetchGame(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await gamesApi.getById(id)
      currentGame.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch game'
    } finally {
      loading.value = false
    }
  }

  async function fetchGlobalStats() {
    loading.value = true
    error.value = null
    try {
      const response = await gamesApi.getGlobalStats()
      globalStats.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch global stats'
    } finally {
      loading.value = false
    }
  }

  async function fetchGameDays() {
    loading.value = true
    error.value = null
    try {
      const response = await gamesApi.getGameDays()
      gameDays.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch game days'
    } finally {
      loading.value = false
    }
  }

  async function createGame(game: Partial<Game>) {
    loading.value = true
    error.value = null
    try {
      const response = await gamesApi.create(game)
      games.value.unshift(response.data)
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to create game'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateGame(id: number, game: Partial<Game>) {
    loading.value = true
    error.value = null
    try {
      const response = await gamesApi.update(id, game)
      const index = games.value.findIndex(g => g.id === id)
      if (index !== -1) {
        games.value[index] = response.data
      }
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to update game'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteGame(id: number) {
    loading.value = true
    error.value = null
    try {
      await gamesApi.delete(id)
      games.value = games.value.filter(g => g.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete game'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    games,
    currentGame,
    globalStats,
    gameDays,
    loading,
    error,
    recentGames,
    fetchGames,
    fetchGame,
    fetchGlobalStats,
    fetchGameDays,
    createGame,
    updateGame,
    deleteGame
  }
})

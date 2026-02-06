import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { playersApi } from '../services/api'
import type { Player, PlayerStats } from '../types'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([])
  const currentPlayer = ref<Player | null>(null)
  const currentPlayerStats = ref<PlayerStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const sortedPlayers = computed(() => {
    return [...players.value].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Actions
  async function fetchPlayers() {
    loading.value = true
    error.value = null
    try {
      const response = await playersApi.getAll()
      players.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch players'
    } finally {
      loading.value = false
    }
  }

  async function fetchPlayer(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await playersApi.getById(id)
      currentPlayer.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch player'
    } finally {
      loading.value = false
    }
  }

  async function fetchPlayerStats(id: number, gameDay?: string) {
    loading.value = true
    error.value = null
    try {
      const response = await playersApi.getStats(id, gameDay)
      currentPlayerStats.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch player stats'
    } finally {
      loading.value = false
    }
  }

  async function createPlayer(player: Partial<Player>) {
    loading.value = true
    error.value = null
    try {
      const response = await playersApi.create(player)
      players.value.push(response.data)
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to create player'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updatePlayer(id: number, player: Partial<Player>) {
    loading.value = true
    error.value = null
    try {
      const response = await playersApi.update(id, player)
      const index = players.value.findIndex(p => p.id === id)
      if (index !== -1) {
        players.value[index] = response.data
      }
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to update player'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deletePlayer(id: number) {
    loading.value = true
    error.value = null
    try {
      await playersApi.delete(id)
      players.value = players.value.filter(p => p.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete player'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    players,
    currentPlayer,
    currentPlayerStats,
    loading,
    error,
    sortedPlayers,
    fetchPlayers,
    fetchPlayer,
    fetchPlayerStats,
    createPlayer,
    updatePlayer,
    deletePlayer
  }
})

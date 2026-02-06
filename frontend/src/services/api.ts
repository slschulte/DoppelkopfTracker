import axios from 'axios'
import type { Player, PlayerStats, Game, Card, GlobalStats } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Players API
export const playersApi = {
  getAll: () => api.get<Player[]>('/players'),
  getById: (id: number) => api.get<Player>(`/players/${id}`),
  getStats: (id: number, game_day?: string) => api.get<PlayerStats>(`/players/${id}/stats`, { params: { game_day } }),
  create: (player: Partial<Player>) => api.post<Player>('/players', player),
  update: (id: number, player: Partial<Player>) => api.put<Player>(`/players/${id}`, player),
  delete: (id: number) => api.delete(`/players/${id}`)
}

// Games API
export const gamesApi = {
  getAll: (params?: { limit?: number; offset?: number; player_id?: number; game_type?: string }) => 
    api.get<Game[]>('/games', { params }),
  getById: (id: number) => api.get<Game>(`/games/${id}`),
  getGlobalStats: () => api.get<GlobalStats>('/games/stats/global'),
  getGameDays: () => api.get<Array<{ game_day: string; game_count: number; first_game: string }>>('/games/game-days'),
  create: (game: Partial<Game>) => api.post<Game>('/games', game),
  update: (id: number, game: Partial<Game>) => api.put<Game>(`/games/${id}`, game),
  delete: (id: number) => api.delete(`/games/${id}`)
}

// Cards API
export const cardsApi = {
  getAll: (params?: { player_id?: number; card_type?: string; paid?: boolean }) => 
    api.get<Card[]>('/cards', { params }),
  getUnpaid: () => api.get<{ cards: Card[]; total_unpaid: number; currency: string }>('/cards/unpaid'),
  create: (card: Partial<Card>) => api.post<Card>('/cards', card),
  update: (id: number, card: Partial<Card>) => api.put<Card>(`/cards/${id}`, card),
  delete: (id: number) => api.delete(`/cards/${id}`)
}

export default api

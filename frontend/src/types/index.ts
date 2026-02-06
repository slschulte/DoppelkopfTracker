export interface Player {
  id: number
  name: string
  avatar_color: string
  created_at: string
}

export interface PlayerStats {
  player: Player
  total_points: number
  games_played: number
  games_won: number
  games_lost: number
  win_rate: number
  average_points: number
  solo_games: number
  yellow_cards: number
  red_cards: number
  unpaid_red_cards: number
}

export interface Game {
  id: number
  date: string
  game_day?: string
  game_type: 'normal' | 'dame' | 'bube' | 'trumpf' | 'hochzeit'
  winner_team: 're' | 'kontra'
  points_re: number
  points_kontra: number
  extras?: string
  announcements?: string
  bock_round: boolean
  participations?: GameParticipation[]
}

export interface GameDay {
  game_day: string
  game_count: number
  first_game: string
}

export interface GameParticipation {
  id: number
  game_id: number
  player_id: number
  team: 're' | 'kontra'
  points_earned: number
  name?: string
  avatar_color?: string
}

export interface Card {
  id: number
  player_id: number
  card_type: 'yellow' | 'red'
  date: string
  reason?: string
  paid: boolean
  player_name?: string
  avatar_color?: string
}

export interface GameExtras {
  karlchen?: boolean
  doppelkopf?: boolean
  fuchs?: boolean
  gegenDieAlten?: boolean
}

export interface GameAnnouncements {
  re?: boolean
  kontra?: boolean
  keine90?: boolean
  keine60?: boolean
  keine30?: boolean
  keine0?: boolean
}

export interface GlobalStats {
  total_games: number
  average_points: number
  extras_stats: { extras: string; count: number }[]
  bock_rounds: number
  solo_games: { game_type: string; count: number }[]
}

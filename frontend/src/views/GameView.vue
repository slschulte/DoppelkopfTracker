<template>
  <div class="game-view">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Neues Spiel erfassen</h1>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>

    <div class="card max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit">
        <!-- Date -->
        <div class="mb-6">
          <label class="label">Datum & Uhrzeit</label>
          <input
            v-model="form.date"
            type="datetime-local"
            class="input"
            required
          />
        </div>

        <!-- Game Type -->
        <div class="mb-6">
          <label class="label">Spieltyp</label>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              v-for="type in gameTypes"
              :key="type.value"
              type="button"
              @click="form.game_type = type.value"
              class="px-4 py-2 rounded-lg border-2 transition-all"
              :class="form.game_type === type.value 
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' 
                : 'border-gray-300 hover:border-gray-400'"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Player Selection -->
        <div class="mb-6">
          <label class="label">Spieler auswählen (4 erforderlich)</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Re Team -->
            <div class="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 class="font-bold text-blue-900 mb-3">Re-Partei</h3>
              <div class="space-y-2">
                <select v-model="form.re_player1" class="input" required>
                  <option value="">Spieler 1 wählen...</option>
                  <option v-for="player in availablePlayers" :key="player.id" :value="player.id">
                    {{ player.name }}
                  </option>
                </select>
                <select v-model="form.re_player2" class="input" required>
                  <option value="">Spieler 2 wählen...</option>
                  <option v-for="player in availablePlayers" :key="player.id" :value="player.id">
                    {{ player.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Kontra Team -->
            <div class="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <h3 class="font-bold text-red-900 mb-3">Kontra-Partei</h3>
              <div class="space-y-2">
                <select v-model="form.kontra_player1" class="input" required>
                  <option value="">Spieler 1 wählen...</option>
                  <option v-for="player in availablePlayers" :key="player.id" :value="player.id">
                    {{ player.name }}
                  </option>
                </select>
                <select v-model="form.kontra_player2" class="input" required>
                  <option value="">Spieler 2 wählen...</option>
                  <option v-for="player in availablePlayers" :key="player.id" :value="player.id">
                    {{ player.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Points -->
        <div class="mb-6">
          <label class="label">Punkteingabe (Gesamt: 240 Augen)</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-blue-700 font-medium">Re-Punkte</label>
              <input
                v-model.number="form.points_re"
                type="number"
                min="0"
                max="240"
                class="input"
                required
                @input="updateKontraPoints"
              />
            </div>
            <div>
              <label class="text-sm text-red-700 font-medium">Kontra-Punkte</label>
              <input
                v-model.number="form.points_kontra"
                type="number"
                min="0"
                max="240"
                class="input"
                required
                @input="updateRePoints"
              />
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Summe: {{ form.points_re + form.points_kontra }} / 240
          </p>
        </div>

        <!-- Extras -->
        <div class="mb-6">
          <label class="label">Extras</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="form.extras.karlchen" type="checkbox" class="w-5 h-5 text-blue-600" />
              <span>Karlchen</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="form.extras.doppelkopf" type="checkbox" class="w-5 h-5 text-blue-600" />
              <span>Doppelkopf</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="form.extras.fuchs" type="checkbox" class="w-5 h-5 text-blue-600" />
              <span>Fuchs gefangen</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="form.extras.gegenDieAlten" type="checkbox" class="w-5 h-5 text-blue-600" />
              <span>Gegen die Alten</span>
            </label>
          </div>
        </div>

        <!-- Announcements -->
        <div class="mb-6">
          <label class="label">Ansagen</label>
          <div class="space-y-3">
            <div class="flex space-x-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="form.announcements.re" type="checkbox" class="w-5 h-5 text-blue-600" />
                <span class="font-medium">Re</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="form.announcements.kontra" type="checkbox" class="w-5 h-5 text-red-600" />
                <span class="font-medium">Kontra</span>
              </label>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="form.announcements.keine90" type="checkbox" class="w-5 h-5" />
                <span>Keine 90</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="form.announcements.keine60" type="checkbox" class="w-5 h-5" />
                <span>Keine 60</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="form.announcements.keine30" type="checkbox" class="w-5 h-5" />
                <span>Keine 30</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="form.announcements.keine0" type="checkbox" class="w-5 h-5" />
                <span>Keine 0</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Bock Round -->
        <div class="mb-6">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input v-model="form.bock_round" type="checkbox" class="w-5 h-5 text-orange-600" />
            <span class="font-medium">Bock-Runde (doppelte Punkte)</span>
          </label>
        </div>

        <!-- Points Preview -->
        <div v-if="calculatedPoints" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
          <h3 class="font-bold text-lg mb-3 text-blue-900">📊 Berechnete Punkte</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-700">Gewinner:</span>
              <span class="font-bold text-green-700">{{ winnerTeam === 're' ? 'Re-Partei' : 'Kontra-Partei' }}</span>
            </div>
            
            <div class="border-t border-blue-200 pt-2 space-y-1">
              <p class="text-gray-600">• Grundwert: +{{ calculatedPoints.basePoints }}</p>
              <p v-if="calculatedPoints.announcementPoints > 0" class="text-gray-600">
                • Re/Kontra Ansagen: +{{ calculatedPoints.announcementPoints }}
              </p>
              <p v-if="calculatedPoints.thresholdPoints > 0" class="text-gray-600">
                • Erreichte Stufen: +{{ calculatedPoints.thresholdPoints }}
              </p>
              <p v-if="calculatedPoints.absagenPoints > 0" class="text-gray-600">
                • Erfüllte Absagen: +{{ calculatedPoints.absagenPoints }}
              </p>
              <p v-if="calculatedPoints.extraPoints > 0" class="text-gray-600">
                • Sonderpunkte (Extras): +{{ calculatedPoints.extraPoints }}
              </p>
              <p v-if="calculatedPoints.bockMultiplier > 1" class="text-orange-600 font-semibold">
                • Bock-Runde: ×{{ calculatedPoints.bockMultiplier }}
              </p>
            </div>
            
            <div class="border-t-2 border-blue-300 pt-3 mt-3">
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-blue-900">Gesamt:</span>
                <span class="text-2xl font-bold text-green-600">{{ calculatedPoints.total }} Punkte</span>
              </div>
              <p class="text-xs text-gray-600 mt-1">{{ calculatedPoints.soloMultiplier }}</p>
              <p class="text-xs text-gray-500 mt-2">
                ✓ Gewinner erhalten <span class="text-green-600 font-semibold">+{{ calculatedPoints.total }}</span> Punkte<br>
                ✗ Verlierer erhalten <span class="text-red-600 font-semibold">-{{ calculatedPoints.total }}</span> Punkte
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="resetForm"
            class="btn btn-secondary"
          >
            Zurücksetzen
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? 'Speichern...' : 'Spiel speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGamesStore } from '../stores/games'
import { usePlayersStore } from '../stores/players'
import { storeToRefs } from 'pinia'
import type { GameExtras, GameAnnouncements } from '../types'

const gamesStore = useGamesStore()
const playersStore = usePlayersStore()
const { loading, error } = storeToRefs(gamesStore)
const { players } = storeToRefs(playersStore)

const gameTypes = [
  { value: 'normal', label: 'Normal' },
  { value: 'dame', label: 'Dame-Solo' },
  { value: 'bube', label: 'Buben-Solo' },
  { value: 'trumpf', label: 'Trumpf-Solo' },
  { value: 'hochzeit', label: 'Hochzeit' }
]

const successMessage = ref('')

const form = ref({
  date: new Date().toISOString().slice(0, 16),
  game_type: 'normal',
  re_player1: '',
  re_player2: '',
  kontra_player1: '',
  kontra_player2: '',
  points_re: 121,
  points_kontra: 119,
  extras: {
    karlchen: false,
    doppelkopf: false,
    fuchs: false,
    gegenDieAlten: false
  } as GameExtras,
  announcements: {
    re: false,
    kontra: false,
    keine90: false,
    keine60: false,
    keine30: false,
    keine0: false
  } as GameAnnouncements,
  bock_round: false
})

onMounted(() => {
  playersStore.fetchPlayers()
})

const availablePlayers = computed(() => players.value)

const isFormValid = computed(() => {
  const selectedPlayers = [
    form.value.re_player1,
    form.value.re_player2,
    form.value.kontra_player1,
    form.value.kontra_player2
  ]
  
  // Check if all players are selected
  if (selectedPlayers.some(p => !p)) return false
  
  // Check if all players are unique
  const uniquePlayers = new Set(selectedPlayers)
  if (uniquePlayers.size !== 4) return false
  
  // Check if points sum to 240
  if (form.value.points_re + form.value.points_kontra !== 240) return false
  
  return true
})

const winnerTeam = computed(() => {
  return form.value.points_re >= 121 ? 're' : 'kontra'
})

const calculatedPoints = computed(() => {
  if (!isFormValid.value) return null
  
  const losingPoints = winnerTeam.value === 're' ? form.value.points_kontra : form.value.points_re
  
  // 1. Grundwert: 1 Punkt für das gewonnene Spiel
  let totalPoints = 1
  
  // 2. Ansagen: +2 Punkte pro Re/Kontra
  let announcementPoints = 0
  if (form.value.announcements.re) {
    totalPoints += 2
    announcementPoints += 2
  }
  if (form.value.announcements.kontra) {
    totalPoints += 2
    announcementPoints += 2
  }
  
  // 3. Zusatzpunkte für erreichte Stufen (immer für Gewinner)
  let thresholdPoints = 0
  if (losingPoints < 90) { totalPoints += 1; thresholdPoints++ }
  if (losingPoints < 60) { totalPoints += 1; thresholdPoints++ }
  if (losingPoints < 30) { totalPoints += 1; thresholdPoints++ }
  if (losingPoints === 0) { totalPoints += 1; thresholdPoints++ }
  
  // 4. Zusätzliche Punkte für erfüllte Absagen
  let absagenPoints = 0
  if (form.value.announcements.keine90 && losingPoints < 90) {
    totalPoints += 1
    absagenPoints++
  }
  if (form.value.announcements.keine60 && losingPoints < 60) {
    totalPoints += 1
    absagenPoints++
  }
  if (form.value.announcements.keine30 && losingPoints < 30) {
    totalPoints += 1
    absagenPoints++
  }
  if (form.value.announcements.keine0 && losingPoints === 0) {
    totalPoints += 1
    absagenPoints++
  }
  
  // 5. Sonderpunkte für Extras
  let extraPoints = 0
  if (form.value.extras.karlchen) { totalPoints += 1; extraPoints++ }
  if (form.value.extras.doppelkopf) { totalPoints += 1; extraPoints++ }
  if (form.value.extras.fuchs) { totalPoints += 1; extraPoints++ }
  if (form.value.extras.gegenDieAlten) { totalPoints += 1; extraPoints++ }
  
  // 6. Bock-Runde verdoppelt alle Punkte
  if (form.value.bock_round) {
    totalPoints *= 2
  }
  
  const isSolo = form.value.game_type !== 'normal'
  
  return {
    basePoints: 1,
    announcementPoints,
    thresholdPoints,
    absagenPoints,
    extraPoints,
    bockMultiplier: form.value.bock_round ? 2 : 1,
    total: totalPoints,
    soloMultiplier: isSolo ? '3× für Solospieler, 1× für Gegner' : 'Gleich für alle Spieler'
  }
})

function updateKontraPoints() {
  form.value.points_kontra = 240 - form.value.points_re
}

function updateRePoints() {
  form.value.points_re = 240 - form.value.points_kontra
}

function resetForm() {
  form.value = {
    date: new Date().toISOString().slice(0, 16),
    game_type: 'normal',
    re_player1: '',
    re_player2: '',
    kontra_player1: '',
    kontra_player2: '',
    points_re: 121,
    points_kontra: 119,
    extras: {
      karlchen: false,
      doppelkopf: false,
      fuchs: false,
      gegenDieAlten: false
    },
    announcements: {
      re: false,
      kontra: false,
      keine90: false,
      keine60: false,
      keine30: false,
      keine0: false
    },
    bock_round: false
  }
  successMessage.value = ''
}

async function handleSubmit() {
  if (!isFormValid.value) return
  
  const participations = [
    { player_id: Number(form.value.re_player1), team: 're' },
    { player_id: Number(form.value.re_player2), team: 're' },
    { player_id: Number(form.value.kontra_player1), team: 'kontra' },
    { player_id: Number(form.value.kontra_player2), team: 'kontra' }
  ]
  
  const gameData = {
    date: form.value.date,
    game_type: form.value.game_type,
    points_re: form.value.points_re,
    points_kontra: form.value.points_kontra,
    extras: form.value.extras,
    announcements: form.value.announcements,
    bock_round: form.value.bock_round,
    participations
  }
  
  try {
    await gamesStore.createGame(gameData)
    successMessage.value = 'Spiel erfolgreich gespeichert!'
    setTimeout(() => {
      resetForm()
    }, 2000)
  } catch (e) {
    // Error is handled by store
  }
}
</script>

<template>
  <div class="game-history">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Spielverlauf</h2>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Spieler filtern</label>
        <select v-model="filterPlayer" class="input">
          <option value="">Alle Spieler</option>
          <option v-for="player in players" :key="player.id" :value="player.id">
            {{ player.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="label">Spieltyp filtern</label>
        <select v-model="filterGameType" class="input">
          <option value="">Alle Typen</option>
          <option value="normal">Normal</option>
          <option value="dame">Dame-Solo</option>
          <option value="bube">Buben-Solo</option>
          <option value="trumpf">Trumpf-Solo</option>
          <option value="hochzeit">Hochzeit</option>
        </select>
      </div>

      <div>
        <label class="label">Sortierung</label>
        <select v-model="sortOrder" class="input">
          <option value="desc">Neueste zuerst</option>
          <option value="asc">Älteste zuerst</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Games List -->
    <div v-if="!loading && displayedGames.length > 0" class="space-y-3">
      <GameHistoryCard
        v-for="game in displayedGames"
        :key="game.id"
        :game="game"
        @edit="editGame"
        @delete="confirmDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && displayedGames.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🎴</div>
      <p class="text-gray-500 text-lg">Keine Spiele gefunden</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalGames > limit" class="mt-6 flex justify-center space-x-2">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="btn btn-secondary"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        Zurück
      </button>
      <span class="px-4 py-2 text-gray-700">
        Seite {{ currentPage }} von {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-secondary"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        Weiter
      </button>
    </div>

    <!-- Edit Game Modal -->
    <EditGameModal
      v-if="showEditModal && editingGame"
      :game="editingGame"
      @close="showEditModal = false"
      @save="handleUpdate"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Spiel löschen?"
      message="Möchtest du dieses Spiel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      confirm-text="Löschen"
      cancel-text="Abbrechen"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGamesStore } from '../stores/games'
import { usePlayersStore } from '../stores/players'
import { storeToRefs } from 'pinia'
import GameHistoryCard from './GameHistoryCard.vue'
import EditGameModal from './EditGameModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import type { Game } from '../types'

const gamesStore = useGamesStore()
const playersStore = usePlayersStore()
const { games, loading } = storeToRefs(gamesStore)
const { players } = storeToRefs(playersStore)

const filterPlayer = ref('')
const filterGameType = ref('')
const sortOrder = ref('desc')
const currentPage = ref(1)
const limit = 20

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const editingGame = ref<Game | null>(null)
const deletingGame = ref<Game | null>(null)

onMounted(async () => {
  await playersStore.fetchPlayers()
  await fetchGames()
})

watch([filterPlayer, filterGameType, sortOrder, currentPage], () => {
  fetchGames()
})

async function fetchGames() {
  const params: any = {
    limit,
    offset: (currentPage.value - 1) * limit
  }
  
  if (filterPlayer.value) {
    params.player_id = Number(filterPlayer.value)
  }
  
  if (filterGameType.value) {
    params.game_type = filterGameType.value
  }
  
  await gamesStore.fetchGames(params)
}

const displayedGames = computed(() => {
  let filtered = [...games.value]
  
  if (sortOrder.value === 'asc') {
    filtered.reverse()
  }
  
  return filtered
})

const totalGames = computed(() => games.value.length)
const totalPages = computed(() => Math.ceil(totalGames.value / limit))

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function editGame(game: Game) {
  editingGame.value = game
  showEditModal.value = true
}

function confirmDelete(game: Game) {
  deletingGame.value = game
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (deletingGame.value) {
    await gamesStore.deleteGame(deletingGame.value.id)
    showDeleteConfirm.value = false
    deletingGame.value = null
    await fetchGames()
  }
}

async function handleUpdate(updatedGame: Partial<Game>) {
  if (editingGame.value) {
    await gamesStore.updateGame(editingGame.value.id, updatedGame)
    showEditModal.value = false
    editingGame.value = null
    await fetchGames()
  }
}
</script>

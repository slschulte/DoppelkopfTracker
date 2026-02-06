<template>
  <div class="players-view">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Spielerverwaltung</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        + Neuer Spieler
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Players List -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <PlayerCard
        v-for="player in sortedPlayers"
        :key="player.id"
        :player="player"
        @edit="editPlayer"
        @delete="confirmDelete"
        @view-stats="viewPlayerStats"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && sortedPlayers.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg mb-4">Noch keine Spieler vorhanden</p>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Ersten Spieler anlegen
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <PlayerModal
      v-if="showCreateModal || showEditModal"
      :player="editingPlayer"
      :is-edit="showEditModal"
      @close="closeModals"
      @save="handleSave"
    />

    <!-- Stats Modal -->
    <PlayerStatsModal
      v-if="showStatsModal && currentPlayerStats"
      :stats="currentPlayerStats"
      @close="showStatsModal = false"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Spieler löschen?"
      :message="`Möchtest du ${deletingPlayer?.name} wirklich löschen? Alle Spieldaten bleiben erhalten.`"
      confirm-text="Löschen"
      cancel-text="Abbrechen"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayersStore } from '../stores/players'
import { storeToRefs } from 'pinia'
import PlayerCard from '../components/PlayerCard.vue'
import PlayerModal from '../components/PlayerModal.vue'
import PlayerStatsModal from '../components/PlayerStatsModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import type { Player } from '../types'

const playersStore = usePlayersStore()
const { sortedPlayers, loading, error, currentPlayerStats } = storeToRefs(playersStore)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showStatsModal = ref(false)
const showDeleteConfirm = ref(false)
const editingPlayer = ref<Player | null>(null)
const deletingPlayer = ref<Player | null>(null)

onMounted(() => {
  playersStore.fetchPlayers()
})

function editPlayer(player: Player) {
  editingPlayer.value = player
  showEditModal.value = true
}

function confirmDelete(player: Player) {
  deletingPlayer.value = player
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (deletingPlayer.value) {
    await playersStore.deletePlayer(deletingPlayer.value.id)
    showDeleteConfirm.value = false
    deletingPlayer.value = null
  }
}

async function viewPlayerStats(player: Player) {
  await playersStore.fetchPlayerStats(player.id)
  showStatsModal.value = true
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  editingPlayer.value = null
}

async function handleSave(player: Partial<Player>) {
  if (showEditModal.value && editingPlayer.value) {
    await playersStore.updatePlayer(editingPlayer.value.id, player)
  } else {
    await playersStore.createPlayer(player)
  }
  closeModals()
}
</script>

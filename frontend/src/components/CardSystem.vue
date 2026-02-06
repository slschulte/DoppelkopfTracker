<template>
  <div class="card-system">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gelbe & Rote Karten</h2>
        <p class="text-gray-600">Verwarnungen und Strafen verwalten</p>
      </div>
      <button @click="showAddCardModal = true" class="btn btn-primary">
        + Karte vergeben
      </button>
    </div>

    <!-- Unpaid Fines Alert -->
    <div v-if="totalUnpaid > 0" class="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">💶</span>
          <div>
            <h3 class="font-bold text-red-900">Offene Strafen</h3>
            <p class="text-red-700">{{ totalUnpaid }} × 1€ = {{ totalUnpaid }}€</p>
          </div>
        </div>
        <button
          @click="showUnpaidModal = true"
          class="btn bg-red-600 text-white hover:bg-red-700"
        >
          Details anzeigen
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap gap-3">
      <select v-model="filterType" class="input max-w-xs">
        <option value="">Alle Karten</option>
        <option value="yellow">Gelbe Karten</option>
        <option value="red">Rote Karten</option>
      </select>
      <select v-model="filterPlayer" class="input max-w-xs">
        <option value="">Alle Spieler</option>
        <option v-for="player in players" :key="player.id" :value="player.id">
          {{ player.name }}
        </option>
      </select>
      <select v-model="filterPaid" class="input max-w-xs">
        <option value="">Alle</option>
        <option value="false">Unbezahlt</option>
        <option value="true">Bezahlt</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Cards List -->
    <div v-if="!loading && filteredCards.length > 0" class="space-y-3">
      <CardItem
        v-for="card in filteredCards"
        :key="card.id"
        :card="card"
        @mark-paid="markAsPaid"
        @delete="confirmDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredCards.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🃏</div>
      <p class="text-gray-500">Keine Karten vorhanden</p>
    </div>

    <!-- Add Card Modal -->
    <AddCardModal
      v-if="showAddCardModal"
      @close="showAddCardModal = false"
      @save="handleAddCard"
    />

    <!-- Unpaid Cards Modal -->
    <UnpaidCardsModal
      v-if="showUnpaidModal"
      :cards="unpaidCards"
      :total="totalUnpaid"
      @close="showUnpaidModal = false"
      @mark-paid="markAsPaid"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Karte löschen?"
      message="Möchtest du diese Karte wirklich löschen?"
      confirm-text="Löschen"
      cancel-text="Abbrechen"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCardsStore } from '../stores/cards'
import { usePlayersStore } from '../stores/players'
import { storeToRefs } from 'pinia'
import CardItem from './CardItem.vue'
import AddCardModal from './AddCardModal.vue'
import UnpaidCardsModal from './UnpaidCardsModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import type { Card } from '../types'

const cardsStore = useCardsStore()
const playersStore = usePlayersStore()
const { cards, loading, unpaidCards, totalUnpaid } = storeToRefs(cardsStore)
const { players } = storeToRefs(playersStore)

const showAddCardModal = ref(false)
const showUnpaidModal = ref(false)
const showDeleteConfirm = ref(false)
const deletingCard = ref<Card | null>(null)

const filterType = ref('')
const filterPlayer = ref('')
const filterPaid = ref('')

onMounted(async () => {
  await playersStore.fetchPlayers()
  await cardsStore.fetchCards()
  await cardsStore.fetchUnpaidCards()
})

watch([filterType, filterPlayer, filterPaid], async () => {
  const params: any = {}
  if (filterType.value) params.card_type = filterType.value
  if (filterPlayer.value) params.player_id = Number(filterPlayer.value)
  if (filterPaid.value) params.paid = filterPaid.value === 'true'
  
  await cardsStore.fetchCards(params)
})

const filteredCards = computed(() => cards.value)

function confirmDelete(card: Card) {
  deletingCard.value = card
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (deletingCard.value) {
    await cardsStore.deleteCard(deletingCard.value.id)
    showDeleteConfirm.value = false
    deletingCard.value = null
    await cardsStore.fetchUnpaidCards()
  }
}

async function markAsPaid(card: Card) {
  await cardsStore.markAsPaid(card.id)
  await cardsStore.fetchCards()
  await cardsStore.fetchUnpaidCards()
}

async function handleAddCard(card: Partial<Card>) {
  await cardsStore.createCard(card)
  showAddCardModal.value = false
  await cardsStore.fetchCards()
  await cardsStore.fetchUnpaidCards()
}
</script>

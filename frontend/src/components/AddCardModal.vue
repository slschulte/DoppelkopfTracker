<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 class="text-2xl font-bold mb-4">Karte vergeben</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="label">Spieler</label>
          <select v-model="form.player_id" class="input" required>
            <option value="">Spieler wählen...</option>
            <option v-for="player in players" :key="player.id" :value="player.id">
              {{ player.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="label">Kartentyp</label>
          <div class="flex space-x-4">
            <button
              type="button"
              @click="form.card_type = 'yellow'"
              class="flex-1 py-3 rounded-lg border-2 transition-all"
              :class="form.card_type === 'yellow' 
                ? 'border-yellow-400 bg-yellow-50 text-yellow-900 font-semibold' 
                : 'border-gray-300'"
            >
              🟨 Gelbe Karte
            </button>
            <button
              type="button"
              @click="form.card_type = 'red'"
              class="flex-1 py-3 rounded-lg border-2 transition-all"
              :class="form.card_type === 'red' 
                ? 'border-red-400 bg-red-50 text-red-900 font-semibold' 
                : 'border-gray-300'"
            >
              🟥 Rote Karte
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Gelbe Karte = Verwarnung | Rote Karte = 1€ Strafe
          </p>
        </div>

        <div class="mb-6">
          <label class="label">Grund (optional)</label>
          <textarea
            v-model="form.reason"
            class="input"
            rows="3"
            placeholder="Was ist passiert?"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Abbrechen
          </button>
          <button type="submit" class="btn btn-primary">
            Karte vergeben
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayersStore } from '../stores/players'
import { storeToRefs } from 'pinia'
import type { Card } from '../types'

const emit = defineEmits<{
  close: []
  save: [card: Partial<Card>]
}>()

const playersStore = usePlayersStore()
const { players } = storeToRefs(playersStore)

const form = ref({
  player_id: '',
  card_type: 'yellow' as 'yellow' | 'red',
  reason: ''
})

onMounted(() => {
  playersStore.fetchPlayers()
})

function handleSubmit() {
  emit('save', {
    player_id: Number(form.value.player_id),
    card_type: form.value.card_type,
    reason: form.value.reason || undefined,
    date: new Date().toISOString()
  })
}
</script>

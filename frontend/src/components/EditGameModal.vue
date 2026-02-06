<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
      <h2 class="text-2xl font-bold mb-4">Spiel bearbeiten</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Date -->
        <div class="mb-4">
          <label class="label">Datum & Uhrzeit</label>
          <input
            v-model="form.date"
            type="datetime-local"
            class="input"
            required
          />
        </div>

        <!-- Points -->
        <div class="mb-4">
          <label class="label">Punkte</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-blue-700">Re</label>
              <input
                v-model.number="form.points_re"
                type="number"
                min="0"
                max="240"
                class="input"
                required
              />
            </div>
            <div>
              <label class="text-sm text-red-700">Kontra</label>
              <input
                v-model.number="form.points_kontra"
                type="number"
                min="0"
                max="240"
                class="input"
                required
              />
            </div>
          </div>
        </div>

        <!-- Bock Round -->
        <div class="mb-6">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input v-model="form.bock_round" type="checkbox" class="w-5 h-5" />
            <span>Bock-Runde</span>
          </label>
        </div>

        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Abbrechen
          </button>
          <button type="submit" class="btn btn-primary">
            Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Game } from '../types'

const props = defineProps<{
  game: Game
}>()

const emit = defineEmits<{
  close: []
  save: [game: Partial<Game>]
}>()

const form = ref({
  date: '',
  points_re: 0,
  points_kontra: 0,
  bock_round: false
})

watch(() => props.game, (game) => {
  if (game) {
    form.value = {
      date: game.date.slice(0, 16),
      points_re: game.points_re,
      points_kontra: game.points_kontra,
      bock_round: game.bock_round
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', {
    date: form.value.date,
    points_re: form.value.points_re,
    points_kontra: form.value.points_kontra,
    bock_round: form.value.bock_round
  })
}
</script>

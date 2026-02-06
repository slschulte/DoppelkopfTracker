<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 class="text-2xl font-bold mb-4">
        {{ isEdit ? 'Spieler bearbeiten' : 'Neuer Spieler' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="label">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="input"
            placeholder="Spielername"
            required
          />
        </div>

        <div class="mb-6">
          <label class="label">Avatar-Farbe</label>
          <div class="flex space-x-2 mb-2">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              @click="form.avatar_color = color"
              class="w-10 h-10 rounded-full border-2 transition-all"
              :class="form.avatar_color === color ? 'border-gray-900 scale-110' : 'border-gray-300'"
              :style="{ backgroundColor: color }"
            />
          </div>
          <input
            v-model="form.avatar_color"
            type="color"
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-secondary"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            class="btn btn-primary"
          >
            {{ isEdit ? 'Speichern' : 'Anlegen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Player } from '../types'

const props = defineProps<{
  player?: Player | null
  isEdit: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [player: Partial<Player>]
}>()

const colorOptions = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
]

const form = ref({
  name: '',
  avatar_color: '#3B82F6'
})

watch(() => props.player, (player) => {
  if (player) {
    form.value = {
      name: player.name,
      avatar_color: player.avatar_color
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', form.value)
}
</script>

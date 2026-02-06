<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-bold mb-2">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('cancel')"
          class="btn btn-secondary"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          class="btn btn-danger"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmText: string
  cancelText: string
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-gray-600 text-sm">{{ title }}</span>
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <div class="text-2xl font-bold text-gray-900">{{ value }}</div>
    <div v-if="subValue" class="text-sm text-gray-500 mt-1">{{ subValue }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  subValue?: string
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      Distance Information
    </h2>

    <div v-if="distanceInfo" class="space-y-3">
      <!-- Distance display -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
        <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">Distance</div>
        <div class="space-y-1">
          <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ distanceInfo.km }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ distanceInfo.m }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ distanceInfo.miles }}
          </div>
        </div>
      </div>

      <!-- Bearing display -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
        <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">Bearing (A→B)</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ distanceInfo.bearing }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          0°=North, 90°=East, 180°=South, 270°=West
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
      <svg class="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p class="text-sm">Place two markers</p>
      <p class="text-sm">on the map</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DistanceInfo {
  meters: number
  km: string
  m: string
  miles: string
  bearing: string
}

interface Props {
  distanceInfo: DistanceInfo | null
}

defineProps<Props>()
</script>
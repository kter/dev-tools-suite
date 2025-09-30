<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Map Distance Calculator
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Calculate great-circle distance and bearing between two points on a map
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-240px)] lg:min-h-[600px]">
        <!-- Sidebar -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Control Buttons -->
          <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-3">
            <button
              @click="handleClear"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>

            <button
              @click="handleGeolocation"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Location
            </button>
          </div>

          <!-- Distance Panel -->
          <DistancePanel :distance-info="distanceInfo" />

          <!-- Instructions -->
          <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
            <h3 class="font-semibold mb-2">How to Use</h3>
            <ol class="list-decimal list-inside space-y-1">
              <li>Click on the map to place marker A</li>
              <li>Click again to place marker B</li>
              <li>Markers can be dragged to move</li>
              <li>Subsequent clicks move the nearest marker</li>
            </ol>
          </div>
        </div>

        <!-- Map -->
        <div class="lg:col-span-9">
          <MapContainer
            ref="mapContainerRef"
            @markers-updated="handleMarkersUpdated"
          />
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-12 text-center text-gray-500 dark:text-gray-400">
        <p>
          &copy; 2025 DevTools. Built with Nuxt 3 and deployed on AWS.
          <span class="mx-2">|</span>
          <a
            href="https://www.tomohiko.io/legal-disclosure"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
          >
            特定商取引法に基づく表記
          </a>
        </p>
      </footer>
    </div>

    <!-- Ko-fi Support Button -->
    <KofiButton kofi-username="tomohiko" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DistanceInfo {
  meters: number
  km: string
  m: string
  miles: string
  bearing: string
}

const mapContainerRef = ref<any>(null)
const distanceInfo = ref<DistanceInfo | null>(null)

const handleMarkersUpdated = () => {
  if (!mapContainerRef.value) return

  const markers = mapContainerRef.value.getMarkerPositions()

  if (markers.A && markers.B) {
    const posA = markers.A.getLatLng()
    const posB = markers.B.getLatLng()

    const { calculateDistance, calculateBearing } = useGeodesy()
    const { formatKm, formatM, formatMiles, formatBearing } = useDistanceFormat()

    const distance = calculateDistance(
      posA.lat,
      posA.lng,
      posB.lat,
      posB.lng
    )

    const bearing = calculateBearing(
      posA.lat,
      posA.lng,
      posB.lat,
      posB.lng
    )

    distanceInfo.value = {
      meters: distance,
      km: formatKm(distance),
      m: formatM(distance),
      miles: formatMiles(distance),
      bearing: formatBearing(bearing)
    }
  } else {
    distanceInfo.value = null
  }
}

const handleClear = () => {
  if (mapContainerRef.value) {
    mapContainerRef.value.clearMarkers()
  }
  distanceInfo.value = null
}

const handleGeolocation = () => {
  if (!('geolocation' in navigator)) {
    // Silent failure - geolocation not supported
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Success: center map on current location
      if (mapContainerRef.value) {
        mapContainerRef.value.centerMap(
          position.coords.latitude,
          position.coords.longitude
        )
      }
    },
    (error) => {
      // Silent failure - do nothing
      console.debug('Geolocation failed:', error.message)
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 60000
    }
  )
}
</script>
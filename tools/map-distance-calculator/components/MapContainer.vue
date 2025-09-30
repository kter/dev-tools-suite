<template>
  <ClientOnly>
    <div class="relative h-[500px] lg:h-full">
      <div ref="mapEl" class="h-full rounded-lg overflow-hidden shadow-lg"></div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  markersUpdated: []
}>()

const mapEl = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const clickCount = ref(0)
const L = ref<any>(null)

const { addMarker, moveMarker, removeAllMarkers, findNearestMarker, updatePolyline, getMarkerPositions } = useMapMarkers(map)

onMounted(async () => {
  // Wait a bit for the element to be ready
  await nextTick()

  if (!mapEl.value) {
    console.error('Map element not found')
    return
  }

  try {
    // Dynamically import Leaflet
    const leaflet = await import('leaflet')
    L.value = leaflet.default

    // Initialize map at Tokyo Station
    map.value = L.value.map(mapEl.value).setView([35.681236, 139.767125], 12)

    // Add OpenStreetMap tiles
    L.value.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map.value)

    // Handle map clicks
    map.value.on('click', async (e: any) => {
      const { lat, lng } = e.latlng

      if (clickCount.value === 0) {
        // First click: add marker A
        await addMarker('A', lat, lng)
        setupDragHandler('A')
        clickCount.value = 1
      } else if (clickCount.value === 1) {
        // Second click: add marker B
        await addMarker('B', lat, lng)
        setupDragHandler('B')
        await updatePolyline()
        clickCount.value = 2
        emit('markersUpdated')
      } else {
        // Third+ click: move nearest marker
        const nearest = findNearestMarker(lat, lng)
        if (nearest) {
          moveMarker(nearest, lat, lng)
          await updatePolyline()
          emit('markersUpdated')
        }
      }
    })
  } catch (error) {
    console.error('Failed to initialize map:', error)
  }
})

const setupDragHandler = (id: 'A' | 'B') => {
  const positions = getMarkerPositions()
  const marker = positions[id]

  if (marker) {
    marker.on('dragend', async () => {
      await updatePolyline()
      emit('markersUpdated')
    })
  }
}

const centerMap = (lat: number, lng: number) => {
  if (map.value) {
    map.value.setView([lat, lng], 12)
  }
}

const clearMarkers = () => {
  removeAllMarkers()
  clickCount.value = 0
  emit('markersUpdated')
}

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
  }
})

defineExpose({
  centerMap,
  clearMarkers,
  getMarkerPositions
})
</script>

<style scoped>
/* Ensure the map takes full height */
:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
}
</style>
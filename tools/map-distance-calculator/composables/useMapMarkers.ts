import type { Ref } from 'vue'
import type L from 'leaflet'

/**
 * useMapMarkers - Manage Leaflet markers and polylines
 *
 * Handles marker creation, movement, and polyline drawing
 * for the map distance calculator
 */
export function useMapMarkers(map: Ref<L.Map | null>) {
  const markers = ref<{ A?: L.Marker, B?: L.Marker }>({})
  const polyline = ref<L.Polyline | null>(null)

  /**
   * Add or replace a marker on the map
   */
  const addMarker = async (id: 'A' | 'B', lat: number, lng: number): Promise<void> => {
    if (!map.value) return

    // Remove existing marker if present
    if (markers.value[id]) {
      map.value.removeLayer(markers.value[id]!)
    }

    // Create draggable marker with permanent tooltip
    const L = await import('leaflet')
    const marker = L.default.marker([lat, lng], { draggable: true })
      .addTo(map.value)
      .bindTooltip(id, { permanent: true, direction: 'top', offset: [0, -20] })

    markers.value[id] = marker
  }

  /**
   * Move an existing marker to a new position
   */
  const moveMarker = (id: 'A' | 'B', lat: number, lng: number): void => {
    if (markers.value[id]) {
      markers.value[id]!.setLatLng([lat, lng])
    }
  }

  /**
   * Find which marker is closer to a given point
   */
  const findNearestMarker = (lat: number, lng: number): 'A' | 'B' | null => {
    const { calculateDistance } = useGeodesy()

    const markerA = markers.value.A
    const markerB = markers.value.B

    if (!markerA && !markerB) return null
    if (!markerA) return 'B'
    if (!markerB) return 'A'

    const posA = markerA.getLatLng()
    const posB = markerB.getLatLng()

    const distA = calculateDistance(lat, lng, posA.lat, posA.lng)
    const distB = calculateDistance(lat, lng, posB.lat, posB.lng)

    return distA < distB ? 'A' : 'B'
  }

  /**
   * Update or create polyline connecting markers A and B
   */
  const updatePolyline = async (): Promise<void> => {
    if (!map.value) return

    // Remove existing polyline
    if (polyline.value) {
      map.value.removeLayer(polyline.value)
      polyline.value = null
    }

    const markerA = markers.value.A
    const markerB = markers.value.B

    // Draw polyline only if both markers exist
    if (markerA && markerB) {
      const L = await import('leaflet')
      const posA = markerA.getLatLng()
      const posB = markerB.getLatLng()

      polyline.value = L.default.polyline([posA, posB], {
        color: '#3b82f6',
        weight: 3
      }).addTo(map.value)
    }
  }

  /**
   * Remove all markers and polyline from the map
   */
  const removeAllMarkers = (): void => {
    if (!map.value) return

    // Remove markers
    Object.values(markers.value).forEach(marker => {
      if (marker) map.value!.removeLayer(marker)
    })
    markers.value = {}

    // Remove polyline
    if (polyline.value) {
      map.value.removeLayer(polyline.value)
      polyline.value = null
    }
  }

  /**
   * Get current marker positions
   */
  const getMarkerPositions = () => {
    return {
      A: markers.value.A,
      B: markers.value.B
    }
  }

  return {
    addMarker,
    moveMarker,
    removeAllMarkers,
    findNearestMarker,
    updatePolyline,
    getMarkerPositions
  }
}
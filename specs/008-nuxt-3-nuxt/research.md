# Research: Map Distance Calculator

**Feature**: 008-nuxt-3-nuxt
**Date**: 2025-09-30

## 1. Leaflet Integration with Nuxt 3

### Decision
Use dynamic import in a client-only plugin (`plugins/leaflet.client.ts`) to load Leaflet and prevent SSR issues.

### Implementation Approach
```typescript
// plugins/leaflet.client.ts
export default defineNuxtPlugin(async () => {
  const L = await import('leaflet')
  return {
    provide: {
      leaflet: L.default
    }
  }
})
```

Add Leaflet CSS to `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  css: ['leaflet/dist/leaflet.css'],
  // ... other config
})
```

### Type Definitions
Install `@types/leaflet` as a dev dependency for TypeScript support:
```bash
npm install --save-dev @types/leaflet
```

### Rationale
- `.client.ts` suffix ensures plugin only runs on client-side
- Dynamic import prevents "window is not defined" errors during build
- CSS must be explicitly imported as Leaflet doesn't auto-inject styles in Nuxt

### Alternatives Considered
- Direct import in components: Rejected due to SSR issues
- Separate Leaflet wrapper component: Rejected as plugin provides cleaner global access
- External CDN: Rejected to maintain offline capability and version control

## 2. Haversine Formula Implementation

### Decision
Implement pure TypeScript functions for haversine distance and initial bearing calculations using WGS84 constants.

### Mathematical Formulas

**Haversine Distance**:
```
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c
```
Where:
- φ = latitude in radians
- λ = longitude in radians
- R = 6,371,008.8 m (WGS84 mean radius)

**Initial Bearing**:
```
θ = atan2(sin Δλ ⋅ cos φ2, cos φ1 ⋅ sin φ2 − sin φ1 ⋅ cos φ2 ⋅ cos Δλ)
bearing = (θ × 180/π + 360) % 360
```

### Implementation
```typescript
export function useGeodesy() {
  const EARTH_RADIUS = 6371008.8 // WGS84 mean radius in meters

  const toRadians = (degrees: number): number => degrees * Math.PI / 180
  const toDegrees = (radians: number): number => radians * 180 / Math.PI

  const normalizeLongitude = (lng: number): number => {
    // Normalize to -180...180 using atan2
    return toDegrees(Math.atan2(Math.sin(toRadians(lng)), Math.cos(toRadians(lng))))
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const φ1 = toRadians(lat1)
    const φ2 = toRadians(lat2)
    const Δφ = toRadians(lat2 - lat1)
    const Δλ = toRadians(normalizeLongitude(lng2 - lng1))

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return EARTH_RADIUS * c
  }

  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const φ1 = toRadians(lat1)
    const φ2 = toRadians(lat2)
    const Δλ = toRadians(normalizeLongitude(lng2 - lng1))

    const y = Math.sin(Δλ) * Math.cos(φ2)
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

    const θ = Math.atan2(y, x)
    return (toDegrees(θ) + 360) % 360
  }

  return {
    calculateDistance,
    calculateBearing,
    normalizeLongitude
  }
}
```

### Rationale
- WGS84 radius (6,371,008.8m) is more accurate than spherical approximations
- atan2 for longitude normalization correctly handles date line crossing
- Pure functions enable easy unit testing
- No external dependencies for geodesy calculations

### Alternatives Considered
- Turf.js library: Rejected due to bundle size overhead (~450KB) for simple calculations
- Vincenty's formulae: Rejected as overkill (haversine accuracy sufficient for UI purposes)
- Simple Euclidean distance: Rejected as inaccurate for large distances

## 3. Distance Formatting Requirements

### Decision
Implement conditional formatting based on distance magnitude with proper decimal precision.

### Implementation
```typescript
export function useDistanceFormat() {
  const formatKm = (meters: number): string => {
    const km = meters / 1000
    if (km < 10) {
      return km.toFixed(3) // 3 decimal places for < 10km
    }
    return km.toFixed(2) // 2 decimal places for >= 10km
  }

  const formatM = (meters: number): string => {
    return meters.toFixed(1) // 1 decimal place
  }

  const formatMiles = (meters: number): string => {
    const miles = meters / 1609.344 // Standard international mile
    return miles.toFixed(3) // 3 decimal places
  }

  const formatBearing = (degrees: number): string => {
    return degrees.toFixed(1) + '°' // 1 decimal place with degree symbol
  }

  return {
    formatKm,
    formatM,
    formatMiles,
    formatBearing
  }
}
```

### Display Format
```
距離:
  12.345 km (< 10km: 3 decimals)
  123.45 km (>= 10km: 2 decimals)
  12345.6 m (always 1 decimal)
  7.672 mile (always 3 decimals)

方位角:
  123.4° (always 1 decimal)
```

### Rationale
- Higher precision for short distances where small changes are significant
- Lower precision for long distances where sub-meter accuracy is less relevant
- International mile (1609.344m) is standard for distance conversions
- Consistent decimal formatting improves readability

### Alternatives Considered
- Fixed precision for all distances: Rejected as unhelpful for varying scales
- Locale-based formatting (toLocaleString): Rejected to ensure consistent decimal separators
- Scientific notation for large distances: Rejected as less intuitive for users

## 4. Marker Management Strategy

### Decision
Use Leaflet's native marker and polyline APIs with reactive Vue refs to manage state.

### Marker Operations
```typescript
export function useMapMarkers(map: Ref<L.Map | null>) {
  const markers = ref<{ A?: L.Marker, B?: L.Marker }>({})
  const polyline = ref<L.Polyline | null>(null)

  const addMarker = (id: 'A' | 'B', lat: number, lng: number): void => {
    if (!map.value) return

    // Remove existing marker if present
    if (markers.value[id]) {
      map.value.removeLayer(markers.value[id]!)
    }

    // Create draggable marker
    const marker = L.marker([lat, lng], { draggable: true })
      .addTo(map.value)
      .bindTooltip(id, { permanent: true, direction: 'top' })

    markers.value[id] = marker
  }

  const moveMarker = (id: 'A' | 'B', lat: number, lng: number): void => {
    if (markers.value[id]) {
      markers.value[id]!.setLatLng([lat, lng])
    }
  }

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

  const updatePolyline = (): void => {
    if (!map.value) return

    // Remove existing polyline
    if (polyline.value) {
      map.value.removeLayer(polyline.value)
    }

    const markerA = markers.value.A
    const markerB = markers.value.B

    // Draw polyline only if both markers exist
    if (markerA && markerB) {
      const posA = markerA.getLatLng()
      const posB = markerB.getLatLng()

      polyline.value = L.polyline([posA, posB], {
        color: '#3b82f6',
        weight: 3
      }).addTo(map.value)
    }
  }

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

  return {
    addMarker,
    moveMarker,
    removeAllMarkers,
    findNearestMarker,
    updatePolyline
  }
}
```

### Event Handling
- Map click: `map.on('click', (e) => { ... })`
- Marker drag: `marker.on('dragend', (e) => { ... })`
- Automatic polyline update after any marker movement

### Rationale
- Leaflet's native APIs are well-documented and performant
- Draggable markers provide intuitive UX
- Reactive refs enable Vue component reactivity
- Nearest marker calculation uses actual geodesic distance

### Alternatives Considered
- Custom marker rendering with Canvas: Rejected as Leaflet provides sufficient control
- Storing marker positions separately: Rejected as Leaflet markers already track their positions
- Using Leaflet marker clusters: Rejected as we only have 2 markers maximum

## 5. Geolocation API Best Practices

### Decision
Use browser Geolocation API with silent error handling and no user notifications on failure.

### Implementation
```typescript
const goToCurrentLocation = (): void => {
  if (!map.value) return

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success: center map on current location
        const { latitude, longitude } = position.coords
        map.value!.setView([latitude, longitude], 12)
      },
      (error) => {
        // Silent failure: do nothing, no error message
        console.debug('Geolocation failed:', error.message)
      },
      {
        enableHighAccuracy: false, // Faster response
        timeout: 5000, // 5 second timeout
        maximumAge: 60000 // Accept 1 minute old cached position
      }
    )
  }
  // If geolocation not available, do nothing (silent failure)
}
```

### Error Handling
- `PERMISSION_DENIED`: User declined → Silent
- `POSITION_UNAVAILABLE`: GPS unavailable → Silent
- `TIMEOUT`: Request took too long → Silent
- No geolocation support: Button does nothing

### Rationale
- Silent failures prevent unnecessary user friction
- Geolocation is a convenience feature, not critical functionality
- 5 second timeout prevents long waits
- Cache acceptance improves response time

### Alternatives Considered
- Error messages/alerts: Rejected per requirements (failures should be ignored)
- Requesting high accuracy: Rejected as slower and unnecessary for map centering
- Disabling button when geolocation unavailable: Rejected to keep UI simple
- Fallback to IP-based location: Rejected as adds complexity without clear benefit

## Summary

All research tasks are complete with concrete implementation approaches:

1. ✅ **Leaflet Integration**: Client-only plugin with dynamic import
2. ✅ **Haversine Formula**: Pure TypeScript with WGS84 constants
3. ✅ **Distance Formatting**: Conditional precision based on magnitude
4. ✅ **Marker Management**: Leaflet native APIs with Vue reactivity
5. ✅ **Geolocation**: Silent error handling with browser API

No NEEDS CLARIFICATION items remain. Ready to proceed to Phase 1 (Design & Contracts).
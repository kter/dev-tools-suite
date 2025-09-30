# Composables Contract: Map Distance Calculator

**Feature**: 008-nuxt-3-nuxt
**Date**: 2025-09-30

## Overview
Since this is a client-side only application with no backend APIs, this document defines the contracts (interfaces and expected behaviors) for the composables that encapsulate business logic.

## 1. useGeodesy

### Purpose
Provides geodesic calculations for distance and bearing between two geographic points.

### Contract

```typescript
export function useGeodesy(): {
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
  calculateBearing: (lat1: number, lng1: number, lat2: number, lng2: number) => number
  normalizeLongitude: (lng: number) => number
}
```

### Function Specifications

#### calculateDistance
```typescript
calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number
```

**Purpose**: Calculate great-circle distance between two points using Haversine formula.

**Parameters**:
- `lat1`: Latitude of point A in decimal degrees
- `lng1`: Longitude of point A in decimal degrees
- `lat2`: Latitude of point B in decimal degrees
- `lng2`: Longitude of point B in decimal degrees

**Returns**: Distance in meters (non-negative number)

**Algorithm**: Haversine formula with R = 6,371,008.8m (WGS84 mean radius)

**Test Cases**:
```typescript
// Same point → 0
calculateDistance(35.681236, 139.767125, 35.681236, 139.767125) // → 0

// Tokyo to Osaka (approx 400km)
calculateDistance(35.681236, 139.767125, 34.693738, 135.502165) // → ~400000

// Date line crossing (Pacific Ocean)
calculateDistance(0, 179, 0, -179) // → ~222390 (correct normalization)

// North pole to South pole
calculateDistance(90, 0, -90, 0) // → ~20015086 (half Earth circumference)
```

#### calculateBearing
```typescript
calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number
```

**Purpose**: Calculate initial bearing (forward azimuth) from point A to point B.

**Parameters**:
- `lat1`: Latitude of point A in decimal degrees
- `lng1`: Longitude of point A in decimal degrees
- `lat2`: Latitude of point B in decimal degrees
- `lng2`: Longitude of point B in decimal degrees

**Returns**: Bearing in degrees (0-360, where 0=North, 90=East, 180=South, 270=West)

**Algorithm**: atan2-based bearing calculation

**Test Cases**:
```typescript
// Due east
calculateBearing(0, 0, 0, 1) // → 90.0

// Due north
calculateBearing(0, 0, 1, 0) // → 0.0

// Due west
calculateBearing(0, 0, 0, -1) // → 270.0

// Due south
calculateBearing(0, 0, -1, 0) // → 180.0

// Northeast (45°)
calculateBearing(35.0, 139.0, 36.0, 140.0) // → ~45.0
```

#### normalizeLongitude
```typescript
normalizeLongitude(lng: number): number
```

**Purpose**: Normalize longitude to -180...180 range using atan2.

**Parameters**:
- `lng`: Longitude in decimal degrees (any value)

**Returns**: Normalized longitude (-180 ≤ result ≤ 180)

**Algorithm**: `atan2(sin(lng), cos(lng))` in radians, converted to degrees

**Test Cases**:
```typescript
normalizeLongitude(0) // → 0
normalizeLongitude(180) // → 180
normalizeLongitude(-180) // → -180
normalizeLongitude(181) // → -179
normalizeLongitude(360) // → 0
normalizeLongitude(-181) // → 179
```

## 2. useDistanceFormat

### Purpose
Formats distance values for display with appropriate precision and units.

### Contract

```typescript
export function useDistanceFormat(): {
  formatKm: (meters: number) => string
  formatM: (meters: number) => string
  formatMiles: (meters: number) => string
  formatBearing: (degrees: number) => string
}
```

### Function Specifications

#### formatKm
```typescript
formatKm(meters: number): string
```

**Purpose**: Format distance in kilometers with conditional precision.

**Parameters**:
- `meters`: Distance in meters (non-negative)

**Returns**: Formatted string with "km" suffix

**Precision Rules**:
- < 10km: 3 decimal places
- ≥ 10km: 2 decimal places

**Test Cases**:
```typescript
formatKm(0) // → "0.000 km"
formatKm(1234) // → "1.234 km"
formatKm(9999) // → "10.00 km"  (rounds to >= 10)
formatKm(10000) // → "10.00 km"
formatKm(123456) // → "123.46 km"
```

#### formatM
```typescript
formatM(meters: number): string
```

**Purpose**: Format distance in meters.

**Parameters**:
- `meters`: Distance in meters (non-negative)

**Returns**: Formatted string with "m" suffix (1 decimal place)

**Test Cases**:
```typescript
formatM(0) // → "0.0 m"
formatM(123.45) // → "123.5 m"
formatM(123.44) // → "123.4 m"
formatM(1234.56) // → "1234.6 m"
```

#### formatMiles
```typescript
formatMiles(meters: number): string
```

**Purpose**: Format distance in miles.

**Parameters**:
- `meters`: Distance in meters (non-negative)

**Returns**: Formatted string with "mile" suffix (3 decimal places)

**Conversion**: 1 mile = 1609.344 meters

**Test Cases**:
```typescript
formatMiles(0) // → "0.000 mile"
formatMiles(1609.344) // → "1.000 mile"
formatMiles(1000) // → "0.621 mile"
formatMiles(160934.4) // → "100.000 mile"
```

#### formatBearing
```typescript
formatBearing(degrees: number): string
```

**Purpose**: Format bearing angle with degree symbol.

**Parameters**:
- `degrees`: Bearing in degrees (0-360)

**Returns**: Formatted string with "°" suffix (1 decimal place)

**Test Cases**:
```typescript
formatBearing(0) // → "0.0°"
formatBearing(45.67) // → "45.7°"
formatBearing(90) // → "90.0°"
formatBearing(359.99) // → "360.0°" (rounds to 360)
```

## 3. useMapMarkers

### Purpose
Manages Leaflet markers, polylines, and marker interactions.

### Contract

```typescript
export function useMapMarkers(map: Ref<L.Map | null>): {
  addMarker: (id: 'A' | 'B', lat: number, lng: number) => void
  moveMarker: (id: 'A' | 'B', lat: number, lng: number) => void
  removeAllMarkers: () => void
  findNearestMarker: (lat: number, lng: number) => 'A' | 'B' | null
  updatePolyline: () => void
}
```

### Function Specifications

#### addMarker
```typescript
addMarker(id: 'A' | 'B', lat: number, lng: number): void
```

**Purpose**: Add or replace a marker on the map.

**Parameters**:
- `id`: Marker identifier ('A' or 'B')
- `lat`: Latitude in decimal degrees
- `lng`: Longitude in decimal degrees

**Side Effects**:
- Removes existing marker with same ID (if present)
- Creates new Leaflet marker at specified position
- Marker is draggable
- Marker has permanent tooltip showing ID
- Adds marker to map

**Test Cases**:
- Adding marker A to empty map → marker appears
- Adding marker B when A exists → both markers visible
- Adding marker A when A exists → old A removed, new A appears
- Adding marker when map is null → no-op (silent fail)

#### moveMarker
```typescript
moveMarker(id: 'A' | 'B', lat: number, lng: number): void
```

**Purpose**: Move an existing marker to a new position.

**Parameters**:
- `id`: Marker identifier ('A' or 'B')
- `lat`: New latitude in decimal degrees
- `lng`: New longitude in decimal degrees

**Side Effects**:
- Updates marker position on map
- If marker doesn't exist, no-op

**Test Cases**:
- Moving existing marker → marker position updates
- Moving non-existent marker → no error, no-op
- Moving marker when map is null → no-op

#### removeAllMarkers
```typescript
removeAllMarkers(): void
```

**Purpose**: Remove all markers and polyline from the map.

**Side Effects**:
- Removes all markers (A and B) from map
- Removes polyline from map
- Clears internal marker state

**Test Cases**:
- Removing when 2 markers exist → map cleared
- Removing when 0 markers exist → no error, no-op
- Removing when map is null → no-op

#### findNearestMarker
```typescript
findNearestMarker(lat: number, lng: number): 'A' | 'B' | null
```

**Purpose**: Determine which marker is closer to a given point.

**Parameters**:
- `lat`: Target latitude in decimal degrees
- `lng`: Target longitude in decimal degrees

**Returns**:
- `'A'` if marker A is closer
- `'B'` if marker B is closer
- `'A'` if only marker A exists
- `'B'` if only marker B exists
- `null` if no markers exist

**Algorithm**: Uses `calculateDistance()` from useGeodesy

**Test Cases**:
- No markers → null
- Only A exists → 'A'
- Only B exists → 'B'
- Both exist, point closer to A → 'A'
- Both exist, point closer to B → 'B'
- Both exist, point equidistant → either A or B (consistent)

#### updatePolyline
```typescript
updatePolyline(): void
```

**Purpose**: Redraw polyline connecting markers A and B.

**Side Effects**:
- Removes existing polyline (if present)
- If both markers exist: creates new polyline connecting them
- If < 2 markers exist: no polyline drawn
- Polyline color: #3b82f6 (blue)
- Polyline weight: 3 pixels

**Test Cases**:
- Update with 0 markers → no polyline
- Update with 1 marker → no polyline
- Update with 2 markers → polyline drawn
- Update multiple times → old polyline removed, new one added

## Contract Test Strategy

For each composable, unit tests should verify:

1. **Type correctness**: Return types match declarations
2. **Edge cases**: Null inputs, boundary values, empty state
3. **Mathematical accuracy**: Distance/bearing calculations within 0.1% tolerance
4. **Formatting consistency**: String outputs match specifications
5. **Side effect verification**: DOM changes occur as expected (for map markers)

## Example Test Structure

```typescript
describe('useGeodesy', () => {
  const { calculateDistance, calculateBearing, normalizeLongitude } = useGeodesy()

  describe('calculateDistance', () => {
    it('returns 0 for same point', () => {
      expect(calculateDistance(0, 0, 0, 0)).toBe(0)
    })

    it('calculates Tokyo-Osaka distance correctly', () => {
      const dist = calculateDistance(35.681236, 139.767125, 34.693738, 135.502165)
      expect(dist).toBeGreaterThan(395000)
      expect(dist).toBeLessThan(405000)
    })

    it('handles date line crossing', () => {
      const dist = calculateDistance(0, 179, 0, -179)
      expect(dist).toBeGreaterThan(220000)
      expect(dist).toBeLessThan(225000)
    })
  })

  // ... more tests
})
```

## Summary
These composable contracts define the complete interface for business logic in the map distance calculator. All functions are pure (except map manipulation) and testable independently of the UI layer.
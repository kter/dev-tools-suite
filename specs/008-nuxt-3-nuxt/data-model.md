# Data Model: Map Distance Calculator

**Feature**: 008-nuxt-3-nuxt
**Date**: 2025-09-30

## Overview
This application is entirely client-side with no backend or persistent storage. The data model consists of in-memory TypeScript types and interfaces used to manage map state, markers, and distance calculations.

## Core Entities

### 1. Marker
Represents a geographic point on the map.

```typescript
interface Marker {
  id: 'A' | 'B'
  lat: number   // Latitude in decimal degrees (-90 to 90)
  lng: number   // Longitude in decimal degrees (-180 to 180)
  leafletMarker?: L.Marker  // Optional reference to Leaflet marker instance
}
```

**Properties**:
- `id`: Unique identifier ('A' or 'B' only)
- `lat`: Latitude coordinate (WGS84)
- `lng`: Longitude coordinate (WGS84)
- `leafletMarker`: Optional reference to Leaflet marker for DOM manipulation

**Validation Rules**:
- `lat` must be between -90 and 90
- `lng` must be between -180 and 180
- Only 2 markers exist at any time (A and B)

**Lifecycle**:
- Created on map click (1st click → A, 2nd click → B)
- Updated on marker drag or 3rd+ click (nearest marker moves)
- Destroyed on "Clear" button click

### 2. DistanceInfo
Contains calculated distance and bearing information between two markers.

```typescript
interface DistanceInfo {
  meters: number    // Raw distance in meters (haversine calculation)
  km: string       // Formatted kilometers (conditional precision)
  m: string        // Formatted meters (1 decimal)
  miles: string    // Formatted miles (3 decimals)
  bearing: string  // Initial bearing from A to B (0-360°)
}
```

**Properties**:
- `meters`: Unformatted distance value for calculations
- `km`: Display string (e.g., "12.345 km" or "123.45 km")
- `m`: Display string (e.g., "12345.6 m")
- `miles`: Display string (e.g., "7.672 mile")
- `bearing`: Display string (e.g., "123.4°")

**Calculation Rules**:
- `meters`: Haversine formula with R = 6,371,008.8m
- `km`: < 10km → 3 decimals, ≥ 10km → 2 decimals
- `m`: Always 1 decimal
- `miles`: Always 3 decimals (1 mile = 1609.344m)
- `bearing`: Initial bearing from A to B, 0-360°, 1 decimal

**Lifecycle**:
- Created when both markers A and B exist
- Updated when any marker moves (drag or click)
- Destroyed when either marker is removed or "Clear" is clicked

### 3. MapState
Overall application state container.

```typescript
interface MapState {
  map: L.Map | null           // Leaflet map instance
  markers: {
    A?: L.Marker
    B?: L.Marker
  }
  polyline: L.Polyline | null  // Line connecting A and B
  distanceInfo: DistanceInfo | null  // Current distance calculation
}
```

**Properties**:
- `map`: Leaflet map instance (null until mounted)
- `markers`: Dictionary of active markers (A and/or B)
- `polyline`: Visual line between markers (null if < 2 markers)
- `distanceInfo`: Calculated distance data (null if < 2 markers)

**State Transitions**:
```
Initial State:
  map: null, markers: {}, polyline: null, distanceInfo: null

After Map Mount:
  map: L.Map, markers: {}, polyline: null, distanceInfo: null

After 1st Click:
  map: L.Map, markers: { A }, polyline: null, distanceInfo: null

After 2nd Click:
  map: L.Map, markers: { A, B }, polyline: L.Polyline, distanceInfo: DistanceInfo

After Drag/3rd+ Click:
  map: L.Map, markers: { A, B }, polyline: L.Polyline (updated), distanceInfo: DistanceInfo (updated)

After Clear:
  map: L.Map, markers: {}, polyline: null, distanceInfo: null
```

## Type Definitions

### GeodecyFunctions
Exported by `useGeodesy()` composable.

```typescript
interface GeodecyFunctions {
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
  calculateBearing: (lat1: number, lng1: number, lat2: number, lng2: number) => number
  normalizeLongitude: (lng: number) => number
}
```

### DistanceFormatFunctions
Exported by `useDistanceFormat()` composable.

```typescript
interface DistanceFormatFunctions {
  formatKm: (meters: number) => string
  formatM: (meters: number) => string
  formatMiles: (meters: number) => string
  formatBearing: (degrees: number) => string
}
```

### MapMarkerFunctions
Exported by `useMapMarkers()` composable.

```typescript
interface MapMarkerFunctions {
  addMarker: (id: 'A' | 'B', lat: number, lng: number) => void
  moveMarker: (id: 'A' | 'B', lat: number, lng: number) => void
  removeAllMarkers: () => void
  findNearestMarker: (lat: number, lng: number) => 'A' | 'B' | null
  updatePolyline: () => void
}
```

## Constants

```typescript
// Geodesy constants
const EARTH_RADIUS = 6371008.8  // WGS84 mean radius in meters

// Map initialization
const INITIAL_CENTER = { lat: 35.681236, lng: 139.767125 }  // Tokyo Station
const INITIAL_ZOOM = 12

// Unit conversions
const METERS_PER_MILE = 1609.344
const METERS_PER_KM = 1000

// Map styling
const POLYLINE_COLOR = '#3b82f6'  // Blue
const POLYLINE_WEIGHT = 3  // pixels
```

## Data Flow

```
User Interaction → Event Handler → State Update → Calculation → UI Update

Example: User clicks map
1. map.on('click') → event handler
2. Determine marker ID (A/B or nearest)
3. addMarker() or moveMarker()
4. updatePolyline()
5. Calculate distance/bearing
6. Update distanceInfo reactive state
7. Vue reactivity updates DistancePanel component
```

## Persistence
**None**. All state is ephemeral and reset on page refresh. This is intentional as the tool is a calculator, not a data storage application.

## Validation
- Latitude: -90 ≤ lat ≤ 90
- Longitude: -180 ≤ lng ≤ 180 (with normalization)
- Marker count: 0 ≤ count ≤ 2
- Distance: Always non-negative
- Bearing: 0 ≤ bearing < 360

## Error Handling
- Invalid coordinates: Ignored (Leaflet handles bounds)
- Missing markers: Functions return null/undefined gracefully
- Division by zero: N/A (distance between same point is 0)
- Geolocation failure: Silent (no state change)

## Summary
The data model is intentionally simple with no backend dependencies. State is managed through Vue reactive refs and Leaflet's native object model. All calculations are deterministic pure functions that can be unit tested independently.
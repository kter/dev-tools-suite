/**
 * useGeodesy - Geodesic calculations for distance and bearing
 *
 * Uses Haversine formula for great-circle distance calculation
 * with WGS84 mean Earth radius (6,371,008.8 meters)
 */
export function useGeodesy() {
  // WGS84 mean Earth radius in meters
  const EARTH_RADIUS = 6371008.8

  /**
   * Convert degrees to radians
   */
  const toRadians = (degrees: number): number => degrees * Math.PI / 180

  /**
   * Convert radians to degrees
   */
  const toDegrees = (radians: number): number => radians * 180 / Math.PI

  /**
   * Normalize longitude to -180...180 range using atan2
   * This correctly handles date line crossing
   */
  const normalizeLongitude = (lng: number): number => {
    return toDegrees(Math.atan2(Math.sin(toRadians(lng)), Math.cos(toRadians(lng))))
  }

  /**
   * Calculate great-circle distance between two points using Haversine formula
   *
   * @param lat1 Latitude of point A in decimal degrees
   * @param lng1 Longitude of point A in decimal degrees
   * @param lat2 Latitude of point B in decimal degrees
   * @param lng2 Longitude of point B in decimal degrees
   * @returns Distance in meters
   */
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const φ1 = toRadians(lat1)
    const φ2 = toRadians(lat2)
    const Δφ = toRadians(lat2 - lat1)
    const Δλ = toRadians(normalizeLongitude(lng2 - lng1))

    // Haversine formula
    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return EARTH_RADIUS * c
  }

  /**
   * Calculate initial bearing (forward azimuth) from point A to point B
   *
   * @param lat1 Latitude of point A in decimal degrees
   * @param lng1 Longitude of point A in decimal degrees
   * @param lat2 Latitude of point B in decimal degrees
   * @param lng2 Longitude of point B in decimal degrees
   * @returns Bearing in degrees (0-360, where 0=North, 90=East, 180=South, 270=West)
   */
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
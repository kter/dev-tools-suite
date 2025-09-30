/**
 * useDistanceFormat - Format distance values for display
 *
 * Provides consistent formatting for distances in various units
 * with appropriate precision based on magnitude
 */
export function useDistanceFormat() {
  /**
   * Format distance in kilometers with conditional precision
   * - < 10km: 3 decimal places
   * - >= 10km: 2 decimal places
   */
  const formatKm = (meters: number): string => {
    const km = meters / 1000
    if (km < 10) {
      return km.toFixed(3) + ' km'
    }
    return km.toFixed(2) + ' km'
  }

  /**
   * Format distance in meters
   * Always 1 decimal place
   */
  const formatM = (meters: number): string => {
    return meters.toFixed(1) + ' m'
  }

  /**
   * Format distance in miles
   * Always 3 decimal places
   * 1 mile = 1609.344 meters (standard international mile)
   */
  const formatMiles = (meters: number): string => {
    const miles = meters / 1609.344
    return miles.toFixed(3) + ' mile'
  }

  /**
   * Format bearing angle with degree symbol
   * Always 1 decimal place
   */
  const formatBearing = (degrees: number): string => {
    return degrees.toFixed(1) + '°'
  }

  return {
    formatKm,
    formatM,
    formatMiles,
    formatBearing
  }
}
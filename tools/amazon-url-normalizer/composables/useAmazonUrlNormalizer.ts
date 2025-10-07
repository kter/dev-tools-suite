import type { NormalizedURL, ValidationResult } from '../types'

/**
 * Composable for normalizing Amazon product URLs to shortest valid format
 */
export const useAmazonUrlNormalizer = () => {
  /**
   * Normalize an Amazon product URL to the shortest valid format
   * @param validationResult - Result from parseAmazonUrl
   * @returns NormalizedURL object or null if validation failed
   */
  const normalizeUrl = (validationResult: ValidationResult): NormalizedURL | null => {
    if (!validationResult.isValid || !validationResult.domain || !validationResult.asin) {
      return null
    }

    const normalizedUrl = `https://${validationResult.domain}/dp/${validationResult.asin}`

    return {
      normalizedUrl,
      domain: validationResult.domain,
      asin: validationResult.asin
    }
  }

  /**
   * Check if a URL is already in normalized format
   * @param rawUrl - Original URL
   * @param normalizedUrl - Normalized URL
   * @returns true if URLs are equivalent (ignoring trailing slashes)
   */
  const isAlreadyNormalized = (rawUrl: string, normalizedUrl: string): boolean => {
    try {
      const raw = new URL(rawUrl.trim())
      const normalized = new URL(normalizedUrl)

      // Remove trailing slashes for comparison
      const rawPath = raw.pathname.replace(/\/$/, '')
      const normalizedPath = normalized.pathname.replace(/\/$/, '')

      return raw.hostname === normalized.hostname &&
             rawPath === normalizedPath &&
             raw.search === '' &&  // No query params
             raw.hash === ''       // No hash fragment
    } catch {
      return false
    }
  }

  return {
    normalizeUrl,
    isAlreadyNormalized
  }
}

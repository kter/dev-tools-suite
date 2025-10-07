/**
 * Type definitions for Amazon URL Normalizer
 */

export interface AmazonURL {
  rawUrl: string        // Original URL as entered by user
  domain: string | null // Extracted Amazon domain (e.g., "amazon.co.jp")
  asin: string | null   // Extracted ASIN (10-char product ID)
  isValid: boolean      // Whether URL passed validation
}

export interface NormalizedURL {
  normalizedUrl: string // Shortest valid Amazon product URL
  domain: string        // Preserved from input
  asin: string          // Extracted product ID
}

export interface ValidationResult {
  isValid: boolean             // Overall validation status
  errorMessage: string | null  // Human-readable error (null if valid)
  asin: string | null          // Extracted ASIN (null if invalid)
  domain: string | null        // Extracted domain (null if invalid)
}

import type { ValidationResult } from '../types'

/**
 * Composable for parsing and validating Amazon product URLs
 */
export const useAmazonUrlParser = () => {
  // Amazon domain pattern - supports all major regional sites
  const amazonDomainPattern = /^(www\.)?amazon\.(com|co\.uk|de|fr|it|es|ca|com\.mx|co\.jp|in|com\.au|sg|ae|sa|com\.br|cn|nl|se|pl|com\.tr)$/

  // ASIN extraction pattern - matches /dp/, /gp/product/, /product/ paths
  const asinPattern = /\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?]|$)/i

  /**
   * Parse and validate an Amazon product URL
   * @param url - Raw URL string to parse
   * @returns ValidationResult with ASIN and domain if valid, or error message
   */
  const parseAmazonUrl = (url: string): ValidationResult => {
    // Handle empty input
    if (!url || url.trim() === '') {
      return {
        isValid: false,
        errorMessage: 'Invalid URL format. Please enter a complete Amazon URL.',
        asin: null,
        domain: null
      }
    }

    // Parse URL structure
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.trim())
    } catch (error) {
      return {
        isValid: false,
        errorMessage: 'Invalid URL format. Please enter a complete Amazon URL.',
        asin: null,
        domain: null
      }
    }

    // Validate Amazon domain
    if (!amazonDomainPattern.test(parsedUrl.hostname)) {
      return {
        isValid: false,
        errorMessage: 'Not a valid Amazon URL. Please enter an Amazon product link.',
        asin: null,
        domain: null
      }
    }

    // Extract ASIN from pathname
    const asinMatch = parsedUrl.pathname.match(asinPattern)
    if (!asinMatch) {
      return {
        isValid: false,
        errorMessage: 'Could not find product ID in URL. Make sure it\'s a product page link.',
        asin: null,
        domain: parsedUrl.hostname
      }
    }

    // Success - return extracted ASIN and domain
    return {
      isValid: true,
      errorMessage: null,
      asin: asinMatch[1].toUpperCase(), // Normalize ASIN to uppercase
      domain: parsedUrl.hostname
    }
  }

  return {
    parseAmazonUrl
  }
}

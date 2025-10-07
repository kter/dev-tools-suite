/**
 * Contract: Amazon URL Normalizer
 *
 * Defines the interface for normalizing Amazon product URLs to their
 * shortest valid format.
 */

export interface NormalizeAmazonUrlInput {
  url: string // Raw Amazon URL to normalize
}

export interface NormalizeAmazonUrlOutput {
  normalizedUrl: string // Shortest valid Amazon product URL
  wasAlreadyNormalized: boolean // True if input was already in normalized format
}

/**
 * Function Contract: normalizeAmazonUrl
 *
 * Converts an Amazon product URL to its shortest valid format.
 * The normalized format is: https://{domain}/dp/{ASIN}
 *
 * @param input - Object containing the URL to normalize
 * @returns Normalized URL and flag indicating if it was already normalized
 * @throws Error if URL is invalid (must be validated first)
 */
export interface NormalizeAmazonUrlContract {
  (input: NormalizeAmazonUrlInput): NormalizeAmazonUrlOutput
}

/**
 * Contract Test Examples
 */
export const normalizeAmazonUrlExamples = [
  // Long URLs with tracking parameters
  {
    name: 'Remove tracking parameters from /dp/ URL',
    input: {
      url: 'https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1?keywords=laptop&qid=1234567890&sr=8-1'
    },
    output: {
      normalizedUrl: 'https://www.amazon.co.jp/dp/B08N5WRWNW',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'Remove tracking parameters from /gp/product/ URL',
    input: {
      url: 'https://www.amazon.com/gp/product/B0ABCDEFGH?ref=ppx_yo_dt_b_asin_title_o00_s00&psc=1'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0ABCDEFGH',
      wasAlreadyNormalized: false
    }
  },

  // Already normalized URLs
  {
    name: 'Already normalized /dp/ URL',
    input: {
      url: 'https://www.amazon.com/dp/B0XYZ12345'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0XYZ12345',
      wasAlreadyNormalized: true
    }
  },
  {
    name: 'Already normalized with trailing slash',
    input: {
      url: 'https://www.amazon.co.uk/dp/B123456789/'
    },
    output: {
      normalizedUrl: 'https://www.amazon.co.uk/dp/B123456789',
      wasAlreadyNormalized: true
    }
  },

  // Different Amazon regional domains
  {
    name: 'Normalize Amazon Japan URL',
    input: {
      url: 'https://www.amazon.co.jp/dp/B0JAPANABC/ref=nav_logo'
    },
    output: {
      normalizedUrl: 'https://www.amazon.co.jp/dp/B0JAPANABC',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'Normalize Amazon Germany URL',
    input: {
      url: 'https://www.amazon.de/gp/product/B0GERMANYY?psc=1'
    },
    output: {
      normalizedUrl: 'https://www.amazon.de/dp/B0GERMANYY',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'Normalize Amazon Canada URL',
    input: {
      url: 'https://amazon.ca/dp/B0CANADAAA?th=1&psc=1'
    },
    output: {
      normalizedUrl: 'https://amazon.ca/dp/B0CANADAAA',
      wasAlreadyNormalized: false
    }
  },

  // URL path variations
  {
    name: 'Convert /product/ to /dp/',
    input: {
      url: 'https://www.amazon.com/product/B0PRODUCTA'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0PRODUCTA',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'Convert /gp/product/ to /dp/',
    input: {
      url: 'https://www.amazon.com/gp/product/B0GPPRODUCT'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0GPPRODUCT',
      wasAlreadyNormalized: false
    }
  },

  // Preserve domain variations (with/without www)
  {
    name: 'Preserve www subdomain if present',
    input: {
      url: 'https://www.amazon.com/dp/B123456789?tag=tracking'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B123456789',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'Preserve absence of www subdomain',
    input: {
      url: 'https://amazon.com/dp/B987654321?ref=example'
    },
    output: {
      normalizedUrl: 'https://amazon.com/dp/B987654321',
      wasAlreadyNormalized: false
    }
  },

  // Remove URL fragments and complex query strings
  {
    name: 'Remove URL fragment (hash)',
    input: {
      url: 'https://www.amazon.com/dp/B0FRAGMENT#customerReviews'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0FRAGMENT',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'Remove multiple query parameters',
    input: {
      url: 'https://www.amazon.com/dp/B0MANYQUERY?keywords=test&qid=123&sr=8-1&tag=affiliate&th=1&psc=1'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0MANYQUERY',
      wasAlreadyNormalized: false
    }
  },

  // Edge cases
  {
    name: 'URL with path suffix after ASIN',
    input: {
      url: 'https://www.amazon.com/dp/B0PATHSUFF/ref=sr_1_5?keywords=example'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0PATHSUFF',
      wasAlreadyNormalized: false
    }
  },
  {
    name: 'ASIN with mixed case (normalize to original case)',
    input: {
      url: 'https://www.amazon.com/dp/b0MixedCASE'
    },
    output: {
      normalizedUrl: 'https://www.amazon.com/dp/B0MIXEDCASE',
      wasAlreadyNormalized: false
    }
  }
]

/**
 * Preconditions:
 * - Input URL must be a valid Amazon product URL
 * - URL must have been validated by parseAmazonUrl first
 * - URL must contain a valid ASIN
 *
 * Postconditions:
 * - Output URL always follows format: https://{domain}/dp/{ASIN}
 * - No query parameters in output
 * - No URL fragments in output
 * - No trailing slash
 * - ASIN is uppercase
 * - Domain is preserved from input (no cross-region conversion)
 * - wasAlreadyNormalized is true only if input exactly matches normalized format
 *
 * Invariants:
 * - normalizeAmazonUrl(normalizeAmazonUrl(url)) === normalizeAmazonUrl(url) (idempotent)
 * - Output URL length is always 25 + domain.length characters
 *
 * Performance Requirements:
 * - Normalization should complete in <5ms for typical URLs
 * - No network requests (client-side only)
 *
 * Security Considerations:
 * - ASIN is extracted, not constructed from user input
 * - Domain is validated before normalization
 * - No XSS risk as output is a clean URL string
 */

/**
 * Additional Contract: Compare URLs for Equality
 */
export interface CompareUrlsInput {
  url1: string
  url2: string
}

export interface CompareUrlsOutput {
  areEquivalent: boolean // True if both URLs point to same Amazon product
}

export const compareUrlsExamples = [
  {
    name: 'Same URL',
    input: {
      url1: 'https://www.amazon.com/dp/B123456789',
      url2: 'https://www.amazon.com/dp/B123456789'
    },
    output: {
      areEquivalent: true
    }
  },
  {
    name: 'Same product, different tracking',
    input: {
      url1: 'https://www.amazon.com/dp/B123456789?tag=aff1',
      url2: 'https://www.amazon.com/dp/B123456789?tag=aff2'
    },
    output: {
      areEquivalent: true
    }
  },
  {
    name: 'Different products',
    input: {
      url1: 'https://www.amazon.com/dp/B111111111',
      url2: 'https://www.amazon.com/dp/B222222222'
    },
    output: {
      areEquivalent: false
    }
  },
  {
    name: 'Same product, different regions',
    input: {
      url1: 'https://www.amazon.com/dp/B123456789',
      url2: 'https://www.amazon.co.jp/dp/B123456789'
    },
    output: {
      areEquivalent: false // Different domains = different products
    }
  }
]

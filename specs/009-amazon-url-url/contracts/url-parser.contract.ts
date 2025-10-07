/**
 * Contract: Amazon URL Parser
 *
 * Defines the interface for parsing Amazon product URLs and extracting
 * the ASIN (product ID) and domain information.
 */

export interface ParseAmazonUrlInput {
  url: string // Raw URL string to parse
}

export interface ParseAmazonUrlOutput {
  isValid: boolean            // Whether the URL is a valid Amazon product URL
  asin: string | null         // Extracted 10-character ASIN (null if invalid)
  domain: string | null       // Extracted Amazon domain (null if invalid)
  errorMessage: string | null // User-facing error message (null if valid)
}

/**
 * Function Contract: parseAmazonUrl
 *
 * Parses an Amazon product URL and extracts the ASIN and domain.
 * Validates that the URL belongs to Amazon and contains a valid product ID.
 *
 * @param input - Object containing the URL string to parse
 * @returns Validation result with extracted ASIN and domain, or error message
 */
export interface ParseAmazonUrlContract {
  (input: ParseAmazonUrlInput): ParseAmazonUrlOutput
}

/**
 * Contract Test Examples
 */
export const parseAmazonUrlExamples = [
  // Valid URLs - Standard product page
  {
    name: 'Standard /dp/ URL with tracking parameters',
    input: {
      url: 'https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1?keywords=laptop&qid=1234567890&sr=8-1'
    },
    output: {
      isValid: true,
      asin: 'B08N5WRWNW',
      domain: 'www.amazon.co.jp',
      errorMessage: null
    }
  },
  {
    name: 'Standard /dp/ URL without www',
    input: {
      url: 'https://amazon.com/dp/1234567890'
    },
    output: {
      isValid: true,
      asin: '1234567890',
      domain: 'amazon.com',
      errorMessage: null
    }
  },

  // Valid URLs - Alternative product page formats
  {
    name: 'Product page with /gp/product/ path',
    input: {
      url: 'https://www.amazon.de/gp/product/B0ABCDEFGH?ref=ppx_yo_dt_b_asin_title_o00_s00'
    },
    output: {
      isValid: true,
      asin: 'B0ABCDEFGH',
      domain: 'www.amazon.de',
      errorMessage: null
    }
  },
  {
    name: 'Product page with /product/ path',
    input: {
      url: 'https://amazon.co.uk/product/B123456789'
    },
    output: {
      isValid: true,
      asin: 'B123456789',
      domain: 'amazon.co.uk',
      errorMessage: null
    }
  },

  // Valid URLs - Already normalized
  {
    name: 'Already normalized URL',
    input: {
      url: 'https://www.amazon.com/dp/B0XYZ12345'
    },
    output: {
      isValid: true,
      asin: 'B0XYZ12345',
      domain: 'www.amazon.com',
      errorMessage: null
    }
  },

  // Valid URLs - Different Amazon regions
  {
    name: 'Amazon Canada (.ca)',
    input: {
      url: 'https://www.amazon.ca/dp/B0CANADABC'
    },
    output: {
      isValid: true,
      asin: 'B0CANADABC',
      domain: 'www.amazon.ca',
      errorMessage: null
    }
  },
  {
    name: 'Amazon India (.in)',
    input: {
      url: 'https://www.amazon.in/dp/B0INDIAABC'
    },
    output: {
      isValid: true,
      asin: 'B0INDIAABC',
      domain: 'www.amazon.in',
      errorMessage: null
    }
  },

  // Invalid URLs - Wrong domain
  {
    name: 'Non-Amazon URL',
    input: {
      url: 'https://www.example.com/product/12345'
    },
    output: {
      isValid: false,
      asin: null,
      domain: null,
      errorMessage: 'Not a valid Amazon URL. Please enter an Amazon product link.'
    }
  },
  {
    name: 'Amazon-like domain but not Amazon',
    input: {
      url: 'https://www.amazon-fake.com/dp/B123456789'
    },
    output: {
      isValid: false,
      asin: null,
      domain: null,
      errorMessage: 'Not a valid Amazon URL. Please enter an Amazon product link.'
    }
  },

  // Invalid URLs - Missing ASIN
  {
    name: 'Amazon search results page (no ASIN)',
    input: {
      url: 'https://www.amazon.com/s?k=laptop&ref=nb_sb_noss'
    },
    output: {
      isValid: false,
      asin: null,
      domain: 'www.amazon.com',
      errorMessage: 'Could not find product ID in URL. Make sure it\'s a product page link.'
    }
  },
  {
    name: 'Amazon homepage',
    input: {
      url: 'https://www.amazon.com/'
    },
    output: {
      isValid: false,
      asin: null,
      domain: 'www.amazon.com',
      errorMessage: 'Could not find product ID in URL. Make sure it\'s a product page link.'
    }
  },

  // Invalid URLs - Malformed
  {
    name: 'Incomplete URL (no protocol)',
    input: {
      url: 'amazon.com/dp/B123456789'
    },
    output: {
      isValid: false,
      asin: null,
      domain: null,
      errorMessage: 'Invalid URL format. Please enter a complete Amazon URL.'
    }
  },
  {
    name: 'Empty URL',
    input: {
      url: ''
    },
    output: {
      isValid: false,
      asin: null,
      domain: null,
      errorMessage: 'Invalid URL format. Please enter a complete Amazon URL.'
    }
  },
  {
    name: 'Invalid characters in URL',
    input: {
      url: 'https://www.amazon.com/dp/B<script>alert(1)</script>'
    },
    output: {
      isValid: false,
      asin: null,
      domain: null,
      errorMessage: 'Invalid URL format. Please enter a complete Amazon URL.'
    }
  },

  // Edge Cases - ASIN validation
  {
    name: 'ASIN too short (9 characters)',
    input: {
      url: 'https://www.amazon.com/dp/B12345678'
    },
    output: {
      isValid: false,
      asin: null,
      domain: 'www.amazon.com',
      errorMessage: 'Could not find product ID in URL. Make sure it\'s a product page link.'
    }
  },
  {
    name: 'ASIN too long (11 characters)',
    input: {
      url: 'https://www.amazon.com/dp/B12345678901'
    },
    output: {
      isValid: false,
      asin: null,
      domain: 'www.amazon.com',
      errorMessage: 'Could not find product ID in URL. Make sure it\'s a product page link.'
    }
  },
  {
    name: 'ASIN with lowercase letters',
    input: {
      url: 'https://www.amazon.com/dp/b123456789'
    },
    output: {
      isValid: true, // Case-insensitive matching should work
      asin: 'B123456789', // Should be normalized to uppercase
      domain: 'www.amazon.com',
      errorMessage: null
    }
  },
  {
    name: 'ASIN with special characters',
    input: {
      url: 'https://www.amazon.com/dp/B123-56789'
    },
    output: {
      isValid: false,
      asin: null,
      domain: 'www.amazon.com',
      errorMessage: 'Could not find product ID in URL. Make sure it\'s a product page link.'
    }
  }
]

/**
 * Preconditions:
 * - Input URL must be a string
 * - No maximum length limit on input
 *
 * Postconditions:
 * - If valid: isValid=true, asin and domain are non-null, errorMessage is null
 * - If invalid: isValid=false, errorMessage is non-null
 * - ASIN is always uppercase when extracted
 * - Domain preserves original case from URL
 *
 * Performance Requirements:
 * - Parsing should complete in <10ms for typical URLs
 * - Regex matching should not catastrophically backtrack
 *
 * Security Considerations:
 * - Input is treated as untrusted user input
 * - URL parsing uses native URL API to prevent injection
 * - Regex patterns are designed to prevent ReDoS attacks
 */

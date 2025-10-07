# Data Model: Amazon URL Normalizer

## Overview
This document defines the data structures and state management for the Amazon URL Normalizer tool. As a client-side only application, there is no backend persistence or database schema. All data is ephemeral and exists only in the browser's runtime memory.

---

## Core Entities

### 1. AmazonURL (Input)
Represents the raw Amazon URL provided by the user, which may contain tracking parameters, session IDs, and other unnecessary components.

**TypeScript Definition**:
```typescript
interface AmazonURL {
  rawUrl: string        // Original URL as entered by user
  domain: string | null // Extracted Amazon domain (e.g., "amazon.co.jp")
  asin: string | null   // Extracted ASIN (10-char product ID)
  isValid: boolean      // Whether URL passed validation
}
```

**Field Specifications**:
- `rawUrl`:
  - Type: `string`
  - Required: Yes
  - Validation: None (any string accepted as input)
  - Example: `"https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1?keywords=laptop&qid=1234567890"`

- `domain`:
  - Type: `string | null`
  - Required: No (null if validation fails)
  - Validation: Must match Amazon domain pattern
  - Examples: `"amazon.com"`, `"amazon.co.jp"`, `"amazon.de"`

- `asin`:
  - Type: `string | null`
  - Required: No (null if not found or validation fails)
  - Validation: Exactly 10 alphanumeric characters (uppercase)
  - Pattern: `/^[A-Z0-9]{10}$/`
  - Examples: `"B08N5WRWNW"`, `"1234567890"`, `"B0ABCDEFGH"`

- `isValid`:
  - Type: `boolean`
  - Required: Yes
  - Values: `true` if domain and ASIN are valid, `false` otherwise

**State Lifecycle**:
1. User inputs URL → `rawUrl` populated
2. Validation triggered → `domain` and `asin` extracted or set to null
3. `isValid` flag set based on validation result

---

### 2. NormalizedURL (Output)
Represents the cleaned, shortened Amazon URL containing only essential components.

**TypeScript Definition**:
```typescript
interface NormalizedURL {
  normalizedUrl: string // Shortest valid Amazon product URL
  domain: string        // Preserved from input
  asin: string          // Extracted product ID
}
```

**Field Specifications**:
- `normalizedUrl`:
  - Type: `string`
  - Required: Yes
  - Format: `https://{domain}/dp/{asin}`
  - Example: `"https://www.amazon.co.jp/dp/B08N5WRWNW"`

- `domain`:
  - Type: `string`
  - Required: Yes
  - Source: Preserved from input URL (no cross-region conversion)
  - Example: `"amazon.co.jp"`

- `asin`:
  - Type: `string`
  - Required: Yes
  - Source: Extracted from input URL path
  - Example: `"B08N5WRWNW"`

**Invariants**:
- `normalizedUrl` must always follow format `https://{domain}/dp/{asin}`
- `domain` must be valid Amazon domain
- `asin` must be exactly 10 alphanumeric characters

**Transformation Rules**:
```typescript
// AmazonURL → NormalizedURL
function normalize(input: AmazonURL): NormalizedURL {
  if (!input.isValid || !input.domain || !input.asin) {
    throw new Error('Cannot normalize invalid URL')
  }

  return {
    normalizedUrl: `https://${input.domain}/dp/${input.asin}`,
    domain: input.domain,
    asin: input.asin
  }
}
```

---

### 3. ValidationResult
Represents the outcome of URL validation, including error information for display to user.

**TypeScript Definition**:
```typescript
interface ValidationResult {
  isValid: boolean             // Overall validation status
  errorMessage: string | null  // Human-readable error (null if valid)
  asin: string | null          // Extracted ASIN (null if invalid)
  domain: string | null        // Extracted domain (null if invalid)
}
```

**Field Specifications**:
- `isValid`:
  - Type: `boolean`
  - Required: Yes
  - Values: `true` if URL is valid Amazon product URL, `false` otherwise

- `errorMessage`:
  - Type: `string | null`
  - Required: Yes (null when valid)
  - Purpose: User-facing error message
  - Examples:
    - `"Not a valid Amazon URL. Please enter an Amazon product link."`
    - `"Could not find product ID in URL. Make sure it's a product page link."`
    - `"Invalid URL format. Please enter a complete Amazon URL."`

- `asin`:
  - Type: `string | null`
  - Required: Yes (null when invalid)
  - Value: Extracted 10-character product ID

- `domain`:
  - Type: `string | null`
  - Required: Yes (null when domain validation fails)
  - Value: Extracted Amazon domain

**Validation States**:

| State | `isValid` | `errorMessage` | `asin` | `domain` | Trigger |
|-------|-----------|----------------|--------|----------|---------|
| Valid | `true` | `null` | Set | Set | Valid Amazon product URL |
| Invalid Domain | `false` | "Not a valid Amazon URL" | `null` | `null` | Non-Amazon domain |
| Invalid ASIN | `false` | "Could not find product ID" | `null` | Set | Amazon domain but no ASIN |
| Malformed | `false` | "Invalid URL format" | `null` | `null` | URL parsing error |

---

## Component State

### Application State (Vue Reactive State)
The tool maintains minimal reactive state in the main `app.vue` component:

```typescript
interface AppState {
  inputUrl: string              // User input (v-model bound to textarea)
  validationResult: ValidationResult | null  // Result of validation
  normalizedUrl: string | null  // Normalized URL (if valid)
  copyMessage: string          // Toast message for copy feedback
  isDark: boolean              // Dark mode state (from useDarkMode)
}
```

**State Flow Diagram**:
```
User Input
    ↓
inputUrl (reactive ref)
    ↓
[watch inputUrl] → validateUrl() → validationResult
    ↓
[computed] normalizedUrl
    ↓
User clicks Copy
    ↓
copyToClipboard() → copyMessage (toast)
    ↓
[setTimeout 2s] → copyMessage = ''
```

---

## Data Transformations

### 1. URL Parsing
**Input**: Raw URL string
**Output**: ValidationResult
**Process**:
```typescript
function parseAmazonUrl(url: string): ValidationResult {
  // Step 1: Parse URL structure
  try {
    const parsedUrl = new URL(url)
  } catch (error) {
    return { isValid: false, errorMessage: 'Invalid URL format', asin: null, domain: null }
  }

  // Step 2: Validate Amazon domain
  const domainMatch = parsedUrl.hostname.match(/^(www\.)?amazon\.(com|co\.uk|de|fr|...)$/)
  if (!domainMatch) {
    return { isValid: false, errorMessage: 'Not a valid Amazon URL', asin: null, domain: null }
  }

  // Step 3: Extract ASIN from path
  const asinMatch = parsedUrl.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/)
  if (!asinMatch) {
    return { isValid: false, errorMessage: 'Could not find product ID', asin: null, domain: parsedUrl.hostname }
  }

  // Step 4: Return success
  return {
    isValid: true,
    errorMessage: null,
    asin: asinMatch[1],
    domain: parsedUrl.hostname
  }
}
```

### 2. URL Normalization
**Input**: ValidationResult
**Output**: NormalizedURL
**Process**:
```typescript
function normalizeUrl(validation: ValidationResult): NormalizedURL | null {
  if (!validation.isValid || !validation.domain || !validation.asin) {
    return null
  }

  return {
    normalizedUrl: `https://${validation.domain}/dp/${validation.asin}`,
    domain: validation.domain,
    asin: validation.asin
  }
}
```

### 3. Already Normalized Detection
**Input**: Raw URL, Normalized URL
**Output**: boolean
**Process**:
```typescript
function isAlreadyNormalized(rawUrl: string, normalizedUrl: string): boolean {
  try {
    const raw = new URL(rawUrl)
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
```

---

## Validation Rules

### Domain Validation
```typescript
const AMAZON_DOMAINS = [
  'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.it',
  'amazon.es', 'amazon.ca', 'amazon.com.mx', 'amazon.co.jp', 'amazon.in',
  'amazon.com.au', 'amazon.sg', 'amazon.ae', 'amazon.sa', 'amazon.com.br',
  'amazon.cn', 'amazon.nl', 'amazon.se', 'amazon.pl', 'amazon.com.tr'
]

function isAmazonDomain(hostname: string): boolean {
  const domain = hostname.replace(/^www\./, '')
  return AMAZON_DOMAINS.includes(domain)
}
```

### ASIN Validation
```typescript
const ASIN_PATTERN = /^[A-Z0-9]{10}$/

function isValidAsin(asin: string): boolean {
  return ASIN_PATTERN.test(asin)
}
```

### URL Format Validation
```typescript
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}
```

---

## Error Handling

### Error Categories

1. **Input Validation Errors** (user-facing):
   - Invalid URL format
   - Non-Amazon domain
   - Missing ASIN

2. **Runtime Errors** (developer-facing):
   - Clipboard API failure
   - Unexpected regex match failure
   - Component mount errors

### Error Messages

| Error Type | User Message | Technical Cause |
|------------|--------------|-----------------|
| Malformed URL | "Invalid URL format. Please enter a complete Amazon URL." | URL constructor throws |
| Invalid Domain | "Not a valid Amazon URL. Please enter an Amazon product link." | Domain doesn't match pattern |
| Missing ASIN | "Could not find product ID in URL. Make sure it's a product page link." | No ASIN in pathname |
| Copy Failed | "Failed to copy to clipboard. Please try again." | Clipboard API denied |

---

## Performance Considerations

### Reactive Computations
- **Input validation**: Debounced by 300ms to avoid excessive re-computation on typing
- **Normalized URL**: Computed property (cached until dependencies change)
- **Copy operation**: Async (non-blocking)

### Memory Management
- No persistent storage (state cleared on page refresh)
- No URL history (single URL at a time)
- Toast messages auto-clear after 2 seconds

---

## Type Definitions Export

All type definitions should be exported from a central types file for reuse:

```typescript
// types.ts
export interface AmazonURL {
  rawUrl: string
  domain: string | null
  asin: string | null
  isValid: boolean
}

export interface NormalizedURL {
  normalizedUrl: string
  domain: string
  asin: string
}

export interface ValidationResult {
  isValid: boolean
  errorMessage: string | null
  asin: string | null
  domain: string | null
}
```

---

**Status**: Data model complete ✓
**Next Artifact**: Contracts (function specifications)

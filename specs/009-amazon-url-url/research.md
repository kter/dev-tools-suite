# Research: Amazon URL Normalizer

## 1. Amazon URL Format Patterns

### Decision
Use regular expressions to extract ASIN from common Amazon URL path patterns. The ASIN (Amazon Standard Identification Number) is a 10-character alphanumeric identifier (uppercase letters and digits) that uniquely identifies a product.

### Common URL Patterns
Amazon product URLs appear in multiple formats across different pages and contexts:

1. **Standard Product Page**: `https://www.amazon.{tld}/dp/{ASIN}`
2. **Product Detail (Alternative)**: `https://www.amazon.{tld}/gp/product/{ASIN}`
3. **Direct Product**: `https://www.amazon.{tld}/product/{ASIN}`
4. **Short Format**: `https://www.amazon.{tld}/{ASIN}`
5. **With Tracking Parameters**: Any of above + `?ref=...&keywords=...&qid=...`
6. **With Path Suffix**: `https://www.amazon.{tld}/dp/{ASIN}/ref=sr_1_1`

### ASIN Format Specification
- **Length**: Exactly 10 characters
- **Characters**: Alphanumeric (A-Z, 0-9)
- **Case**: Uppercase letters only
- **Examples**: B08N5WRWNW, 1234567890, B0ABCDEFGH

### Regex Pattern Strategy
```javascript
// Primary ASIN extraction pattern
const asinPattern = /\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?]|$)/i

// Alternative pattern for short URLs
const shortPattern = /\/([A-Z0-9]{10})(?:[/?]|$)/i
```

### Rationale
- Regex provides efficient client-side parsing without dependencies
- Supports all major Amazon URL formats observed in the wild
- Pattern specificity avoids false positives from other 10-character strings
- Case-insensitive matching handles URL variations

### Alternatives Considered
- **URL parameter parsing**: Rejected - ASIN is in path, not query params
- **String splitting**: Rejected - Less robust than regex for edge cases
- **External library**: Rejected - Unnecessary dependency for simple pattern matching

---

## 2. URL Validation Strategy

### Decision
Implement two-stage validation: (1) Verify Amazon domain, (2) Extract and validate ASIN format.

### Supported Amazon Domains
Amazon operates regional sites with different top-level domains:
- **North America**: amazon.com (US), amazon.ca (Canada), amazon.com.mx (Mexico)
- **Europe**: amazon.co.uk (UK), amazon.de (Germany), amazon.fr (France), amazon.it (Italy), amazon.es (Spain)
- **Asia-Pacific**: amazon.co.jp (Japan), amazon.in (India), amazon.com.au (Australia), amazon.sg (Singapore)
- **Middle East**: amazon.ae (UAE), amazon.sa (Saudi Arabia)
- **South America**: amazon.com.br (Brazil)

### Domain Validation Pattern
```javascript
const amazonDomainPattern = /^(www\.)?amazon\.(com|co\.uk|de|fr|it|es|ca|com\.mx|co\.jp|in|com\.au|sg|ae|sa|com\.br|cn|nl|se|pl|com\.tr)$/
```

### Validation Flow
1. Parse URL using JavaScript URL API
2. Validate hostname matches Amazon domain pattern
3. Extract ASIN from pathname using regex
4. Validate ASIN format (10 chars, alphanumeric)
5. Return validation result with error message if invalid

### Error Messages
- **Invalid domain**: "Not a valid Amazon URL. Please enter an Amazon product link."
- **No ASIN found**: "Could not find product ID in URL. Make sure it's a product page link."
- **Malformed URL**: "Invalid URL format. Please enter a complete Amazon URL."

### Rationale
- Two-stage validation provides clear, specific error messages
- Domain validation prevents false positives from non-Amazon URLs
- Preserves original domain (no cross-region conversion per spec requirement FR-014)
- Try-catch around URL API handles malformed URL strings gracefully

### Alternatives Considered
- **Single regex for entire URL**: Rejected - Less maintainable, harder to provide specific errors
- **Whitelist of exact domains**: Rejected - Requires updates when Amazon adds new regions
- **Third-party URL validation**: Rejected - Unnecessary dependency

---

## 3. Client-Side URL Parsing

### Decision
Use native JavaScript URL API for parsing, combined with regex for ASIN extraction. No external dependencies required.

### Implementation Approach
```typescript
function parseAmazonUrl(url: string): ValidationResult {
  try {
    const parsedUrl = new URL(url)

    // Validate Amazon domain
    if (!amazonDomainPattern.test(parsedUrl.hostname)) {
      return {
        isValid: false,
        errorMessage: 'Not a valid Amazon URL',
        asin: null,
        domain: null
      }
    }

    // Extract ASIN from pathname
    const asinMatch = parsedUrl.pathname.match(asinPattern)
    if (!asinMatch) {
      return {
        isValid: false,
        errorMessage: 'Could not find product ID in URL',
        asin: null,
        domain: parsedUrl.hostname
      }
    }

    return {
      isValid: true,
      errorMessage: null,
      asin: asinMatch[1],
      domain: parsedUrl.hostname
    }
  } catch (error) {
    return {
      isValid: false,
      errorMessage: 'Invalid URL format',
      asin: null,
      domain: null
    }
  }
}
```

### Browser Compatibility
- URL API: Supported in all modern browsers (Chrome 32+, Firefox 19+, Safari 6.1+, Edge 12+)
- Regex: Universal support
- No polyfills required for target browsers

### Error Handling
- Try-catch wrapper handles malformed URL strings that throw in URL constructor
- Explicit error messages for each failure mode
- Null-safe returns with proper TypeScript typing

### Rationale
- Native APIs avoid bundle size increase
- URL API properly handles encoded characters, query params, fragments
- Defensive error handling prevents crashes from user input
- TypeScript types ensure type safety at compile time

### Alternatives Considered
- **Manual string parsing**: Rejected - Error-prone for edge cases (encoded chars, fragments)
- **Third-party URL parser**: Rejected - Unnecessary dependency
- **Server-side validation**: Rejected - Spec requires client-side only tool

---

## 4. Copy to Clipboard Implementation

### Decision
Use modern Clipboard API (`navigator.clipboard.writeText`) as primary method, with visual feedback via toast notification.

### Implementation Approach
```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Clipboard API failed:', error)
    // Fallback for older browsers or permission issues
    return fallbackCopyToClipboard(text)
  }
}

function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch (error) {
    document.body.removeChild(textarea)
    return false
  }
}
```

### Visual Feedback Strategy
- Toast notification appears in bottom-right corner
- Message: "Copied to clipboard!"
- Display duration: 2 seconds
- Auto-dismiss with fade transition
- Green background (success color)

### Browser Compatibility
- **Clipboard API**: Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+
- **Fallback (execCommand)**: Universal support (deprecated but functional)
- **Target coverage**: 99%+ of users

### Permission Handling
- Clipboard API requires user gesture (click event) - satisfied by button click
- No explicit permission prompt needed for writeText
- Fallback handles permission denial gracefully

### Rationale
- Modern Clipboard API is cleaner and more secure
- Async/await provides better UX (no blocking)
- Fallback ensures compatibility with older browsers
- Visual feedback confirms action succeeded

### Alternatives Considered
- **Copy on select**: Rejected - Requires explicit user action per spec
- **Clipboard.js library**: Rejected - Unnecessary for simple copy operation
- **Manual selection + Ctrl+C**: Rejected - Poor UX

---

## 5. Dark Mode and Theming

### Decision
Reuse existing `useDarkMode` composable and `ThemeToggle` component from tools/shared. Follow purple/pink gradient theme consistent with other tools.

### Existing Shared Resources
```typescript
// tools/shared/composables/useDarkMode.ts
export const useDarkMode = () => {
  const isDark = ref(false)

  const initializeTheme = () => {
    if (process.client) {
      isDark.value = localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
         window.matchMedia('(prefers-color-scheme: dark)').matches)

      if (isDark.value) {
        document.documentElement.classList.add('dark')
      }
    }
  }

  return { isDark, initializeTheme }
}
```

### Theme Color Scheme (from hash-generator)
- **Light mode gradient**: `from-purple-50 to-pink-100`
- **Dark mode gradient**: `from-gray-900 to-gray-800`
- **Primary accent**: Purple 600 (light) / Purple 400 (dark)
- **Secondary accent**: Pink 600 (light) / Pink 400 (dark)
- **Card background**: White (light) / Gray 800 (dark)
- **Text colors**: Gray 900 (light) / White (dark)

### Tailwind Dark Mode Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      // Inherit from existing tools
    }
  }
}
```

### Implementation Pattern
```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100
              dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="absolute top-0 right-0">
      <ThemeToggle />
    </div>
    <!-- Tool content -->
  </div>
</template>

<script setup>
const { initializeTheme } = useDarkMode()
onMounted(() => {
  initializeTheme()
})
</script>
```

### Rationale
- Consistency across all tools improves UX
- Shared composable reduces code duplication
- Class-based dark mode allows manual toggle + system preference
- Smooth transitions enhance polish

### Alternatives Considered
- **Custom dark mode implementation**: Rejected - Reinventing the wheel
- **Different color scheme**: Rejected - Breaks visual consistency
- **Media query only**: Rejected - Users expect manual toggle control

---

## 6. Ko-fi Integration

### Decision
Use existing `KofiButton` component from tools/shared with username "kterr" (same as other tools).

### Component Integration
```vue
<template>
  <div>
    <!-- Main tool UI -->

    <!-- Ko-fi button at bottom-left -->
    <KofiButton kofi-username="kterr" />
  </div>
</template>

<script setup>
import KofiButton from '../shared/components/KofiButton.vue'
</script>
```

### Component Features (from shared/components/KofiButton.vue)
- Floating button with auto-hide on scroll
- Default position: bottom-left
- Visibility threshold: 70% scroll
- Smooth fade transitions
- Loads Ko-fi widget script dynamically
- Fallback button if widget fails to load

### Rationale
- Consistent donation CTA across all tools
- Shared component ensures uniform behavior
- Auto-hide on scroll prevents obstruction of content

### Alternatives Considered
- **Custom Ko-fi implementation**: Rejected - Shared component already exists
- **Different position**: Rejected - Consistency across tools
- **Static button**: Rejected - Auto-hide improves UX

---

## Summary of Technology Decisions

| Aspect | Technology Choice | Rationale |
|--------|------------------|-----------|
| Framework | Nuxt 3 (SPA mode) | Matches existing tool pattern |
| Language | TypeScript (strict) | Type safety, required by project |
| Styling | Tailwind CSS | Consistent with other tools |
| URL Parsing | Native URL API + Regex | No dependencies, sufficient for needs |
| Clipboard | Clipboard API + fallback | Modern API with compatibility |
| Dark Mode | Shared useDarkMode composable | Reuse existing code |
| Theme Toggle | Shared ThemeToggle component | Consistency across tools |
| Support Button | Shared KofiButton component | Uniform donation UX |
| Build | nuxt generate (static) | Static site deployment |
| Testing | Playwright E2E | Project standard |

---

## Open Questions Resolved

All NEEDS CLARIFICATION items from Technical Context have been resolved through research:

✅ **Language/Version**: TypeScript 5.x (strict mode), Node.js 20+ LTS
✅ **Primary Dependencies**: Nuxt 3, @nuxtjs/tailwindcss, shared components
✅ **Storage**: N/A (client-side only)
✅ **Testing**: Playwright E2E tests
✅ **Target Platform**: Static web app (CloudFront + S3 on AWS, Firebase on GCP)
✅ **Performance Goals**: <100ms normalization, <50ms clipboard
✅ **Constraints**: Client-side only, offline-capable, responsive
✅ **Scale/Scope**: Single tool, 1 input, 1 output, copy button

---

**Status**: Research complete ✓
**Next Phase**: Design & Contracts (data-model.md, contracts/, quickstart.md)

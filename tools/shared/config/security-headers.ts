/**
 * Security Headers Configuration
 * Shared security headers configuration used across all dev tools
 *
 * These headers help prevent:
 * - MIME type sniffing attacks (X-Content-Type-Options)
 * - Clickjacking attacks (X-Frame-Options)
 * - XSS attacks (X-XSS-Protection)
 *
 * Note: For production deployments, these headers are also configured
 * at the CloudFront level via ResponseHeadersPolicy in CDK.
 */

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

/**
 * Get Nitro route rules with security headers
 * Use this in nuxt.config.ts to apply security headers to all routes
 */
export const getSecurityHeadersRouteRules = () => ({
  '/**': {
    headers: SECURITY_HEADERS
  }
})

export default SECURITY_HEADERS

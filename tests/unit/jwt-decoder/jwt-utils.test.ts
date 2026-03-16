import { describe, it, expect } from 'vitest'
import { getAlgorithmDescription, formatTimestamp, formatClaimValue } from '../../../tools/jwt-decoder/utils/jwt-utils'

describe('getAlgorithmDescription', () => {
  it('returns description for known algorithms', () => {
    expect(getAlgorithmDescription('HS256')).toBe('HMAC using SHA-256')
    expect(getAlgorithmDescription('RS256')).toBe('RSA using SHA-256')
    expect(getAlgorithmDescription('ES256')).toBe('ECDSA using P-256 and SHA-256')
    expect(getAlgorithmDescription('none')).toBe('No signature')
  })

  it('returns "Unknown algorithm" for unknown algorithms', () => {
    expect(getAlgorithmDescription('UNKNOWN')).toBe('Unknown algorithm')
    expect(getAlgorithmDescription('')).toBe('Unknown algorithm')
  })

  it('handles all standard algorithms', () => {
    const algorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512']
    for (const alg of algorithms) {
      expect(getAlgorithmDescription(alg)).not.toBe('Unknown algorithm')
    }
  })
})

describe('formatTimestamp', () => {
  it('converts Unix timestamp to locale string', () => {
    // Unix epoch
    const result = formatTimestamp(0)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('handles known timestamps', () => {
    // 2024-01-01T00:00:00Z = 1704067200
    const result = formatTimestamp(1704067200)
    expect(typeof result).toBe('string')
    expect(result).toContain('2024')
  })
})

describe('formatClaimValue', () => {
  it('formats timestamp claims as dates', () => {
    const result = formatClaimValue('exp', 1704067200)
    expect(typeof result).toBe('string')
    expect(result).toContain('2024')
  })

  it('formats timestamp for nbf claim', () => {
    const result = formatClaimValue('nbf', 1704067200)
    expect(typeof result).toBe('string')
    expect(result).toContain('2024')
  })

  it('formats timestamp for iat claim', () => {
    const result = formatClaimValue('iat', 1704067200)
    expect(typeof result).toBe('string')
    expect(result).toContain('2024')
  })

  it('formats array values as comma-separated string', () => {
    expect(formatClaimValue('aud', ['api.example.com', 'example.com'])).toBe('api.example.com, example.com')
  })

  it('converts other values to string', () => {
    expect(formatClaimValue('sub', 'user123')).toBe('user123')
    expect(formatClaimValue('admin', true)).toBe('true')
    expect(formatClaimValue('count', 42)).toBe('42')
  })
})

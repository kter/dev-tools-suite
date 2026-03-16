import { describe, expect, it } from 'vitest'
import {
  getCharacterSet,
  getSecureRandomInt,
  LOWERCASE_CHARS,
  NUMBER_CHARS,
  SYMBOL_CHARS,
  UPPERCASE_CHARS,
} from '../../../tools/password-generator/utils/password-utils'

const defaultOptions = {
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: false,
  excludeAmbiguous: false,
}

describe('getCharacterSet', () => {
  it('returns uppercase chars when only uppercase selected', () => {
    const charset = getCharacterSet({
      ...defaultOptions,
      includeLowercase: false,
      includeNumbers: false,
    })
    expect(charset).toBe(UPPERCASE_CHARS)
  })

  it('returns lowercase chars when only lowercase selected', () => {
    const charset = getCharacterSet({
      ...defaultOptions,
      includeUppercase: false,
      includeNumbers: false,
    })
    expect(charset).toBe(LOWERCASE_CHARS)
  })

  it('returns combined charset for multiple types', () => {
    const charset = getCharacterSet({
      ...defaultOptions,
      includeNumbers: false,
      includeSymbols: false,
    })
    expect(charset).toBe(UPPERCASE_CHARS + LOWERCASE_CHARS)
  })

  it('excludes similar characters when excludeSimilar is true', () => {
    const charset = getCharacterSet({ ...defaultOptions, excludeSimilar: true })
    expect(charset).not.toContain('0')
    expect(charset).not.toContain('O')
    expect(charset).not.toContain('l')
    expect(charset).not.toContain('1')
    expect(charset).not.toContain('I')
  })

  it('excludes ambiguous characters when excludeAmbiguous is true', () => {
    const charset = getCharacterSet({
      ...defaultOptions,
      includeSymbols: true,
      excludeAmbiguous: true,
    })
    expect(charset).not.toContain('{')
    expect(charset).not.toContain('}')
    expect(charset).not.toContain('[')
    expect(charset).not.toContain(']')
  })

  it('returns empty string when no types selected', () => {
    const charset = getCharacterSet({
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeSimilar: false,
      excludeAmbiguous: false,
    })
    expect(charset).toBe('')
  })

  it('includes symbols when includeSymbols is true', () => {
    const charset = getCharacterSet({ ...defaultOptions, includeSymbols: true })
    expect(charset).toContain('!')
    expect(charset).toContain('@')
    expect(charset).toContain('#')
  })
})

describe('getSecureRandomInt', () => {
  it('returns a number within [0, max)', () => {
    for (let i = 0; i < 100; i++) {
      const result = getSecureRandomInt(10)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(10)
    }
  })

  it('uses provided crypto implementation', () => {
    const mockCrypto = {
      getRandomValues: (arr: Uint32Array) => {
        arr[0] = 42
      },
    }
    expect(getSecureRandomInt(100, mockCrypto)).toBe(42)
  })

  it('returns integer values', () => {
    const result = getSecureRandomInt(10)
    expect(Number.isInteger(result)).toBe(true)
  })
})

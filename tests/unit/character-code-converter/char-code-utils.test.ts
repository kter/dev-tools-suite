import { describe, expect, it } from 'vitest'
import {
  convertChar,
  encodeFullText,
} from '../../../tools/character-code-converter/utils/char-code-utils'

describe('convertChar', () => {
  it('converts ASCII character "A"', () => {
    const result = convertChar('A')
    expect(result.character).toBe('A')
    expect(result.ascii).toBe('65')
    expect(result.hex).toBe('0x41')
    expect(result.unicode).toBe('U+0041')
    expect(result.utf8).toBe('41')
    expect(result.binary).toBe('01000001')
  })

  it('represents space as "(space)"', () => {
    const result = convertChar(' ')
    expect(result.character).toBe('(space)')
    expect(result.ascii).toBe('32')
  })

  it('represents newline as "(newline)"', () => {
    const result = convertChar('\n')
    expect(result.character).toBe('(newline)')
    expect(result.ascii).toBe('10')
  })

  it('represents tab as "(tab)"', () => {
    const result = convertChar('\t')
    expect(result.character).toBe('(tab)')
  })

  it('returns "N/A" for ascii when char code > 127', () => {
    const result = convertChar('あ')
    expect(result.ascii).toBe('N/A')
    expect(result.unicode).toMatch(/^U\+/)
  })

  it('converts digit "0"', () => {
    const result = convertChar('0')
    expect(result.ascii).toBe('48')
    expect(result.hex).toBe('0x30')
    expect(result.binary).toBe('00110000')
  })
})

describe('encodeFullText', () => {
  it('encodes ASCII text to Base64', () => {
    const result = encodeFullText('Hello')
    expect(result.base64).toBe('SGVsbG8=')
  })

  it('URL-encodes special characters', () => {
    const result = encodeFullText('Hello World')
    expect(result.urlEncoded).toBe('Hello%20World')
  })

  it('converts HTML special chars to entities', () => {
    const result = encodeFullText('<div>')
    expect(result.htmlEntities).toContain('&#60;')
    expect(result.htmlEntities).toContain('&#62;')
  })

  it('handles Japanese text', () => {
    const result = encodeFullText('あ')
    expect(result.base64).toBeTruthy()
    expect(result.urlEncoded).toContain('%')
    expect(result.htmlEntities).toContain('&#')
  })

  it('returns empty strings for empty input', () => {
    const result = encodeFullText('')
    expect(result.base64).toBe('')
    expect(result.urlEncoded).toBe('')
    expect(result.htmlEntities).toBe('')
  })
})

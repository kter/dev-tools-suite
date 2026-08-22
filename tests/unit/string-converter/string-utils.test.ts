import { describe, expect, it } from 'vitest'
import {
  base64Decode,
  base64Encode,
  camelToSnake,
  htmlEscape,
  htmlUnescape,
  snakeToCamel,
  toLowerCase,
  toUpperCase,
  urlDecode,
  urlEncode,
} from '../../../tools/string-converter/utils/string-utils'

describe('base64Encode / base64Decode', () => {
  it('encodes ASCII text to Base64', () => {
    expect(base64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=')
  })

  it('round-trips ASCII text', () => {
    const input = 'Hello World'
    expect(base64Decode(base64Encode(input))).toBe(input)
  })

  it('handles Japanese characters', () => {
    const input = 'こんにちは'
    expect(base64Decode(base64Encode(input))).toBe(input)
  })

  it('returns empty string for empty input', () => {
    expect(base64Encode('')).toBe('')
    expect(base64Decode('')).toBe('')
  })
})

describe('urlEncode / urlDecode', () => {
  it('encodes spaces as %20', () => {
    expect(urlEncode('Hello World!')).toBe('Hello%20World!')
  })

  it('encodes special URL characters', () => {
    expect(urlEncode('https://example.com/search?q=test')).toBe(
      'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtest'
    )
  })

  it('round-trips URLs', () => {
    const input = 'https://example.com/path?foo=bar&baz=qux'
    expect(urlDecode(urlEncode(input))).toBe(input)
  })

  it('returns empty string for empty input', () => {
    expect(urlEncode('')).toBe('')
    expect(urlDecode('')).toBe('')
  })
})

describe('htmlEscape / htmlUnescape', () => {
  it('escapes HTML tags', () => {
    expect(htmlEscape('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes ampersand', () => {
    expect(htmlEscape('A & B')).toContain('&amp;')
  })

  it('round-trips HTML content', () => {
    const input = '<div class="test">Hello & World</div>'
    expect(htmlUnescape(htmlEscape(input))).toBe(input)
  })

  it('returns empty string for empty input', () => {
    expect(htmlEscape('')).toBe('')
    expect(htmlUnescape('')).toBe('')
  })
})

describe('snakeToCamel', () => {
  it('converts snake_case to camelCase', () => {
    expect(snakeToCamel('user_name')).toBe('userName')
    expect(snakeToCamel('api_response_data')).toBe('apiResponseData')
  })

  it('returns empty string for empty input', () => {
    expect(snakeToCamel('')).toBe('')
  })

  it('leaves camelCase unchanged', () => {
    expect(snakeToCamel('userName')).toBe('userName')
  })
})

describe('camelToSnake', () => {
  it('converts camelCase to snake_case', () => {
    expect(camelToSnake('userName')).toBe('user_name')
    expect(camelToSnake('apiResponseData')).toBe('api_response_data')
  })

  it('returns empty string for empty input', () => {
    expect(camelToSnake('')).toBe('')
  })

  it('leaves snake_case unchanged (lowercases it)', () => {
    expect(camelToSnake('user_name')).toBe('user_name')
  })
})

describe('toUpperCase / toLowerCase', () => {
  it('converts to uppercase', () => {
    expect(toUpperCase('Hello World')).toBe('HELLO WORLD')
    expect(toUpperCase('test data')).toBe('TEST DATA')
  })

  it('converts to lowercase', () => {
    expect(toLowerCase('Hello World')).toBe('hello world')
    expect(toLowerCase('TEST DATA')).toBe('test data')
  })

  it('returns empty string for empty input', () => {
    expect(toUpperCase('')).toBe('')
    expect(toLowerCase('')).toBe('')
  })
})

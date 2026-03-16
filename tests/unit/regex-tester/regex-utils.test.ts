import { describe, it, expect } from 'vitest'
import { buildFlagString, parseRegexMatches, performReplace, escapeHtml } from '../../../tools/regex-tester/utils/regex-utils'

const defaultFlags = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false
}

describe('buildFlagString', () => {
  it('returns empty string for no flags', () => {
    expect(buildFlagString({ global: false, ignoreCase: false, multiline: false, dotAll: false })).toBe('')
  })

  it('returns "g" for global only', () => {
    expect(buildFlagString({ ...defaultFlags })).toBe('g')
  })

  it('returns "gi" for global and ignoreCase', () => {
    expect(buildFlagString({ ...defaultFlags, ignoreCase: true })).toBe('gi')
  })

  it('returns "gims" for all flags', () => {
    expect(buildFlagString({ global: true, ignoreCase: true, multiline: true, dotAll: true })).toBe('gims')
  })
})

describe('parseRegexMatches', () => {
  it('finds all global matches', () => {
    const matches = parseRegexMatches('\\d+', 'foo 123 bar 456', defaultFlags)
    expect(matches).toHaveLength(2)
    expect(matches[0].value).toBe('123')
    expect(matches[0].index).toBe(4)
    expect(matches[1].value).toBe('456')
  })

  it('finds single match when global is false', () => {
    const matches = parseRegexMatches('\\d+', 'foo 123 bar 456', { ...defaultFlags, global: false })
    expect(matches).toHaveLength(1)
    expect(matches[0].value).toBe('123')
  })

  it('returns empty array when no matches', () => {
    const matches = parseRegexMatches('xyz', 'hello world', defaultFlags)
    expect(matches).toHaveLength(0)
  })

  it('captures groups', () => {
    const matches = parseRegexMatches('(\\w+)@(\\w+)', 'test@example', { ...defaultFlags, global: false })
    expect(matches[0].groups).toEqual(['test', 'example'])
  })

  it('matches case-insensitively when ignoreCase is true', () => {
    const matches = parseRegexMatches('hello', 'Hello World HELLO', { ...defaultFlags, ignoreCase: true })
    expect(matches).toHaveLength(2)
  })
})

describe('performReplace', () => {
  it('replaces first occurrence without global flag', () => {
    const regex = new RegExp('foo')
    expect(performReplace('foo bar foo', regex, 'baz')).toBe('baz bar foo')
  })

  it('replaces all occurrences with global flag', () => {
    const regex = new RegExp('foo', 'g')
    expect(performReplace('foo bar foo', regex, 'baz')).toBe('baz bar baz')
  })

  it('supports capture group references', () => {
    const regex = new RegExp('(\\w+)@(\\w+)', 'g')
    expect(performReplace('user@host', regex, '$2@$1')).toBe('host@user')
  })
})

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toContain('&amp;')
  })

  it('escapes less than and greater than', () => {
    const result = escapeHtml('<div>')
    expect(result).toContain('&lt;')
    expect(result).toContain('&gt;')
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toContain('&quot;')
  })

  it('does not escape plain text', () => {
    expect(escapeHtml('hello world')).toContain('hello')
  })
})

import { describe, expect, it } from 'vitest'
import {
  formatOutput,
  parseInput,
  stringifyToml,
} from '../../../tools/json-yaml-converter/utils/json-yaml-utils'

const defaultFormatOptions = {
  prettyFormat: true,
  jsonIndent: '2',
}

const sampleData = { name: 'John', age: 30, active: true }

describe('parseInput', () => {
  it('parses valid JSON', () => {
    const result = parseInput('{"name":"John","age":30}', 'json')
    expect(result).toEqual({ name: 'John', age: 30 })
  })

  it('parses valid YAML', () => {
    const result = parseInput('name: John\nage: 30', 'yaml')
    expect(result).toEqual({ name: 'John', age: 30 })
  })

  it('parses valid TOML', () => {
    const result = parseInput('name = "John"\nage = 30', 'toml')
    expect(result).toEqual({ name: 'John', age: 30 })
  })

  it('throws for invalid JSON', () => {
    expect(() => parseInput('{invalid json}', 'json')).toThrow()
  })

  it('throws for invalid YAML', () => {
    expect(() => parseInput('key: :\n  bad indent', 'yaml')).toThrow()
  })

  it('returns null for empty input', () => {
    expect(parseInput('', 'json')).toBeNull()
    expect(parseInput('   ', 'yaml')).toBeNull()
  })
})

describe('formatOutput', () => {
  it('formats data as pretty JSON', () => {
    const result = formatOutput(sampleData, 'json', defaultFormatOptions)
    const parsed = JSON.parse(result)
    expect(parsed).toEqual(sampleData)
    expect(result).toContain('\n')
  })

  it('formats data as compact JSON', () => {
    const result = formatOutput(sampleData, 'json', { prettyFormat: false, jsonIndent: '2' })
    expect(result).not.toContain('\n')
    const parsed = JSON.parse(result)
    expect(parsed).toEqual(sampleData)
  })

  it('formats data as YAML', () => {
    const result = formatOutput(sampleData, 'yaml', defaultFormatOptions)
    expect(result).toContain('name: John')
    expect(result).toContain('age: 30')
  })

  it('formats data as TOML', () => {
    const result = formatOutput(sampleData, 'toml', defaultFormatOptions)
    expect(result).toContain('name = "John"')
    expect(result).toContain('age = 30')
  })

  it('uses tab indent when jsonIndent is "tab"', () => {
    const result = formatOutput({ key: 'value' }, 'json', { prettyFormat: true, jsonIndent: 'tab' })
    expect(result).toContain('\t')
  })
})

describe('stringifyToml', () => {
  it('stringifies simple key-value pairs', () => {
    const result = stringifyToml({ name: 'John', age: 30, active: true })
    expect(result).toContain('name = "John"')
    expect(result).toContain('age = 30')
    expect(result).toContain('active = true')
  })

  it('handles nested objects as TOML tables', () => {
    const result = stringifyToml({ address: { city: 'NYC', zip: '10001' } })
    expect(result).toContain('[address]')
    expect(result).toContain('city = "NYC"')
  })

  it('handles arrays', () => {
    const result = stringifyToml({ hobbies: ['reading', 'coding'] })
    expect(result).toContain('hobbies =')
    expect(result).toContain('reading')
  })

  it('skips null and undefined values', () => {
    const result = stringifyToml({ name: 'John', missing: null, undef: undefined })
    expect(result).toContain('name = "John"')
    expect(result).not.toContain('missing')
    expect(result).not.toContain('undef')
  })
})

describe('JSON→YAML round-trip', () => {
  it('converts JSON to YAML and back', () => {
    const jsonInput = '{"name":"John","age":30,"hobbies":["reading","coding"]}'
    const parsed = parseInput(jsonInput, 'json')
    const yaml = formatOutput(parsed, 'yaml', defaultFormatOptions)
    const backToJson = formatOutput(parseInput(yaml, 'yaml'), 'json', defaultFormatOptions)
    expect(JSON.parse(backToJson)).toEqual(JSON.parse(jsonInput))
  })
})

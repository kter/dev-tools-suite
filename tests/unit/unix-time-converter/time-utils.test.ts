import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { convertUnixToHuman, convertHumanToUnix } from '../../../tools/unix-time-converter/utils/time-utils'

// Use UTC timezone to make tests deterministic
const originalTZ = process.env.TZ

beforeAll(() => {
  process.env.TZ = 'UTC'
})

afterAll(() => {
  process.env.TZ = originalTZ
})

describe('convertUnixToHuman', () => {
  it('converts Unix epoch (0) to date', () => {
    const result = convertUnixToHuman(0)
    expect(result.utc).toContain('1970')
    expect(result.local).toBeTruthy()
  })

  it('returns valid date for Y2K timestamp', () => {
    // 946684800 = 2000-01-01T00:00:00Z
    const result = convertUnixToHuman(946684800)
    expect(result.utc).toContain('2000')
    expect(result.local).toBeTruthy()
  })

  it('returns error message for NaN input', () => {
    const result = convertUnixToHuman(NaN)
    expect(result.local).toBe('Invalid timestamp')
    expect(result.utc).toBe('Invalid timestamp')
  })

  it('returns string values', () => {
    const result = convertUnixToHuman(1704067200)
    expect(typeof result.local).toBe('string')
    expect(typeof result.utc).toBe('string')
  })
})

describe('convertHumanToUnix', () => {
  it('converts UTC date/time to Unix timestamp', () => {
    // 2000-01-01 00:00 UTC = 946684800
    const result = convertHumanToUnix('2000-01-01', '00:00')
    expect(result.utc).toBe('946684800')
  })

  it('returns empty strings when date or time is missing', () => {
    expect(convertHumanToUnix('', '12:00')).toEqual({ local: '', utc: '' })
    expect(convertHumanToUnix('2024-01-01', '')).toEqual({ local: '', utc: '' })
    expect(convertHumanToUnix('', '')).toEqual({ local: '', utc: '' })
  })

  it('returns error for invalid date', () => {
    const result = convertHumanToUnix('invalid-date', '00:00')
    expect(result.local).toBe('Invalid date/time')
    expect(result.utc).toBe('Invalid date/time')
  })

  it('returns string values for valid input', () => {
    const result = convertHumanToUnix('2024-01-01', '00:00')
    expect(typeof result.local).toBe('string')
    expect(typeof result.utc).toBe('string')
  })
})

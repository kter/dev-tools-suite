/**
 * Tool interface validation tests
 * Tests Tool schema validation and rejects invalid objects
 * Based on contracts/component-tests.spec.ts
 */

import { describe, it, expect } from 'vitest'
import type { Tool } from '../types/tool'
import { validateTool, validateToolArray } from '../types/tool'

// Mock data for testing
const validTool: Tool = {
  id: 'password-gen',
  name: 'Password Generator',
  description: 'Generate secure passwords with custom options',
  url: '/password-generator',
  icon: 'lock-icon',
  tags: ['security', 'password']
}

const minimalTool: Tool = {
  id: 'hash-gen',
  name: 'Hash Generator',
  description: 'Create MD5, SHA256 and other hash types',
  url: '/hash-generator'
}

describe('Tool Interface Validation', () => {
  describe('validateTool', () => {
    it('should validate valid Tool objects', () => {
      expect(validateTool(validTool)).toBe(true)
      expect(validateTool(minimalTool)).toBe(true)
    })

    it('should validate Tool with all required fields', () => {
      const tool = {
        id: 'test-tool',
        name: 'Test Tool',
        description: 'A test tool',
        url: '/test'
      }
      expect(validateTool(tool)).toBe(true)
    })

    it('should reject null or undefined', () => {
      expect(validateTool(null)).toBe(false)
      expect(validateTool(undefined)).toBe(false)
    })

    it('should reject non-object values', () => {
      expect(validateTool('string')).toBe(false)
      expect(validateTool(123)).toBe(false)
      expect(validateTool([])).toBe(false)
      expect(validateTool(true)).toBe(false)
    })

    it('should reject objects missing required fields', () => {
      const missingId = { name: 'Tool', description: 'Desc', url: '/url' }
      const missingName = { id: 'tool', description: 'Desc', url: '/url' }
      const missingDescription = { id: 'tool', name: 'Tool', url: '/url' }
      const missingUrl = { id: 'tool', name: 'Tool', description: 'Desc' }

      expect(validateTool(missingId)).toBe(false)
      expect(validateTool(missingName)).toBe(false)
      expect(validateTool(missingDescription)).toBe(false)
      expect(validateTool(missingUrl)).toBe(false)
    })

    it('should reject empty string values for required fields', () => {
      const emptyId = { id: '', name: 'Tool', description: 'Desc', url: '/url' }
      const emptyName = { id: 'tool', name: '', description: 'Desc', url: '/url' }
      const emptyDesc = { id: 'tool', name: 'Tool', description: '', url: '/url' }
      const emptyUrl = { id: 'tool', name: 'Tool', description: 'Desc', url: '' }

      expect(validateTool(emptyId)).toBe(false)
      expect(validateTool(emptyName)).toBe(false)
      expect(validateTool(emptyDesc)).toBe(false)
      expect(validateTool(emptyUrl)).toBe(false)
    })

    it('should reject whitespace-only strings for required fields', () => {
      const whitespaceId = { id: '   ', name: 'Tool', description: 'Desc', url: '/url' }
      expect(validateTool(whitespaceId)).toBe(false)
    })

    it('should reject invalid icon field', () => {
      const invalidIcon = { ...validTool, icon: '' }
      const nonStringIcon = { ...validTool, icon: 123 }

      expect(validateTool(invalidIcon)).toBe(false)
      expect(validateTool(nonStringIcon)).toBe(false)
    })

    it('should accept undefined optional fields', () => {
      const noOptionals = {
        id: 'tool',
        name: 'Tool',
        description: 'Description',
        url: '/url',
        icon: undefined,
        tags: undefined
      }
      expect(validateTool(noOptionals)).toBe(true)
    })

    it('should validate tags array properly', () => {
      const validTags = { ...validTool, tags: ['tag1', 'tag2'] }
      const emptyTags = { ...validTool, tags: [] }
      const invalidTagType = { ...validTool, tags: [123, 'valid'] }
      const emptyStringTag = { ...validTool, tags: ['valid', ''] }
      const nonArrayTags = { ...validTool, tags: 'not-array' }

      expect(validateTool(validTags)).toBe(true)
      expect(validateTool(emptyTags)).toBe(true)
      expect(validateTool(invalidTagType)).toBe(false)
      expect(validateTool(emptyStringTag)).toBe(false)
      expect(validateTool(nonArrayTags)).toBe(false)
    })
  })

  describe('validateToolArray', () => {
    it('should validate array of valid tools', () => {
      const tools = [validTool, minimalTool]
      expect(validateToolArray(tools)).toBe(true)
    })

    it('should validate empty array', () => {
      expect(validateToolArray([])).toBe(true)
    })

    it('should reject non-array input', () => {
      expect(validateToolArray('not-array')).toBe(false)
      expect(validateToolArray(validTool)).toBe(false)
      expect(validateToolArray(null)).toBe(false)
    })

    it('should reject array with invalid tools', () => {
      const invalidTool = { id: '', name: 'Invalid' }
      const mixedArray = [validTool, invalidTool]

      expect(validateToolArray(mixedArray)).toBe(false)
    })
  })

  describe('Tool interface structure compliance', () => {
    it('should have all required Tool properties', () => {
      expect(validTool).toHaveProperty('id')
      expect(validTool).toHaveProperty('name')
      expect(validTool).toHaveProperty('description')
      expect(validTool).toHaveProperty('url')

      expect(typeof validTool.id).toBe('string')
      expect(typeof validTool.name).toBe('string')
      expect(typeof validTool.description).toBe('string')
      expect(typeof validTool.url).toBe('string')
    })

    it('should handle optional properties correctly', () => {
      if (validTool.icon) {
        expect(typeof validTool.icon).toBe('string')
      }

      if (validTool.tags) {
        expect(Array.isArray(validTool.tags)).toBe(true)
        validTool.tags.forEach(tag => {
          expect(typeof tag).toBe('string')
        })
      }
    })
  })
})
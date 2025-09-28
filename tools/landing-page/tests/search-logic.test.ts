/**
 * Search filtering contract tests
 * Tests filterTools function against name, description, tags
 * Based on contracts/component-tests.spec.ts and data-model.md search algorithm
 */

import { describe, it, expect } from 'vitest'
import type { Tool } from '../types/tool'

// Mock tools data for testing
const mockTools: Tool[] = [
  {
    id: 'password-gen',
    name: 'Password Generator',
    description: 'Generate secure passwords with custom options',
    url: '/password-generator',
    tags: ['security', 'password']
  },
  {
    id: 'hash-gen',
    name: 'Hash Generator',
    description: 'Create MD5, SHA256 and other hash types',
    url: '/hash-generator',
    tags: ['hash', 'encryption']
  },
  {
    id: 'qr-code',
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs and text',
    url: '/qr-generator',
    tags: ['qr', 'code', 'generator']
  },
  {
    id: 'timer',
    name: 'Timer Tool',
    description: 'Simple countdown and stopwatch timer',
    url: '/timer',
    tags: ['time', 'utility']
  }
]

/**
 * Search filter function implementation
 * This will be implemented in useToolSearch composable
 * Testing the contract here to ensure it works correctly
 */
function filterTools(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) {
    return tools
  }

  const searchQuery = query.toLowerCase()
  return tools.filter(tool => {
    // Search in name
    if (tool.name.toLowerCase().includes(searchQuery)) {
      return true
    }
    // Search in description
    if (tool.description.toLowerCase().includes(searchQuery)) {
      return true
    }
    // Search in tags
    if (tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery))) {
      return true
    }
    return false
  })
}

describe('Search Logic Contract', () => {
  describe('filterTools function', () => {
    it('should filter tools by name', () => {
      const query = 'password'
      const results = filterTools(mockTools, query)

      expect(results).toHaveLength(1)
      expect(results[0].name.toLowerCase()).toContain(query)
      expect(results[0].id).toBe('password-gen')
    })

    it('should filter tools by description', () => {
      const query = 'generate'
      const results = filterTools(mockTools, query)

      expect(results.length).toBeGreaterThan(0)
      results.forEach(tool => {
        const matchesName = tool.name.toLowerCase().includes(query)
        const matchesDescription = tool.description.toLowerCase().includes(query)
        expect(matchesName || matchesDescription).toBe(true)
      })
    })

    it('should filter tools by tags', () => {
      const query = 'security'
      const results = filterTools(mockTools, query)

      expect(results).toHaveLength(1)
      expect(results[0].tags).toContain(query)
      expect(results[0].id).toBe('password-gen')
    })

    it('should handle empty query by returning all tools', () => {
      const results = filterTools(mockTools, '')
      expect(results).toEqual(mockTools)
    })

    it('should handle whitespace-only query by returning all tools', () => {
      const results = filterTools(mockTools, '   ')
      expect(results).toEqual(mockTools)
    })

    it('should perform case insensitive search', () => {
      const queries = ['PASSWORD', 'Password', 'password', 'PaSsWoRd']

      queries.forEach(query => {
        const results = filterTools(mockTools, query)
        expect(results).toHaveLength(1)
        expect(results[0].id).toBe('password-gen')
      })
    })

    it('should return empty array for no matches', () => {
      const query = 'nonexistent'
      const results = filterTools(mockTools, query)
      expect(results).toHaveLength(0)
    })

    it('should find partial matches in names', () => {
      const query = 'gen'
      const results = filterTools(mockTools, query)

      expect(results.length).toBeGreaterThan(1)
      results.forEach(tool => {
        const hasMatch =
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags?.some(tag => tag.toLowerCase().includes(query))
        expect(hasMatch).toBe(true)
      })
    })

    it('should find partial matches in descriptions', () => {
      const query = 'md5'
      const results = filterTools(mockTools, query)

      expect(results).toHaveLength(1)
      expect(results[0].description.toLowerCase()).toContain(query)
    })

    it('should match multiple fields simultaneously', () => {
      const query = 'code'
      const results = filterTools(mockTools, query)

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('qr-code')
      // Matches both name 'QR Code Generator' and tags ['qr', 'code', 'generator']
    })

    it('should handle tools without tags', () => {
      const toolsWithoutTags: Tool[] = [{
        id: 'simple-tool',
        name: 'Simple Tool',
        description: 'A tool without tags',
        url: '/simple'
      }]

      const results = filterTools(toolsWithoutTags, 'simple')
      expect(results).toHaveLength(1)
    })

    it('should handle special characters in search', () => {
      const queries = ['#', '@', '$', '%', '&', '*']

      queries.forEach(query => {
        const results = filterTools(mockTools, query)
        expect(Array.isArray(results)).toBe(true)
        // Should not throw errors, even if no matches
      })
    })

    it('should maintain original order of tools', () => {
      const query = 'generator'
      const results = filterTools(mockTools, query)

      // Should maintain relative order from original array
      const originalIndices = results.map(tool =>
        mockTools.findIndex(t => t.id === tool.id)
      )

      // Check that indices are in ascending order
      for (let i = 1; i < originalIndices.length; i++) {
        expect(originalIndices[i]).toBeGreaterThan(originalIndices[i - 1])
      }
    })

    it('should handle very long search queries', () => {
      const longQuery = 'a'.repeat(1000)
      const results = filterTools(mockTools, longQuery)

      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(0) // No matches expected
    })
  })

  describe('Search performance characteristics', () => {
    it('should handle large tool datasets efficiently', () => {
      // Create larger dataset for performance testing
      const largeMockTools = Array.from({ length: 100 }, (_, i) => ({
        id: `tool-${i}`,
        name: `Tool ${i}`,
        description: `Description for tool ${i}`,
        url: `/tool-${i}`,
        tags: [`tag${i}`, 'common']
      }))

      const startTime = performance.now()
      const results = filterTools(largeMockTools, 'common')
      const endTime = performance.now()

      expect(results).toHaveLength(100) // All tools should match 'common' tag
      expect(endTime - startTime).toBeLessThan(50) // Should be fast (<50ms per research.md)
    })
  })
})
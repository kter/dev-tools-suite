/**
 * Keyboard navigation contract tests
 * Tests arrow key selection and bounds checking
 * Based on contracts/component-tests.spec.ts keyboard navigation patterns
 */

import { describe, it, expect } from 'vitest'
import type { Tool } from '../types/tool'

// Mock tools for navigation testing
const mockTools: Tool[] = [
  { id: 'tool1', name: 'Tool 1', description: 'First tool', url: '/tool1' },
  { id: 'tool2', name: 'Tool 2', description: 'Second tool', url: '/tool2' },
  { id: 'tool3', name: 'Tool 3', description: 'Third tool', url: '/tool3' }
]

/**
 * Keyboard navigation logic simulation
 * This will be implemented in useKeyboardNavigation composable
 */
class KeyboardNavigation {
  private selectedIndex: number = -1
  private items: any[] = []

  constructor(items: any[]) {
    this.items = items
  }

  getSelectedIndex(): number {
    return this.selectedIndex
  }

  selectNext(): void {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.items.length - 1)
  }

  selectPrevious(): void {
    this.selectedIndex = Math.max(this.selectedIndex - 1, -1)
  }

  resetSelection(): void {
    this.selectedIndex = -1
  }

  getSelectedItem<T>(): T | undefined {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
      return this.items[this.selectedIndex] as T
    }
    return undefined
  }

  setItems(items: any[]): void {
    this.items = items
    // Reset selection if current selection is out of bounds
    if (this.selectedIndex >= items.length) {
      this.selectedIndex = -1
    }
  }
}

describe('Keyboard Navigation Contract', () => {
  describe('Arrow key navigation', () => {
    it('should start with no selection (-1)', () => {
      const nav = new KeyboardNavigation(mockTools)
      expect(nav.getSelectedIndex()).toBe(-1)
    })

    it('should move to first item on arrow down from no selection', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext()
      expect(nav.getSelectedIndex()).toBe(0)
    })

    it('should move to previous item on arrow up', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext() // Move to 0
      nav.selectNext() // Move to 1
      nav.selectPrevious() // Move back to 0
      expect(nav.getSelectedIndex()).toBe(0)
    })

    it('should not go below -1 when pressing arrow up from no selection', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectPrevious()
      expect(nav.getSelectedIndex()).toBe(-1)
    })

    it('should not go above last item index when pressing arrow down', () => {
      const nav = new KeyboardNavigation(mockTools)
      // Move to last item
      for (let i = 0; i < mockTools.length; i++) {
        nav.selectNext()
      }
      expect(nav.getSelectedIndex()).toBe(mockTools.length - 1)

      // Try to go beyond last item
      nav.selectNext()
      expect(nav.getSelectedIndex()).toBe(mockTools.length - 1) // Should stay at last
    })

    it('should cycle through all items correctly', () => {
      const nav = new KeyboardNavigation(mockTools)

      // Test forward navigation
      for (let i = 0; i < mockTools.length; i++) {
        nav.selectNext()
        expect(nav.getSelectedIndex()).toBe(i)
      }

      // Test backward navigation
      for (let i = mockTools.length - 2; i >= 0; i--) {
        nav.selectPrevious()
        expect(nav.getSelectedIndex()).toBe(i)
      }
    })
  })

  describe('Selection management', () => {
    it('should reset selection to -1', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext() // Move to 0
      nav.selectNext() // Move to 1
      nav.resetSelection()
      expect(nav.getSelectedIndex()).toBe(-1)
    })

    it('should return undefined when no item is selected', () => {
      const nav = new KeyboardNavigation(mockTools)
      expect(nav.getSelectedItem()).toBeUndefined()
    })

    it('should return correct item when selection is valid', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext() // Select first item (index 0)

      const selectedItem = nav.getSelectedItem<Tool>()
      expect(selectedItem).toBeDefined()
      expect(selectedItem?.id).toBe('tool1')
      expect(selectedItem?.name).toBe('Tool 1')
    })

    it('should handle selection after reset', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext() // Move to 0
      nav.resetSelection()
      nav.selectNext() // Should move to 0 again
      expect(nav.getSelectedIndex()).toBe(0)
    })
  })

  describe('Bounds checking', () => {
    it('should handle empty items array', () => {
      const nav = new KeyboardNavigation([])
      nav.selectNext()
      expect(nav.getSelectedIndex()).toBe(-1) // Can't select anything
    })

    it('should handle single item array', () => {
      const singleTool = [mockTools[0]]
      const nav = new KeyboardNavigation(singleTool)

      nav.selectNext()
      expect(nav.getSelectedIndex()).toBe(0)

      nav.selectNext() // Should stay at 0
      expect(nav.getSelectedIndex()).toBe(0)

      nav.selectPrevious() // Should go to -1
      expect(nav.getSelectedIndex()).toBe(-1)
    })

    it('should handle dynamic item list changes', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext() // Move to 0
      nav.selectNext() // Move to 1

      // Simulate filtering that reduces items
      const filteredTools = [mockTools[0]]
      nav.setItems(filteredTools)

      // Selection should be reset since index 1 no longer exists
      expect(nav.getSelectedIndex()).toBe(-1)
    })

    it('should maintain valid selection when items list grows', () => {
      const nav = new KeyboardNavigation([mockTools[0]])
      nav.selectNext() // Select first item

      // Add more items
      nav.setItems(mockTools)
      expect(nav.getSelectedIndex()).toBe(0) // Should still be valid
    })
  })

  describe('Edge cases', () => {
    it('should handle rapid key presses correctly', () => {
      const nav = new KeyboardNavigation(mockTools)

      // Simulate rapid down arrow presses
      for (let i = 0; i < 10; i++) {
        nav.selectNext()
      }
      expect(nav.getSelectedIndex()).toBe(mockTools.length - 1)

      // Simulate rapid up arrow presses
      for (let i = 0; i < 10; i++) {
        nav.selectPrevious()
      }
      expect(nav.getSelectedIndex()).toBe(-1)
    })

    it('should handle alternating key presses', () => {
      const nav = new KeyboardNavigation(mockTools)

      nav.selectNext()    // 0
      nav.selectPrevious() // -1
      nav.selectNext()    // 0
      nav.selectNext()    // 1
      nav.selectPrevious() // 0

      expect(nav.getSelectedIndex()).toBe(0)
    })

    it('should maintain consistency after multiple resets', () => {
      const nav = new KeyboardNavigation(mockTools)

      for (let i = 0; i < 5; i++) {
        nav.selectNext()
        nav.selectNext()
        nav.resetSelection()
        expect(nav.getSelectedIndex()).toBe(-1)
      }
    })
  })

  describe('Integration with search results', () => {
    it('should handle navigation with filtered results', () => {
      // Simulate search filtering scenario
      const originalTools = mockTools
      const filteredTools = [mockTools[0], mockTools[2]] // Skip middle tool

      const nav = new KeyboardNavigation(filteredTools)

      nav.selectNext() // Should select first filtered result
      expect(nav.getSelectedIndex()).toBe(0)

      const selectedItem = nav.getSelectedItem<Tool>()
      expect(selectedItem?.id).toBe('tool1')

      nav.selectNext() // Should select second filtered result
      expect(nav.getSelectedIndex()).toBe(1)

      const secondSelectedItem = nav.getSelectedItem<Tool>()
      expect(secondSelectedItem?.id).toBe('tool3') // Note: tool2 was filtered out
    })

    it('should reset selection when search results change', () => {
      const nav = new KeyboardNavigation(mockTools)
      nav.selectNext() // Select first item

      // Simulate new search results
      const newResults = [mockTools[1], mockTools[2]]
      nav.setItems(newResults)

      // Selection should be reset since the item list changed
      expect(nav.getSelectedIndex()).toBe(-1)
    })
  })
})
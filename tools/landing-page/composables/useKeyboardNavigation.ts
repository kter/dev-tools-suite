/**
 * useKeyboardNavigation composable
 * Handles arrow key selection, bounds checking
 * Based on contracts/component-tests.spec.ts keyboard navigation patterns
 */

import { ref, readonly, watch, type Ref } from 'vue'
import type { UseKeyboardNavigationReturn } from '../types/components'

/**
 * Main useKeyboardNavigation composable
 * Provides arrow key navigation through a list of items
 */
export function useKeyboardNavigation<T = any>(
  items: Ref<T[]> = ref([])
): UseKeyboardNavigationReturn {
  // Currently selected index (-1 means no selection)
  const selectedIndex = ref(-1)

  /**
   * Select next item
   * Moves selection down, respects bounds
   */
  const selectNext = (): void => {
    if (items.value.length === 0) {
      selectedIndex.value = -1
      return
    }

    selectedIndex.value = Math.min(selectedIndex.value + 1, items.value.length - 1)
  }

  /**
   * Select previous item
   * Moves selection up, respects bounds
   */
  const selectPrevious = (): void => {
    if (items.value.length === 0) {
      selectedIndex.value = -1
      return
    }

    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  }

  /**
   * Reset selection to no selection (-1)
   */
  const resetSelection = (): void => {
    selectedIndex.value = -1
  }

  /**
   * Get currently selected item
   * Returns undefined if no item is selected or index is out of bounds
   */
  const getSelectedItem = <U = T>(itemsList?: U[]): U | undefined => {
    const targetItems = itemsList || items.value
    if (selectedIndex.value >= 0 && selectedIndex.value < targetItems.length) {
      return targetItems[selectedIndex.value] as U
    }
    return undefined
  }

  // Watch items changes and reset selection if current selection becomes invalid
  watch(
    items,
    (newItems) => {
      if (selectedIndex.value >= newItems.length) {
        selectedIndex.value = -1
      }
    },
    { deep: true }
  )

  return {
    selectedIndex: readonly(selectedIndex),
    selectNext,
    selectPrevious,
    resetSelection,
    getSelectedItem
  }
}

/**
 * Enhanced keyboard navigation with additional features
 * Includes keyboard event handling and visual feedback
 */
export function useAdvancedKeyboardNavigation<T = any>(
  items: Ref<T[]> = ref([]),
  options: {
    enableWrapAround?: boolean
    enableHomeEnd?: boolean
    enablePageUpDown?: boolean
  } = {}
) {
  const baseNavigation = useKeyboardNavigation(items)
  const { enableWrapAround = false, enableHomeEnd = true, enablePageUpDown = false } = options

  /**
   * Enhanced select next with wrap around option
   */
  const selectNextEnhanced = (): void => {
    if (items.value.length === 0) {
      return
    }

    if (enableWrapAround && baseNavigation.selectedIndex.value === items.value.length - 1) {
      // Wrap to beginning
      baseNavigation.resetSelection()
    } else {
      baseNavigation.selectNext()
    }
  }

  /**
   * Enhanced select previous with wrap around option
   */
  const selectPreviousEnhanced = (): void => {
    if (items.value.length === 0) {
      return
    }

    if (enableWrapAround && baseNavigation.selectedIndex.value === -1) {
      // Wrap to end
      const selectedIndex = ref(items.value.length - 1)
      baseNavigation.selectedIndex = selectedIndex as any
    } else {
      baseNavigation.selectPrevious()
    }
  }

  /**
   * Jump to first item
   */
  const selectFirst = (): void => {
    if (items.value.length > 0) {
      const selectedIndex = ref(0)
      baseNavigation.selectedIndex = selectedIndex as any
    }
  }

  /**
   * Jump to last item
   */
  const selectLast = (): void => {
    if (items.value.length > 0) {
      const selectedIndex = ref(items.value.length - 1)
      baseNavigation.selectedIndex = selectedIndex as any
    }
  }

  /**
   * Page down (select item 5 positions down)
   */
  const selectPageDown = (): void => {
    if (items.value.length === 0) {
      return
    }

    const pageSize = 5
    const currentIndex = baseNavigation.selectedIndex.value
    const newIndex = Math.min(currentIndex + pageSize, items.value.length - 1)
    const selectedIndex = ref(newIndex)
    baseNavigation.selectedIndex = selectedIndex as any
  }

  /**
   * Page up (select item 5 positions up)
   */
  const selectPageUp = (): void => {
    if (items.value.length === 0) {
      return
    }

    const pageSize = 5
    const currentIndex = baseNavigation.selectedIndex.value
    const newIndex = Math.max(currentIndex - pageSize, -1)
    const selectedIndex = ref(newIndex)
    baseNavigation.selectedIndex = selectedIndex as any
  }

  /**
   * Handle keyboard events
   * Maps keyboard events to navigation actions
   */
  const handleKeyboardEvent = (event: KeyboardEvent): boolean => {
    let handled = false

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectNextEnhanced()
        handled = true
        break

      case 'ArrowUp':
        event.preventDefault()
        selectPreviousEnhanced()
        handled = true
        break

      case 'Home':
        if (enableHomeEnd) {
          event.preventDefault()
          selectFirst()
          handled = true
        }
        break

      case 'End':
        if (enableHomeEnd) {
          event.preventDefault()
          selectLast()
          handled = true
        }
        break

      case 'PageDown':
        if (enablePageUpDown) {
          event.preventDefault()
          selectPageDown()
          handled = true
        }
        break

      case 'PageUp':
        if (enablePageUpDown) {
          event.preventDefault()
          selectPageUp()
          handled = true
        }
        break
    }

    return handled
  }

  return {
    ...baseNavigation,
    selectNext: selectNextEnhanced,
    selectPrevious: selectPreviousEnhanced,
    selectFirst,
    selectLast,
    selectPageDown,
    selectPageUp,
    handleKeyboardEvent
  }
}

/**
 * Utility for managing visual selection indicators
 * Helps with styling selected items
 */
export function useNavigationStyling() {
  /**
   * Get CSS classes for item based on selection state
   */
  const getItemClasses = (index: number, selectedIndex: number): string[] => {
    const classes: string[] = []

    if (index === selectedIndex) {
      classes.push('selected', 'bg-blue-100', 'border-blue-300')
    } else {
      classes.push('hover:bg-gray-50')
    }

    return classes
  }

  /**
   * Get ARIA attributes for item based on selection state
   */
  const getItemAriaAttributes = (index: number, selectedIndex: number, itemId: string) => {
    return {
      'aria-selected': index === selectedIndex,
      'id': `${itemId}-${index}`,
      'role': 'option'
    }
  }

  /**
   * Scroll selected item into view
   */
  const scrollToSelected = (selectedIndex: number, containerId: string): void => {
    if (selectedIndex < 0) {
      return
    }

    const container = document.getElementById(containerId)
    const selectedElement = document.querySelector(`[data-index="${selectedIndex}"]`)

    if (container && selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }

  return {
    getItemClasses,
    getItemAriaAttributes,
    scrollToSelected
  }
}

/**
 * Hook for keyboard navigation analytics
 */
export function useNavigationAnalytics() {
  const keyPresses = ref<Record<string, number>>({})
  const navigationSessions = ref(0)

  const trackKeyPress = (key: string): void => {
    if (!keyPresses.value[key]) {
      keyPresses.value[key] = 0
    }
    keyPresses.value[key]++
  }

  const trackNavigationSession = (): void => {
    navigationSessions.value++
  }

  const getAnalytics = () => ({
    keyPresses: { ...keyPresses.value },
    navigationSessions: navigationSessions.value
  })

  const resetAnalytics = (): void => {
    keyPresses.value = {}
    navigationSessions.value = 0
  }

  return {
    trackKeyPress,
    trackNavigationSession,
    getAnalytics,
    resetAnalytics
  }
}
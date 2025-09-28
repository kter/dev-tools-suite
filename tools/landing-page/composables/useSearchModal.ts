/**
 * useSearchModal composable
 * Manages modal open/close state, focus handling
 * Based on research.md modal management decisions
 */

import { ref, readonly, nextTick, type Ref } from 'vue'
import type { UseSearchModalReturn } from '../types/components'

/**
 * Main useSearchModal composable
 * Handles search modal visibility and focus management
 */
export function useSearchModal(): UseSearchModalReturn {
  // Modal state
  const isOpen = ref(false)

  // Search input element ref
  const searchInput: Ref<HTMLInputElement | undefined> = ref()

  // Store reference to element that triggered search for focus return
  const triggerElement: Ref<HTMLElement | undefined> = ref()

  /**
   * Open search modal
   * Focuses search input and stores trigger element for focus return
   */
  const open = async (): Promise<void> => {
    // Store current active element for focus return
    if (document.activeElement && document.activeElement !== document.body) {
      triggerElement.value = document.activeElement as HTMLElement
    }

    isOpen.value = true

    // Focus search input on next tick to ensure DOM is updated
    await nextTick()
    if (searchInput.value) {
      searchInput.value.focus()
    }
  }

  /**
   * Close search modal
   * Hides modal and optionally returns focus to trigger element
   */
  const close = (): void => {
    isOpen.value = false
  }

  /**
   * Return focus to the element that triggered the search
   * Called after modal is closed to maintain proper focus flow
   */
  const returnFocus = (): void => {
    if (triggerElement.value) {
      try {
        triggerElement.value.focus()
      } catch (error) {
        // Element might not be focusable or might have been removed
        // Fallback to body focus
        document.body.focus()
      }
      triggerElement.value = undefined
    }
  }

  return {
    isOpen: readonly(isOpen),
    searchInput,
    open,
    close,
    returnFocus
  }
}

/**
 * Extended search modal composable with additional state management
 * Includes features like escape key handling and click outside detection
 */
export function useAdvancedSearchModal(): UseSearchModalReturn & {
  handleEscape: () => void
  handleClickOutside: (event: Event) => void
  isSearchInputFocused: Ref<boolean>
} {
  const baseModal = useSearchModal()
  const isSearchInputFocused = ref(false)

  /**
   * Handle escape key press
   * Closes modal and returns focus
   */
  const handleEscape = (): void => {
    if (baseModal.isOpen.value) {
      baseModal.close()
      baseModal.returnFocus()
    }
  }

  /**
   * Handle click outside modal
   * Closes modal if click is outside the modal content
   */
  const handleClickOutside = (event: Event): void => {
    if (!baseModal.isOpen.value) {
      return
    }

    const target = event.target as HTMLElement
    if (!target) {
      return
    }

    // Check if click is outside modal content
    const modalContent = document.querySelector('[data-testid="search-modal"]')
    if (modalContent && !modalContent.contains(target)) {
      baseModal.close()
      baseModal.returnFocus()
    }
  }

  // Enhanced open function with focus tracking
  const enhancedOpen = async (): Promise<void> => {
    await baseModal.open()
    isSearchInputFocused.value = true
  }

  // Enhanced close function with focus tracking
  const enhancedClose = (): void => {
    baseModal.close()
    isSearchInputFocused.value = false
  }

  return {
    ...baseModal,
    open: enhancedOpen,
    close: enhancedClose,
    handleEscape,
    handleClickOutside,
    isSearchInputFocused: readonly(isSearchInputFocused)
  }
}

/**
 * Utility for managing modal z-index and preventing body scroll
 * Optional enhancement for better UX
 */
export function useModalUtils() {
  const originalBodyOverflow = ref('')

  /**
   * Prevent body scroll when modal is open
   */
  const preventBodyScroll = (): void => {
    originalBodyOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  /**
   * Restore body scroll when modal is closed
   */
  const restoreBodyScroll = (): void => {
    document.body.style.overflow = originalBodyOverflow.value
  }

  /**
   * Get appropriate z-index for modal
   */
  const getModalZIndex = (): number => {
    // High z-index to ensure modal appears above other content
    return 9999
  }

  return {
    preventBodyScroll,
    restoreBodyScroll,
    getModalZIndex
  }
}

/**
 * Hook for tracking modal interaction analytics (if needed)
 */
export function useSearchModalAnalytics() {
  const searchActivations = ref(0)
  const searchClosures = ref(0)
  const averageSessionLength = ref(0)
  const sessionStartTime = ref<number | null>(null)

  const trackModalOpen = (): void => {
    searchActivations.value++
    sessionStartTime.value = Date.now()
  }

  const trackModalClose = (): void => {
    searchClosures.value++

    if (sessionStartTime.value) {
      const sessionDuration = Date.now() - sessionStartTime.value
      // Simple running average calculation
      const totalSessions = searchClosures.value
      averageSessionLength.value =
        (averageSessionLength.value * (totalSessions - 1) + sessionDuration) / totalSessions
      sessionStartTime.value = null
    }
  }

  const getAnalytics = () => ({
    activations: searchActivations.value,
    closures: searchClosures.value,
    averageSessionLength: averageSessionLength.value
  })

  return {
    trackModalOpen,
    trackModalClose,
    getAnalytics
  }
}
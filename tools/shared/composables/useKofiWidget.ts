/**
 * Ko-fi Widget Composable
 * Provides Ko-fi donation widget functionality across all dev tools
 */

import { ref, readonly, type Ref } from 'vue'
import type { KofiWidgetConfig, KofiWidgetState } from '../types/kofi'

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (accountId: string, config: any) => void
    }
    useKofiWidget?: () => any
  }
}

export function useKofiWidget() {
  // Reactive state for widget status
  const state: Ref<KofiWidgetState> = ref({
    isLoaded: false,
    isVisible: false,
    loadError: false
  })

  let config: KofiWidgetConfig | null = null

  /**
   * Initialize Ko-fi widget with configuration
   */
  function init(widgetConfig: KofiWidgetConfig): void {
    config = widgetConfig
    // Reset state when initializing
    state.value = {
      isLoaded: false,
      isVisible: false,
      loadError: false
    }
  }

  /**
   * Load Ko-fi script and initialize widget
   */
  async function load(): Promise<void> {
    if (!config) {
      console.warn('Ko-fi widget not initialized. Call init() first.')
      return
    }

    try {
      // Check if Ko-fi script is already loaded
      if (window.kofiWidgetOverlay) {
        initializeWidget()
        return
      }

      // Create and load Ko-fi script
      const script = document.createElement('script')
      script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
      script.async = true

      // Set up success and error handlers
      script.onload = () => {
        initializeWidget()
      }

      script.onerror = () => {
        handleLoadError()
      }

      // Add script to document head
      document.head.appendChild(script)

      // Set timeout for loading (5 seconds)
      setTimeout(() => {
        if (!state.value.isLoaded) {
          handleLoadError()
        }
      }, 5000)

    } catch (error) {
      console.error('Failed to load Ko-fi widget:', error)
      handleLoadError()
    }
  }

  /**
   * Initialize the widget once script is loaded
   */
  function initializeWidget(): void {
    if (!config || !window.kofiWidgetOverlay) {
      handleLoadError()
      return
    }

    try {
      // Create Ko-fi widget configuration
      const kofiConfig = {
        'type': config.type,
        'floating-chat.donateButton.text': config.buttonText,
        'floating-chat.donateButton.background-color': config.backgroundColor,
        'floating-chat.donateButton.text-color': config.textColor
      }

      // Initialize Ko-fi widget
      window.kofiWidgetOverlay.draw(config.accountId, kofiConfig)

      // Update state
      state.value = {
        isLoaded: true,
        isVisible: true,
        loadError: false
      }

    } catch (error) {
      console.error('Failed to initialize Ko-fi widget:', error)
      handleLoadError()
    }
  }

  /**
   * Handle loading errors by hiding widget completely
   */
  function handleLoadError(): void {
    state.value = {
      isLoaded: false,
      isVisible: false,
      loadError: true
    }
    // Silent failure - no error messages to user
  }

  /**
   * Manually hide widget
   */
  function hide(): void {
    state.value.isVisible = false
    // Could implement hiding logic here if Ko-fi provides an API
  }

  /**
   * Manually show widget (if loaded successfully)
   */
  function show(): void {
    if (state.value.isLoaded && !state.value.loadError) {
      state.value.isVisible = true
    }
  }

  // Expose composable for global testing access
  if (typeof window !== 'undefined') {
    window.useKofiWidget = () => ({
      init,
      state: readonly(state),
      load,
      hide,
      show
    })
  }

  return {
    init,
    state: readonly(state),
    load,
    hide,
    show
  }
}
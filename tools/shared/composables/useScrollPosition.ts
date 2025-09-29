import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import {
  detectScrollContainer,
  calculateScrollPercentage,
  isPageContentShort,
  throttleScrollEvent
} from '../utils/scroll-detection';

interface ScrollPositionReturn {
  scrollPercentage: Ref<number>;
  isAtThreshold: Ref<boolean>;
  isShortPage: Ref<boolean>;
  scrollContainer: Ref<HTMLElement | null>;
  cleanup: () => void;
}

/**
 * Enhanced scroll position composable with auto-detection
 * Automatically detects the appropriate scroll container and provides
 * reactive scroll state for the Ko-fi button component.
 *
 * @param threshold - Scroll percentage threshold (default: 70)
 * @returns ScrollPositionReturn - Reactive scroll state
 */
export function useScrollPosition(threshold: number = 70): ScrollPositionReturn {
  const scrollPercentage = ref(0);
  const isAtThreshold = ref(false);
  const isShortPage = ref(false);
  const scrollContainer = ref<HTMLElement | null>(null);

  let throttledHandler: (() => void) | null = null;
  let resizeHandler: (() => void) | null = null;

  const calculateScrollState = (): void => {
    const container = scrollContainer.value;
    if (!container) {
      return;
    }

    // Check if page is too short to scroll
    const isShort = isPageContentShort(container);
    isShortPage.value = isShort;

    if (isShort) {
      scrollPercentage.value = 0;
      isAtThreshold.value = false;
      return;
    }

    // Calculate scroll percentage
    const percentage = calculateScrollPercentage(container);
    scrollPercentage.value = percentage;

    // Check if at or beyond threshold
    isAtThreshold.value = percentage >= threshold;
  };

  const handleResize = (): void => {
    // Re-detect scroll container on resize as layout may have changed
    const newContainer = detectScrollContainer();
    if (newContainer !== scrollContainer.value) {
      // Remove old listeners
      if (scrollContainer.value && throttledHandler) {
        if (scrollContainer.value === document.body) {
          window.removeEventListener('scroll', throttledHandler);
        } else {
          scrollContainer.value.removeEventListener('scroll', throttledHandler);
        }
      }

      // Update container reference
      scrollContainer.value = newContainer;

      // Add new listeners
      if (throttledHandler) {
        if (newContainer === document.body) {
          window.addEventListener('scroll', throttledHandler, { passive: true });
        } else {
          newContainer.addEventListener('scroll', throttledHandler, { passive: true });
        }
      }
    }

    // Recalculate scroll state
    calculateScrollState();
  };

  const cleanup = (): void => {
    if (scrollContainer.value && throttledHandler) {
      if (scrollContainer.value === document.body) {
        window.removeEventListener('scroll', throttledHandler);
      } else {
        scrollContainer.value.removeEventListener('scroll', throttledHandler);
      }
    }

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', resizeHandler);
    }

    throttledHandler = null;
    resizeHandler = null;
  };

  const initializeScrollDetection = (): void => {
    try {
      // Auto-detect the appropriate scroll container
      scrollContainer.value = detectScrollContainer();

      // Create throttled scroll handler
      throttledHandler = throttleScrollEvent(calculateScrollState, 100);

      // Create throttled resize handler
      resizeHandler = throttleScrollEvent(handleResize, 100);

      // Initial calculation
      calculateScrollState();

      // Add event listeners
      if (scrollContainer.value === document.body) {
        window.addEventListener('scroll', throttledHandler, { passive: true });
      } else {
        scrollContainer.value.addEventListener('scroll', throttledHandler, { passive: true });
      }

      window.addEventListener('resize', resizeHandler);
      window.addEventListener('orientationchange', resizeHandler);
    } catch (error) {
      console.warn('Error initializing scroll detection:', error);

      // Fallback to basic document body detection
      scrollContainer.value = document.body;
      isShortPage.value = document.documentElement.scrollHeight <= window.innerHeight;
      scrollPercentage.value = 0;
      isAtThreshold.value = false;
    }
  };

  onMounted(() => {
    // Use nextTick equivalent to ensure DOM is ready
    setTimeout(initializeScrollDetection, 0);
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    scrollPercentage,
    isAtThreshold,
    isShortPage,
    scrollContainer,
    cleanup
  };
}
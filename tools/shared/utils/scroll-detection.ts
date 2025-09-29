/**
 * Scroll Container Auto-Detection Utilities
 *
 * Provides automatic detection of appropriate scroll containers
 * to handle different tool layouts across the dev-tools-suite.
 */

export interface ScrollDetectionResult {
  container: HTMLElement;
  isShortPage: boolean;
  scrollableHeight: number;
}

/**
 * Auto-detect the appropriate scroll container for the current page layout
 * @returns HTMLElement - The detected scroll container
 */
export function detectScrollContainer(): HTMLElement {
  // Check for explicitly scrollable containers first
  const scrollableContainers = document.querySelectorAll([
    'main[style*="overflow"]',
    'section[style*="overflow"]',
    'div[style*="overflow"]',
    '.scroll-container',
    '[data-scroll-container]'
  ].join(','));

  for (const container of scrollableContainers) {
    const element = container as HTMLElement;
    const styles = window.getComputedStyle(element);

    // Check if container is actually scrollable
    if (
      (styles.overflowY === 'auto' || styles.overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight
    ) {
      return element;
    }
  }

  // Check for semantic main content areas
  const mainElements = [
    document.querySelector('main'),
    document.querySelector('#main'),
    document.querySelector('.main-content'),
    document.querySelector('[role="main"]')
  ].filter(Boolean) as HTMLElement[];

  for (const main of mainElements) {
    if (main.scrollHeight > main.clientHeight) {
      return main;
    }
  }

  // Check if document body is scrollable
  if (document.documentElement.scrollHeight > window.innerHeight) {
    return document.body;
  }

  // Fallback to document body
  return document.body;
}

/**
 * Calculate scroll percentage for a given container
 * @param container - The scroll container element
 * @returns number - Scroll percentage (0-100)
 */
export function calculateScrollPercentage(container: HTMLElement): number {
  if (!container) {
    return 0;
  }

  try {
    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (container === document.body) {
      // For document body, use window scroll properties
      scrollTop = window.scrollY || window.pageYOffset;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    } else {
      // For other containers, use element properties
      scrollTop = container.scrollTop;
      scrollHeight = container.scrollHeight;
      clientHeight = container.clientHeight;
    }

    const scrollableHeight = scrollHeight - clientHeight;

    // Handle cases where there's no scrollable content
    if (scrollableHeight <= 0) {
      return 0;
    }

    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));
    return percentage;
  } catch (error) {
    console.warn('Error calculating scroll percentage:', error);
    return 0;
  }
}

/**
 * Check if page content is shorter than the viewport
 * @param container - The scroll container element
 * @returns boolean - True if page is shorter than viewport
 */
export function isPageContentShort(container: HTMLElement): boolean {
  if (!container) {
    return true;
  }

  try {
    if (container === document.body) {
      return document.documentElement.scrollHeight <= window.innerHeight;
    } else {
      return container.scrollHeight <= container.clientHeight;
    }
  } catch (error) {
    console.warn('Error checking page content height:', error);
    return true;
  }
}

/**
 * Throttle scroll event handler to improve performance
 * @param handler - The scroll event handler function
 * @param delay - Throttle delay in milliseconds (default: 100)
 * @returns Function - Throttled handler function
 */
export function throttleScrollEvent(
  handler: () => void,
  delay: number = 100
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return function throttledHandler() {
    const currentTime = Date.now();

    if (currentTime - lastExecTime >= delay) {
      // Execute immediately if enough time has passed
      handler();
      lastExecTime = currentTime;
    } else {
      // Schedule execution for later
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        handler();
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Get comprehensive scroll detection information
 * @param threshold - Scroll percentage threshold (default: 70)
 * @returns ScrollDetectionResult - Complete scroll detection data
 */
export function getScrollDetectionInfo(threshold: number = 70): ScrollDetectionResult {
  const container = detectScrollContainer();
  const isShort = isPageContentShort(container);
  const percentage = calculateScrollPercentage(container);

  let scrollableHeight: number;

  if (container === document.body) {
    scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  } else {
    scrollableHeight = container.scrollHeight - container.clientHeight;
  }

  return {
    container,
    isShortPage: isShort,
    scrollableHeight: Math.max(0, scrollableHeight)
  };
}

/**
 * Expose utilities to global scope for testing
 */
if (typeof window !== 'undefined') {
  (window as any).detectScrollContainer = detectScrollContainer;
  (window as any).calculateScrollPercentage = calculateScrollPercentage;
  (window as any).isPageContentShort = isPageContentShort;
  (window as any).throttleScrollEvent = throttleScrollEvent;
}
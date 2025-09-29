/**
 * Component Interface Contract: Universal Support Me Button
 *
 * This contract defines the interface for the KofiButton component
 * that will be shared across all 23 developer tools.
 */

export interface KofiButtonProps {
  /** Ko-fi username for donation link (always 'kterr') */
  kofiUsername: string;

  /** Scroll percentage threshold for visibility toggle (default: 70) */
  threshold?: number;

  /** Animation duration in milliseconds (default: 300) */
  animationDuration?: number;

  /** Button position on screen (default: 'bottom-left') */
  position?: 'bottom-left' | 'bottom-right';
}

export interface KofiButtonEmits {
  /** Emitted when button becomes visible */
  'kofi:shown': [];

  /** Emitted when button becomes hidden */
  'kofi:hidden': [];

  /** Emitted when button is clicked */
  'kofi:clicked': [];
}

export interface ScrollPositionComposable {
  /** Current scroll percentage (0-100) */
  scrollPercentage: Ref<number>;

  /** Whether scroll position is at or beyond threshold */
  isAtThreshold: Ref<boolean>;

  /** Whether page content is shorter than viewport */
  isShortPage: Ref<boolean>;

  /** Auto-detected scroll container element */
  scrollContainer: Ref<HTMLElement | null>;
}

export interface ScrollDetectionUtils {
  /** Auto-detect appropriate scroll container for the current page layout */
  detectScrollContainer(): HTMLElement;

  /** Calculate scroll percentage for given container */
  calculateScrollPercentage(container: HTMLElement): number;

  /** Check if page content is shorter than viewport */
  isPageContentShort(container: HTMLElement): boolean;

  /** Throttle scroll event handler */
  throttleScrollEvent(handler: () => void, delay: number): () => void;
}

/**
 * Usage Contract for Tools Integration
 *
 * Each tool must integrate the KofiButton component as follows:
 *
 * 1. Import: import KofiButton from '../shared/components/KofiButton.vue'
 * 2. Use in template: <KofiButton kofi-username="kterr" />
 * 3. No additional configuration required - component auto-detects layout
 * 4. Component handles all scroll tracking and Ko-fi integration
 */

/**
 * Test Contract
 *
 * Each tool must have an E2E test file that validates:
 * - Button visible on page load
 * - Button hidden when scrolled to 70%+
 * - Button visible again when scrolled back up
 * - Button always visible on short pages
 * - Ko-fi link opens correctly on click
 * - Accessibility attributes are correct
 * - Reduced motion preference is respected
 */
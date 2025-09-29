/**
 * Universal Support Me Button Component Types
 *
 * TypeScript interfaces for the shared KofiButton component
 * used across all 23 developer tools.
 */

import type { Ref } from 'vue';

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
 * Button State Management
 */
export interface KofiButtonState {
  /** Current visibility state (computed from scroll position) */
  isVisible: boolean;

  /** Whether scroll position is at or beyond 70% threshold */
  isAtThreshold: boolean;

  /** Whether page content is shorter than viewport height */
  isShortPage: boolean;

  /** CSS transition duration in milliseconds (default: 300) */
  animationDuration: number;

  /** Scroll percentage threshold for state change (default: 70) */
  threshold: number;

  /** Button positioning (default: 'bottom-left') */
  position: 'bottom-left' | 'bottom-right';
}

/**
 * Scroll Position Tracking
 */
export interface ScrollPosition {
  /** Current vertical scroll position in pixels */
  scrollTop: number;

  /** Total scrollable height of the detected container */
  scrollHeight: number;

  /** Viewport height of the detected container */
  clientHeight: number;

  /** Calculated scroll percentage (0-100) */
  scrollPercentage: number;

  /** Auto-detected scroll container (document.body or main content) */
  container: HTMLElement;

  /** Whether scroll events are currently throttled */
  isThrottled: boolean;
}

/**
 * Tool Integration Configuration
 */
export interface ToolIntegration {
  /** Name of the tool (e.g., 'hash-generator', 'qr-generator') */
  toolName: string;

  /** Ko-fi username (always 'kterr') */
  kofiUsername: string;

  /** Whether tool has non-standard layout requiring special handling */
  hasCustomLayout: boolean;

  /** Auto-detected or manually specified scroll container */
  scrollContainer: HTMLElement | null;

  /** Whether E2E tests are implemented for this tool */
  testCoverage: boolean;
}
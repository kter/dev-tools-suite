/**
 * Component Interface Contract for Ko-fi Support Button
 * This defines the public API for the KofiButton Vue component
 */

export interface KofiButtonProps {
  /**
   * Ko-fi account username
   * @required
   */
  kofiUsername: string;

  /**
   * Scroll percentage threshold to show button (0-100)
   * @default 70
   */
  threshold?: number;

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;

  /**
   * Button position on screen
   * @default 'bottom-left'
   */
  position?: 'bottom-left' | 'bottom-right';
}

export interface KofiButtonEmits {
  /**
   * Emitted when button becomes visible
   */
  (event: 'shown'): void;

  /**
   * Emitted when button becomes hidden
   */
  (event: 'hidden'): void;

  /**
   * Emitted when button is clicked
   */
  (event: 'clicked'): void;
}

export interface ScrollPositionComposable {
  /**
   * Current scroll percentage (0-100)
   */
  scrollPercentage: Ref<number>;

  /**
   * Whether scroll position is at or beyond threshold
   */
  isAtThreshold: Ref<boolean>;

  /**
   * Whether page content is shorter than viewport
   */
  isShortPage: Ref<boolean>;

  /**
   * Cleanup function to remove event listeners
   */
  cleanup: () => void;
}

export interface KofiButtonState {
  /**
   * Whether button is currently visible
   */
  isVisible: boolean;

  /**
   * Current scroll percentage
   */
  scrollPercentage: number;

  /**
   * Whether page is too short to scroll
   */
  isShortPage: boolean;
}
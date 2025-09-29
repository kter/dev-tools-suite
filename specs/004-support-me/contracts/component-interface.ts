/**
 * Component Interface Contract: Support Me Button Visibility Reversal
 *
 * This interface defines the expected behavior of the KofiButton component
 * with reversed visibility logic (show by default, hide on scroll).
 */

export interface KofiButtonProps {
  /** Ko-fi account username (required) */
  kofiUsername: string;
  /** Scroll threshold percentage for hiding button (default: 70) */
  threshold?: number;
}

export interface KofiButtonState {
  /** Current visibility state - REVERSED logic: visible when scroll < 70% */
  isVisible: boolean;
  /** Current scroll position percentage (0-100) */
  scrollPercentage: number;
  /** Whether scroll has reached threshold (≥70%) */
  isAtThreshold: boolean;
  /** Whether page content is shorter than viewport */
  isShortPage: boolean;
}

export interface ScrollPositionComposable {
  /** Current scroll percentage (0-100) */
  scrollPercentage: Ref<number>;
  /** Whether at or past the scroll threshold */
  isAtThreshold: Ref<boolean>;
  /** Whether page content is too short to scroll */
  isShortPage: Ref<boolean>;
  /** Manual cleanup function for event listeners */
  cleanup: () => void;
}

/**
 * Behavior Contract: KofiButton Component
 */
export interface KofiButtonBehavior {
  /**
   * Initial State: Button must be visible when page loads
   * - isVisible = true
   * - scrollPercentage = 0
   * - isAtThreshold = false
   */
  initialVisibility(): Promise<boolean>;

  /**
   * Scroll Behavior: Button must hide when scrolling to 70% threshold
   * - When scrollPercentage ≥ 70%: isVisible = false
   * - Fade out animation must be 300ms
   * - ARIA attributes must update (aria-hidden="true", tabindex="-1")
   */
  hideOnScroll(scrollPercentage: number): Promise<void>;

  /**
   * Scroll Back Behavior: Button must show when scrolling back above threshold
   * - When scrollPercentage < 70%: isVisible = true
   * - Fade in animation must be 300ms
   * - ARIA attributes must update (aria-hidden="false", tabindex="0")
   */
  showOnScrollBack(scrollPercentage: number): Promise<void>;

  /**
   * Short Page Behavior: Button must remain always visible
   * - When page height ≤ viewport height: isVisible = true (forced)
   * - No threshold checking applied
   * - Accessibility attributes remain active
   */
  handleShortPage(): Promise<boolean>;

  /**
   * Click Behavior: Must open Ko-fi widget/page
   * - Opens Ko-fi support page for specified username
   * - May open in new tab/window or overlay
   * - Click event must not be prevented by visibility state
   */
  handleClick(): Promise<void>;

  /**
   * Accessibility Behavior: Must respect user preferences
   * - When prefers-reduced-motion: no animations
   * - ARIA attributes must reflect current state
   * - Keyboard navigation must work when visible
   */
  handleAccessibility(): Promise<void>;

  /**
   * Resize Behavior: Must recalculate on window resize
   * - Threshold calculations must update
   * - Visibility state must re-evaluate
   * - Animation state must be preserved
   */
  handleResize(): Promise<void>;
}

/**
 * Test Scenarios Contract
 */
export interface TestScenarios {
  /** Page load shows button immediately */
  testInitialVisibility: () => Promise<void>;

  /** Scrolling to 70% hides button with animation */
  testHideOnScroll: () => Promise<void>;

  /** Scrolling back above 70% shows button with animation */
  testShowOnScrollBack: () => Promise<void>;

  /** Short pages keep button always visible */
  testShortPageBehavior: () => Promise<void>;

  /** Button click opens Ko-fi page */
  testKofiIntegration: () => Promise<void>;

  /** Accessibility attributes update correctly */
  testAccessibilityAttributes: () => Promise<void>;

  /** Reduced motion preference is respected */
  testReducedMotion: () => Promise<void>;

  /** Window resize recalculates behavior */
  testResizeHandling: () => Promise<void>;

  /** Button positioned at bottom-left (20px margins) */
  testPositioning: () => Promise<void>;

  /** Animation duration is exactly 300ms */
  testAnimationTiming: () => Promise<void>;
}

/**
 * Performance Requirements
 */
export interface PerformanceContract {
  /** Scroll handling must maintain 60fps */
  scrollPerformance: {
    maxFrameTime: 16.67; // milliseconds
    throttleInterval: 100; // milliseconds
  };

  /** Animation must be smooth and hardware-accelerated */
  animationPerformance: {
    duration: 300; // milliseconds
    easing: 'ease-in-out';
    properties: ['opacity', 'transform']; // CSS properties that can be accelerated
  };

  /** Memory usage must be minimal */
  memoryConstraints: {
    noMemoryLeaks: true;
    cleanupOnUnmount: true;
  };
}

export default {
  KofiButtonProps,
  KofiButtonState,
  ScrollPositionComposable,
  KofiButtonBehavior,
  TestScenarios,
  PerformanceContract
};
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useScrollPosition } from '../composables/useScrollPosition';

describe('useScrollPosition Composable', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    // Reset window properties
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    // Clear all timers
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
    vi.useRealTimers();
  });

  it('should return initial values', () => {
    const { scrollPercentage, isAtThreshold, isShortPage } = useScrollPosition(70);

    expect(scrollPercentage.value).toBe(0);
    expect(isAtThreshold.value).toBe(false);
    expect(isShortPage.value).toBe(false);
  });

  it('should calculate scroll percentage correctly', () => {
    const { scrollPercentage } = useScrollPosition(70);

    // Simulate scrolling to 50% of scrollable area
    window.scrollY = 600; // (2000 - 800) * 0.5
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();

    expect(scrollPercentage.value).toBeCloseTo(50, 0);
  });

  it('should detect when at threshold', () => {
    const { isAtThreshold } = useScrollPosition(70);

    // Scroll to 70%
    window.scrollY = 840; // (2000 - 800) * 0.7
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();

    expect(isAtThreshold.value).toBe(true);
  });

  it('should detect when below threshold', () => {
    const { isAtThreshold } = useScrollPosition(70);

    // First go above threshold
    window.scrollY = 900;
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();
    expect(isAtThreshold.value).toBe(true);

    // Then go below
    window.scrollY = 500;
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();
    expect(isAtThreshold.value).toBe(false);
  });

  it('should detect short pages', () => {
    // Make page shorter than viewport
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 700, writable: true });

    const { isShortPage } = useScrollPosition(70);

    expect(isShortPage.value).toBe(true);
  });

  it('should handle zero scrollable height', () => {
    // Page exactly fits viewport
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, writable: true });

    const { scrollPercentage, isShortPage } = useScrollPosition(70);

    expect(scrollPercentage.value).toBe(0);
    expect(isShortPage.value).toBe(true);
  });

  it('should throttle scroll events', () => {
    const { scrollPercentage } = useScrollPosition(70);

    // Fire multiple scroll events rapidly
    for (let i = 1; i <= 10; i++) {
      window.scrollY = i * 100;
      window.dispatchEvent(new Event('scroll'));
    }

    // Should not update immediately
    expect(scrollPercentage.value).toBe(0);

    // After throttle delay
    vi.advanceTimersByTime(100);

    // Should have the last value
    expect(scrollPercentage.value).toBeGreaterThan(0);
  });

  it('should handle window resize events', () => {
    const { isShortPage } = useScrollPosition(70);

    expect(isShortPage.value).toBe(false);

    // Resize to make page short
    Object.defineProperty(window, 'innerHeight', { value: 2100, writable: true });
    window.dispatchEvent(new Event('resize'));

    expect(isShortPage.value).toBe(true);
  });

  it('should recalculate on resize', () => {
    const { scrollPercentage } = useScrollPosition(70);

    // Set initial scroll
    window.scrollY = 600;
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();

    const initialPercentage = scrollPercentage.value;

    // Resize window
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
    window.dispatchEvent(new Event('resize'));

    // Percentage should change due to different scrollable height
    expect(scrollPercentage.value).not.toBe(initialPercentage);
  });

  it('should provide cleanup function', () => {
    const result = useScrollPosition(70);
    cleanup = result.cleanup;

    const removeScrollSpy = vi.spyOn(window, 'removeEventListener');
    const removeResizeSpy = vi.spyOn(window, 'removeEventListener');

    cleanup();

    expect(removeScrollSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeResizeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should handle different threshold values', () => {
    const { isAtThreshold: isAt50 } = useScrollPosition(50);
    const { isAtThreshold: isAt90 } = useScrollPosition(90);

    // Scroll to 60%
    window.scrollY = 720; // (2000 - 800) * 0.6
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();

    expect(isAt50.value).toBe(true);  // Above 50%
    expect(isAt90.value).toBe(false); // Below 90%
  });

  it('should clamp scroll percentage between 0 and 100', () => {
    const { scrollPercentage } = useScrollPosition(70);

    // Try to scroll beyond maximum
    window.scrollY = 5000;
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();

    expect(scrollPercentage.value).toBe(100);

    // Try negative scroll (shouldn't happen but test for safety)
    window.scrollY = -100;
    window.dispatchEvent(new Event('scroll'));
    vi.runAllTimers();

    expect(scrollPercentage.value).toBe(0);
  });

  it('should handle mobile orientation change', () => {
    const { scrollPercentage } = useScrollPosition(70);

    // Simulate orientation change
    Object.defineProperty(window, 'innerHeight', { value: 1200, writable: true });
    window.dispatchEvent(new Event('orientationchange'));

    // Should recalculate
    expect(scrollPercentage.value).toBeDefined();
  });

  it('should use passive event listeners for performance', () => {
    const addEventSpy = vi.spyOn(window, 'addEventListener');

    useScrollPosition(70);

    // Check that scroll listener is passive
    expect(addEventSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ passive: true })
    );
  });
});
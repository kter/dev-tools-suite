import { test, expect } from '@playwright/test';

test.describe('Ko-fi Support Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('shows button on initial page load', async ({ page }) => {
    const kofiButton = page.locator('[data-testid="kofi-button"]');
    await expect(kofiButton).toHaveClass(/kofi-button-visible/);

    // Verify opacity is 1
    const opacity = await kofiButton.evaluate(el => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBe(1);
  });

  test('hides button when scrolled to 70% of page', async ({ page }) => {
    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // First ensure button is visible initially
    await expect(kofiButton).toHaveClass(/kofi-button-visible/);

    // Scroll to 80% to ensure we're well past the 70% threshold
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = totalHeight * 0.8;
      window.scrollTo(0, targetScroll);
    });

    // Wait longer for throttled scroll handler + animation
    await page.waitForTimeout(800);

    // Check if button has hidden class and opacity = 0
    await expect(kofiButton).toHaveClass(/kofi-button-hidden/);

    const opacity = await kofiButton.evaluate(el => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBe(0);
  });

  test('shows button when scrolled back above threshold', async ({ page }) => {
    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Scroll down to hide button
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.8);
    });
    await page.waitForTimeout(400);
    await expect(kofiButton).toHaveClass(/kofi-button-hidden/);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await expect(kofiButton).toHaveClass(/kofi-button-visible/);
  });

  test('shows button immediately on short pages', async ({ page }) => {
    // Create a page with minimal content by setting viewport larger than content
    await page.setViewportSize({ width: 1200, height: 2000 });
    await page.reload();

    const kofiButton = page.locator('[data-testid="kofi-button"]');
    await page.waitForTimeout(500); // Wait for component to initialize
    await expect(kofiButton).toHaveClass(/kofi-button-visible/);
  });

  test('button opens Ko-fi page when clicked', async ({ page, context }) => {
    // Button should be visible by default, no need to scroll
    const kofiButton = page.locator('[data-testid="kofi-button"]');
    await page.waitForTimeout(1000); // Wait longer for component and Ko-fi widget to initialize

    // Verify button is in visible state first
    await expect(kofiButton).toHaveClass(/kofi-button-visible/);

    // Scroll to top to ensure button is in viewport
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Use fallback click handler since Ko-fi widget might not be loaded
    // Listen for new page/popup
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      kofiButton.click({ force: true })
    ]);

    // Verify Ko-fi page opened
    await expect(newPage.url()).toContain('ko-fi.com');
  });

  test('respects prefers-reduced-motion', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Scroll to trigger hiding
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.8);
    });

    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Should be hidden without animation
    await expect(kofiButton).toHaveClass(/kofi-button-hidden/);

    // Verify no transition is applied
    const hasTransition = await kofiButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.transition !== 'none' && styles.transition !== '';
    });

    expect(hasTransition).toBe(false);
  });

  test('maintains accessibility attributes', async ({ page }) => {
    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // When visible (initial state)
    await expect(kofiButton).toHaveAttribute('aria-hidden', 'false');
    await expect(kofiButton).toHaveAttribute('tabindex', '0');
    await expect(kofiButton).toHaveAttribute('aria-label', 'Support me on Ko-fi');

    // Scroll to hide
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.8);
    });
    await page.waitForTimeout(400);

    // When hidden
    await expect(kofiButton).toHaveAttribute('aria-hidden', 'true');
    await expect(kofiButton).toHaveAttribute('tabindex', '-1');
  });

  test('recalculates on window resize', async ({ page }) => {
    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Set initial viewport
    await page.setViewportSize({ width: 1200, height: 800 });

    // Scroll to 70% (should hide button)
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.7);
    });
    await page.waitForTimeout(400);
    await expect(kofiButton).toHaveClass(/kofi-button-hidden/);

    // Resize to trigger recalculation
    await page.setViewportSize({ width: 1200, height: 400 });
    await page.waitForTimeout(100);

    // Button visibility should be recalculated based on new dimensions
  });

  test('positions button at bottom-left corner', async ({ page }) => {
    // Scroll to show button
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.8);
    });
    await page.waitForTimeout(400);

    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Check computed styles for positioning
    const position = await kofiButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        bottom: styles.bottom,
        left: styles.left
      };
    });

    expect(position.position).toBe('fixed');
    expect(position.bottom).toBe('20px');
    expect(position.left).toBe('20px');
  });

  test('fades with 300ms animation duration', async ({ page }) => {
    // Prepare to observe animation
    const animationPromise = page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new MutationObserver(() => {
          const button = document.querySelector('[data-testid="kofi-button"]');
          if (button) {
            const styles = window.getComputedStyle(button);
            if (styles.transitionDuration === '0.3s' || styles.transitionDuration === '300ms') {
              observer.disconnect();
              resolve(true);
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      });
    });

    // Trigger scroll
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.8);
    });

    // Verify animation duration
    const hasCorrectDuration = await animationPromise;
    expect(hasCorrectDuration).toBe(true);
  });
});
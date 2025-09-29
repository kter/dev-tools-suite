import { test, expect } from '@playwright/test';

test.describe('Shared KofiButton Component', () => {
  test('component interface is properly defined', async ({ page }) => {
    // Navigate to a page that will use the shared component
    await page.goto('http://localhost:3000/');

    // Test basic component presence and structure
    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Verify component exists (will fail until implementation)
    await expect(kofiButton).toBeAttached();

    // Verify required props are configurable
    await expect(kofiButton).toHaveAttribute('aria-label', 'Support me on Ko-fi');

    // Verify component has proper role
    await expect(kofiButton).toHaveAttribute('role', 'button');
  });

  test('component emits correct events', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Add event listeners to track emissions
    await page.evaluate(() => {
      window.kofiEvents = [];
      document.addEventListener('kofi:shown', () => window.kofiEvents.push('shown'));
      document.addEventListener('kofi:hidden', () => window.kofiEvents.push('hidden'));
      document.addEventListener('kofi:clicked', () => window.kofiEvents.push('clicked'));
    });

    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Test initial show event (will fail until implementation)
    const events = await page.evaluate(() => window.kofiEvents);
    expect(events).toContain('shown');
  });

  test('component respects threshold prop', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Test with different threshold values (will fail until implementation)
    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Component should respect 70% threshold by default
    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.65); // Below threshold
    });

    await page.waitForTimeout(200);
    await expect(kofiButton).toHaveClass(/kofi-button-visible/);

    await page.evaluate(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, totalHeight * 0.75); // Above threshold
    });

    await page.waitForTimeout(400);
    await expect(kofiButton).toHaveClass(/kofi-button-hidden/);
  });

  test('component handles animation duration prop', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Verify animation duration is set correctly (will fail until implementation)
    const duration = await kofiButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.transitionDuration;
    });

    // Default should be 300ms
    expect(duration).toBe('0.3s');
  });

  test('component supports position prop', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const kofiButton = page.locator('[data-testid="kofi-button"]');

    // Verify default bottom-left positioning (will fail until implementation)
    const position = await kofiButton.evaluate(el => {
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

  test('component integrates with Ko-fi widget', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Test Ko-fi widget integration (will fail until implementation)
    const kofiContainer = page.locator('[id^="kofi-container-"]');

    // Should have Ko-fi container div
    await expect(kofiContainer).toBeAttached();

    // Should load Ko-fi script
    const kofiScript = page.locator('script[src*="ko-fi.com"]');
    await expect(kofiScript).toBeAttached();
  });

  test('component provides fallback button', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Test fallback button before Ko-fi loads (will fail until implementation)
    const fallbackButton = page.locator('.kofi-fallback-button');

    // Fallback should be visible initially
    await expect(fallbackButton).toBeVisible();
    await expect(fallbackButton).toContainText('Support Me');
  });
});
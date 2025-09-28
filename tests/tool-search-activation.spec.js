/**
 * E2E test for search activation
 * Tests: press '/' key, verify overlay appears and input focused
 * Based on quickstart.md Scenario 1
 */

const { test, expect } = require('@playwright/test');

test.describe('Tool Search Activation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page (adjust URL based on environment)
    await page.goto('http://localhost:3000'); // Development URL

    // Wait for SPA to load completely
    await page.waitForTimeout(2000);

    // Ensure page is focused and ready for keyboard input
    await page.click('body');
  });

  test('should activate search overlay when pressing / key', async ({ page }) => {
    // Scenario 1: Search Modal Activation
    // Given: Landing page is loaded with multiple tools displayed

    // Verify landing page has loaded with tools
    await expect(page.locator('h1')).toBeVisible();

    // When: Press the '/' key from anywhere on the page
    await page.keyboard.press('/');

    // Then: Search input field appears as fixed overlay at top center and is focused

    // Verify search overlay appears
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();

    // Verify search input is visible
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Verify search input is focused (cursor visible)
    await expect(searchInput).toBeFocused();

    // Verify overlay is positioned at top center
    const overlayBox = await searchOverlay.boundingBox();
    const pageWidth = await page.evaluate(() => window.innerWidth);

    // Check that overlay is roughly centered horizontally
    const centerX = pageWidth / 2;
    const overlayCenter = overlayBox.x + overlayBox.width / 2;
    expect(Math.abs(overlayCenter - centerX)).toBeLessThan(50); // Allow 50px tolerance

    // Check that overlay is positioned near top (within first 30% of viewport)
    const pageHeight = await page.evaluate(() => window.innerHeight);
    expect(overlayBox.y).toBeLessThan(pageHeight * 0.3);
  });

  test('should show backdrop blur/darkening behind overlay', async ({ page }) => {
    // Press / to activate search
    await page.keyboard.press('/');

    // Verify page behind overlay is slightly blurred/darkened
    const backdrop = page.locator('[data-testid="search-backdrop"]');
    await expect(backdrop).toBeVisible();

    // Check backdrop has proper styling (blur/dark effect)
    const backdropStyles = await backdrop.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter
      };
    });

    // Should have some form of backdrop effect
    expect(backdropStyles.backgroundColor || backdropStyles.backdropFilter).toBeTruthy();
  });

  test('should not activate search when typing in other input fields', async ({ page }) => {
    // Create a test input field on the page
    await page.evaluate(() => {
      const input = document.createElement('input');
      input.id = 'test-input';
      input.placeholder = 'Test input';
      document.body.appendChild(input);
    });

    // Focus the test input
    await page.click('#test-input');

    // Type '/' in the input field
    await page.keyboard.press('/');

    // Search overlay should NOT appear
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).not.toBeVisible();

    // The '/' character should be in the input field instead
    const inputValue = await page.inputValue('#test-input');
    expect(inputValue).toBe('/');
  });

  test('should focus search input immediately after activation', async ({ page }) => {
    // Press / key
    await page.keyboard.press('/');

    // Search input should be focused immediately
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeFocused();

    // Should be able to type immediately without additional clicks
    await page.keyboard.type('test');

    const inputValue = await page.inputValue('[data-testid="search-input"]');
    expect(inputValue).toBe('test');
  });

  test('should handle rapid / key presses gracefully', async ({ page }) => {
    // Press / multiple times rapidly
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('/');
      await page.waitForTimeout(50); // Small delay between presses
    }

    // Should still work correctly - only one overlay should be visible
    const searchOverlays = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlays).toHaveCount(1);

    // Input should be focused and functional
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeFocused();
  });

  test('should work from different page areas', async ({ page }) => {
    // Test activating search from different areas of the page
    const testAreas = [
      'body',
      'h1', // Header area
      // Note: Tool cards will be tested once they're implemented
    ];

    for (const area of testAreas) {
      // Close any existing search overlay first
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);

      // Click on the area and press /
      await page.click(area);
      await page.keyboard.press('/');

      // Verify search activates
      const searchOverlay = page.locator('[data-testid="search-overlay"]');
      await expect(searchOverlay).toBeVisible();

      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeFocused();
    }
  });

  test('should maintain accessibility attributes', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');

    // Check ARIA attributes for accessibility
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Verify modal has proper ARIA attributes
    await expect(searchOverlay).toHaveAttribute('role', 'dialog');
    await expect(searchOverlay).toHaveAttribute('aria-modal', 'true');

    // Verify input has proper attributes
    await expect(searchInput).toHaveAttribute('role', 'combobox');
    await expect(searchInput).toHaveAttribute('aria-expanded', 'true');
  });
});
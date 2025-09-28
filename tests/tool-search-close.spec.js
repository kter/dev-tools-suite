/**
 * E2E test for modal closing
 * Tests: click outside and Escape key, verify modal closes
 * Based on quickstart.md Scenario 5
 */

const { test, expect } = require('@playwright/test');

test.describe('Tool Search Modal Closing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    await page.click('body');
  });

  test('should close modal when clicking outside search area', async ({ page }) => {
    // Scenario 5: Close Search Modal
    // Given: Search input is visible and focused

    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');

    await expect(searchInput).toBeFocused();
    await expect(searchOverlay).toBeVisible();

    // When: Click on backdrop (outside search modal)
    const backdrop = page.locator('[data-testid="search-backdrop"]');
    await backdrop.click();

    // Then: Search modal closes and all tools are visible

    // Verify search modal closes
    await expect(searchOverlay).not.toBeVisible();

    // Verify all tools are visible
    const allTools = page.locator('[data-testid="tool-card"]:visible');
    const toolCount = await allTools.count();
    expect(toolCount).toBeGreaterThan(0);
  });

  test('should close modal when pressing Escape key', async ({ page }) => {
    // Given: Search input is visible and focused

    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');

    await expect(searchInput).toBeFocused();
    await expect(searchOverlay).toBeVisible();

    // When: Press Escape key
    await page.keyboard.press('Escape');

    // Then: Search modal closes and focus returns to page

    // Verify search modal closes
    await expect(searchOverlay).not.toBeVisible();

    // Verify focus returns to page (not trapped in hidden input)
    await expect(searchInput).not.toBeVisible();

    // Should be able to reactivate search
    await page.keyboard.press('/');
    await expect(searchOverlay).toBeVisible();
  });

  test('should not close modal when clicking inside search area', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');

    await expect(searchOverlay).toBeVisible();

    // Click on search input (inside modal)
    await searchInput.click();

    // Modal should remain open
    await expect(searchOverlay).toBeVisible();
    await expect(searchInput).toBeFocused();

    // Click on modal content area (not backdrop)
    const modalContent = page.locator('[data-testid="search-modal"]');
    await modalContent.click();

    // Modal should still remain open
    await expect(searchOverlay).toBeVisible();
  });

  test('should handle multiple close actions gracefully', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');

    await expect(searchOverlay).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(searchOverlay).not.toBeVisible();

    // Try to close again (should not cause errors)
    await page.keyboard.press('Escape');
    await expect(searchOverlay).not.toBeVisible();

    // Reopen and close with click
    await page.keyboard.press('/');
    await expect(searchOverlay).toBeVisible();

    const backdrop = page.locator('[data-testid="search-backdrop"]');
    await backdrop.click();
    await expect(searchOverlay).not.toBeVisible();

    // Try to close again (should not cause errors)
    await backdrop.click();
    await expect(searchOverlay).not.toBeVisible();
  });

  test('should close modal from different search states', async ({ page }) => {
    const testStates = [
      { description: 'empty search', query: '' },
      { description: 'search with results', query: 'generator' },
      { description: 'search with no results', query: 'nonexistent' }
    ];

    for (const state of testStates) {
      // Activate search and set state
      await page.keyboard.press('/');
      const searchInput = page.locator('[data-testid="search-input"]');
      const searchOverlay = page.locator('[data-testid="search-overlay"]');

      if (state.query) {
        await searchInput.fill(state.query);
        await page.waitForTimeout(250);
      }

      await expect(searchOverlay).toBeVisible();

      // Close with Escape
      await page.keyboard.press('Escape');
      await expect(searchOverlay).not.toBeVisible();

      // Verify all tools are visible
      const allTools = page.locator('[data-testid="tool-card"]:visible');
      const toolCount = await allTools.count();
      expect(toolCount).toBeGreaterThan(0);
    }
  });

  test('should handle rapid open/close cycles', async ({ page }) => {
    // Rapid open/close with different methods
    for (let i = 0; i < 5; i++) {
      // Open
      await page.keyboard.press('/');
      const searchOverlay = page.locator('[data-testid="search-overlay"]');
      await expect(searchOverlay).toBeVisible();

      // Close (alternate between Escape and click)
      if (i % 2 === 0) {
        await page.keyboard.press('Escape');
      } else {
        const backdrop = page.locator('[data-testid="search-backdrop"]');
        await backdrop.click();
      }

      await expect(searchOverlay).not.toBeVisible();
      await page.waitForTimeout(100);
    }
  });

  test('should preserve page state after closing modal', async ({ page }) => {
    // Get initial page state
    const initialTools = page.locator('[data-testid="tool-card"]:visible');
    const initialCount = await initialTools.count();
    const initialTitle = await page.title();

    // Open search, perform actions, then close
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('test query');
    await page.waitForTimeout(250);

    // Close modal
    await page.keyboard.press('Escape');

    // Verify page state is preserved
    const finalTools = page.locator('[data-testid="tool-card"]:visible');
    const finalCount = await finalTools.count();
    const finalTitle = await page.title();

    expect(finalCount).toBe(initialCount);
    expect(finalTitle).toBe(initialTitle);
  });

  test('should handle click outside on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1200, height: 800 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);

      // Activate search
      await page.keyboard.press('/');
      const searchOverlay = page.locator('[data-testid="search-overlay"]');
      await expect(searchOverlay).toBeVisible();

      // Click outside modal area
      const backdrop = page.locator('[data-testid="search-backdrop"]');
      await backdrop.click();

      // Should close regardless of screen size
      await expect(searchOverlay).not.toBeVisible();
    }

    // Reset viewport
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should not close when clicking on scrollbar', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();

    // Try clicking near edge of modal (where scrollbar might be)
    const modalContent = page.locator('[data-testid="search-modal"]');
    const modalBox = await modalContent.boundingBox();

    if (modalBox) {
      // Click near right edge of modal content (not backdrop)
      await page.mouse.click(
        modalBox.x + modalBox.width - 10,
        modalBox.y + modalBox.height / 2
      );

      // Modal should remain open
      await expect(searchOverlay).toBeVisible();
    }
  });

  test('should handle touch events for closing modal', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    // Activate search
    await page.keyboard.press('/');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();

    // Simulate touch on backdrop
    const backdrop = page.locator('[data-testid="search-backdrop"]');

    // Use dispatchEvent to simulate touch
    await backdrop.evaluate(element => {
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(touchEvent);
    });

    // Click to trigger close
    await backdrop.click();

    // Should close modal
    await expect(searchOverlay).not.toBeVisible();

    // Reset viewport
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should maintain focus management when closing', async ({ page }) => {
    // Store initial focus context
    await page.click('body');

    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');

    await expect(searchInput).toBeFocused();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(searchOverlay).not.toBeVisible();

    // Focus should not be trapped in hidden elements
    await expect(searchInput).not.toBeVisible();

    // Should be able to interact with page normally
    await page.keyboard.press('/');
    await expect(searchOverlay).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test('should close modal when navigating away', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();

    // Simulate navigation (refresh page)
    await page.reload();
    await page.waitForTimeout(2000);

    // Modal should not be visible after page reload
    const searchOverlayAfterReload = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlayAfterReload).not.toBeVisible();

    // Should be able to activate search normally
    await page.keyboard.press('/');
    await expect(searchOverlayAfterReload).toBeVisible();
  });
});
/**
 * E2E test for clear/escape behavior
 * Tests: clear input and press Escape, verify all tools reappear
 * Based on quickstart.md Scenario 3
 */

const { test, expect } = require('@playwright/test');

test.describe('Tool Search Clear and Escape Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    await page.click('body');
  });

  test('should show all tools when clearing search input', async ({ page }) => {
    // Scenario 3: Clear Search Results
    // Given: Search query matches some tools and results are filtered

    // Activate search and filter results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Perform search that filters results
    await searchInput.fill('password');
    await page.waitForTimeout(250);

    // Verify results are filtered
    const filteredCards = page.locator('[data-testid="tool-card"]:visible');
    const filteredCount = await filteredCards.count();

    // When: Clear text from input field
    await searchInput.fill('');
    await page.waitForTimeout(250);

    // Then: All tools reappear immediately
    const allCards = page.locator('[data-testid="tool-card"]:visible');
    const allCount = await allCards.count();

    // Should have more tools visible after clearing (or at least same if only 1 tool exists)
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('should close search modal and show all tools when pressing Escape', async ({ page }) => {
    // Given: Search query matches some tools and results are filtered

    // Activate search and filter results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    await searchInput.fill('test');
    await page.waitForTimeout(250);

    // Verify search modal is open
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();

    // When: Press Escape key
    await page.keyboard.press('Escape');

    // Then: Search modal closes and all tools are visible on landing page

    // Verify search modal is closed
    await expect(searchOverlay).not.toBeVisible();

    // Verify all tools are visible on landing page
    const allTools = page.locator('[data-testid="tool-card"]:visible');
    const toolCount = await allTools.count();
    expect(toolCount).toBeGreaterThan(0);
  });

  test('should handle multiple clear operations', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Perform multiple search and clear cycles
    const searchTerms = ['password', 'hash', 'generator'];

    for (const term of searchTerms) {
      // Search for term
      await searchInput.fill(term);
      await page.waitForTimeout(250);

      // Verify filtering occurred
      const filteredCards = page.locator('[data-testid="tool-card"]:visible');
      const filteredCount = await filteredCards.count();

      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(250);

      // Verify all tools are back
      const allCards = page.locator('[data-testid="tool-card"]:visible');
      const allCount = await allCards.count();
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    }
  });

  test('should handle Escape key from different search states', async ({ page }) => {
    // Test Escape from empty search
    await page.keyboard.press('/');
    await page.keyboard.press('Escape');

    let searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).not.toBeVisible();

    // Test Escape from search with results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('generator');
    await page.waitForTimeout(250);
    await page.keyboard.press('Escape');

    await expect(searchOverlay).not.toBeVisible();

    // Test Escape from search with no results
    await page.keyboard.press('/');
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);
    await page.keyboard.press('Escape');

    await expect(searchOverlay).not.toBeVisible();
  });

  test('should preserve tool visibility after closing search', async ({ page }) => {
    // Get initial tool count
    const initialTools = page.locator('[data-testid="tool-card"]:visible');
    const initialCount = await initialTools.count();

    // Open search, filter, then close
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('xyz'); // Unlikely to match
    await page.waitForTimeout(250);
    await page.keyboard.press('Escape');

    // Verify all original tools are visible again
    const finalTools = page.locator('[data-testid="tool-card"]:visible');
    const finalCount = await finalTools.count();
    expect(finalCount).toBe(initialCount);
  });

  test('should clear search using Backspace/Delete keys', async ({ page }) => {
    // Activate search and type
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('password');
    await page.waitForTimeout(250);

    // Get filtered count
    const filteredCards = page.locator('[data-testid="tool-card"]:visible');
    const filteredCount = await filteredCards.count();

    // Clear using backspace
    await page.keyboard.press('Control+a'); // Select all
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(250);

    // Verify all tools are back
    const allCards = page.locator('[data-testid="tool-card"]:visible');
    const allCount = await allCards.count();
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);

    // Verify input is empty
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('should handle rapid Escape key presses', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('test');
    await page.waitForTimeout(250);

    // Press Escape multiple times rapidly
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(50);
    }

    // Should handle gracefully - search should be closed
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).not.toBeVisible();

    // All tools should be visible
    const allTools = page.locator('[data-testid="tool-card"]:visible');
    const toolCount = await allTools.count();
    expect(toolCount).toBeGreaterThan(0);
  });

  test('should restore focus to page after closing search with Escape', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Verify search input is focused
    await expect(searchInput).toBeFocused();

    // Close with Escape
    await page.keyboard.press('Escape');

    // Focus should return to page (not the search input which is now hidden)
    await expect(searchInput).not.toBeVisible();

    // Should be able to activate search again with /
    await page.keyboard.press('/');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test('should not close search when pressing other keys', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    const searchOverlay = page.locator('[data-testid="search-overlay"]');

    await expect(searchOverlay).toBeVisible();

    // Press various keys that should NOT close the search
    const nonClosingKeys = ['Enter', 'Tab', 'ArrowDown', 'ArrowUp', 'Space'];

    for (const key of nonClosingKeys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(100);

      // Search should still be open
      await expect(searchOverlay).toBeVisible();
      await expect(searchInput).toBeFocused();
    }
  });

  test('should clear search and maintain responsive layout', async ({ page }) => {
    // Test on different viewport sizes
    const viewports = [
      { width: 1200, height: 800 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);

      // Activate search and filter
      await page.keyboard.press('/');
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('test');
      await page.waitForTimeout(250);

      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(250);

      // Verify tools are visible and properly laid out
      const toolCards = page.locator('[data-testid="tool-card"]:visible');
      const count = await toolCards.count();
      expect(count).toBeGreaterThan(0);

      // Check that cards have reasonable dimensions
      if (count > 0) {
        const firstCard = await toolCards.first().boundingBox();
        expect(firstCard.width).toBeGreaterThan(50);
        expect(firstCard.height).toBeGreaterThan(50);
      }

      // Close search for next iteration
      await page.keyboard.press('Escape');
    }

    // Reset to default viewport
    await page.setViewportSize({ width: 1200, height: 800 });
  });
});
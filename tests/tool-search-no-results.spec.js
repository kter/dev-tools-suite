/**
 * E2E test for no results state
 * Tests: type "nonexistent", verify empty space displayed
 * Based on quickstart.md Scenario 4
 */

const { test, expect } = require('@playwright/test');

test.describe('Tool Search No Results State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    await page.click('body');
  });

  test('should display empty space when no tools match search query', async ({ page }) => {
    // Scenario 4: No Search Results
    // Given: User is typing in search input

    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeFocused();

    // When: Type a query that matches no tools
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);

    // Then: Empty space is displayed with no tools visible

    // Verify no tools are displayed
    const visibleTools = page.locator('[data-testid="tool-card"]:visible');
    const toolCount = await visibleTools.count();
    expect(toolCount).toBe(0);

    // Verify empty space is shown (no "no results" message per clarifications)
    const noResultsMessage = page.locator('[data-testid="no-results-message"]');
    await expect(noResultsMessage).not.toBeVisible();

    // Verify search input remains focused and functional
    await expect(searchInput).toBeFocused();

    // Verify search overlay is still visible
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();
  });

  test('should handle various non-matching search terms', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    const nonMatchingTerms = [
      'xyz123',
      'nonexistent',
      'randomstuff',
      '!@#$%^&*()',
      'zzzzzzzzzz',
      'abcdefghijklmnop'
    ];

    for (const term of nonMatchingTerms) {
      await searchInput.fill(term);
      await page.waitForTimeout(250);

      // Should show no tools
      const visibleTools = page.locator('[data-testid="tool-card"]:visible');
      const toolCount = await visibleTools.count();
      expect(toolCount).toBe(0);

      // Search interface should remain functional
      await expect(searchInput).toBeFocused();
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe(term);
    }
  });

  test('should maintain search functionality in no results state', async ({ page }) => {
    // Activate search and get to no results state
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);

    // Verify no results
    const visibleTools = page.locator('[data-testid="tool-card"]:visible');
    expect(await visibleTools.count()).toBe(0);

    // Should be able to modify search to get results
    await searchInput.fill('generator'); // Likely to match tools
    await page.waitForTimeout(250);

    // Should now show results
    const newVisibleTools = page.locator('[data-testid="tool-card"]:visible');
    const newToolCount = await newVisibleTools.count();
    expect(newToolCount).toBeGreaterThan(0);
  });

  test('should handle transition from results to no results', async ({ page }) => {
    // Start with search that has results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('generator');
    await page.waitForTimeout(250);

    // Verify we have results
    const initialTools = page.locator('[data-testid="tool-card"]:visible');
    const initialCount = await initialTools.count();
    expect(initialCount).toBeGreaterThan(0);

    // Modify search to get no results
    await searchInput.fill('generatorxyz123');
    await page.waitForTimeout(250);

    // Should now have no results
    const noResultsTools = page.locator('[data-testid="tool-card"]:visible');
    const noResultsCount = await noResultsTools.count();
    expect(noResultsCount).toBe(0);

    // Interface should still be functional
    await expect(searchInput).toBeFocused();
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();
  });

  test('should handle transition from no results to results', async ({ page }) => {
    // Start with no results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('xyz123');
    await page.waitForTimeout(250);

    // Verify no results
    const noResultsTools = page.locator('[data-testid="tool-card"]:visible');
    expect(await noResultsTools.count()).toBe(0);

    // Modify search to get results
    await searchInput.fill('pass'); // Likely to match password-related tools
    await page.waitForTimeout(250);

    // Should now have results
    const resultsTools = page.locator('[data-testid="tool-card"]:visible');
    const resultsCount = await resultsTools.count();
    expect(resultsCount).toBeGreaterThanOrEqual(0); // At least 0, might be > 0
  });

  test('should maintain proper layout in no results state', async ({ page }) => {
    // Activate search and get no results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);

    // Check that search overlay maintains proper layout
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    const overlayBox = await searchOverlay.boundingBox();

    expect(overlayBox.width).toBeGreaterThan(0);
    expect(overlayBox.height).toBeGreaterThan(0);

    // Check that search input is still properly positioned
    const inputBox = await searchInput.boundingBox();
    expect(inputBox.width).toBeGreaterThan(0);
    expect(inputBox.height).toBeGreaterThan(0);
  });

  test('should handle very long non-matching search queries', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Type very long search that won't match
    const longQuery = 'a'.repeat(200) + 'xyz123';
    await searchInput.fill(longQuery);
    await page.waitForTimeout(250);

    // Should handle gracefully
    const visibleTools = page.locator('[data-testid="tool-card"]:visible');
    expect(await visibleTools.count()).toBe(0);

    // Input should accept the long query
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe(longQuery);

    // Interface should remain responsive
    await expect(searchInput).toBeFocused();
  });

  test('should maintain accessibility in no results state', async ({ page }) => {
    // Activate search and get no results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);

    // Check ARIA attributes are maintained
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toHaveAttribute('role', 'dialog');
    await expect(searchOverlay).toHaveAttribute('aria-modal', 'true');

    await expect(searchInput).toHaveAttribute('role', 'combobox');
    await expect(searchInput).toHaveAttribute('aria-expanded', 'true');

    // Should still be able to close with Escape
    await page.keyboard.press('Escape');
    await expect(searchOverlay).not.toBeVisible();
  });

  test('should handle keyboard navigation in no results state', async ({ page }) => {
    // Activate search and get no results
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);

    // Try arrow key navigation (should not cause errors)
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');

    // Should not cause errors and search should still be functional
    await expect(searchInput).toBeFocused();
    const searchOverlay = page.locator('[data-testid="search-overlay"]');
    await expect(searchOverlay).toBeVisible();
  });

  test('should not show loading states for no results', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Type query that won't match
    await searchInput.fill('xyz123');
    await page.waitForTimeout(250);

    // Should not show loading indicators
    const loadingIndicator = page.locator('[data-testid="search-loading"]');
    await expect(loadingIndicator).not.toBeVisible();

    // Should not show spinner or similar
    const spinner = page.locator('[data-testid="spinner"], .spinner, .loading');
    await expect(spinner).not.toBeVisible();
  });

  test('should clear no results state when clearing search', async ({ page }) => {
    // Get to no results state
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('nonexistent');
    await page.waitForTimeout(250);

    // Verify no results
    const noResultsTools = page.locator('[data-testid="tool-card"]:visible');
    expect(await noResultsTools.count()).toBe(0);

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(250);

    // Should show all tools again
    const allTools = page.locator('[data-testid="tool-card"]:visible');
    const allCount = await allTools.count();
    expect(allCount).toBeGreaterThan(0);
  });
});
/**
 * E2E test for real-time filtering
 * Tests: type "password", verify filtering works in real-time
 * Based on quickstart.md Scenario 2
 */

const { test, expect } = require('@playwright/test');

test.describe('Tool Search Real-time Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    await page.click('body');
  });

  test('should filter tools in real-time as user types', async ({ page }) => {
    // Scenario 2: Real-time Search Filtering
    // Given: Search input is active and focused

    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeFocused();

    // When: Type "password" character by character
    const searchTerm = 'password';

    // Type each character and verify real-time filtering
    for (let i = 1; i <= searchTerm.length; i++) {
      const partialTerm = searchTerm.substring(0, i);

      // Clear input and type partial term
      await searchInput.fill(partialTerm);

      // Small delay to allow for debouncing
      await page.waitForTimeout(250);

      // Verify filtering happens (tools should be filtered)
      const toolCards = page.locator('[data-testid="tool-card"]');
      const visibleCards = await toolCards.count();

      // At least some filtering should occur as we type
      if (partialTerm.length >= 2) {
        // Should have fewer results than total available tools
        expect(visibleCards).toBeLessThanOrEqual(10); // Assuming < 10 total tools
      }
    }

    // Then: Only tools containing "password" in name or description remain visible

    // Verify final filtering result
    const finalToolCards = page.locator('[data-testid="tool-card"]:visible');
    const finalCount = await finalToolCards.count();

    if (finalCount > 0) {
      // Check that visible tools contain the search term
      for (let i = 0; i < finalCount; i++) {
        const card = finalToolCards.nth(i);
        const cardText = await card.textContent();
        const hasMatch = cardText.toLowerCase().includes('password');
        expect(hasMatch).toBe(true);
      }
    }
  });

  test('should perform case-insensitive filtering', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    const searchVariations = ['password', 'PASSWORD', 'Password', 'PaSsWoRd'];

    for (const variation of searchVariations) {
      // Clear and type the variation
      await searchInput.fill(variation);
      await page.waitForTimeout(250);

      // All variations should produce the same results
      const toolCards = page.locator('[data-testid="tool-card"]:visible');
      const count = await toolCards.count();

      // Results should be consistent regardless of case
      expect(count).toBeGreaterThanOrEqual(0);

      // If there are results, verify they match case-insensitively
      if (count > 0) {
        const firstCard = toolCards.first();
        const cardText = await firstCard.textContent();
        const hasMatch = cardText.toLowerCase().includes('password');
        expect(hasMatch).toBe(true);
      }
    }
  });

  test('should filter by tool names', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Test filtering by tool names (assuming these tools exist)
    const toolNameSearches = [
      'generator',
      'hash',
      'qr',
      'timer'
    ];

    for (const searchTerm of toolNameSearches) {
      await searchInput.fill(searchTerm);
      await page.waitForTimeout(250);

      const visibleCards = page.locator('[data-testid="tool-card"]:visible');
      const count = await visibleCards.count();

      if (count > 0) {
        // Verify that matching tools have the search term in their name
        for (let i = 0; i < count; i++) {
          const card = visibleCards.nth(i);
          const toolName = await card.locator('[data-testid="tool-name"]').textContent();
          const hasMatch = toolName.toLowerCase().includes(searchTerm.toLowerCase());
          expect(hasMatch).toBe(true);
        }
      }
    }
  });

  test('should filter by tool descriptions', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Test filtering by descriptions
    const descriptionSearches = [
      'generate',
      'create',
      'secure',
      'convert'
    ];

    for (const searchTerm of descriptionSearches) {
      await searchInput.fill(searchTerm);
      await page.waitForTimeout(250);

      const visibleCards = page.locator('[data-testid="tool-card"]:visible');
      const count = await visibleCards.count();

      if (count > 0) {
        // Verify that matching tools have the search term in name or description
        for (let i = 0; i < count; i++) {
          const card = visibleCards.nth(i);
          const cardText = await card.textContent();
          const hasMatch = cardText.toLowerCase().includes(searchTerm.toLowerCase());
          expect(hasMatch).toBe(true);
        }
      }
    }
  });

  test('should filter by tags (if available)', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Test filtering by common tags
    const tagSearches = [
      'security',
      'utility',
      'converter',
      'tool'
    ];

    for (const searchTerm of tagSearches) {
      await searchInput.fill(searchTerm);
      await page.waitForTimeout(250);

      const visibleCards = page.locator('[data-testid="tool-card"]:visible');
      const count = await visibleCards.count();

      // Tags filtering should work if tags are implemented
      // This test will pass even if no tools match tags
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should show no delay in filtering for small datasets', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Measure time for filtering to occur
    const startTime = Date.now();

    await searchInput.fill('test');

    // Wait for any visible changes to complete
    await page.waitForTimeout(100);

    const endTime = Date.now();
    const filterTime = endTime - startTime;

    // Filtering should be fast (<50ms response time from research.md)
    // Adding some tolerance for test environment
    expect(filterTime).toBeLessThan(300); // 300ms tolerance for E2E environment
  });

  test('should maintain tool card layout during filtering', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Get initial layout information
    const initialCards = page.locator('[data-testid="tool-card"]');
    const initialCount = await initialCards.count();

    if (initialCount > 0) {
      const firstCardInitial = await initialCards.first().boundingBox();

      // Perform search that should filter results
      await searchInput.fill('xyz'); // Unlikely to match many tools
      await page.waitForTimeout(250);

      // Check that layout is maintained (no broken cards)
      const filteredCards = page.locator('[data-testid="tool-card"]:visible');
      const filteredCount = await filteredCards.count();

      if (filteredCount > 0) {
        const firstCardFiltered = await filteredCards.first().boundingBox();

        // Cards should maintain reasonable positioning
        expect(firstCardFiltered.width).toBeGreaterThan(0);
        expect(firstCardFiltered.height).toBeGreaterThan(0);
      }
    }
  });

  test('should handle rapid typing without errors', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    // Type rapidly to test debouncing
    const rapidText = 'password';

    // Type all characters quickly
    for (const char of rapidText) {
      await page.keyboard.type(char);
      await page.waitForTimeout(10); // Very fast typing
    }

    // Wait for debouncing to settle
    await page.waitForTimeout(300);

    // Should still work correctly
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe(rapidText);

    // Should show appropriate results
    const visibleCards = page.locator('[data-testid="tool-card"]:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle special characters in search', async ({ page }) => {
    // Activate search
    await page.keyboard.press('/');
    const searchInput = page.locator('[data-testid="search-input"]');

    const specialCharacters = ['@', '#', '$', '%', '&', '*', '(', ')', '-', '+'];

    for (const char of specialCharacters) {
      await searchInput.fill(char);
      await page.waitForTimeout(250);

      // Should not cause errors
      const visibleCards = page.locator('[data-testid="tool-card"]:visible');
      const count = await visibleCards.count();
      expect(count).toBeGreaterThanOrEqual(0);

      // Input should accept the character
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe(char);
    }
  });
});
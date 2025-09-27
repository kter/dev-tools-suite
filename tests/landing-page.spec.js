const { test, expect } = require('@playwright/test');

test.describe('Landing Page Ko-fi Widget', () => {
  test('should display Ko-fi widget on landing page', async ({ page }) => {
    await page.goto('https://dev.devtools.site');

    // Wait for SPA to load
    await page.waitForTimeout(3000);

    // Check that Ko-fi widget is present - this will fail until implementation
    const kofiWidget = page.locator('[data-testid="kofi-widget"]').or(
      page.locator('iframe[src*="ko-fi.com"]')
    ).or(
      page.locator('.kofi-button')
    );

    await expect(kofiWidget).toBeVisible();
  });

  test('should have correct Ko-fi widget configuration', async ({ page }) => {
    await page.goto('https://dev.devtools.site');
    await page.waitForTimeout(3000);

    // Check that Ko-fi script is loaded - this will fail until implementation
    const kofiScript = page.locator('script[src*="ko-fi.com"]');
    await expect(kofiScript).toBeAttached();
  });

  test('should not interfere with landing page functionality', async ({ page }) => {
    await page.goto('https://dev.devtools.site');
    await page.waitForTimeout(3000);

    // Check that main landing page content is still accessible
    await expect(page.locator('h1')).toBeVisible();

    // Check that navigation links work (landing page should have tool links)
    const toolLinks = page.locator('a[href*="devtools.site"]');
    await expect(toolLinks.first()).toBeVisible();
  });
});
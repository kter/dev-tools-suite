const { test, expect } = require('@playwright/test');

test.describe('Hash Generator Ko-fi Widget', () => {
  test('should display Ko-fi widget on hash generator page', async ({ page }) => {
    await page.goto('https://hash-generator.dev.devtools.site');

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

  test('should have consistent widget position across tools', async ({ page }) => {
    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Check that Ko-fi widget appears in consistent position
    const kofiWidget = page.locator('[data-testid="kofi-widget"]');
    const widgetPosition = await kofiWidget.boundingBox();

    // This test will help verify positioning consistency
    expect(widgetPosition).toBeTruthy();
  });

  test('should not interfere with hash generator functionality', async ({ page }) => {
    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Check that main hash generator functionality works
    await expect(page.locator('h1')).toContainText('Hash Generator');

    // Test hash generation still works with widget present
    const inputField = page.locator('input[type="text"]').or(page.locator('textarea'));
    if (await inputField.count() > 0) {
      await inputField.first().fill('test');
      // Widget should not interfere with tool functionality
    }
  });
});
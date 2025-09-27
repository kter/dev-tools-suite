const { test, expect } = require('@playwright/test');

test.describe('QR Generator Ko-fi Widget', () => {
  test('should display Ko-fi widget on QR generator page', async ({ page }) => {
    await page.goto('https://qr-generator.dev.devtools.site');

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

  test('should maintain widget visibility during QR generation', async ({ page }) => {
    await page.goto('https://qr-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Test that widget remains visible during tool interaction
    const inputField = page.locator('input[type="text"]').or(page.locator('textarea'));
    if (await inputField.count() > 0) {
      await inputField.first().fill('test QR code');
    }

    // Widget should still be visible after interaction
    const kofiWidget = page.locator('[data-testid="kofi-widget"]');
    await expect(kofiWidget).toBeVisible();
  });

  test('should not interfere with QR generator functionality', async ({ page }) => {
    await page.goto('https://qr-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Check that main QR generator functionality works
    await expect(page.locator('h1')).toContainText('QR');

    // Widget should not block QR generation
    const generateButton = page.locator('button').filter({ hasText: /generate|create/i });
    if (await generateButton.count() > 0) {
      await expect(generateButton.first()).toBeVisible();
    }
  });
});
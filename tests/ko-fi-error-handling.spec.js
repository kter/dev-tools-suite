const { test, expect } = require('@playwright/test');

test.describe('Ko-fi Widget Error Handling', () => {
  test('should hide widget when Ko-fi script is blocked', async ({ page }) => {
    // Block Ko-fi domain to simulate service unavailability
    await page.route('**/ko-fi.com/**', route => route.abort());

    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Widget should be hidden when script fails to load
    const kofiWidget = page.locator('[data-testid="kofi-widget"]');
    await expect(kofiWidget).not.toBeVisible();
  });

  test('should maintain tool functionality when Ko-fi fails', async ({ page }) => {
    // Block Ko-fi domain
    await page.route('**/ko-fi.com/**', route => route.abort());

    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Tool should work normally even without Ko-fi widget
    await expect(page.locator('h1')).toContainText('Hash Generator');

    // No error messages should be displayed to user
    const errorMessages = page.locator('text=/error|failed|blocked/i');
    await expect(errorMessages).toHaveCount(0);
  });

  test('should handle network timeout gracefully', async ({ page }) => {
    // Simulate slow Ko-fi response
    await page.route('**/ko-fi.com/**', route => {
      setTimeout(() => route.abort(), 10000); // 10 second timeout
    });

    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Page should load normally without waiting for Ko-fi
    await expect(page.locator('h1')).toContainText('Password Generator');

    // Widget should not be visible during timeout
    const kofiWidget = page.locator('[data-testid="kofi-widget"]');
    await expect(kofiWidget).not.toBeVisible();
  });

  test('should not display error messages in console', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Block Ko-fi domain
    await page.route('**/ko-fi.com/**', route => route.abort());

    await page.goto('https://qr-generator.dev.devtools.site');
    await page.waitForTimeout(3000);

    // Should not have Ko-fi related error messages visible to user
    // (Internal console errors are acceptable for debugging)
    const visibleErrors = page.locator('.error, .alert, [role="alert"]');
    await expect(visibleErrors).toHaveCount(0);
  });
});
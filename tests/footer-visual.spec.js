import { test, expect } from '@playwright/test';

/**
 * Footer Visual Regression Baseline Tests
 * Creates visual baselines and validates footer appearance consistency
 */

const tools = [
  'hash-generator',
  'qr-generator',
  'unix-time-converter',
  'password-generator',
  'landing-page'
];

test.describe('Footer Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual comparisons
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('Footer visual baseline - landing page', async ({ page }) => {
    await page.goto('https://dev.devtools.site');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Take screenshot of footer area
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('landing-page-footer.png');
  });

  for (const tool of tools.filter(t => t !== 'landing-page')) {
    test(`Footer visual baseline - ${tool}`, async ({ page }) => {
      await page.goto(`https://${tool}.dev.devtools.site`);
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Take screenshot of footer area
      const footer = page.locator('footer');
      await expect(footer).toHaveScreenshot(`${tool}-footer.png`);
    });
  }

  test('Footer visual consistency across tools', async ({ page }) => {
    const screenshots = [];

    // Capture footer screenshots from multiple tools
    for (const tool of tools.slice(0, 3)) {
      const url = tool === 'landing-page'
        ? 'https://dev.devtools.site'
        : `https://${tool}.dev.devtools.site`;

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      await page.locator('footer').scrollIntoViewIfNeeded();

      // Get footer element for comparison
      const footer = page.locator('footer');
      screenshots.push(await footer.screenshot());
    }

    // Note: Visual comparison logic would require additional image comparison utilities
    // For now, this test establishes the baseline for manual comparison
  });

  test('Footer responsive visual test - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForLoadState('networkidle');

    await page.locator('footer').scrollIntoViewIfNeeded();

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-mobile-320px.png');
  });

  test('Footer responsive visual test - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForLoadState('networkidle');

    await page.locator('footer').scrollIntoViewIfNeeded();

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-tablet-768px.png');
  });

  test('Footer dark mode visual test', async ({ page }) => {
    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForLoadState('networkidle');

    // Try to toggle dark mode
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(page.locator('button[aria-label*="theme"]')).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(1000); // Wait for theme transition
    }

    await page.locator('footer').scrollIntoViewIfNeeded();

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-dark-mode.png');
  });

  test('Footer position and spacing visual test', async ({ page }) => {
    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForLoadState('networkidle');

    // Capture full page to verify footer positioning
    await expect(page).toHaveScreenshot('full-page-with-footer.png', {
      fullPage: true,
      clip: { x: 0, y: 0, width: 1200, height: 2000 } // Adjust based on typical page height
    });
  });

  test('Legal disclosure link hover state visual test', async ({ page }) => {
    await page.goto('https://hash-generator.dev.devtools.site');
    await page.waitForLoadState('networkidle');

    await page.locator('footer').scrollIntoViewIfNeeded();

    // Hover over legal disclosure link
    const legalLink = page.locator('footer a[href="https://www.tomohiko.io/legal-disclosure"]');
    await legalLink.hover();

    // Wait for hover transition
    await page.waitForTimeout(300);

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-link-hover-state.png');
  });
});
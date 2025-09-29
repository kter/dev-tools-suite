import { test, expect } from '@playwright/test';

/**
 * Footer Component Contract Tests
 * Validates footer implementation across all DevTools according to contract schema
 */

// Test data for all tools that should have footers
const tools = [
  'hash-generator',
  'qr-generator',
  'unix-time-converter',
  'password-generator',
  'ip-calculator',
  'ip-info',
  'string-converter',
  'json-yaml-converter',
  'jwt-decoder',
  'regex-tester',
  'markdown-preview',
  'placeholder-generator',
  'image-converter',
  'lorem-ipsum-generator',
  'timezone-converter',
  'character-code-converter',
  'timer',
  'code-diff',
  'mic-test',
  'badger-image-generator',
  'poster-splitter',
  'landing-page'
];

const footerContract = {
  copyright: '© 2025 DevTools. Built with Nuxt 3 and deployed on AWS.',
  legalDisclosureUrl: 'https://www.tomohiko.io/legal-disclosure',
  legalDisclosureText: '特定商取引法に基づく表記'
};

test.describe('Footer Contract Validation', () => {
  // Test each tool individually for footer presence and structure
  for (const tool of tools) {
    test(`${tool} - Footer element exists and has correct structure`, async ({ page }) => {
      // Navigate to tool (use dev environment for testing)
      const url = tool === 'landing-page'
        ? 'https://dev.devtools.site'
        : `https://${tool}.dev.devtools.site`;

      await page.goto(url);

      // Wait for page to load completely
      await page.waitForLoadState('networkidle');

      // Verify footer element exists
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Verify footer has correct CSS classes for styling
      await expect(footer).toHaveClass(/mt-20.*text-center.*text-gray-500.*dark:text-gray-400/);

      // Verify footer contains exactly one paragraph
      const paragraph = footer.locator('p');
      await expect(paragraph).toBeVisible();
      await expect(paragraph).toHaveCount(1);
    });

    test(`${tool} - Copyright text is correct`, async ({ page }) => {
      const url = tool === 'landing-page'
        ? 'https://dev.devtools.site'
        : `https://${tool}.dev.devtools.site`;

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Verify copyright text content
      const footer = page.locator('footer');
      await expect(footer).toContainText(footerContract.copyright);
    });

    test(`${tool} - Legal disclosure link is present and correct`, async ({ page }) => {
      const url = tool === 'landing-page'
        ? 'https://dev.devtools.site'
        : `https://${tool}.dev.devtools.site`;

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Verify legal disclosure link exists
      const legalLink = page.locator(`footer a[href="${footerContract.legalDisclosureUrl}"]`);
      await expect(legalLink).toBeVisible();

      // Verify link text content
      await expect(legalLink).toHaveText(footerContract.legalDisclosureText);

      // Verify link attributes for security and new tab opening
      await expect(legalLink).toHaveAttribute('target', '_blank');
      await expect(legalLink).toHaveAttribute('rel', 'noopener noreferrer');

      // Verify link has hover styling classes
      await expect(legalLink).toHaveClass(/hover:text-gray-700.*dark:hover:text-gray-300.*underline.*transition-colors/);
    });
  }

  test('Footer consistency across all tools', async ({ page }) => {
    // Test that all tools have identical footer structure
    const footerTexts = [];

    for (const tool of tools.slice(0, 3)) { // Test subset for performance
      const url = tool === 'landing-page'
        ? 'https://dev.devtools.site'
        : `https://${tool}.dev.devtools.site`;

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const footerText = await page.locator('footer').textContent();
      footerTexts.push(footerText);
    }

    // Verify all footers have identical content
    const firstFooterText = footerTexts[0];
    for (const footerText of footerTexts) {
      expect(footerText).toBe(firstFooterText);
    }
  });

  test('Footer responsive design validation', async ({ page }) => {
    const testTool = 'hash-generator'; // Use one tool as representative
    await page.goto(`https://${testTool}.dev.devtools.site`);
    await page.waitForLoadState('networkidle');

    // Test mobile viewport (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    const footerMobile = page.locator('footer');
    await expect(footerMobile).toBeVisible();

    // Test tablet viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(footerMobile).toBeVisible();

    // Test desktop viewport (1200px)
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(footerMobile).toBeVisible();
  });

  test('Footer dark mode compatibility', async ({ page }) => {
    const testTool = 'hash-generator';
    await page.goto(`https://${testTool}.dev.devtools.site`);
    await page.waitForLoadState('networkidle');

    // Toggle to dark mode if theme toggle exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(page.locator('button[aria-label*="theme"]')).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }

    // Verify footer is still visible in dark mode
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify footer has dark mode styling
    await expect(footer).toHaveClass(/dark:text-gray-400/);
  });
});
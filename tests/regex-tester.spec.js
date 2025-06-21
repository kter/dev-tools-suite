const { test, expect } = require('@playwright/test');

test.describe('Regex Tester', () => {
  test('should load and display Regex Tester interface', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Regex Tester');
    
    // Check main sections
    await expect(page.locator('text=Regular Expression')).toBeVisible();
    await expect(page.locator('text=Test String')).toBeVisible();
  });

  test('should show regex pattern input with flags', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check pattern input
    await expect(page.locator('text=Pattern')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    
    // Check regex flags
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(4); // g, i, m, s flags
    await expect(page.locator('text=g')).toBeVisible();
    await expect(page.locator('text=i')).toBeVisible();
    await expect(page.locator('text=m')).toBeVisible();
    await expect(page.locator('text=s')).toBeVisible();
  });

  test('should show load sample and clear buttons', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check action buttons
    await expect(page.locator('button:has-text("Load Sample")')).toBeVisible();
    await expect(page.locator('button:has-text("Clear All")')).toBeVisible();
  });

  test('should display test string input area', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check test string section
    await expect(page.locator('text=Test String')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('button:has-text("Load Sample Text")')).toBeVisible();
  });

  test('should show flag explanations', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check flag explanations
    await expect(page.locator('text=g: global')).toBeVisible();
    await expect(page.locator('text=i: ignore case')).toBeVisible();
    await expect(page.locator('text=m: multiline')).toBeVisible();
    await expect(page.locator('text=s: dot all')).toBeVisible();
  });

  test('should display match results section when pattern and text are provided', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample pattern and text
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Load Sample Text")');
    await page.waitForTimeout(1000);
    
    // Check for match results section
    await expect(page.locator('text=Match Results')).toBeVisible();
  });

  test('should show replace tool section', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample to see replace tool
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Load Sample Text")');
    await page.waitForTimeout(1000);
    
    // Check for replace tool section
    await expect(page.locator('text=Replace Tool')).toBeVisible();
    await expect(page.locator('text=Replace with')).toBeVisible();
  });

  test('should display common patterns section', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check common patterns section
    await expect(page.locator('text=Common Patterns')).toBeVisible();
    await expect(page.locator('text=Email Address')).toBeVisible();
    await expect(page.locator('text=URL')).toBeVisible();
    await expect(page.locator('text=Phone Number')).toBeVisible();
  });

  test('should show various common pattern examples', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check for different pattern types
    await expect(page.locator('text=IPv4 Address')).toBeVisible();
    await expect(page.locator('text=Credit Card Number')).toBeVisible();
    await expect(page.locator('text=Date (YYYY-MM-DD)')).toBeVisible();
    await expect(page.locator('text=HTML Tag')).toBeVisible();
    await expect(page.locator('text=Hexadecimal Color')).toBeVisible();
  });

  test('should validate regex pattern and show status', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample pattern
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Should show valid pattern status
    await expect(page.locator('text=Valid regex pattern')).toBeVisible();
  });

  test('should show match details when matches are found', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample pattern and text
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Load Sample Text")');
    await page.waitForTimeout(1000);
    
    // Check for match details
    await expect(page.locator('text=Match Details')).toBeVisible();
    await expect(page.locator('text=Text with Highlights')).toBeVisible();
  });

  test('should have copy functionality in replace tool', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample pattern and text
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Load Sample Text")');
    await page.waitForTimeout(1000);
    
    // Enter replacement text
    await page.fill('input[placeholder*="replacement"]', 'REPLACED');
    await page.waitForTimeout(500);
    
    // Check for copy button in replace section
    await expect(page.locator('button:has-text("Copy Result")')).toBeVisible();
  });

  test('should have proper responsive design', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that main container exists
    await expect(page.locator('.container')).toBeVisible();
    
    // Check grid layouts
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Regular Expression')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should show no matches message when appropriate', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter a pattern that won't match
    await page.fill('input[type="text"]', 'zzzzzzzzz');
    await page.fill('textarea', 'hello world');
    await page.waitForTimeout(1000);
    
    // Should show no matches found
    await expect(page.locator('text=No matches found')).toBeVisible();
  });

  test('should display pattern format with slashes and flags', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample pattern
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Should show pattern with proper format
    const patternDisplay = page.locator('code');
    await expect(patternDisplay.first()).toBeVisible();
  });

  test('should handle flag changes properly', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter pattern and text
    await page.fill('input[type="text"]', 'test');
    await page.fill('textarea', 'Test TEST test');
    
    // Toggle case insensitive flag
    await page.check('input[type="checkbox"]'); // This should be the 'i' flag
    await page.waitForTimeout(500);
    
    // Should still show match results section
    await expect(page.locator('text=Match Results')).toBeVisible();
  });

  test('should show proper heading structure', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(1); // Regular Expression
    await expect(page.locator('h3')).toHaveCount(2); // Test String, Common Patterns
  });

  test('should allow clicking on common patterns to load them', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that common pattern items are clickable
    const emailPattern = page.locator('text=Email Address').locator('..');
    await expect(emailPattern).toBeVisible();
    
    // Pattern containers should have cursor-pointer class
    await expect(page.locator('.cursor-pointer')).toBeVisible();
  });

  test('should display match position information', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample pattern and text to get matches
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Load Sample Text")');
    await page.waitForTimeout(1000);
    
    // Should show position information
    await expect(page.locator('text=Position:')).toBeVisible();
  });

  test('should show capture groups when available', async ({ page }) => {
    await page.goto('https://regex-tester.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter a pattern with capture groups
    await page.fill('input[type="text"]', '(\\w+)@(\\w+)');
    await page.fill('textarea', 'user@domain.com');
    await page.waitForTimeout(1000);
    
    // Should show capture groups section
    await expect(page.locator('text=Capture Groups')).toBeVisible();
  });
});
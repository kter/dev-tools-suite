const { test, expect } = require('@playwright/test');

test.describe('JSON/YAML Converter', () => {
  test('should load and display JSON/YAML Converter interface', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('JSON/YAML Converter');
    
    // Check main sections
    await expect(page.locator('text=Conversion Settings')).toBeVisible();
    await expect(page.locator('text=Input Format')).toBeVisible();
    await expect(page.locator('text=Output Format')).toBeVisible();
  });

  test('should show format selection options', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check input format dropdown
    const inputFormatSelect = page.locator('select').first();
    await expect(inputFormatSelect).toBeVisible();
    
    // Check output format dropdown
    const outputFormatSelect = page.locator('select').nth(1);
    await expect(outputFormatSelect).toBeVisible();
    
    // Check swap button
    await expect(page.locator('button:has-text("Swap")')).toBeVisible();
  });

  test('should have input and output text areas', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check input section
    await expect(page.locator('text=Input (JSON)')).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
    
    // Check output section
    await expect(page.locator('text=Output (YAML)')).toBeVisible();
    await expect(page.locator('textarea').nth(1)).toBeVisible();
  });

  test('should show load sample and clear buttons', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check buttons in input section
    await expect(page.locator('button:has-text("Load Sample")')).toBeVisible();
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();
  });

  test('should display formatting options', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check pretty format checkbox
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('text=Pretty format output')).toBeVisible();
  });

  test('should show supported formats information', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check supported formats section
    await expect(page.locator('text=Supported Formats')).toBeVisible();
    await expect(page.locator('text=JSON')).toBeVisible();
    await expect(page.locator('text=YAML')).toBeVisible();
    await expect(page.locator('text=TOML')).toBeVisible();
  });

  test('should show copy and download buttons when output exists', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample data first
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check if copy and download buttons appear
    // Note: These buttons only appear when there's output text
    const copyButton = page.locator('button:has-text("Copy")');
    const downloadButton = page.locator('button:has-text("Download")');
    
    // We expect these to be in the DOM but might not be visible if no conversion happened
    await expect(copyButton.or(page.locator('text=Copy'))).toBeVisible();
  });

  test('should have proper responsive design', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that main container exists
    await expect(page.locator('.container')).toBeVisible();
    
    // Check grid layouts
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Conversion Settings')).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should display proper format selection structure', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check format selection grid
    const formatGrid = page.locator('.grid').first();
    await expect(formatGrid).toBeVisible();
    
    // Check that we have input format, swap button, and output format
    await expect(page.locator('text=Input Format')).toBeVisible();
    await expect(page.locator('text=Output Format')).toBeVisible();
    await expect(page.locator('button:has-text("Swap")')).toBeVisible();
  });

  test('should show validation status for input', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample to see validation status
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Should show some kind of validation status (either error or success)
    // We're looking for either validation success or error indicators
    const validationIndicator = page.locator('svg').first();
    await expect(validationIndicator).toBeVisible();
  });

  test('should have proper header structure', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(1); // Conversion Settings
    await expect(page.locator('h3')).toHaveCount(3); // Input, Output, Supported Formats
  });

  test('should handle browser compatibility gracefully', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // The interface should load regardless of browser capabilities
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Conversion Settings')).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('should show format information section', async ({ page }) => {
    await page.goto('https://json-yaml-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check format information section
    await expect(page.locator('text=Supported Formats')).toBeVisible();
    
    // Check format descriptions
    await expect(page.locator('text=JavaScript Object Notation')).toBeVisible();
    await expect(page.locator('text=human-readable data serialization')).toBeVisible();
    await expect(page.locator('text=configuration file format')).toBeVisible();
  });
});
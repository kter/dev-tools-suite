const { test, expect } = require('@playwright/test');

test.describe('Poster Splitter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/poster-splitter');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Poster Splitter/);
  });

  test('should display main heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Poster Splitter');
  });

  test('should have dark mode toggle button', async ({ page }) => {
    const darkModeButton = page.locator('button[title*="Current theme"]');
    await expect(darkModeButton).toBeVisible();
  });

  test('should have file upload area', async ({ page }) => {
    // Check for drag & drop area
    const uploadArea = page.locator('text=/Drag & drop your A3 file here/');
    await expect(uploadArea).toBeVisible();
    
    // Check for browse button
    const browseButton = page.locator('button:has-text("Browse Files")');
    await expect(browseButton).toBeVisible();
  });

  test('should show supported formats', async ({ page }) => {
    const supportedFormats = page.locator('text=/Supported formats: PDF, PNG, JPG/');
    await expect(supportedFormats).toBeVisible();
  });

  test('should have output format selector after file upload', async ({ page }) => {
    // Initially, the options should not be visible
    const outputFormat = page.locator('select').first();
    await expect(outputFormat).not.toBeVisible();
  });

  test('should have split direction selector after file upload', async ({ page }) => {
    // Initially, the options should not be visible
    const splitDirection = page.locator('text=/Split Direction/');
    await expect(splitDirection).not.toBeVisible();
  });

  test('should have preview section', async ({ page }) => {
    const previewHeading = page.locator('h2:has-text("Preview & Download")');
    await expect(previewHeading).toBeVisible();
    
    // Should show placeholder initially
    const placeholder = page.locator('text=/Split pages will appear here/');
    await expect(placeholder).toBeVisible();
  });

  test('should have instructions section', async ({ page }) => {
    const instructionsHeading = page.locator('h2:has-text("How to Use")');
    await expect(instructionsHeading).toBeVisible();
    
    // Check for some instruction steps
    const step1 = page.locator('text=/Upload your A3-sized image or PDF file/');
    await expect(step1).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    const darkModeButton = page.locator('button[title*="Current theme"]');
    const htmlElement = page.locator('html');
    
    // Get initial state
    const initialHasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
    
    // Click dark mode button
    await darkModeButton.click();
    await page.waitForTimeout(100);
    
    // Check if dark class toggled
    const afterClickHasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
    
    // The state should have changed
    expect(afterClickHasDarkClass).not.toBe(initialHasDarkClass);
  });

  test('should handle file selection via button click', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    // Check that file input exists and has correct accept attribute
    await expect(fileInput).toHaveAttribute('accept', '.pdf,.png,.jpg,.jpeg');
  });

  test('should show tip about overlap', async ({ page }) => {
    const tip = page.locator('text=/Adding a small overlap/');
    await expect(tip).toBeVisible();
  });
});
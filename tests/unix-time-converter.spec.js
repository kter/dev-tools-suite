const { test, expect } = require('@playwright/test');

test.describe('Unix Time Converter', () => {
  test('should load and display Unix Time Converter interface', async ({ page }) => {
    await page.goto('https://unix-time-converter.dev.devtools.site');
    
    // Check title
    await expect(page).toHaveTitle(/Unix Time Converter/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Unix Time Converter');
    
    // Check current time display is working
    await expect(page.locator('text=Current Time')).toBeVisible();
    await expect(page.locator('text=Unix Timestamp')).toBeVisible();
    await expect(page.locator('text=Human Readable')).toBeVisible();
    
    // Check input fields are present
    await expect(page.locator('input[placeholder*="1640995200"]')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[type="time"]')).toBeVisible();
  });

  test('should convert Unix timestamp to human readable date', async ({ page }) => {
    await page.goto('https://unix-time-converter.dev.devtools.site');
    
    // Enter a known Unix timestamp (2022-01-01 00:00:00 UTC = 1640995200)
    await page.fill('input[placeholder*="1640995200"]', '1640995200');
    
    // Wait for conversion to appear
    await page.waitForTimeout(500);
    
    // Check that conversion results are displayed
    const localTimeSection = page.locator('text=Local Time').locator('..');
    await expect(localTimeSection).toBeVisible();
    
    const utcTimeSection = page.locator('text=UTC Time').locator('..');
    await expect(utcTimeSection).toBeVisible();
  });

  test('should convert date to Unix timestamp', async ({ page }) => {
    await page.goto('https://unix-time-converter.dev.devtools.site');
    
    // Set a specific date and time
    await page.fill('input[type="date"]', '2022-01-01');
    await page.fill('input[type="time"]', '00:00');
    
    // Wait for conversion
    await page.waitForTimeout(500);
    
    // Check that Unix timestamp results are displayed
    const localTimestampSection = page.locator('text=Unix Timestamp (Local)').locator('..');
    await expect(localTimestampSection).toBeVisible();
    
    const utcTimestampSection = page.locator('text=Unix Timestamp (UTC)').locator('..');
    await expect(utcTimestampSection).toBeVisible();
  });

  test('should display common timestamps', async ({ page }) => {
    await page.goto('https://unix-time-converter.dev.devtools.site');
    
    // Check that common timestamps section is visible
    await expect(page.locator('text=Common Timestamps')).toBeVisible();
    
    // Check that Unix Epoch is present
    await expect(page.locator('text=Unix Epoch')).toBeVisible();
    
    // Check that Y2K is present
    await expect(page.locator('text=Y2K')).toBeVisible();
    
    // Click on Unix Epoch to test functionality
    await page.click('text=Unix Epoch');
    
    // Verify that the Unix input field was populated with 0
    await expect(page.locator('input[placeholder*="1640995200"]')).toHaveValue('0');
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://unix-time-converter.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should load robots.txt correctly', async ({ page }) => {
    const response = await page.goto('https://unix-time-converter.dev.devtools.site/robots.txt');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Disallow: /');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://unix-time-converter.dev.devtools.site');
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Current Time')).toBeVisible();
    await expect(page.locator('input[placeholder*="1640995200"]')).toBeVisible();
  });
});
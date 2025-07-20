const { test, expect } = require('@playwright/test');

test.describe('Character Code Converter', () => {
  test('should load and display Character Code Converter interface', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Character Code Converter');
    
    // Check main sections
    await expect(page.locator('text=Input Text')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Enter text to convert"]')).toBeVisible();
  });

  test('should convert single ASCII character', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter a single character
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'A');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check character analysis table is visible
    await expect(page.locator('text=Character Analysis')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('th:has-text("Character")')).toBeVisible();
    await expect(page.locator('th:has-text("ASCII (Dec)")')).toBeVisible();
    await expect(page.locator('th:has-text("ASCII (Hex)")')).toBeVisible();
    await expect(page.locator('th:has-text("Unicode")')).toBeVisible();
    await expect(page.locator('th:has-text("UTF-8 (Hex)")')).toBeVisible();
    await expect(page.locator('th:has-text("Binary")')).toBeVisible();
    
    // Check values for 'A' (ASCII 65)
    await expect(page.locator('td:has-text("A")').first()).toBeVisible();
    await expect(page.locator('td:has-text("65")')).toBeVisible();
    await expect(page.locator('td:has-text("0x41")')).toBeVisible();
    await expect(page.locator('td:has-text("U+0041")')).toBeVisible();
    await expect(page.locator('td:has-text("41")')).toBeVisible();
    await expect(page.locator('td:has-text("01000001")')).toBeVisible();
  });

  test('should convert multiple characters', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter multiple characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'ABC');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check that we have 3 rows in the table (one for each character)
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(3);
    
    // Check first character (A)
    await expect(rows.nth(0).locator('td').nth(1)).toContainText('65');
    
    // Check second character (B)
    await expect(rows.nth(1).locator('td').nth(1)).toContainText('66');
    
    // Check third character (C)
    await expect(rows.nth(2).locator('td').nth(1)).toContainText('67');
  });

  test('should convert special characters', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text with space and newline
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'A B\nC');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check special character representations
    await expect(page.locator('td:has-text("(space)")')).toBeVisible();
    await expect(page.locator('td:has-text("(newline)")')).toBeVisible();
  });

  test('should convert Unicode characters', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter Unicode character (emoji)
    await page.fill('textarea[placeholder*="Enter text to convert"]', '😀');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check that ASCII shows N/A for non-ASCII characters
    await expect(page.locator('td:has-text("N/A")')).toBeVisible();
    
    // Check Unicode code point
    await expect(page.locator('td:has-text("U+1F600")')).toBeVisible();
    
    // Check UTF-8 encoding (should be 4 bytes: F0 9F 98 80)
    await expect(page.locator('td:has-text("F0 9F 98 80")')).toBeVisible();
  });

  test('should show full text encodings', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello World');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check full text encodings section
    await expect(page.locator('text=Full Text Encodings')).toBeVisible();
    
    // Check Base64 encoding
    await expect(page.locator('text=Base64:')).toBeVisible();
    await expect(page.locator('text=SGVsbG8gV29ybGQ=')).toBeVisible();
    
    // Check URL encoding
    await expect(page.locator('text=URL Encoded:')).toBeVisible();
    await expect(page.locator('text=Hello%20World')).toBeVisible();
    
    // Check HTML entities
    await expect(page.locator('text=HTML Entities:')).toBeVisible();
  });

  test('should handle HTML special characters', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter HTML special characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', '<div>');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check HTML entities encoding
    const htmlEntities = page.locator('div:has-text("HTML Entities:") + div');
    await expect(htmlEntities).toContainText('&#60;div&#62;');
  });

  test('should handle empty input', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear input
    await page.fill('textarea[placeholder*="Enter text to convert"]', '');
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Check that no results are shown
    await expect(page.locator('text=Character Analysis')).not.toBeVisible();
    await expect(page.locator('text=Full Text Encodings')).not.toBeVisible();
  });

  test('should convert mixed ASCII and Unicode text', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter mixed text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello 世界');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check that we have correct number of rows
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(8); // "Hello 世界" = 8 characters
    
    // Check that ASCII characters show ASCII values
    await expect(rows.nth(0).locator('td').nth(1)).toContainText('72'); // H
    
    // Check that non-ASCII characters show N/A
    await expect(rows.nth(6).locator('td').nth(1)).toContainText('N/A'); // 世
  });

  test('should display binary values correctly', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter a character
    await page.fill('textarea[placeholder*="Enter text to convert"]', '0');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check binary value for '0' (ASCII 48 = 00110000)
    await expect(page.locator('td:has-text("00110000")')).toBeVisible();
  });

  test('should handle tab character', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text with tab
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'A\tB');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check tab representation
    await expect(page.locator('td:has-text("(tab)")')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Enter text to convert"]')).toBeVisible();
    
    // Enter text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Test');
    await page.waitForTimeout(1000);
    
    // Check that table is scrollable
    const tableContainer = page.locator('.overflow-x-auto');
    await expect(tableContainer).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should update conversions in real-time', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Type one character
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'A');
    await page.waitForTimeout(500);
    
    // Check that we have one row
    let rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(1);
    
    // Add another character
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'AB');
    await page.waitForTimeout(500);
    
    // Check that we now have two rows
    rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(2);
  });

  test('should handle extended ASCII characters', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter extended ASCII character (é = 233)
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'é');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check that ASCII shows N/A for extended ASCII
    await expect(page.locator('td:has-text("N/A")')).toBeVisible();
    
    // Check Unicode representation
    await expect(page.locator('td:has-text("U+00E9")')).toBeVisible();
  });

  test('should correctly encode URL with special characters', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text with special characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello & World!');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check URL encoding
    const urlEncoded = page.locator('div:has-text("URL Encoded:") + div');
    await expect(urlEncoded).toContainText('Hello%20%26%20World!');
  });

  test('should show correct hex values', async ({ page }) => {
    await page.goto('https://character-code-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter lowercase letters
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'abc');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check hex values
    const rows = page.locator('tbody tr');
    await expect(rows.nth(0).locator('td').nth(2)).toContainText('0x61'); // a
    await expect(rows.nth(1).locator('td').nth(2)).toContainText('0x62'); // b
    await expect(rows.nth(2).locator('td').nth(2)).toContainText('0x63'); // c
  });
});
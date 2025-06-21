const { test, expect } = require('@playwright/test');

test.describe('String Converter', () => {
  test('should load and display String Converter interface', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('String Converter');
    
    // Check main sections
    await expect(page.locator('text=Conversion Type')).toBeVisible();
    await expect(page.locator('text=Input')).toBeVisible();
    await expect(page.locator('text=Output')).toBeVisible();
    await expect(page.locator('text=Batch Conversion')).toBeVisible();
    await expect(page.locator('text=Quick Examples')).toBeVisible();
  });

  test('should have conversion type buttons', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check for various conversion types
    await expect(page.locator('text=Base64 Encode')).toBeVisible();
    await expect(page.locator('text=Base64 Decode')).toBeVisible();
    await expect(page.locator('text=URL Encode')).toBeVisible();
    await expect(page.locator('text=URL Decode')).toBeVisible();
    await expect(page.locator('text=HTML Escape')).toBeVisible();
    await expect(page.locator('text=HTML Unescape')).toBeVisible();
    await expect(page.locator('text=snake_case → camelCase')).toBeVisible();
    await expect(page.locator('text=camelCase → snake_case')).toBeVisible();
  });

  test('should perform Base64 encoding', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Base64 Encode (should be default)
    await page.click('text=Base64 Encode');
    
    // Enter test text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello World');
    
    // Wait for auto-conversion
    await page.waitForTimeout(1000);
    
    // Check output
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('SGVsbG8gV29ybGQ=');
  });

  test('should perform Base64 decoding', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Base64 Decode
    await page.click('text=Base64 Decode');
    
    // Enter encoded text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'SGVsbG8gV29ybGQ=');
    
    // Wait for auto-conversion
    await page.waitForTimeout(1000);
    
    // Check output
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('Hello World');
  });

  test('should perform URL encoding', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select URL Encode
    await page.click('text=URL Encode');
    
    // Enter test text with special characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello World!');
    
    // Wait for auto-conversion
    await page.waitForTimeout(1000);
    
    // Check output
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('Hello%20World!');
  });

  test('should perform snake_case to camelCase conversion', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select snake_case to camelCase
    await page.click('text=snake_case → camelCase');
    
    // Enter snake_case text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'user_name');
    
    // Wait for auto-conversion
    await page.waitForTimeout(1000);
    
    // Check output
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('userName');
  });

  test('should perform camelCase to snake_case conversion', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select camelCase to snake_case
    await page.click('text=camelCase → snake_case');
    
    // Enter camelCase text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'userName');
    
    // Wait for auto-conversion
    await page.waitForTimeout(1000);
    
    // Check output
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('user_name');
  });

  test('should perform HTML escaping', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select HTML Escape
    await page.click('text=HTML Escape');
    
    // Enter HTML with special characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', '<script>alert("hello")</script>');
    
    // Wait for auto-conversion
    await page.waitForTimeout(1000);
    
    // Check output contains escaped characters
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toContain('&lt;');
    expect(outputValue).toContain('&gt;');
    expect(outputValue).toContain('&quot;');
  });

  test('should swap input and output when swap button clicked', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Base64 Encode
    await page.click('text=Base64 Encode');
    
    // Enter text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello World');
    await page.waitForTimeout(1000);
    
    // Click swap button
    await page.click('button:has-text("Swap")');
    await page.waitForTimeout(1000);
    
    // Check that input now contains the encoded value and conversion type changed
    const input = page.locator('textarea[placeholder*="Enter text to convert"]');
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('SGVsbG8gV29ybGQ=');
    
    // Check that Base64 Decode is now selected
    const base64DecodeButton = page.locator('text=Base64 Decode').locator('..');
    await expect(base64DecodeButton).toHaveClass(/bg-blue-50/);
  });

  test('should copy output to clipboard', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter some text and convert
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello World');
    await page.waitForTimeout(1000);
    
    // Click copy button
    await page.click('button:has-text("Copy")');
    
    // Check for copy notification
    await expect(page.locator('text=copied to clipboard')).toBeVisible();
    
    // Wait for notification to disappear
    await page.waitForTimeout(2500);
    await expect(page.locator('text=copied to clipboard')).not.toBeVisible();
  });

  test('should clear input when clear button clicked', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter some text
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello World');
    await page.waitForTimeout(1000);
    
    // Click clear button
    await page.click('button:has-text("Clear")');
    
    // Check that input is cleared
    const input = page.locator('textarea[placeholder*="Enter text to convert"]');
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('');
    
    // Check that output is also cleared
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('');
  });

  test('should show character and byte counts', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text with Unicode characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello 世界');
    await page.waitForTimeout(1000);
    
    // Check character count (should be 8)
    await expect(page.locator('text=Characters: 8')).toBeVisible();
    
    // Check that byte count is displayed (will be higher due to Unicode)
    await expect(page.locator('text=Bytes:')).toBeVisible();
  });

  test('should perform batch conversion', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select uppercase conversion
    await page.click('text=UPPERCASE');
    
    // Enter multiple lines in batch input
    await page.fill('textarea[placeholder*="Enter multiple strings"]', 'hello\nworld\ntest');
    
    // Wait for batch conversion
    await page.waitForTimeout(1000);
    
    // Check batch output
    const batchOutput = page.locator('textarea[readonly]').nth(1);
    const batchOutputValue = await batchOutput.inputValue();
    expect(batchOutputValue).toContain('HELLO');
    expect(batchOutputValue).toContain('WORLD');
    expect(batchOutputValue).toContain('TEST');
  });

  test('should use examples when clicked', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Base64 Encode to see examples
    await page.click('text=Base64 Encode');
    await page.waitForTimeout(500);
    
    // Click on "Use Example" button for first example
    await page.click('button:has-text("Use Example")');
    
    // Check that input is populated with example
    const input = page.locator('textarea[placeholder*="Enter text to convert"]');
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('Hello World');
  });

  test('should handle invalid Base64 input gracefully', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Base64 Decode
    await page.click('text=Base64 Decode');
    
    // Enter invalid Base64
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Invalid Base64!@#');
    
    // Wait for conversion attempt
    await page.waitForTimeout(1000);
    
    // Check for error message
    await expect(page.locator('text=Invalid Base64 input')).toBeVisible();
  });

  test('should convert between different case formats', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test kebab-case to camelCase
    await page.click('text=kebab-case → camelCase');
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'user-name');
    await page.waitForTimeout(1000);
    
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('userName');
  });

  test('should perform text transformation (uppercase, lowercase, title case)', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test Title Case
    await page.click('text=Title Case');
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'hello world');
    await page.waitForTimeout(1000);
    
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('Hello World');
  });

  test('should reverse text', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Reverse Text
    await page.click('text=Reverse Text');
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello');
    await page.waitForTimeout(1000);
    
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('olleH');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Conversion Type')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Enter text to convert"]')).toBeVisible();
    
    // Check that buttons are accessible
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy")')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should update conversion automatically when input changes', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select Base64 Encode
    await page.click('text=Base64 Encode');
    
    // Type characters one by one and check auto-conversion
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'H');
    await page.waitForTimeout(500);
    
    const output1 = await page.locator('textarea[readonly]').first().inputValue();
    expect(output1).toBeTruthy();
    
    // Add more characters
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello');
    await page.waitForTimeout(500);
    
    const output2 = await page.locator('textarea[readonly]').first().inputValue();
    expect(output2).not.toBe(output1);
  });

  test('should handle empty input gracefully', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear any existing input
    await page.fill('textarea[placeholder*="Enter text to convert"]', '');
    await page.waitForTimeout(500);
    
    // Check that output is empty
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('');
    
    // Check that no error is shown
    await expect(page.locator('text=Error:')).not.toBeVisible();
  });

  test('should copy batch results', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter batch input
    await page.fill('textarea[placeholder*="Enter multiple strings"]', 'hello\nworld');
    await page.waitForTimeout(1000);
    
    // Click copy batch results
    await page.click('button:has-text("Copy Batch Results")');
    
    // Check for copy notification
    await expect(page.locator('text=Batch results copied to clipboard!')).toBeVisible();
  });

  test('should switch between conversion types and maintain functionality', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Start with Base64 Encode
    await page.click('text=Base64 Encode');
    await page.fill('textarea[placeholder*="Enter text to convert"]', 'Hello');
    await page.waitForTimeout(500);
    
    // Switch to URL Encode
    await page.click('text=URL Encode');
    await page.waitForTimeout(500);
    
    // Check that output changed for URL encoding
    const output = page.locator('textarea[readonly]').first();
    const outputValue = await output.inputValue();
    expect(outputValue).toBe('Hello'); // URL encoding of "Hello" is just "Hello"
    
    // Switch to uppercase
    await page.click('text=UPPERCASE');
    await page.waitForTimeout(500);
    
    const uppercaseOutput = await output.inputValue();
    expect(uppercaseOutput).toBe('HELLO');
  });

  test('should show examples for each conversion type', async ({ page }) => {
    await page.goto('https://string-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check Base64 examples
    await page.click('text=Base64 Encode');
    await expect(page.locator('text=Hello World')).toBeVisible();
    await expect(page.locator('text=SGVsbG8gV29ybGQ=')).toBeVisible();
    
    // Check URL Encode examples
    await page.click('text=URL Encode');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Hello%20World!')).toBeVisible();
    
    // Check snake_case examples
    await page.click('text=snake_case → camelCase');
    await page.waitForTimeout(500);
    await expect(page.locator('text=user_name')).toBeVisible();
    await expect(page.locator('text=userName')).toBeVisible();
  });
});
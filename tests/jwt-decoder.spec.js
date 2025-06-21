const { test, expect } = require('@playwright/test');

test.describe('JWT Decoder', () => {
  test('should load and display JWT Decoder interface', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('JWT Decoder');
    
    // Check main sections
    await expect(page.locator('text=JWT Token')).toBeVisible();
    await expect(page.locator('text=About JWT Tokens')).toBeVisible();
  });

  test('should show JWT token input area', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check token input section
    await expect(page.locator('text=JWT Token')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('textarea')).toHaveAttribute('placeholder', 'Paste your JWT token here...');
  });

  test('should show load sample and clear buttons', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check action buttons
    await expect(page.locator('button:has-text("Load Sample")')).toBeVisible();
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();
  });

  test('should display token structure when valid JWT is entered', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check if token structure is shown
    await expect(page.locator('text=Token Structure')).toBeVisible();
    await expect(page.locator('text=Header')).toBeVisible();
    await expect(page.locator('text=Payload')).toBeVisible();
    await expect(page.locator('text=Signature')).toBeVisible();
  });

  test('should show validation status', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for validation status
    await expect(page.locator('text=Valid JWT token structure')).toBeVisible();
  });

  test('should display decoded sections after loading sample', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for header section
    await expect(page.locator('h3:has-text("Header")')).toBeVisible();
    
    // Check for payload section
    await expect(page.locator('h3:has-text("Payload")')).toBeVisible();
    
    // Check for signature section
    await expect(page.locator('h3:has-text("Signature")')).toBeVisible();
    
    // Check for token status section
    await expect(page.locator('text=Token Status')).toBeVisible();
  });

  test('should show copy buttons for each section', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for copy buttons (there should be multiple copy buttons)
    const copyButtons = page.locator('button:has-text("Copy")');
    await expect(copyButtons.first()).toBeVisible();
  });

  test('should display standard claims information', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for standard claims section
    await expect(page.locator('text=Standard Claims')).toBeVisible();
  });

  test('should show token status indicators', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for status indicators
    await expect(page.locator('text=Token Status')).toBeVisible();
    await expect(page.locator('text=Expiration')).toBeVisible();
    await expect(page.locator('text=Algorithm')).toBeVisible();
  });

  test('should display signature warning', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for signature verification warning
    await expect(page.locator('text=Signature Verification')).toBeVisible();
    await expect(page.locator('text=secret key or public key')).toBeVisible();
  });

  test('should show JWT information when no token is entered', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check for JWT information section
    await expect(page.locator('text=About JWT Tokens')).toBeVisible();
    await expect(page.locator('text=JSON Web Tokens')).toBeVisible();
    await expect(page.locator('text=Header.Payload.Signature')).toBeVisible();
  });

  test('should have proper responsive design', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that main container exists
    await expect(page.locator('.container')).toBeVisible();
    
    // Check that content is organized properly
    await expect(page.locator('.bg-white.rounded-lg.shadow-md')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=JWT Token')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should display color-coded token parts', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for color-coded sections (look for colored circular indicators)
    await expect(page.locator('.w-3.h-3.bg-red-500.rounded-full')).toBeVisible(); // Header
    await expect(page.locator('.w-3.h-3.bg-purple-500.rounded-full')).toBeVisible(); // Payload
    await expect(page.locator('.w-3.h-3.bg-blue-500.rounded-full')).toBeVisible(); // Signature
  });

  test('should show algorithm information', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for algorithm information
    await expect(page.locator('text=Algorithm')).toBeVisible();
  });

  test('should handle clear functionality', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample first
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Then clear
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(500);
    
    // Should show the information section again
    await expect(page.locator('text=About JWT Tokens')).toBeVisible();
  });

  test('should display proper heading structure', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(1); // JWT Token
    
    // Load sample to see more headings
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for section headings
    await expect(page.locator('h3')).toHaveCount(4); // Header, Payload, Token Status, Signature
  });

  test('should show JSON formatted output', async ({ page }) => {
    await page.goto('https://jwt-decoder.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load sample JWT
    await page.click('button:has-text("Load Sample")');
    await page.waitForTimeout(1000);
    
    // Check for JSON formatted content in pre/code blocks
    await expect(page.locator('pre')).toBeVisible();
    await expect(page.locator('code')).toBeVisible();
  });
});
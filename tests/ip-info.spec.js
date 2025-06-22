const { test, expect } = require('@playwright/test');

test.describe('IP Info', () => {
  test('should load and display IP Info interface', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('IP Info');
    
    // Check main sections
    await expect(page.locator('text=Your IP Address')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button:has-text("Copy IP")')).toBeVisible();
    await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
  });

  test('should display IP address information', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    
    // Wait for IP information to load
    await page.waitForTimeout(5000);
    
    // Check that IP address is displayed (should not be "Loading...")
    const ipDisplay = page.locator('.text-4xl.font-bold.text-blue-600');
    await expect(ipDisplay).toBeVisible();
    
    const ipText = await ipDisplay.textContent();
    expect(ipText).not.toBe('Loading...');
    expect(ipText).toMatch(/^\d+\.\d+\.\d+\.\d+$|^[0-9a-fA-F:]+$/); // IPv4 or IPv6 pattern
  });

  test('should display location information when available', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for location information section
    await expect(page.locator('text=Location Information')).toBeVisible();
    
    // Check for common location fields (may or may not be present depending on IP)
    const locationSection = page.locator('text=Location Information').locator('..');
    await expect(locationSection).toBeVisible();
  });

  test('should display network information when available', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for network information section
    await expect(page.locator('text=Network Information')).toBeVisible();
    
    // Check for network fields
    const networkSection = page.locator('text=Network Information').locator('..');
    await expect(networkSection).toBeVisible();
  });

  test('should display security and privacy section', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for security section
    await expect(page.locator('text=Security & Privacy')).toBeVisible();
    
    // Check for connection security status
    await expect(page.locator('text=Connection:')).toBeVisible();
    await expect(page.locator('text=Secure (HTTPS)')).toBeVisible();
    
    // Check for privacy note
    await expect(page.locator('text=Privacy Note:')).toBeVisible();
  });

  test('should copy IP address to clipboard', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click copy IP button
    await page.click('button:has-text("Copy IP")');
    
    // Check for success message
    await expect(page.locator('text=Copied to clipboard!')).toBeVisible();
    
    // Wait for message to disappear
    await page.waitForTimeout(2500);
    await expect(page.locator('text=Copied to clipboard!')).not.toBeVisible();
  });

  test('should refresh IP information', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click refresh button
    await page.click('button:has-text("Refresh")');
    
    // Check that button shows refreshing state
    await expect(page.locator('button:has-text("Refreshing...")')).toBeVisible();
    
    // Wait for refresh to complete
    await page.waitForTimeout(3000);
    
    // Check that button returns to normal state
    await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
  });

  test('should show quick actions section', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for quick actions section
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    
    // Check for action buttons
    await expect(page.locator('button:has-text("Copy All Information")')).toBeVisible();
    await expect(page.locator('button:has-text("Check Other IP")')).toBeVisible();
  });

  test('should copy all information', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click copy all information button
    await page.click('button:has-text("Copy All Information")');
    
    // Check for success message
    await expect(page.locator('text=Copied to clipboard!')).toBeVisible();
  });

  test('should show custom IP lookup form', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click check other IP button
    await page.click('button:has-text("Check Other IP")');
    
    // Check that custom lookup form appears
    await expect(page.locator('text=Lookup Custom IP Address')).toBeVisible();
    await expect(page.locator('input[placeholder*="Enter IP address"]')).toBeVisible();
    await expect(page.locator('button:has-text("Lookup")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test('should perform custom IP lookup', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click check other IP button
    await page.click('button:has-text("Check Other IP")');
    
    // Enter a public IP address (Google DNS)
    await page.fill('input[placeholder*="Enter IP address"]', '8.8.8.8');
    
    // Click lookup button
    await page.click('button:has-text("Lookup")');
    
    // Wait for lookup to complete
    await page.waitForTimeout(5000);
    
    // Check that the IP address is updated
    const ipDisplay = page.locator('.text-4xl.font-bold.text-blue-600');
    await expect(ipDisplay).toContainText('8.8.8.8');
  });

  test('should validate invalid IP address', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click check other IP button
    await page.click('button:has-text("Check Other IP")');
    
    // Enter invalid IP address
    await page.fill('input[placeholder*="Enter IP address"]', 'invalid.ip.address');
    
    // Click lookup button
    await page.click('button:has-text("Lookup")');
    
    // Check for error message
    await expect(page.locator('text=Please enter a valid IP address')).toBeVisible();
  });

  test('should cancel custom IP lookup', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click check other IP button
    await page.click('button:has-text("Check Other IP")');
    
    // Click cancel button
    await page.click('button:has-text("Cancel")');
    
    // Check that custom lookup form disappears
    await expect(page.locator('text=Lookup Custom IP Address')).not.toBeVisible();
  });

  test('should show map link when coordinates are available', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check if map link exists (depends on IP geolocation data)
    const mapLink = page.locator('a:has-text("View on Map")');
    const mapLinkExists = await mapLink.count() > 0;
    
    if (mapLinkExists) {
      // Verify link attributes
      await expect(mapLink).toHaveAttribute('target', '_blank');
      await expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const href = await mapLink.getAttribute('href');
      expect(href).toContain('google.com/maps');
    }
  });

  test('should display last updated timestamp', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for last updated text
    await expect(page.locator('text=Last updated:')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure by blocking requests
    await page.route('**/ipapi.co/**', route => route.abort());
    await page.route('**/ip-api.com/**', route => route.abort());
    
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for error state
    await expect(page.locator('text=Failed to load IP information')).toBeVisible();
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    
    // Check for loading state immediately after page load
    await expect(page.locator('text=Loading IP information...')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForTimeout(5000);
    
    // Loading should disappear
    await expect(page.locator('text=Loading IP information...')).not.toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Your IP Address')).toBeVisible();
    
    // Check that sections stack properly on mobile
    await expect(page.locator('text=Location Information')).toBeVisible();
    await expect(page.locator('text=Network Information')).toBeVisible();
    await expect(page.locator('text=Security & Privacy')).toBeVisible();
    
    // Check that buttons are accessible
    await expect(page.locator('button:has-text("Copy IP")')).toBeVisible();
    await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
  });

  test('should handle IPv6 addresses correctly', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click check other IP button
    await page.click('button:has-text("Check Other IP")');
    
    // Enter IPv6 address (Google IPv6 DNS)
    await page.fill('input[placeholder*="Enter IP address"]', '2001:4860:4860::8888');
    
    // Click lookup button
    await page.click('button:has-text("Lookup")');
    
    // Wait for lookup to complete
    await page.waitForTimeout(5000);
    
    // Check that the IPv6 address is handled (should either work or show appropriate message)
    const ipDisplay = page.locator('.text-4xl.font-bold.text-blue-600');
    const ipText = await ipDisplay.textContent();
    
    // Should either show the IPv6 address or handle it gracefully
    expect(ipText).not.toBe('Loading...');
  });

  test('should display information source', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Check for information source text
    await expect(page.locator('text=IP information provided by multiple geolocation services')).toBeVisible();
  });

  test('should allow Enter key for custom IP lookup', async ({ page }) => {
    await page.goto('https://ip-info.dev.devtools.site');
    await page.waitForTimeout(5000);
    
    // Click check other IP button
    await page.click('button:has-text("Check Other IP")');
    
    // Enter IP address and press Enter
    const input = page.locator('input[placeholder*="Enter IP address"]');
    await input.fill('8.8.8.8');
    await input.press('Enter');
    
    // Wait for lookup to complete
    await page.waitForTimeout(5000);
    
    // Check that the IP address is updated
    const ipDisplay = page.locator('.text-4xl.font-bold.text-blue-600');
    await expect(ipDisplay).toContainText('8.8.8.8');
  });
});
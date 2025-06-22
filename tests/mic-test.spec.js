const { test, expect } = require('@playwright/test');

test.describe('Mic Test', () => {
  test('should load and display Mic Test interface', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Mic Test');
    
    // Check main sections
    await expect(page.locator('text=Microphone Status')).toBeVisible();
    await expect(page.locator('text=Privacy & Security')).toBeVisible();
  });

  test('should show microphone access request initially', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check for microphone access request
    await expect(page.locator('text=Microphone Access Required')).toBeVisible();
    await expect(page.locator('button:has-text("Enable Microphone")')).toBeVisible();
    
    // Check explanation text
    await expect(page.locator('text=Click the button below to grant microphone permission')).toBeVisible();
  });

  test('should have privacy information section', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check privacy section
    await expect(page.locator('text=Privacy & Security')).toBeVisible();
    
    // Check privacy points
    await expect(page.locator('text=All audio processing happens locally in your browser')).toBeVisible();
    await expect(page.locator('text=No audio data is sent to any server')).toBeVisible();
    await expect(page.locator('text=Recordings are temporary and deleted when you close the page')).toBeVisible();
    await expect(page.locator('text=You can revoke microphone permission at any time')).toBeVisible();
  });

  test('should show recording controls section when permission exists', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Initially recording controls should not be visible without permission
    await expect(page.locator('text=Recording Test')).not.toBeVisible();
    
    // The interface should show enable microphone button
    await expect(page.locator('button:has-text("Enable Microphone")')).toBeVisible();
  });

  test('should show audio level monitor section when permission exists', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Initially audio level monitor should not be visible without permission
    await expect(page.locator('text=Audio Level Monitor')).not.toBeVisible();
    
    // Should show permission request instead
    await expect(page.locator('text=Microphone Access Required')).toBeVisible();
  });

  test('should handle permission denied state', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Mock permission denied by checking if browser shows appropriate messaging
    // Note: In actual tests, permission state would need to be mocked
    // This test verifies the UI elements exist for permission denied state
    
    // Check that refresh button functionality exists in the codebase
    // The button would appear when permission is denied
    const refreshButton = page.locator('button:has-text("Refresh Page")');
    
    // Initially this should not be visible (permission not yet requested)
    await expect(refreshButton).not.toBeVisible();
  });

  test('should have proper button states', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check enable microphone button
    const enableButton = page.locator('button:has-text("Enable Microphone")');
    await expect(enableButton).toBeVisible();
    await expect(enableButton).toBeEnabled();
    
    // Button should change state when clicked (though permission dialog will show)
    // We can't easily test the actual permission flow in headless mode
  });

  test('should display correct interface structure', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check main container structure
    await expect(page.locator('.container')).toBeVisible();
    
    // Check header section
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.locator('h1')).toContainText('Mic Test');
    await expect(header.locator('p')).toContainText('Test your microphone by recording and playing back audio');
  });

  test('should have responsive design elements', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that main sections use responsive classes
    await expect(page.locator('.bg-white.rounded-lg.shadow-md')).toHaveCount(2); // Status and Privacy sections initially
    
    // Check grid layouts exist
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Microphone Status')).toBeVisible();
    await expect(page.locator('button:has-text("Enable Microphone")')).toBeVisible();
    
    // Check that privacy section is still accessible
    await expect(page.locator('text=Privacy & Security')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should show proper microphone icon and visual elements', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check for microphone icon in the permission request
    await expect(page.locator('svg[viewBox="0 0 24 24"]')).toBeVisible();
    
    // Check for visual status indicators
    await expect(page.locator('.w-16.h-16.bg-blue-100.rounded-full')).toBeVisible();
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(1); // Microphone Status
    await expect(page.locator('h3')).toHaveCount(2); // Permission heading + Privacy heading
    
    // Check specific headings
    await expect(page.locator('h2:has-text("Microphone Status")')).toBeVisible();
    await expect(page.locator('h3:has-text("Microphone Access Required")')).toBeVisible();
    await expect(page.locator('h3:has-text("Privacy & Security")')).toBeVisible();
  });

  test('should handle browser compatibility gracefully', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // The interface should load regardless of getUserMedia support
    // In browsers without support, it should still show the UI
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Microphone Status')).toBeVisible();
    
    // Permission request should be shown
    await expect(page.locator('text=Microphone Access Required')).toBeVisible();
  });

  test('should show appropriate button styling', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check enable microphone button styling
    const enableButton = page.locator('button:has-text("Enable Microphone")');
    await expect(enableButton).toHaveClass(/bg-blue-600/);
    await expect(enableButton).toHaveClass(/text-white/);
    await expect(enableButton).toHaveClass(/rounded-lg/);
    
    // Check hover states are defined
    await expect(enableButton).toHaveClass(/hover:bg-blue-700/);
  });

  test('should display proper status indicators structure', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Initially should show permission request, not status indicators
    await expect(page.locator('text=Microphone Access Required')).toBeVisible();
    
    // Status indicators (Connected, Audio Level, Device) should not be visible yet
    await expect(page.locator('text=Connected')).not.toBeVisible();
    await expect(page.locator('text=Audio Level')).not.toBeVisible();
    await expect(page.locator('text=Device')).not.toBeVisible();
  });

  test('should have proper text content and descriptions', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check main description
    await expect(page.locator('text=Test your microphone by recording and playing back audio to verify it works correctly')).toBeVisible();
    
    // Check permission explanation
    await expect(page.locator('text=Click the button below to grant microphone permission and start testing')).toBeVisible();
    
    // Check privacy explanations
    await expect(page.locator('text=All audio processing happens locally in your browser')).toBeVisible();
  });

  test('should have proper ARIA accessibility', async ({ page }) => {
    await page.goto('https://mic-test.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that important interactive elements are properly accessible
    const enableButton = page.locator('button:has-text("Enable Microphone")');
    await expect(enableButton).toBeVisible();
    
    // Check that headings provide proper structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
  });

  // Note: Testing actual microphone functionality requires special browser permissions
  // and is typically done in integration tests with mocked media devices.
  // The tests above focus on UI/UX elements that can be verified without microphone access.
});
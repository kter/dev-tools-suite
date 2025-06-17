const { test, expect } = require('@playwright/test');

test.describe('Password Generator', () => {
  test('should load and display Password Generator interface', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Password Generator');
    
    // Check password settings section
    await expect(page.locator('text=Password Settings')).toBeVisible();
    await expect(page.locator('text=Password Length:')).toBeVisible();
    
    // Check character type options
    await expect(page.locator('text=Uppercase Letters')).toBeVisible();
    await expect(page.locator('text=Lowercase Letters')).toBeVisible();
    await expect(page.locator('text=Numbers')).toBeVisible();
    await expect(page.locator('text=Symbols')).toBeVisible();
    
    // Check generate button
    await expect(page.locator('button:has-text("Generate Password")')).toBeVisible();
  });

  test('should generate password with default settings', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    
    // Wait for page to load and initial password generation
    await page.waitForTimeout(3000);
    
    // Check that a password is already generated (default behavior)
    const passwordSection = page.locator('text=Generated Password').locator('..');
    await expect(passwordSection).toBeVisible();
    
    // Check password display area exists
    const passwordDisplay = page.locator('.font-mono.text-lg.break-all');
    await expect(passwordDisplay).toBeVisible();
    
    // Check that password has content
    const passwordText = await passwordDisplay.textContent();
    expect(passwordText.length).toBeGreaterThan(0);
  });

  test('should adjust password length with slider', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change password length to 32
    await page.locator('input[type="range"]').fill('32');
    
    // Generate new password
    await page.click('button:has-text("Generate Password")');
    
    // Check that length indicator shows 32
    await expect(page.locator('text=Password Length: 32')).toBeVisible();
    
    // Verify generated password length
    const passwordDisplay = page.locator('.font-mono.text-lg.break-all');
    const passwordText = await passwordDisplay.textContent();
    expect(passwordText.length).toBe(32);
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Get initial password text
    const passwordDisplay = page.locator('.font-mono.text-lg.break-all');
    const originalPassword = await passwordDisplay.textContent();
    
    // Click hide button
    await page.click('button:has-text("Hide")');
    
    // Check password is hidden (should show dots)
    const hiddenPassword = await passwordDisplay.textContent();
    expect(hiddenPassword).toMatch(/^•+$/);
    
    // Click show button
    await page.click('button:has-text("Show")');
    
    // Check password is visible again
    const visiblePassword = await passwordDisplay.textContent();
    expect(visiblePassword).toBe(originalPassword);
  });

  test('should copy password to clipboard', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click copy button
    await page.click('button:has-text("Copy")');
    
    // Check for success message
    await expect(page.locator('text=Password copied to clipboard!')).toBeVisible();
    
    // Wait for message to disappear
    await page.waitForTimeout(2500);
    await expect(page.locator('text=Password copied to clipboard!')).not.toBeVisible();
  });

  test('should update character type options', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Uncheck all options except numbers
    await page.uncheck('input[type="checkbox"]:near(:text("Uppercase Letters"))');
    await page.uncheck('input[type="checkbox"]:near(:text("Lowercase Letters"))');
    await page.uncheck('input[type="checkbox"]:near(:text("Symbols"))');
    
    // Ensure numbers is checked
    await page.check('input[type="checkbox"]:near(:text("Numbers"))');
    
    // Generate password
    await page.click('button:has-text("Generate Password")');
    
    // Check generated password contains only numbers
    const passwordDisplay = page.locator('.font-mono.text-lg.break-all');
    const passwordText = await passwordDisplay.textContent();
    expect(passwordText).toMatch(/^[0-9]+$/);
  });

  test('should show password strength analysis', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check strength analysis section exists
    await expect(page.locator('text=Password Strength Analysis')).toBeVisible();
    await expect(page.locator('text=Strength:')).toBeVisible();
    await expect(page.locator('text=Entropy:')).toBeVisible();
    
    // Check strength bar exists
    const strengthBar = page.locator('.h-2.rounded-full.transition-all');
    await expect(strengthBar).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test.skip('should load robots.txt correctly', async ({ page }) => {
    const response = await page.goto('https://password-generator.dev.devtools.site/robots.txt');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Disallow: /');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Password Settings')).toBeVisible();
    await expect(page.locator('button:has-text("Generate Password")')).toBeVisible();
    
    // Check that password display adapts to mobile
    const passwordDisplay = page.locator('.font-mono.text-lg.break-all');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should handle password history', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Generate a few passwords
    await page.click('button:has-text("Generate Password")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Generate Password")');
    await page.waitForTimeout(500);
    
    // Check history section appears
    await expect(page.locator('text=Password History')).toBeVisible();
    
    // Check history contains entries
    const historyEntries = page.locator('.bg-gray-50.rounded-lg');
    const entryCount = await historyEntries.count();
    expect(entryCount).toBeGreaterThan(0);
    
    // Test clear history
    await page.click('button:has-text("Clear History")');
    await page.waitForTimeout(500);
    
    // Check history section is no longer visible
    await expect(page.locator('text=Password History')).not.toBeVisible();
  });

  test('should display security tips', async ({ page }) => {
    await page.goto('https://password-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check security tips section
    await expect(page.locator('text=Security Tips')).toBeVisible();
    await expect(page.locator('text=Use unique passwords')).toBeVisible();
    await expect(page.locator('text=password manager')).toBeVisible();
    await expect(page.locator('text=two-factor authentication')).toBeVisible();
  });
});
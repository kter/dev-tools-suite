const { test, expect } = require('@playwright/test');

test.describe('Placeholder Generator', () => {
  test('should load and display Placeholder Generator interface', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Placeholder Generator');
    
    // Check main sections
    await expect(page.locator('text=Image Settings')).toBeVisible();
    await expect(page.locator('text=Preview')).toBeVisible();
    await expect(page.locator('text=Actions')).toBeVisible();
    
    // Check input fields
    await expect(page.locator('input#width')).toBeVisible();
    await expect(page.locator('input#height')).toBeVisible();
    await expect(page.locator('input#background-color')).toBeVisible();
    await expect(page.locator('input#text-color')).toBeVisible();
    
    // Check canvas preview
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should have default settings loaded', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check default values
    await expect(page.locator('input#width')).toHaveValue('300');
    await expect(page.locator('input#height')).toHaveValue('200');
    await expect(page.locator('input#font-size')).toHaveValue('20');
    
    // Check default colors (hex values)
    await expect(page.locator('input[type="color"]').first()).toHaveValue('#cccccc');
    
    // Check default format
    await expect(page.locator('select#format')).toHaveValue('png');
    
    // Check preview dimensions display
    await expect(page.locator('text=300×200')).toBeVisible();
  });

  test('should update preview when changing dimensions', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change width
    await page.fill('input#width', '400');
    await page.waitForTimeout(500);
    
    // Check that preview updates
    await expect(page.locator('text=400×200')).toBeVisible();
    
    // Change height
    await page.fill('input#height', '300');
    await page.waitForTimeout(500);
    
    // Check that preview updates
    await expect(page.locator('text=400×300')).toBeVisible();
  });

  test('should update colors correctly', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change background color
    await page.fill('input[type="text"]', '#ff0000');
    await page.waitForTimeout(500);
    
    // Check that color input updates
    const backgroundColorInput = page.locator('input[type="color"]').first();
    await expect(backgroundColorInput).toHaveValue('#ff0000');
    
    // Change text color
    const textColorInputs = page.locator('input[type="text"]');
    await textColorInputs.nth(1).fill('#ffffff');
    await page.waitForTimeout(500);
    
    // Check that text color updates
    const textColorInput = page.locator('input[type="color"]').last();
    await expect(textColorInput).toHaveValue('#ffffff');
  });

  test('should update custom text', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Add custom text
    const customText = 'Hello World';
    await page.fill('input#custom-text', customText);
    await page.waitForTimeout(500);
    
    // Check that URL includes the custom text
    const urlInput = page.locator('input[readonly]').first();
    const url = await urlInput.inputValue();
    expect(url).toContain(encodeURIComponent(customText));
  });

  test('should change font settings', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change font size
    await page.fill('input#font-size', '30');
    await page.waitForTimeout(500);
    
    // Change font family
    await page.selectOption('select#font-family', 'Georgia');
    await page.waitForTimeout(500);
    
    // Verify values are set
    await expect(page.locator('input#font-size')).toHaveValue('30');
    await expect(page.locator('select#font-family')).toHaveValue('Georgia');
  });

  test('should apply preset sizes correctly', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click on Avatar preset (150x150)
    await page.click('button:has-text("Avatar (150×150)")');
    await page.waitForTimeout(500);
    
    // Check that dimensions are updated
    await expect(page.locator('input#width')).toHaveValue('150');
    await expect(page.locator('input#height')).toHaveValue('150');
    await expect(page.locator('text=150×150')).toBeVisible();
    
    // Click on Banner preset (728x90)
    await page.click('button:has-text("Banner (728×90)")');
    await page.waitForTimeout(500);
    
    // Check that dimensions are updated
    await expect(page.locator('input#width')).toHaveValue('728');
    await expect(page.locator('input#height')).toHaveValue('90');
    await expect(page.locator('text=728×90')).toBeVisible();
  });

  test('should maintain aspect ratio when enabled', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enable aspect ratio lock
    await page.check('input[type="checkbox"]');
    await page.waitForTimeout(500);
    
    // Change width and check if height adjusts proportionally
    await page.fill('input#width', '600');
    await page.waitForTimeout(1000);
    
    // Height should be adjusted proportionally (original ratio was 300:200 = 1.5)
    const heightValue = await page.locator('input#height').inputValue();
    expect(parseInt(heightValue)).toBe(400); // 600 / 1.5 = 400
  });

  test('should change file format correctly', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change to JPG format
    await page.selectOption('select#format', 'jpg');
    await page.waitForTimeout(500);
    
    // Check that quality slider appears
    await expect(page.locator('input#quality')).toBeVisible();
    await expect(page.locator('text=Quality')).toBeVisible();
    
    // Check that URL format changes
    const urlInput = page.locator('input[readonly]').first();
    const url = await urlInput.inputValue();
    expect(url).toContain('.jpg');
    
    // Change to SVG format
    await page.selectOption('select#format', 'svg');
    await page.waitForTimeout(500);
    
    // Quality slider should disappear
    await expect(page.locator('input#quality')).not.toBeVisible();
  });

  test('should generate correct URLs', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check default URL structure
    const urlInput = page.locator('input[readonly]').first();
    const defaultUrl = await urlInput.inputValue();
    expect(defaultUrl).toMatch(/https:\/\/placehold\.jp\/[a-f0-9]{6}\/[a-f0-9]{6}\/\d+x\d+\.png/);
    
    // Change settings and check URL updates
    await page.fill('input#width', '500');
    await page.fill('input#height', '400');
    await page.waitForTimeout(500);
    
    const updatedUrl = await urlInput.inputValue();
    expect(updatedUrl).toContain('500x400');
  });

  test('should copy URL to clipboard', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click copy button
    await page.click('button:has-text("Copy")');
    
    // Check for success message
    await expect(page.locator('text=URL copied to clipboard!')).toBeVisible();
    
    // Wait for message to disappear
    await page.waitForTimeout(2500);
    await expect(page.locator('text=URL copied to clipboard!')).not.toBeVisible();
  });

  test('should generate HTML and CSS code', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check HTML code generation
    const htmlTextarea = page.locator('textarea').first();
    const htmlCode = await htmlTextarea.inputValue();
    expect(htmlCode).toContain('<img src="');
    expect(htmlCode).toContain('alt="Placeholder');
    expect(htmlCode).toContain('width="300"');
    expect(htmlCode).toContain('height="200"');
    
    // Check CSS code generation
    const cssTextarea = page.locator('textarea').last();
    const cssCode = await cssTextarea.inputValue();
    expect(cssCode).toContain('background-image: url(');
    expect(cssCode).toContain('background-size: cover;');
  });

  test('should copy HTML and CSS code', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Copy HTML code
    await page.click('button:has-text("Copy HTML")');
    await expect(page.locator('text=HTML code copied to clipboard!')).toBeVisible();
    await page.waitForTimeout(2500);
    
    // Copy CSS code
    await page.click('button:has-text("Copy CSS")');
    await expect(page.locator('text=CSS code copied to clipboard!')).toBeVisible();
  });

  test('should download image', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Set up download promise
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('button:has-text("Download Image")');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Check filename pattern
    expect(download.suggestedFilename()).toMatch(/placeholder-\d+x\d+\.(png|jpg|webp)/);
  });

  test('should display usage examples', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that usage examples section is visible
    await expect(page.locator('text=Common Use Cases')).toBeVisible();
    await expect(page.locator('text=Website Design')).toBeVisible();
    await expect(page.locator('text=Prototyping')).toBeVisible();
    await expect(page.locator('text=Testing')).toBeVisible();
  });

  test('should validate input ranges', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test width limits
    const widthInput = page.locator('input#width');
    await expect(widthInput).toHaveAttribute('min', '1');
    await expect(widthInput).toHaveAttribute('max', '2000');
    
    // Test height limits
    const heightInput = page.locator('input#height');
    await expect(heightInput).toHaveAttribute('min', '1');
    await expect(heightInput).toHaveAttribute('max', '2000');
    
    // Test font size limits
    const fontSizeInput = page.locator('input#font-size');
    await expect(fontSizeInput).toHaveAttribute('min', '8');
    await expect(fontSizeInput).toHaveAttribute('max', '100');
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Image Settings')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check that settings panels are accessible
    await expect(page.locator('input#width')).toBeVisible();
    await expect(page.locator('input#height')).toBeVisible();
    await expect(page.locator('button:has-text("Download Image")')).toBeVisible();
  });

  test('should handle extreme dimensions', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test very small dimensions
    await page.fill('input#width', '10');
    await page.fill('input#height', '10');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=10×10')).toBeVisible();
    
    // Test large dimensions
    await page.fill('input#width', '1920');
    await page.fill('input#height', '1080');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=1920×1080')).toBeVisible();
  });

  test('should update preview when changing text settings', async ({ page }) => {
    await page.goto('https://placeholder-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Add custom text
    await page.fill('input#custom-text', 'Test Image');
    await page.waitForTimeout(500);
    
    // Change font size
    await page.fill('input#font-size', '40');
    await page.waitForTimeout(500);
    
    // Change font family
    await page.selectOption('select#font-family', 'Georgia');
    await page.waitForTimeout(500);
    
    // Preview should still be visible and functional
    await expect(page.locator('canvas')).toBeVisible();
  });
});
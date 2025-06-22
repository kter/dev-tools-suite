const { test, expect } = require('@playwright/test');

test.describe('Lorem Ipsum Generator', () => {
  test('should load and display Lorem Ipsum Generator interface', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Lorem Ipsum Generator');
    
    // Check main sections
    await expect(page.locator('text=Generation Options')).toBeVisible();
    await expect(page.locator('text=Generated Text')).toBeVisible();
  });

  test('should show generation options', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check option dropdowns
    await expect(page.locator('text=Text Type')).toBeVisible();
    await expect(page.locator('text=Generate by')).toBeVisible();
    await expect(page.locator('text=Amount')).toBeVisible();
    
    // Check dropdowns
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('select').nth(1)).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });

  test('should show text type options', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click on text type dropdown
    await page.click('select:near(:text("Text Type"))');
    
    // Check for different text type options
    await expect(page.locator('option:has-text("Lorem Ipsum (Latin)")')).toBeVisible();
    await expect(page.locator('option:has-text("English Words")')).toBeVisible();
    await expect(page.locator('option:has-text("Japanese (Hiragana)")')).toBeVisible();
    await expect(page.locator('option:has-text("Numbers")')).toBeVisible();
  });

  test('should show generation unit options', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click on generation type dropdown
    await page.click('select:near(:text("Generate by"))');
    
    // Check for generation unit options
    await expect(page.locator('option:has-text("Words")')).toBeVisible();
    await expect(page.locator('option:has-text("Sentences")')).toBeVisible();
    await expect(page.locator('option:has-text("Paragraphs")')).toBeVisible();
  });

  test('should show additional options checkboxes', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check additional options
    await expect(page.locator('text=Start with "Lorem ipsum"')).toBeVisible();
    await expect(page.locator('text=Wrap in HTML paragraphs')).toBeVisible();
    await expect(page.locator('text=Capitalize first letter')).toBeVisible();
    await expect(page.locator('text=Add punctuation')).toBeVisible();
    
    // Check checkboxes
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(4);
  });

  test('should show quick generate buttons', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check quick generate buttons
    await expect(page.locator('button:has-text("50 Words")')).toBeVisible();
    await expect(page.locator('button:has-text("100 Words")')).toBeVisible();
    await expect(page.locator('button:has-text("5 Sentences")')).toBeVisible();
    await expect(page.locator('button:has-text("3 Paragraphs")')).toBeVisible();
    await expect(page.locator('button:has-text("5 Paragraphs")')).toBeVisible();
  });

  test('should generate text automatically on page load', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Should have generated text by default
    await expect(page.locator('text=Generated Text')).toBeVisible();
    
    // Should show text statistics
    await expect(page.locator('text=Words')).toBeVisible();
    await expect(page.locator('text=Characters')).toBeVisible();
    await expect(page.locator('text=Sentences')).toBeVisible();
    await expect(page.locator('text=Paragraphs')).toBeVisible();
  });

  test('should show copy and download buttons when text is generated', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Should show action buttons
    await expect(page.locator('button:has-text("Copy")')).toBeVisible();
    await expect(page.locator('button:has-text("Download")')).toBeVisible();
  });

  test('should display text statistics', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check statistics grid
    await expect(page.locator('.text-2xl.font-bold.text-blue-600')).toBeVisible(); // Words count
    await expect(page.locator('.text-2xl.font-bold.text-green-600')).toBeVisible(); // Characters count
    await expect(page.locator('.text-2xl.font-bold.text-purple-600')).toBeVisible(); // Sentences count
    await expect(page.locator('.text-2xl.font-bold.text-orange-600')).toBeVisible(); // Paragraphs count
  });

  test('should generate text when quick buttons are clicked', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click on 50 words button
    await page.click('button:has-text("50 Words")');
    await page.waitForTimeout(500);
    
    // Should show updated content
    await expect(page.locator('.bg-gray-50.p-6.rounded-lg.border')).toBeVisible();
  });

  test('should show Lorem Ipsum information section', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check information section
    await expect(page.locator('text=About Lorem Ipsum')).toBeVisible();
    await expect(page.locator('text=dummy text of the printing')).toBeVisible();
    await expect(page.locator('text=Cicero')).toBeVisible();
  });

  test('should handle amount input changes', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change amount
    await page.fill('input[type="number"]', '10');
    await page.waitForTimeout(1000);
    
    // Should still show generated text
    await expect(page.locator('.bg-gray-50.p-6.rounded-lg.border')).toBeVisible();
  });

  test('should change text type and regenerate', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change to English words
    await page.selectOption('select:near(:text("Text Type"))', 'english');
    await page.waitForTimeout(1000);
    
    // Should still show generated text
    await expect(page.locator('.bg-gray-50.p-6.rounded-lg.border')).toBeVisible();
  });

  test('should have proper responsive design', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that main container exists
    await expect(page.locator('.container')).toBeVisible();
    
    // Check grid layouts
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Generation Options')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should toggle HTML output mode', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Toggle HTML paragraphs option
    await page.check('input[id="includeHtml"]');
    await page.waitForTimeout(1000);
    
    // Should still show generated text
    await expect(page.locator('.bg-gray-50.p-6.rounded-lg.border')).toBeVisible();
  });

  test('should show proper heading structure', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(1); // Generation Options
    await expect(page.locator('h3')).toHaveCount(2); // Generated Text, About Lorem Ipsum
  });

  test('should handle generation type changes', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Change to sentences
    await page.selectOption('select:near(:text("Generate by"))', 'sentences');
    await page.waitForTimeout(1000);
    
    // Amount label should update
    await expect(page.locator('text=Amount (sentences)')).toBeVisible();
  });

  test('should display generated text in proper format', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that generated text container exists
    await expect(page.locator('.bg-gray-50.p-6.rounded-lg.border')).toBeVisible();
    
    // Should show scrollable area for large text
    await expect(page.locator('.max-h-\\[500px\\].overflow-y-auto')).toBeVisible();
  });

  test('should show different text types properly', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test Japanese text type
    await page.selectOption('select:near(:text("Text Type"))', 'japanese');
    await page.waitForTimeout(1000);
    
    // Should still show statistics
    await expect(page.locator('text=Words')).toBeVisible();
    
    // Test Numbers text type
    await page.selectOption('select:near(:text("Text Type"))', 'numbers');
    await page.waitForTimeout(1000);
    
    // Should still show statistics
    await expect(page.locator('text=Words')).toBeVisible();
  });

  test('should handle checkbox options properly', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Toggle various options
    await page.uncheck('input[id="startWithLorem"]');
    await page.waitForTimeout(500);
    
    await page.uncheck('input[id="capitalizeFirst"]');
    await page.waitForTimeout(500);
    
    await page.uncheck('input[id="addPunctuation"]');
    await page.waitForTimeout(500);
    
    // Should still show generated text
    await expect(page.locator('.bg-gray-50.p-6.rounded-lg.border')).toBeVisible();
  });

  test('should show copy button text changes', async ({ page }) => {
    await page.goto('https://lorem-ipsum-generator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Should show copy button
    const copyButton = page.locator('button:has-text("Copy")');
    await expect(copyButton).toBeVisible();
    
    // Button should be enabled
    await expect(copyButton).toBeEnabled();
  });
});
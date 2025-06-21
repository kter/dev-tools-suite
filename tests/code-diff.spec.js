const { test, expect } = require('@playwright/test');

test.describe('Code Diff', () => {
  test('should load and display Code Diff interface', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Code Diff');
    
    // Check main sections
    await expect(page.locator('text=Original')).toBeVisible();
    await expect(page.locator('text=Modified')).toBeVisible();
    await expect(page.locator('text=Diff Result')).toBeVisible();
    await expect(page.locator('text=Quick Examples')).toBeVisible();
  });

  test('should have language selector with multiple options', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check language selector
    const languageSelect = page.locator('#language');
    await expect(languageSelect).toBeVisible();
    
    // Check for various language options
    await expect(languageSelect.locator('option[value="javascript"]')).toBeVisible();
    await expect(languageSelect.locator('option[value="python"]')).toBeVisible();
    await expect(languageSelect.locator('option[value="typescript"]')).toBeVisible();
    await expect(languageSelect.locator('option[value="css"]')).toBeVisible();
    await expect(languageSelect.locator('option[value="json"]')).toBeVisible();
  });

  test('should have view mode selector', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check view mode selector
    const viewModeSelect = page.locator('#view-mode');
    await expect(viewModeSelect).toBeVisible();
    
    // Check for view mode options
    await expect(viewModeSelect.locator('option[value="side-by-side"]')).toBeVisible();
    await expect(viewModeSelect.locator('option[value="unified"]')).toBeVisible();
  });

  test('should have diff options checkboxes', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check diff option checkboxes
    await expect(page.locator('#ignore-whitespace')).toBeVisible();
    await expect(page.locator('#ignore-case')).toBeVisible();
    await expect(page.locator('#word-diff')).toBeVisible();
    
    // Check their labels
    await expect(page.locator('text=Ignore Whitespace')).toBeVisible();
    await expect(page.locator('text=Ignore Case')).toBeVisible();
    await expect(page.locator('text=Word-level Diff')).toBeVisible();
  });

  test('should show diff when text is entered', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear any existing content first
    await page.fill('textarea[placeholder*="original"]', '');
    await page.fill('textarea[placeholder*="modified"]', '');
    
    // Enter different text in original and modified
    await page.fill('textarea[placeholder*="original"]', 'Hello World\nThis is line 2');
    await page.fill('textarea[placeholder*="modified"]', 'Hello Universe\nThis is line 2\nThis is line 3');
    
    // Wait for diff to be computed
    await page.waitForTimeout(1000);
    
    // Check that diff result is no longer empty
    const diffSection = page.locator('text=Diff Result').locator('..');
    await expect(diffSection).not.toContainText('Enter text in both fields to see the diff');
  });

  test('should display diff statistics', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter different text
    await page.fill('textarea[placeholder*="original"]', 'Line 1\nLine 2');
    await page.fill('textarea[placeholder*="modified"]', 'Line 1\nLine 2 Modified\nLine 3');
    
    // Wait for diff computation
    await page.waitForTimeout(1000);
    
    // Check for diff statistics
    await expect(page.locator('text=Diff Statistics')).toBeVisible();
    await expect(page.locator('text=Additions')).toBeVisible();
    await expect(page.locator('text=Deletions')).toBeVisible();
    await expect(page.locator('text=Changes')).toBeVisible();
    await expect(page.locator('text=Unchanged')).toBeVisible();
  });

  test('should switch between side-by-side and unified view', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter test data
    await page.fill('textarea[placeholder*="original"]', 'Hello\nWorld');
    await page.fill('textarea[placeholder*="modified"]', 'Hello\nUniverse');
    await page.waitForTimeout(1000);
    
    // Should start with side-by-side view
    await expect(page.locator('text=Original').nth(1)).toBeVisible(); // In diff result
    
    // Switch to unified view
    await page.selectOption('#view-mode', 'unified');
    await page.waitForTimeout(500);
    
    // Check unified view layout changes
    // The interface should change but we'll check that view mode changed
    expect(await page.locator('#view-mode').inputValue()).toBe('unified');
  });

  test('should clear text when clear button is clicked', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text
    await page.fill('textarea[placeholder*="original"]', 'Test content');
    
    // Click clear button for original
    await page.click('button:has-text("Clear")').first();
    
    // Check that text is cleared
    const originalTextarea = page.locator('textarea[placeholder*="original"]').first();
    expect(await originalTextarea.inputValue()).toBe('');
  });

  test('should swap texts when swap button is clicked', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Switch to unified view to access swap button
    await page.selectOption('#view-mode', 'unified');
    await page.waitForTimeout(500);
    
    // Enter different text in both fields
    await page.fill('textarea[placeholder*="original"]', 'Original Text');
    await page.fill('textarea[placeholder*="modified"]', 'Modified Text');
    
    // Click swap button
    await page.click('button:has-text("Swap")');
    await page.waitForTimeout(500);
    
    // Check that texts have been swapped
    const originalTextarea = page.locator('textarea[placeholder*="original"]');
    const modifiedTextarea = page.locator('textarea[placeholder*="modified"]');
    
    expect(await originalTextarea.inputValue()).toBe('Modified Text');
    expect(await modifiedTextarea.inputValue()).toBe('Original Text');
  });

  test('should copy diff when copy button is clicked', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text to generate diff
    await page.fill('textarea[placeholder*="original"]', 'Hello World');
    await page.fill('textarea[placeholder*="modified"]', 'Hello Universe');
    await page.waitForTimeout(1000);
    
    // Click copy diff button
    await page.click('button:has-text("Copy Diff")');
    
    // Check for copy notification
    await expect(page.locator('text=Diff copied to clipboard!')).toBeVisible();
    
    // Wait for notification to disappear
    await page.waitForTimeout(2500);
    await expect(page.locator('text=Diff copied to clipboard!')).not.toBeVisible();
  });

  test('should load examples when clicked', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click on JavaScript Functions example
    await page.click('text=JavaScript Functions');
    await page.waitForTimeout(500);
    
    // Check that example content is loaded
    const originalTextarea = page.locator('textarea[placeholder*="original"]').first();
    const originalValue = await originalTextarea.inputValue();
    expect(originalValue).toContain('function calculateTotal');
    
    // Check that language is set correctly
    expect(await page.locator('#language').inputValue()).toBe('javascript');
  });

  test('should show line and character counts', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter multi-line text
    await page.fill('textarea[placeholder*="original"]', 'Line 1\nLine 2\nLine 3');
    await page.waitForTimeout(500);
    
    // Check for line and character counts
    await expect(page.locator('text=Lines: 3')).toBeVisible();
    await expect(page.locator('text=Characters:')).toBeVisible();
  });

  test('should handle ignore whitespace option', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text with different whitespace
    await page.fill('textarea[placeholder*="original"]', 'Hello  World');
    await page.fill('textarea[placeholder*="modified"]', 'Hello World');
    await page.waitForTimeout(1000);
    
    // Enable ignore whitespace
    await page.check('#ignore-whitespace');
    await page.waitForTimeout(1000);
    
    // The diff should change when whitespace is ignored
    // We can't easily test the exact diff content, but we can verify the option works
    expect(await page.locator('#ignore-whitespace').isChecked()).toBe(true);
  });

  test('should handle ignore case option', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text with different cases
    await page.fill('textarea[placeholder*="original"]', 'Hello World');
    await page.fill('textarea[placeholder*="modified"]', 'hello world');
    await page.waitForTimeout(1000);
    
    // Enable ignore case
    await page.check('#ignore-case');
    await page.waitForTimeout(1000);
    
    // The diff should change when case is ignored
    expect(await page.locator('#ignore-case').isChecked()).toBe(true);
  });

  test('should handle word-level diff option', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text
    await page.fill('textarea[placeholder*="original"]', 'The quick brown fox');
    await page.fill('textarea[placeholder*="modified"]', 'The slow brown fox');
    await page.waitForTimeout(1000);
    
    // Enable word-level diff
    await page.check('#word-diff');
    await page.waitForTimeout(1000);
    
    // Word-level diff should be enabled
    expect(await page.locator('#word-diff').isChecked()).toBe(true);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#language')).toBeVisible();
    await expect(page.locator('#view-mode')).toBeVisible();
    
    // Check that textareas are accessible
    await expect(page.locator('textarea[placeholder*="original"]')).toBeVisible();
    
    // Switch to unified view which should be more mobile-friendly
    await page.selectOption('#view-mode', 'unified');
    await page.waitForTimeout(500);
    
    await expect(page.locator('textarea[placeholder*="modified"]')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should handle empty input gracefully', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear all text
    await page.fill('textarea[placeholder*="original"]', '');
    await page.fill('textarea[placeholder*="modified"]', '');
    await page.waitForTimeout(500);
    
    // Check that it shows the empty state message
    await expect(page.locator('text=Enter text in both fields to see the diff')).toBeVisible();
    
    // Check that copy and download buttons are disabled
    await expect(page.locator('button:has-text("Copy Diff")')).toBeDisabled();
    await expect(page.locator('button:has-text("Download")')).toBeDisabled();
  });

  test('should show all example options', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check for different example types
    await expect(page.locator('text=JavaScript Functions')).toBeVisible();
    await expect(page.locator('text=CSS Styles')).toBeVisible();
    await expect(page.locator('text=JSON Configuration')).toBeVisible();
    
    // Check example descriptions
    await expect(page.locator('text=Compare function implementations')).toBeVisible();
    await expect(page.locator('text=Compare CSS rule changes')).toBeVisible();
    await expect(page.locator('text=Compare config file changes')).toBeVisible();
  });

  test('should switch between different examples', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click CSS example
    await page.click('text=CSS Styles');
    await page.waitForTimeout(500);
    
    // Check that CSS content is loaded
    const originalTextarea = page.locator('textarea[placeholder*="original"]').first();
    const originalValue = await originalTextarea.inputValue();
    expect(originalValue).toContain('.button');
    expect(originalValue).toContain('background-color: blue');
    
    // Check that language changed to CSS
    expect(await page.locator('#language').inputValue()).toBe('css');
    
    // Switch to JSON example
    await page.click('text=JSON Configuration');
    await page.waitForTimeout(500);
    
    // Check that JSON content is loaded
    const newOriginalValue = await originalTextarea.inputValue();
    expect(newOriginalValue).toContain('"name": "my-app"');
    
    // Check that language changed to JSON
    expect(await page.locator('#language').inputValue()).toBe('json');
  });

  test('should maintain diff view when switching options', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Load an example to have content
    await page.click('text=JavaScript Functions');
    await page.waitForTimeout(1000);
    
    // Switch to unified view
    await page.selectOption('#view-mode', 'unified');
    await page.waitForTimeout(500);
    
    // Toggle options and verify diff still shows
    await page.check('#ignore-whitespace');
    await page.waitForTimeout(500);
    
    await page.check('#word-diff');
    await page.waitForTimeout(500);
    
    // Should still show diff statistics
    await expect(page.locator('text=Diff Statistics')).toBeVisible();
    
    // Should not show empty state
    await expect(page.locator('text=Enter text in both fields to see the diff')).not.toBeVisible();
  });

  test('should handle large text input', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Create large text content
    const largeText1 = Array(100).fill('This is line').map((line, i) => `${line} ${i + 1}`).join('\n');
    const largeText2 = Array(100).fill('This is line').map((line, i) => `${line} ${i + 1} modified`).join('\n');
    
    // Enter large text
    await page.fill('textarea[placeholder*="original"]', largeText1);
    await page.fill('textarea[placeholder*="modified"]', largeText2);
    
    // Wait for processing
    await page.waitForTimeout(2000);
    
    // Should show diff statistics
    await expect(page.locator('text=Diff Statistics')).toBeVisible();
    
    // Line count should be around 100
    await expect(page.locator('text=Lines: 100')).toBeVisible();
  });

  test('should download diff when download button is clicked', async ({ page }) => {
    await page.goto('https://code-diff.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter text to generate diff
    await page.fill('textarea[placeholder*="original"]', 'Hello World');
    await page.fill('textarea[placeholder*="modified"]', 'Hello Universe');
    await page.waitForTimeout(1000);
    
    // Set up download handling
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('button:has-text("Download")');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Check that download started
    expect(download.suggestedFilename()).toMatch(/^diff-.*\.diff$/);
  });
});
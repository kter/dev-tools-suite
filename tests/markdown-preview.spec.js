const { test, expect } = require('@playwright/test');

test.describe('Markdown Preview', () => {
  test('should load and display Markdown Preview interface', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Markdown Preview');
    
    // Check toolbar elements
    await expect(page.locator('select#view-mode')).toBeVisible();
    await expect(page.locator('button:has-text("Load Sample")')).toBeVisible();
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();
    await expect(page.locator('button:has-text("Download")')).toBeVisible();
    
    // Check editor and preview panels are visible (default split view)
    await expect(page.locator('text=Markdown Editor')).toBeVisible();
    await expect(page.locator('text=Preview')).toBeVisible();
    
    // Check textarea is present
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should render default markdown content', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that preview shows rendered content
    const previewPanel = page.locator('.prose');
    await expect(previewPanel).toBeVisible();
    
    // Check for specific rendered elements from default content
    await expect(previewPanel.locator('h1:has-text("Welcome to Markdown Preview")')).toBeVisible();
    await expect(previewPanel.locator('h2:has-text("Features")')).toBeVisible();
    await expect(previewPanel.locator('strong:has-text("live preview")')).toBeVisible();
    
    // Check that code block is rendered
    await expect(previewPanel.locator('pre')).toBeVisible();
    
    // Check that table is rendered
    await expect(previewPanel.locator('table')).toBeVisible();
  });

  test('should update preview when editing markdown', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear existing content
    await page.click('button:has-text("Clear")');
    
    // Type new markdown content
    const testMarkdown = '# Test Header\n\nThis is **bold** text.';
    await page.fill('textarea', testMarkdown);
    
    // Check that preview updates
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('h1:has-text("Test Header")')).toBeVisible();
    await expect(previewPanel.locator('strong:has-text("bold")')).toBeVisible();
  });

  test('should switch between view modes correctly', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test Editor Only mode
    await page.selectOption('select#view-mode', 'edit');
    await expect(page.locator('text=Markdown Editor')).toBeVisible();
    await expect(page.locator('text=Preview')).not.toBeVisible();
    
    // Test Preview Only mode
    await page.selectOption('select#view-mode', 'preview');
    await expect(page.locator('text=Markdown Editor')).not.toBeVisible();
    await expect(page.locator('text=Preview')).toBeVisible();
    
    // Test Split View mode
    await page.selectOption('select#view-mode', 'split');
    await expect(page.locator('text=Markdown Editor')).toBeVisible();
    await expect(page.locator('text=Preview')).toBeVisible();
  });

  test('should load sample markdown content', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear existing content first
    await page.click('button:has-text("Clear")');
    
    // Load sample content
    await page.click('button:has-text("Load Sample")');
    
    // Check that sample content is loaded
    const textarea = page.locator('textarea');
    const content = await textarea.inputValue();
    expect(content).toContain('# Sample Markdown Document');
    expect(content).toContain('## Introduction');
    expect(content).toContain('typescript');
    
    // Check that preview shows sample content
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('h1:has-text("Sample Markdown Document")')).toBeVisible();
    await expect(previewPanel.locator('h2:has-text("Introduction")')).toBeVisible();
  });

  test('should clear markdown content', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear content
    await page.click('button:has-text("Clear")');
    
    // Check that textarea is empty
    const textarea = page.locator('textarea');
    const content = await textarea.inputValue();
    expect(content).toBe('');
    
    // Check that preview is empty (no h1, h2 elements from default content)
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('h1')).not.toBeVisible();
  });

  test('should display word and character count', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear and add specific content
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', 'Hello world test');
    
    // Check word and character count
    await expect(page.locator('text=3 words')).toBeVisible();
    await expect(page.locator('text=16 characters')).toBeVisible();
  });

  test('should toggle syntax highlighting', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Add code block
    const codeMarkdown = '```javascript\nfunction test() {\n  console.log("hello");\n}\n```';
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', codeMarkdown);
    
    // Check syntax highlighting checkbox
    const syntaxCheckbox = page.locator('input[type="checkbox"]');
    await expect(syntaxCheckbox).toBeChecked();
    
    // Toggle syntax highlighting off
    await syntaxCheckbox.uncheck();
    await page.waitForTimeout(500);
    
    // Toggle back on
    await syntaxCheckbox.check();
    await page.waitForTimeout(500);
    
    // Verify code block is still rendered
    await expect(page.locator('.prose pre')).toBeVisible();
  });

  test('should handle markdown tables correctly', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    const tableMarkdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`;
    
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', tableMarkdown);
    
    // Check that table is rendered correctly
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('table')).toBeVisible();
    await expect(previewPanel.locator('th:has-text("Header 1")')).toBeVisible();
    await expect(previewPanel.locator('td:has-text("Cell 1")')).toBeVisible();
  });

  test('should handle code blocks with different languages', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    const codeMarkdown = `\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\``;
    
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', codeMarkdown);
    
    // Check that code blocks are rendered
    const previewPanel = page.locator('.prose');
    const codeBlocks = previewPanel.locator('pre');
    await expect(codeBlocks).toHaveCount(2);
  });

  test('should handle blockquotes correctly', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    const blockquoteMarkdown = '> This is a blockquote\n> with multiple lines';
    
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', blockquoteMarkdown);
    
    // Check that blockquote is rendered
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('blockquote')).toBeVisible();
    await expect(previewPanel.locator('blockquote:has-text("This is a blockquote")')).toBeVisible();
  });

  test('should download markdown file', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Add some content
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', '# Test Document\n\nThis is test content.');
    
    // Set up download promise
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('button:has-text("Download")');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Check filename
    expect(download.suggestedFilename()).toBe('document.md');
  });

  test('should disable download button when content is empty', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Clear content
    await page.click('button:has-text("Clear")');
    
    // Check that download button is disabled
    const downloadButton = page.locator('button:has-text("Download")');
    await expect(downloadButton).toBeDisabled();
    
    // Add content and check that button becomes enabled
    await page.fill('textarea', 'Some content');
    await expect(downloadButton).toBeEnabled();
  });

  test('should display quick reference guide', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that quick reference section is visible
    await expect(page.locator('text=Markdown Quick Reference')).toBeVisible();
    
    // Check for specific reference items
    await expect(page.locator('text=Headers')).toBeVisible();
    await expect(page.locator('text=Emphasis')).toBeVisible();
    await expect(page.locator('text=Lists')).toBeVisible();
    await expect(page.locator('text=Links')).toBeVisible();
    await expect(page.locator('text=Code')).toBeVisible();
    await expect(page.locator('text=Tables')).toBeVisible();
    
    // Check for specific syntax examples
    await expect(page.locator('code:has-text("# H1")')).toBeVisible();
    await expect(page.locator('code:has-text("**bold**")')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('select#view-mode')).toBeVisible();
    await expect(page.locator('button:has-text("Load Sample")')).toBeVisible();
    
    // Check that panels adapt to mobile (should stack in split view)
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('.prose')).toBeVisible();
  });

  test('should handle long content correctly', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Create long content
    let longContent = '# Long Document\n\n';
    for (let i = 1; i <= 50; i++) {
      longContent += `## Section ${i}\n\nThis is section ${i} with some content.\n\n`;
    }
    
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', longContent);
    
    // Check that preview handles long content
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('h1:has-text("Long Document")')).toBeVisible();
    await expect(previewPanel.locator('h2:has-text("Section 1")')).toBeVisible();
    
    // Check word count is updated
    await expect(page.locator('text=words')).toBeVisible();
  });

  test('should handle special markdown features', async ({ page }) => {
    await page.goto('https://markdown-preview.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    const specialMarkdown = `# Special Features

## Task Lists
- [x] Completed task
- [ ] Incomplete task

## Strikethrough
~~This text is crossed out~~

## Horizontal Rule
---

## Inline Code
Here is some \`inline code\` in a sentence.`;
    
    await page.click('button:has-text("Clear")');
    await page.fill('textarea', specialMarkdown);
    
    // Check that special features are rendered
    const previewPanel = page.locator('.prose');
    await expect(previewPanel.locator('hr')).toBeVisible(); // Horizontal rule
    await expect(previewPanel.locator('code:has-text("inline code")')).toBeVisible();
    await expect(previewPanel.locator('del, s')).toBeVisible(); // Strikethrough
  });
});
const { test, expect } = require('@playwright/test');

test.describe('Markdown Preview - Local Test', () => {
  test('should render all markdown elements correctly', async ({ page }) => {
    await page.goto('http://localhost:3005');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    console.log('Testing default content rendering...');
    
    // Check that preview panel exists
    const previewPanel = page.locator('.prose');
    await expect(previewPanel).toBeVisible();
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'markdown-initial.png', fullPage: true });
    
    // Check default content elements
    console.log('Checking headings...');
    await expect(previewPanel.locator('h1:has-text("Welcome to Markdown Preview")')).toBeVisible();
    await expect(previewPanel.locator('h2:has-text("Features")')).toBeVisible();
    await expect(previewPanel.locator('h3:has-text("Code Example")')).toBeVisible();
    
    console.log('Checking text formatting...');
    await expect(previewPanel.locator('strong:has-text("live preview")')).toBeVisible();
    
    console.log('Checking lists...');
    // Check if list items are rendered
    const listItems = previewPanel.locator('li');
    const listCount = await listItems.count();
    console.log(`Found ${listCount} list items`);
    expect(listCount).toBeGreaterThan(0);
    
    console.log('Checking code blocks...');
    // Check if code blocks are rendered
    const codeBlocks = previewPanel.locator('pre');
    const codeBlockCount = await codeBlocks.count();
    console.log(`Found ${codeBlockCount} code blocks`);
    
    // Check if the JavaScript code block contains the expected content
    const codeContent = await previewPanel.locator('pre').first().textContent();
    console.log('Code block content:', codeContent);
    
    console.log('Checking tables...');
    // Check if table is rendered
    const tables = previewPanel.locator('table');
    const tableCount = await tables.count();
    console.log(`Found ${tableCount} tables`);
    
    // Test custom markdown content
    console.log('\nTesting custom markdown content...');
    await page.click('button:has-text("Clear")');
    
    const testMarkdown = `# Test Heading

This is a **bold** text and this is *italic*.

## Lists Test

### Unordered List
- Item 1
- Item 2
- Item 3

### Ordered List
1. First
2. Second
3. Third

## Code Test

Inline code: \`const x = 42\`

\`\`\`javascript
function test() {
  console.log("Testing code block");
}
\`\`\`

## Table Test

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

> This is a blockquote

---

That's a horizontal rule above.`;
    
    await page.fill('textarea', testMarkdown);
    await page.waitForTimeout(1000);
    
    // Take screenshot after custom content
    await page.screenshot({ path: 'markdown-custom.png', fullPage: true });
    
    // Verify custom content rendering
    console.log('Verifying custom content...');
    await expect(previewPanel.locator('h1:has-text("Test Heading")')).toBeVisible();
    await expect(previewPanel.locator('strong:has-text("bold")')).toBeVisible();
    await expect(previewPanel.locator('em:has-text("italic")')).toBeVisible();
    
    // Check lists rendering
    const customListItems = await previewPanel.locator('li').count();
    console.log(`Custom content has ${customListItems} list items`);
    expect(customListItems).toBe(6); // 3 unordered + 3 ordered
    
    // Check code rendering
    const customCodeBlocks = await previewPanel.locator('pre').count();
    console.log(`Custom content has ${customCodeBlocks} code blocks`);
    
    // Check inline code
    const inlineCode = await previewPanel.locator('code:has-text("const x = 42")').count();
    console.log(`Found ${inlineCode} inline code elements`);
    
    // Check table
    const customTables = await previewPanel.locator('table').count();
    console.log(`Custom content has ${customTables} tables`);
    
    // Check blockquote
    const blockquotes = await previewPanel.locator('blockquote').count();
    console.log(`Found ${blockquotes} blockquotes`);
    
    // Check horizontal rule
    const hrs = await previewPanel.locator('hr').count();
    console.log(`Found ${hrs} horizontal rules`);
    
    console.log('\nAll tests completed!');
  });
});
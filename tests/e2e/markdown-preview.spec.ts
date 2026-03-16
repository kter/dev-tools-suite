import { test, expect } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('markdown-preview')

test.describe('Markdown Preview', () => {
  test('renders default markdown content correctly', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    const previewPanel = page.locator('.prose')
    await expect(previewPanel).toBeVisible()

    await expect(previewPanel.locator('h1:has-text("Welcome to Markdown Preview")')).toBeVisible()
    await expect(previewPanel.locator('h2:has-text("Features")')).toBeVisible()
    await expect(previewPanel.locator('strong:has-text("live preview")')).toBeVisible()

    const listItems = previewPanel.locator('li')
    expect(await listItems.count()).toBeGreaterThan(0)
  })

  test('renders custom markdown content', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    await page.click('button:has-text("Clear")')

    const testMarkdown = `# Test Heading

This is a **bold** text and this is *italic*.

## Lists Test

- Item 1
- Item 2
- Item 3

1. First
2. Second
3. Third

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

> This is a blockquote

---`

    await page.fill('textarea', testMarkdown)
    await page.waitForTimeout(500)

    const previewPanel = page.locator('.prose')
    await expect(previewPanel.locator('h1:has-text("Test Heading")')).toBeVisible()
    await expect(previewPanel.locator('strong:has-text("bold")')).toBeVisible()
    await expect(previewPanel.locator('em:has-text("italic")')).toBeVisible()
    await expect(previewPanel.locator('blockquote')).toBeVisible()
    await expect(previewPanel.locator('hr')).toBeVisible()
    await expect(previewPanel.locator('table')).toBeVisible()

    const listItems = previewPanel.locator('li')
    expect(await listItems.count()).toBe(6)
  })
})

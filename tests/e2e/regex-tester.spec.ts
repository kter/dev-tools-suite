import { test, expect } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('regex-tester')

test.describe('Regex Tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('finds matches for a simple pattern', async ({ page }) => {
    await page.locator('input[placeholder*="regex"]').fill('\\d+')
    await page.locator('textarea[placeholder*="test"]').fill('foo 123 bar 456')

    await expect(page.getByText('2 matches found')).toBeVisible()
  })

  test('shows no matches when pattern does not match', async ({ page }) => {
    await page.locator('input[placeholder*="regex"]').fill('xyz')
    await page.locator('textarea[placeholder*="test"]').fill('hello world')

    await expect(page.getByText('No matches found')).toBeVisible()
  })

  test('shows error for invalid regex', async ({ page }) => {
    await page.locator('input[placeholder*="regex"]').fill('[invalid')
    await page.locator('textarea[placeholder*="test"]').fill('test')

    await expect(page.locator('.text-red-600, .text-red-400')).toBeVisible()
  })

  test('performs replacement', async ({ page }) => {
    await page.locator('input[placeholder*="regex"]').fill('foo')
    await page.locator('textarea[placeholder*="test"]').fill('foo bar foo')
    await page.locator('input[placeholder*="replacement"]').fill('baz')

    await expect(page.getByText('baz bar baz')).toBeVisible()
  })

  test('loads a sample pattern', async ({ page }) => {
    await page.click('button:has-text("Load Sample")')

    const patternInput = page.locator('input[placeholder*="regex"]')
    const value = await patternInput.inputValue()
    expect(value.length).toBeGreaterThan(0)
  })
})

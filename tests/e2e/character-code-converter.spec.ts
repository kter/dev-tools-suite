import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('character-code-converter')

test.describe('Character Code Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('shows character analysis for ASCII text', async ({ page }) => {
    await page.locator('textarea').fill('A')

    await expect(page.getByText('65')).toBeVisible()
    await expect(page.getByText('0x41')).toBeVisible()
    await expect(page.getByText('U+0041')).toBeVisible()
    await expect(page.getByText('01000001')).toBeVisible()
  })

  test('shows N/A for ASCII column on non-ASCII chars', async ({ page }) => {
    await page.locator('textarea').fill('あ')

    await expect(page.getByText('N/A')).toBeVisible()
  })

  test('shows full text encodings', async ({ page }) => {
    await page.locator('textarea').fill('Hello')

    await expect(page.getByText('Base64:')).toBeVisible()
    await expect(page.getByText('SGVsbG8=')).toBeVisible()
    await expect(page.getByText('URL Encoded:')).toBeVisible()
    await expect(page.getByText('HTML Entities:')).toBeVisible()
  })

  test('shows table for multiple characters', async ({ page }) => {
    await page.locator('textarea').fill('Hi')

    const rows = page.locator('tbody tr')
    expect(await rows.count()).toBe(2)
  })

  test('clears results when input is cleared', async ({ page }) => {
    await page.locator('textarea').fill('Hello')
    await expect(page.locator('tbody tr').first()).toBeVisible()

    await page.locator('textarea').fill('')
    await expect(page.locator('tbody')).not.toBeVisible()
  })
})

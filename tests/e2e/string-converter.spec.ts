import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('string-converter')

test.describe('String Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('encodes text to Base64', async ({ page }) => {
    await page.locator('button:has-text("Base64 Encode")').click()
    await page.locator('textarea').first().fill('Hello World')

    await expect(page.locator('textarea').nth(1)).toHaveValue('SGVsbG8gV29ybGQ=')
  })

  test('decodes Base64 to text', async ({ page }) => {
    await page.locator('button:has-text("Base64 Decode")').click()
    await page.locator('textarea').first().fill('SGVsbG8gV29ybGQ=')

    await expect(page.locator('textarea').nth(1)).toHaveValue('Hello World')
  })

  test('URL-encodes text', async ({ page }) => {
    await page.locator('button:has-text("URL Encode")').click()
    await page.locator('textarea').first().fill('Hello World!')

    const output = page.locator('textarea').nth(1)
    await expect(output).toHaveValue('Hello%20World!')
  })

  test('converts snake_case to camelCase', async ({ page }) => {
    await page.locator('button:has-text("snake_case")').click()
    await page.locator('textarea').first().fill('user_name')

    await expect(page.locator('textarea').nth(1)).toHaveValue('userName')
  })

  test('converts camelCase to snake_case', async ({ page }) => {
    await page.locator('button:has-text("camelCase")').click()
    await page.locator('textarea').first().fill('userName')

    await expect(page.locator('textarea').nth(1)).toHaveValue('user_name')
  })

  test('can swap input and output', async ({ page }) => {
    await page.locator('button:has-text("Base64 Encode")').click()
    await page.locator('textarea').first().fill('Hello World')

    const swapButton = page.getByRole('button', { name: 'Swap' })
    await expect(swapButton).toBeVisible()
    await swapButton.click()

    await expect(page.locator('textarea').first()).toHaveValue('SGVsbG8gV29ybGQ=')
  })
})

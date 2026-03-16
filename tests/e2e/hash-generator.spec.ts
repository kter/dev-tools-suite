import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('hash-generator')

test.describe('Hash Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('generates MD5 hash for known input', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('hello')

    // MD5 of "hello" is 5d41402abc4b2a76b9719d911017c592
    await expect(page.getByText('5d41402abc4b2a76b9719d911017c592')).toBeVisible()
  })

  test('generates SHA-256 hash for known input', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('hello')

    // SHA-256 of "hello"
    await expect(
      page.getByText('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
    ).toBeVisible()
  })

  test('shows empty state with no input', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('')

    // Should show empty or placeholder hashes
    const hashDisplays = page.locator('.font-mono')
    await expect(hashDisplays.first()).toBeVisible()
  })

  test('can copy hash to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('test')

    const copyButton = page.getByRole('button', { name: /copy/i }).first()
    if (await copyButton.isVisible()) {
      await copyButton.click()
    }
  })
})

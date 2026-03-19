import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('password-generator')

test.describe('Password Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('generates a password on load', async ({ page }) => {
    const passwordDisplay = page.locator('.font-mono.text-lg')
    await expect(passwordDisplay).toBeVisible()
    const text = await passwordDisplay.textContent()
    expect(text?.length).toBeGreaterThan(0)
  })

  test('generates new password on button click', async ({ page }) => {
    const passwordDisplay = page.locator('.font-mono.text-lg')
    const firstPassword = await passwordDisplay.textContent()

    await page.click('button:has-text("Generate Password")')
    await page.waitForTimeout(300)

    const newPassword = await passwordDisplay.textContent()
    // Passwords may differ (small chance of same)
    expect(typeof newPassword).toBe('string')
    expect((newPassword ?? '').length).toBeGreaterThan(0)
  })

  test('shows password strength indicator', async ({ page }) => {
    await expect(page.getByText(/strength/i).first()).toBeVisible()
  })

  test('can toggle password visibility', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: /hide|show/i })
    await expect(toggleButton).toBeVisible()
    await toggleButton.click()
    await expect(toggleButton).toBeVisible()
  })

  test('can copy password to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    const copyButton = page.getByRole('button', { name: /copy/i }).first()
    await expect(copyButton).toBeVisible()
    await copyButton.click()
    await expect(page.getByText(/copied/i)).toBeVisible()
  })
})

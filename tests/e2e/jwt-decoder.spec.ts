import { test, expect } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('jwt-decoder')

// Sample JWT for testing
const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

test.describe('JWT Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('decodes a valid JWT token', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_JWT)

    await expect(page.getByText('Valid JWT token structure')).toBeVisible()
    await expect(page.getByText('Header')).toBeVisible()
    await expect(page.getByText('Payload')).toBeVisible()
    await expect(page.getByText('Signature')).toBeVisible()
  })

  test('shows algorithm in header section', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_JWT)

    await expect(page.getByText('HS256')).toBeVisible()
    await expect(page.getByText('HMAC using SHA-256')).toBeVisible()
  })

  test('shows error for invalid JWT', async ({ page }) => {
    await page.locator('textarea').fill('not.a.valid.jwt.token')

    await expect(page.locator('.text-red-600, .text-red-400')).toBeVisible()
  })

  test('loads sample JWT', async ({ page }) => {
    await page.click('button:has-text("Load Sample")')

    await expect(page.getByText('Valid JWT token structure')).toBeVisible()
  })

  test('can copy header section', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.locator('textarea').fill(SAMPLE_JWT)

    const copyButton = page.getByRole('button', { name: /copy/i }).first()
    await copyButton.click()
    // No error should appear
  })

  test('clears token on Clear button click', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_JWT)
    await page.click('button:has-text("Clear")')

    await expect(page.locator('textarea')).toHaveValue('')
  })
})

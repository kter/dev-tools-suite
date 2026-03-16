import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('unix-time-converter')

test.describe('Unix Time Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('shows current Unix timestamp', async ({ page }) => {
    const currentTimestamp = page.locator('.font-mono.text-lg').first()
    await expect(currentTimestamp).toBeVisible()

    const value = await currentTimestamp.textContent()
    expect(parseInt(value ?? '0')).toBeGreaterThan(1700000000)
  })

  test('converts Unix epoch (0) to date', async ({ page }) => {
    const input = page.locator('input[type="number"]')
    await input.fill('0')

    await expect(page.getByText('1970')).toBeVisible()
  })

  test('converts Y2K timestamp', async ({ page }) => {
    const input = page.locator('input[type="number"]')
    await input.fill('946684800')

    await expect(page.getByText('2000')).toBeVisible()
  })

  test('converts date and time to Unix timestamp', async ({ page }) => {
    const dateInput = page.locator('input[type="date"]')
    const timeInput = page.locator('input[type="time"]')

    await dateInput.fill('2000-01-01')
    await timeInput.fill('00:00')

    // Should show Unix timestamp
    await expect(page.getByText('946684800')).toBeVisible()
  })

  test('loads common timestamp presets', async ({ page }) => {
    const epochButton = page.getByText('Unix Epoch')
    await expect(epochButton).toBeVisible()
    await epochButton.click()

    await expect(page.getByText('1970')).toBeVisible()
  })
})

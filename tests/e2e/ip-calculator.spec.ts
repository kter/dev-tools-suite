import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('ip-calculator')

test.describe('IP Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('shows correct subnet info for 192.168.1.1/24', async ({ page }) => {
    const input = page.locator('#ip-input')
    await input.fill('192.168.1.1/24')

    await expect(page.getByText('255.255.255.0')).toBeVisible()
    await expect(page.getByText('192.168.1.0')).toBeVisible()
    await expect(page.getByText('192.168.1.255')).toBeVisible()
    await expect(page.getByText('Network Class:').locator('..').locator('code')).toContainText('C')
  })

  test('shows correct usable host count for /24', async ({ page }) => {
    const input = page.locator('#ip-input')
    await input.fill('192.168.1.1/24')

    await expect(page.getByText('254', { exact: true })).toBeVisible()
  })

  test('shows error for invalid IP input', async ({ page }) => {
    const input = page.locator('#ip-input')
    await input.fill('999.999.999.999/24')

    await expect(page.getByText(/invalid/i)).toBeVisible()
  })

  test('shows binary representation', async ({ page }) => {
    const input = page.locator('#ip-input')
    await input.fill('192.168.1.1/24')

    await expect(page.getByText('11000000.10101000.00000001.00000001')).toBeVisible()
  })

  test('calculates Class A network', async ({ page }) => {
    const input = page.locator('#ip-input')
    await input.fill('10.0.0.0/8')

    await expect(page.getByText('255.0.0.0')).toBeVisible()
    await expect(page.getByText('Network Class:').locator('..').locator('code')).toContainText('A')
  })
})

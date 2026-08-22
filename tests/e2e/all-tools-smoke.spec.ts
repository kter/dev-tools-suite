import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const tools = [
  'amazon-url-normalizer',
  'badger-image-generator',
  'character-code-converter',
  'code-diff',
  'hash-generator',
  'image-converter',
  'ip-calculator',
  'ip-info',
  'json-yaml-converter',
  'jwt-decoder',
  'landing-page',
  'lorem-ipsum-generator',
  'map-distance-calculator',
  'markdown-preview',
  'mic-test',
  'password-generator',
  'placeholder-generator',
  'poster-splitter',
  'qr-generator',
  'regex-tester',
  'string-converter',
  'timer',
  'timezone-converter',
  'unix-time-converter',
] as const

test.describe('All deployed tools', () => {
  test.skip(!['dev', 'prd'].includes(process.env.TARGET ?? ''), 'Requires a deployed target')

  for (const tool of tools) {
    test(`${tool} serves a usable page without runtime errors`, async ({ page }) => {
      const pageErrors: string[] = []
      page.on('pageerror', error => pageErrors.push(error.message))

      const response = await page.goto(getToolUrl(tool), { waitUntil: 'networkidle' })

      expect(response?.ok()).toBe(true)
      await expect(page.locator('body')).toBeVisible()
      await expect
        .poll(async () => (await page.locator('body').innerText()).trim().length)
        .toBeGreaterThan(20)
      expect(pageErrors).toEqual([])
    })
  }
})

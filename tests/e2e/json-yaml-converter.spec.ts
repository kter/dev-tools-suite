import { expect, test } from '@playwright/test'
import { getToolUrl } from './helpers/url'

const BASE_URL = getToolUrl('json-yaml-converter')

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "active": true
}`

test.describe('JSON/YAML Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('converts JSON to YAML', async ({ page }) => {
    const inputSelect = page.locator('select').first()
    const outputSelect = page.locator('select').nth(1)

    await inputSelect.selectOption('json')
    await outputSelect.selectOption('yaml')

    const textarea = page.locator('textarea').first()
    await textarea.fill(SAMPLE_JSON)

    await expect(page.locator('textarea').nth(1)).toContainText('name: John Doe')
    await expect(page.locator('textarea').nth(1)).toContainText('age: 30')
  })

  test('converts YAML to JSON', async ({ page }) => {
    const inputSelect = page.locator('select').first()
    const outputSelect = page.locator('select').nth(1)

    await inputSelect.selectOption('yaml')
    await outputSelect.selectOption('json')

    const yamlInput = `name: John Doe\nage: 30\nactive: true`
    await page.locator('textarea').first().fill(yamlInput)

    const output = page.locator('textarea').nth(1)
    await expect(output).toContainText('"name": "John Doe"')
    await expect(output).toContainText('"age": 30')
  })

  test('shows validation error for invalid JSON', async ({ page }) => {
    const inputSelect = page.locator('select').first()
    await inputSelect.selectOption('json')

    await page.locator('textarea').first().fill('{invalid json}')

    await expect(page.getByText(/invalid json/i)).toBeVisible()
  })

  test('loads sample data', async ({ page }) => {
    await page.click('button:has-text("Load Sample")')

    const inputTextarea = page.locator('textarea').first()
    const value = await inputTextarea.inputValue()
    expect(value.length).toBeGreaterThan(0)
  })

  test('can copy output', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    const inputSelect = page.locator('select').first()
    await inputSelect.selectOption('json')
    await page.locator('textarea').first().fill(SAMPLE_JSON)

    const copyButton = page.getByRole('button', { name: /copy/i })
    await expect(copyButton).toBeVisible()
    await copyButton.click()
  })
})

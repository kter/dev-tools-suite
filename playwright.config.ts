import { defineConfig, devices } from '@playwright/test'

const TARGET = process.env.TARGET ?? 'local'

const toolPorts: Record<string, number> = {
  'markdown-preview': 3005,
  'ip-calculator': 3006,
  'password-generator': 3007,
  'regex-tester': 3008,
  'jwt-decoder': 3009,
  'string-converter': 3010,
  'json-yaml-converter': 3011,
  'unix-time-converter': 3012,
  'character-code-converter': 3013,
  'hash-generator': 3014,
}

export function getBaseUrl(tool: string): string {
  if (TARGET === 'prd') return `https://${tool}.devtools.site`
  if (TARGET === 'dev') return `https://${tool}.dev.devtools.site`
  const port = toolPorts[tool] ?? 3000
  return `http://localhost:${port}`
}

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'local',
      use: { ...devices['Desktop Chrome'] },
      grep: TARGET === 'local' ? undefined : /^$/,
    },
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'] },
      grep: TARGET === 'dev' ? undefined : /^$/,
    },
    {
      name: 'prd',
      use: { ...devices['Desktop Chrome'] },
      grep: TARGET === 'prd' ? undefined : /^$/,
    },
  ],
})

import { describe, expect, it } from 'vitest'
import { buildToolCatalog } from '../../../tools/landing-page/utils/tool-catalog'

function findTool(toolId: string, isDevEnvironment: boolean) {
  const tool = buildToolCatalog(isDevEnvironment).find(entry => entry.id === toolId)

  expect(tool).toBeDefined()

  return tool!
}

describe('landing-page tool catalog', () => {
  it('builds the new external service URLs for dev', () => {
    expect(findTool('version-checker', true).url).toBe('https://version-checker.dev.devtools.site')
    expect(findTool('easy-print', true).url).toBe('https://easy-print.dev.devtools.site')
    expect(findTool('oil-dashboard', true).url).toBe('https://oil-dashboard.dev.devtools.site')
    expect(findTool('code-map', true).url).toBe('https://codemap.dev.devtools.site')
    expect(findTool('routine-ops', true).url).toBe('https://routine.dev.devtools.site/')
  })

  it('builds the new external service URLs for prd', () => {
    expect(findTool('version-checker', false).url).toBe('https://version-checker.dev.devtools.site')
    expect(findTool('easy-print', false).url).toBe('https://easy-print.devtools.site')
    expect(findTool('oil-dashboard', false).url).toBe('https://oil-dashboard.devtools.site')
    expect(findTool('code-map', false).url).toBe('https://codemap.dev.devtools.site')
    expect(findTool('routine-ops', false).url).toBe('https://routine.devtools.site/')
  })

  it('adds PRD fallback warning badges only where required', () => {
    expect(findTool('version-checker', false)).toMatchObject({
      statusLabel: 'PRD -> DEV',
      statusVariant: 'warning',
    })
    expect(findTool('code-map', false)).toMatchObject({
      statusLabel: 'PRD -> DEV',
      statusVariant: 'warning',
    })
    expect(findTool('easy-print', false)).toMatchObject({
      statusLabel: 'Coming Soon',
      statusVariant: 'warning',
    })
    expect(findTool('oil-dashboard', false).statusLabel).toBeUndefined()
  })

  it('does not add fallback warning badges in dev', () => {
    expect(findTool('version-checker', true).statusLabel).toBeUndefined()
    expect(findTool('code-map', true).statusLabel).toBeUndefined()
  })

  it('keeps the new services appended after AI Notes in the requested order', () => {
    const toolIds = buildToolCatalog(false).map(tool => tool.id)

    expect(toolIds.slice(-9)).toEqual([
      'version-checker',
      'easy-print',
      'oil-dashboard',
      'code-map',
      'routine-ops',
      'yoyaku-kun',
      'linux-pkg',
      'satellite',
      'aws-cert-mgmt',
    ])
  })

  it('builds environment-specific URLs for the satellite tracker', () => {
    expect(findTool('satellite', true).url).toBe('https://satellite.dev.devtools.site')
    expect(findTool('satellite', false).url).toBe('https://satellite.devtools.site')
  })

  it('builds environment-specific URLs for the AWS cert expiry tool', () => {
    expect(findTool('aws-cert-mgmt', true).url).toBe('https://aws-cert-mgmt.dev.devtools.site')
    expect(findTool('aws-cert-mgmt', false).url).toBe('https://aws-cert-mgmt.devtools.site')
  })

  it('uses the hardcoded LINE friend-add link for yoyaku-kun in both envs', () => {
    expect(findTool('yoyaku-kun', true).url).toBe('https://line.me/R/ti/p/@390decxm')
    expect(findTool('yoyaku-kun', false).url).toBe('https://line.me/R/ti/p/@390decxm')
  })

  it('uses the hardcoded repo URL for linux-pkg in both envs', () => {
    expect(findTool('linux-pkg', true).url).toBe('https://repo.devtools.site')
    expect(findTool('linux-pkg', false).url).toBe('https://repo.devtools.site')
  })
})

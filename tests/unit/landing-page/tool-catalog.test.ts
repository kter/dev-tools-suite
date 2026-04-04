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
  })

  it('builds the new external service URLs for prd', () => {
    expect(findTool('version-checker', false).url).toBe('https://version-checker.dev.devtools.site')
    expect(findTool('easy-print', false).url).toBe('https://easy-print.devtools.site')
    expect(findTool('oil-dashboard', false).url).toBe('https://oil-dashboard.devtools.site')
    expect(findTool('code-map', false).url).toBe('https://codemap.dev.devtools.site')
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
    expect(findTool('easy-print', false).statusLabel).toBeUndefined()
    expect(findTool('oil-dashboard', false).statusLabel).toBeUndefined()
  })

  it('does not add fallback warning badges in dev', () => {
    expect(findTool('version-checker', true).statusLabel).toBeUndefined()
    expect(findTool('code-map', true).statusLabel).toBeUndefined()
  })

  it('keeps the new services appended after AI Notes in the requested order', () => {
    const toolIds = buildToolCatalog(false).map(tool => tool.id)

    expect(toolIds.slice(-4)).toEqual([
      'version-checker',
      'easy-print',
      'oil-dashboard',
      'code-map',
    ])
  })
})

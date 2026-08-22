import { describe, expect, it } from 'vitest'
import { validateTool, validateToolArray } from '../../../tools/landing-page/types/tool'

describe('landing-page tool type validation', () => {
  it('accepts status metadata when valid', () => {
    expect(
      validateTool({
        id: 'version-checker',
        name: 'Version Checker',
        description: 'Open the Version Checker service',
        url: 'https://version-checker.dev.devtools.site',
        statusLabel: 'PRD -> DEV',
        statusVariant: 'warning',
      })
    ).toBe(true)
  })

  it('rejects blank status labels', () => {
    expect(
      validateTool({
        id: 'version-checker',
        name: 'Version Checker',
        description: 'Open the Version Checker service',
        url: 'https://version-checker.dev.devtools.site',
        statusLabel: '   ',
      })
    ).toBe(false)
  })

  it('rejects unsupported status variants', () => {
    expect(
      validateTool({
        id: 'version-checker',
        name: 'Version Checker',
        description: 'Open the Version Checker service',
        url: 'https://version-checker.dev.devtools.site',
        statusVariant: 'danger',
      })
    ).toBe(false)
  })

  it('validates arrays that include tools with status metadata', () => {
    expect(
      validateToolArray([
        {
          id: 'easy-print',
          name: 'Easy Print',
          description: 'Open the Easy Print service',
          url: 'https://easy-print.devtools.site',
        },
        {
          id: 'code-map',
          name: 'Code Map',
          description: 'Open the Code Map service',
          url: 'https://codemap.dev.devtools.site',
          statusLabel: 'PRD -> DEV',
          statusVariant: 'warning',
        },
      ])
    ).toBe(true)
  })
})

import yaml from 'js-yaml'
import toml from 'toml'

export type SupportedFormat = 'json' | 'yaml' | 'toml'

export interface FormatOptions {
  prettyFormat: boolean
  jsonIndent: string
}

export function parseInput(inputText: string, inputFormat: SupportedFormat): unknown {
  const trimmed = inputText.trim()
  if (!trimmed) return null

  switch (inputFormat) {
    case 'json':
      return JSON.parse(trimmed)
    case 'yaml':
      return yaml.load(trimmed)
    case 'toml':
      return toml.parse(trimmed)
    default:
      throw new Error('Unsupported input format')
  }
}

export function formatOutput(data: unknown, outputFormat: SupportedFormat, options: FormatOptions): string {
  switch (outputFormat) {
    case 'json': {
      const indentValue = options.jsonIndent === 'tab' ? '\t' : parseInt(options.jsonIndent)
      return options.prettyFormat
        ? JSON.stringify(data, null, indentValue)
        : JSON.stringify(data)
    }
    case 'yaml':
      return yaml.dump(data, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      })
    case 'toml':
      return stringifyToml(data as Record<string, unknown>)
    default:
      throw new Error('Unsupported output format')
  }
}

export function stringifyToml(obj: Record<string, unknown>, prefix = ''): string {
  let result = ''
  const tables: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      tables[key] = value
    } else {
      if (Array.isArray(value)) {
        result += `${key} = ${JSON.stringify(value)}\n`
      } else if (typeof value === 'string') {
        result += `${key} = "${value}"\n`
      } else {
        result += `${key} = ${value}\n`
      }
    }
  }

  for (const [key, value] of Object.entries(tables)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    result += `\n[${fullKey}]\n`
    result += stringifyToml(value as Record<string, unknown>, fullKey)
  }

  return result
}

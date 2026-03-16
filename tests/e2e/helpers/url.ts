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

export function getToolUrl(tool: string, path = ''): string {
  let base: string
  if (TARGET === 'prd') {
    base = tool === 'landing-page'
      ? 'https://devtools.site'
      : `https://${tool}.devtools.site`
  } else if (TARGET === 'dev') {
    base = tool === 'landing-page'
      ? 'https://dev.devtools.site'
      : `https://${tool}.dev.devtools.site`
  } else {
    const port = toolPorts[tool] ?? 3000
    base = `http://localhost:${port}`
  }
  return `${base}${path}`
}

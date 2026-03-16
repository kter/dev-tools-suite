export interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
}

export interface RegexMatch {
  value: string
  index: number
  groups: string[]
}

export function buildFlagString(flags: RegexFlags): string {
  let flagString = ''
  if (flags.global) flagString += 'g'
  if (flags.ignoreCase) flagString += 'i'
  if (flags.multiline) flagString += 'm'
  if (flags.dotAll) flagString += 's'
  return flagString
}

export function parseRegexMatches(pattern: string, testString: string, flags: RegexFlags): RegexMatch[] {
  const flagString = buildFlagString(flags)
  const regex = new RegExp(pattern, flagString)
  const foundMatches: RegexMatch[] = []
  let match: RegExpExecArray | null

  if (flags.global) {
    while ((match = regex.exec(testString)) !== null) {
      foundMatches.push({
        value: match[0],
        index: match.index!,
        groups: match.slice(1)
      })
      if (match[0] === '') {
        regex.lastIndex++
      }
    }
  } else {
    match = regex.exec(testString)
    if (match) {
      foundMatches.push({
        value: match[0],
        index: match.index!,
        groups: match.slice(1)
      })
    }
  }

  return foundMatches
}

export function performReplace(testString: string, regex: RegExp, replacement: string): string {
  return testString.replace(regex, replacement)
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;')
}

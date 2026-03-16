import * as he from 'he'

export function base64Encode(input: string): string {
  if (!input) return ''
  return btoa(unescape(encodeURIComponent(input)))
}

export function base64Decode(input: string): string {
  if (!input) return ''
  const decoded = atob(input.replace(/[^A-Za-z0-9+/]/g, ''))
  return decodeURIComponent(escape(decoded))
}

export function urlEncode(input: string): string {
  if (!input) return ''
  return encodeURIComponent(input)
}

export function urlDecode(input: string): string {
  if (!input) return ''
  return decodeURIComponent(input)
}

export function htmlEscape(input: string): string {
  if (!input) return ''
  return he.encode(input, { useNamedReferences: true })
}

export function htmlUnescape(input: string): string {
  if (!input) return ''
  return he.decode(input)
}

export function snakeToCamel(input: string): string {
  if (!input) return ''
  return input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function camelToSnake(input: string): string {
  if (!input) return ''
  return input.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
}

export function toUpperCase(input: string): string {
  if (!input) return ''
  return input.toUpperCase()
}

export function toLowerCase(input: string): string {
  if (!input) return ''
  return input.toLowerCase()
}

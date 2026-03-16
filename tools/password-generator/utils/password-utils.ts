export interface PasswordOptions {
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
export const NUMBER_CHARS = '0123456789'
export const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
export const SIMILAR_CHARS = '0Ol1I'
export const AMBIGUOUS_CHARS = '{}[]()//\\\'";,<>~'

export function getCharacterSet(options: PasswordOptions): string {
  let charset = ''

  if (options.includeUppercase) charset += UPPERCASE_CHARS
  if (options.includeLowercase) charset += LOWERCASE_CHARS
  if (options.includeNumbers) charset += NUMBER_CHARS
  if (options.includeSymbols) charset += SYMBOL_CHARS

  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('')
  }

  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('')
  }

  return charset
}

export function getSecureRandomInt(max: number, cryptoImpl?: { getRandomValues: (arr: Uint32Array) => void }): number {
  const crypto = cryptoImpl ?? (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined)
  if (crypto && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
  }
  return Math.floor(Math.random() * max)
}

export interface CharacterInfo {
  character: string
  ascii: string
  hex: string
  unicode: string
  utf8: string
  binary: string
}

export interface FullTextEncodings {
  base64: string
  urlEncoded: string
  htmlEntities: string
}

export function convertChar(char: string): CharacterInfo {
  const code = char.charCodeAt(0)
  const utf8Bytes = new TextEncoder().encode(char)

  return {
    character:
      char === ' ' ? '(space)' : char === '\n' ? '(newline)' : char === '\t' ? '(tab)' : char,
    ascii: code <= 127 ? code.toString() : 'N/A',
    hex: '0x' + code.toString(16).toUpperCase().padStart(2, '0'),
    unicode: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
    utf8: Array.from(utf8Bytes)
      .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' '),
    binary: code.toString(2).padStart(8, '0'),
  }
}

export function encodeFullText(text: string): FullTextEncodings {
  return {
    base64: btoa(unescape(encodeURIComponent(text))),
    urlEncoded: encodeURIComponent(text),
    htmlEntities: text
      .split('')
      .map(char => {
        const code = char.charCodeAt(0)
        return code > 127 || ['<', '>', '&', '"', "'"].includes(char) ? `&#${code};` : char
      })
      .join(''),
  }
}

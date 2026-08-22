const ALGORITHM_DESCRIPTIONS: Record<string, string> = {
  HS256: 'HMAC using SHA-256',
  HS384: 'HMAC using SHA-384',
  HS512: 'HMAC using SHA-512',
  RS256: 'RSA using SHA-256',
  RS384: 'RSA using SHA-384',
  RS512: 'RSA using SHA-512',
  ES256: 'ECDSA using P-256 and SHA-256',
  ES384: 'ECDSA using P-384 and SHA-384',
  ES512: 'ECDSA using P-521 and SHA-512',
  PS256: 'RSA PSS using SHA-256',
  PS384: 'RSA PSS using SHA-384',
  PS512: 'RSA PSS using SHA-512',
  none: 'No signature',
}

export function getAlgorithmDescription(alg: string): string {
  return ALGORITHM_DESCRIPTIONS[alg] ?? 'Unknown algorithm'
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function formatClaimValue(key: string, value: unknown): string {
  if (key === 'exp' || key === 'nbf' || key === 'iat') {
    return formatTimestamp(value as number)
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return String(value)
}

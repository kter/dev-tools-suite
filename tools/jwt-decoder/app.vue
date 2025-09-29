<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            JWT Decoder
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-300">Decode and validate JSON Web Tokens with detailed information display</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- JWT Input -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">JWT Token</h2>
            <div class="flex gap-2">
              <button
                @click="loadSampleJWT"
                class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Load Sample
              </button>
              <button
                @click="clearToken"
                class="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          
          <textarea
            v-model="jwtToken"
            @input="decodeJWT"
            placeholder="Paste your JWT token here..."
            class="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          ></textarea>
          
          <!-- Token validation status -->
          <div v-if="tokenError" class="mt-2 text-red-600 dark:text-red-400 text-sm">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ tokenError }}</span>
            </div>
          </div>
          
          <div v-else-if="jwtToken && decodedToken" class="mt-2 text-green-600 dark:text-green-400 text-sm">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Valid JWT token structure</span>
            </div>
          </div>
          
          <!-- Token parts visualization -->
          <div v-if="jwtToken && !tokenError" class="mt-4">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">Token Structure:</div>
            <div class="font-mono text-xs break-all">
              <span class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-1">{{ tokenParts.header }}</span>
              <span class="text-gray-400 dark:text-gray-500">.</span>
              <span class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-1">{{ tokenParts.payload }}</span>
              <span class="text-gray-400 dark:text-gray-500">.</span>
              <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1">{{ tokenParts.signature }}</span>
            </div>
            <div class="flex gap-4 mt-2 text-xs">
              <span class="text-red-800 dark:text-red-300">Header</span>
              <span class="text-purple-800 dark:text-purple-300">Payload</span>
              <span class="text-blue-800 dark:text-blue-300">Signature</span>
            </div>
          </div>
        </div>

        <div v-if="decodedToken" class="space-y-6">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                Header
              </h3>
              <button
                @click="copySection('header')"
                class="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
              </button>
            </div>
            <pre class="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 text-sm overflow-x-auto text-gray-900 dark:text-white"><code>{{ JSON.stringify(decodedToken.header, null, 2) }}</code></pre>
            
            <!-- Header fields explanation -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="decodedToken.header.alg">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Algorithm</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ decodedToken.header.alg }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-500">{{ getAlgorithmDescription(decodedToken.header.alg) }}</div>
              </div>
              <div v-if="decodedToken.header.typ">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Type</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ decodedToken.header.typ }}</div>
              </div>
              <div v-if="decodedToken.header.kid">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Key ID</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ decodedToken.header.kid }}</div>
              </div>
            </div>
          </div>

          <!-- Payload -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                Payload
              </h3>
              <button
                @click="copySection('payload')"
                class="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
              </button>
            </div>
            <pre class="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 text-sm overflow-x-auto text-gray-900 dark:text-white"><code>{{ JSON.stringify(decodedToken.payload, null, 2) }}</code></pre>
            
            <!-- Payload claims -->
            <div class="mt-4">
              <h4 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Standard Claims</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="claim in standardClaims" :key="claim.key" v-show="decodedToken.payload[claim.key]">
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ claim.name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ formatClaimValue(claim.key, decodedToken.payload[claim.key]) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-500">{{ claim.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Token Status -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Status</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Expiration Status -->
              <div class="p-4 rounded-xl" :class="expirationStatus.bgClass">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5" :class="expirationStatus.iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="font-medium" :class="expirationStatus.textClass">Expiration</div>
                </div>
                <div class="text-sm" :class="expirationStatus.textClass">{{ expirationStatus.message }}</div>
              </div>

              <!-- Not Before Status -->
              <div v-if="decodedToken.payload.nbf" class="p-4 rounded-xl" :class="notBeforeStatus.bgClass">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5" :class="notBeforeStatus.iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="font-medium" :class="notBeforeStatus.textClass">Not Before</div>
                </div>
                <div class="text-sm" :class="notBeforeStatus.textClass">{{ notBeforeStatus.message }}</div>
              </div>

              <!-- Issued At -->
              <div v-if="decodedToken.payload.iat" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <div class="font-medium text-blue-800 dark:text-blue-300">Issued At</div>
                </div>
                <div class="text-sm text-blue-700 dark:text-blue-400">{{ formatTimestamp(decodedToken.payload.iat) }}</div>
              </div>

              <!-- Algorithm -->
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <div class="font-medium text-gray-800 dark:text-gray-200">Algorithm</div>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">{{ decodedToken.header.alg || 'None' }}</div>
              </div>
            </div>
          </div>

          <!-- Signature -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                Signature
              </h3>
              <button
                @click="copySection('signature')"
                class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
              </button>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 font-mono text-sm break-all text-gray-900 dark:text-white">
              {{ tokenParts.signature }}
            </div>
            <div class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div class="text-yellow-800 dark:text-yellow-300 text-sm">
                  <div class="font-medium">Signature Verification</div>
                  <div>To verify this token's signature, you need the secret key or public key used to sign it. This tool only decodes the token structure.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Information -->
        <div v-if="!decodedToken" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            About JWT Tokens
          </h3>
          <div class="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
            <p>JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims to be transferred between two parties.</p>
            <p>A JWT consists of three parts separated by dots: Header.Payload.Signature</p>
            <ul class="list-disc list-inside space-y-1 mt-3">
              <li><strong>Header:</strong> Contains metadata about the token (algorithm, type)</li>
              <li><strong>Payload:</strong> Contains the claims (statements about an entity)</li>
              <li><strong>Signature:</strong> Used to verify the token hasn't been tampered with</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Universal Support Me Button -->
    <KofiButton kofi-username="kterr" />
</template>

<script setup lang="ts">
import { decodeJwt } from 'jose'
import KofiButton from '../shared/components/KofiButton.vue'

// Initialize dark mode
const { initializeTheme } = useDarkMode()

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

// Initialize theme on client-side
onMounted(() => {
  initializeTheme()
})

const jwtToken = ref('')
const decodedToken = ref<{ header: any; payload: any } | null>(null)
const tokenError = ref('')
const tokenParts = ref({ header: '', payload: '', signature: '' })

// Sample JWT token for testing
const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzUzNDc2MDAsImF1ZCI6WyJleGFtcGxlLmNvbSIsImFwaS5leGFtcGxlLmNvbSJdLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwianRpIjoiYWJjZGVmZ2gtaWprbC1tbm9wLXFyc3QtdXZ3eHl6MTIifQ.Twl4_3JMm5fK8QnQzOOgR8_rYY_v-XJnGr_lSmJzjHI'

// Standard JWT claims
const standardClaims = [
  { key: 'iss', name: 'Issuer', description: 'Token issuer' },
  { key: 'sub', name: 'Subject', description: 'Token subject' },
  { key: 'aud', name: 'Audience', description: 'Token audience' },
  { key: 'exp', name: 'Expires At', description: 'Expiration time' },
  { key: 'nbf', name: 'Not Before', description: 'Not valid before' },
  { key: 'iat', name: 'Issued At', description: 'Issued at time' },
  { key: 'jti', name: 'JWT ID', description: 'Unique identifier' }
]

const getAlgorithmDescription = (alg: string): string => {
  const descriptions: { [key: string]: string } = {
    'HS256': 'HMAC using SHA-256',
    'HS384': 'HMAC using SHA-384',
    'HS512': 'HMAC using SHA-512',
    'RS256': 'RSA using SHA-256',
    'RS384': 'RSA using SHA-384',
    'RS512': 'RSA using SHA-512',
    'ES256': 'ECDSA using P-256 and SHA-256',
    'ES384': 'ECDSA using P-384 and SHA-384',
    'ES512': 'ECDSA using P-521 and SHA-512',
    'PS256': 'RSA PSS using SHA-256',
    'PS384': 'RSA PSS using SHA-384',
    'PS512': 'RSA PSS using SHA-512',
    'none': 'No signature'
  }
  return descriptions[alg] || 'Unknown algorithm'
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

const formatClaimValue = (key: string, value: any): string => {
  if (key === 'exp' || key === 'nbf' || key === 'iat') {
    return formatTimestamp(value)
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return String(value)
}

const expirationStatus = computed(() => {
  if (!decodedToken.value?.payload.exp) {
    return {
      message: 'No expiration',
      bgClass: 'bg-gray-50',
      textClass: 'text-gray-700',
      iconClass: 'text-gray-600'
    }
  }

  const now = Math.floor(Date.now() / 1000)
  const exp = decodedToken.value.payload.exp

  if (exp < now) {
    return {
      message: `Expired ${formatTimestamp(exp)}`,
      bgClass: 'bg-red-50',
      textClass: 'text-red-700',
      iconClass: 'text-red-600'
    }
  }

  return {
    message: `Valid until ${formatTimestamp(exp)}`,
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    iconClass: 'text-green-600'
  }
})

const notBeforeStatus = computed(() => {
  if (!decodedToken.value?.payload.nbf) {
    return { message: '', bgClass: '', textClass: '', iconClass: '' }
  }

  const now = Math.floor(Date.now() / 1000)
  const nbf = decodedToken.value.payload.nbf

  if (nbf > now) {
    return {
      message: `Not valid until ${formatTimestamp(nbf)}`,
      bgClass: 'bg-yellow-50',
      textClass: 'text-yellow-700',
      iconClass: 'text-yellow-600'
    }
  }

  return {
    message: `Valid since ${formatTimestamp(nbf)}`,
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    iconClass: 'text-green-600'
  }
})

const decodeJWT = () => {
  tokenError.value = ''
  decodedToken.value = null
  tokenParts.value = { header: '', payload: '', signature: '' }

  if (!jwtToken.value.trim()) {
    return
  }

  try {
    // Split the token into parts
    const parts = jwtToken.value.trim().split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Token must have exactly 3 parts separated by dots.')
    }

    tokenParts.value = {
      header: parts[0],
      payload: parts[1],
      signature: parts[2]
    }

    // Decode using jose library
    const decoded = decodeJwt(jwtToken.value)
    
    // Get header from the token
    const headerPart = JSON.parse(atob(parts[0]))
    
    decodedToken.value = {
      header: headerPart,
      payload: decoded
    }

  } catch (error: any) {
    tokenError.value = error.message || 'Failed to decode JWT token'
  }
}

const loadSampleJWT = () => {
  jwtToken.value = sampleJWT
  decodeJWT()
}

const clearToken = () => {
  jwtToken.value = ''
  decodedToken.value = null
  tokenError.value = ''
  tokenParts.value = { header: '', payload: '', signature: '' }
}

const copySection = async (section: 'header' | 'payload' | 'signature') => {
  if (!decodedToken.value) return

  let textToCopy = ''
  
  switch (section) {
    case 'header':
      textToCopy = JSON.stringify(decodedToken.value.header, null, 2)
      break
    case 'payload':
      textToCopy = JSON.stringify(decodedToken.value.payload, null, 2)
      break
    case 'signature':
      textToCopy = tokenParts.value.signature
      break
  }

  try {
    await navigator.clipboard.writeText(textToCopy)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Regex Tester</h1>
        <p class="text-gray-600">Test and validate regular expressions with live matching and detailed explanations</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Regex Pattern Input -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Regular Expression</h2>
            <div class="flex gap-2">
              <button
                @click="loadSample"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Load Sample
              </button>
              <button
                @click="clearAll"
                class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <!-- Pattern Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
              <div class="flex items-center gap-2">
                <span class="text-gray-500 font-mono">/</span>
                <input
                  v-model="pattern"
                  @input="testRegex"
                  type="text"
                  placeholder="Enter your regex pattern here..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span class="text-gray-500 font-mono">/</span>
                <div class="flex gap-1">
                  <label class="flex items-center gap-1">
                    <input
                      v-model="flags.global"
                      @change="testRegex"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-600">g</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input
                      v-model="flags.ignoreCase"
                      @change="testRegex"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-600">i</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input
                      v-model="flags.multiline"
                      @change="testRegex"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-600">m</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input
                      v-model="flags.dotAll"
                      @change="testRegex"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-600">s</span>
                  </label>
                </div>
              </div>
              
              <!-- Flag explanations -->
              <div class="mt-2 text-xs text-gray-500 flex gap-4">
                <span>g: global</span>
                <span>i: ignore case</span>
                <span>m: multiline</span>
                <span>s: dot all</span>
              </div>
            </div>

            <!-- Regex Error -->
            <div v-if="regexError" class="text-red-600 text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ regexError }}</span>
              </div>
            </div>

            <!-- Pattern Info -->
            <div v-else-if="pattern && compiledRegex" class="text-green-600 text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Valid regex pattern: <code class="font-mono bg-gray-100 px-1 rounded">{{ fullPattern }}</code></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Test String Input -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Test String</h3>
            <div class="flex gap-2">
              <button
                @click="loadSampleText"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Load Sample Text
              </button>
            </div>
          </div>
          
          <textarea
            v-model="testString"
            @input="testRegex"
            placeholder="Enter text to test against your regex pattern..."
            class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          ></textarea>
        </div>

        <div v-if="pattern && testString" class="space-y-6">
          <!-- Match Results -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Match Results</h3>
            
            <div v-if="matches.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>No matches found</p>
            </div>

            <div v-else>
              <!-- Match summary -->
              <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2 text-green-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="font-medium">{{ matches.length }} match{{ matches.length !== 1 ? 'es' : '' }} found</span>
                </div>
              </div>

              <!-- Highlighted text -->
              <div class="mb-6">
                <h4 class="text-md font-medium text-gray-800 mb-3">Text with Highlights</h4>
                <div class="bg-gray-50 p-4 rounded border font-mono text-sm whitespace-pre-wrap" v-html="highlightedText"></div>
              </div>

              <!-- Match details -->
              <div>
                <h4 class="text-md font-medium text-gray-800 mb-3">Match Details</h4>
                <div class="space-y-3">
                  <div
                    v-for="(match, index) in matches"
                    :key="index"
                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div class="flex justify-between items-start mb-3">
                      <div class="font-medium text-gray-900">Match {{ index + 1 }}</div>
                      <div class="text-sm text-gray-500">Position: {{ match.index }} - {{ match.index + match.value.length - 1 }}</div>
                    </div>
                    
                    <div class="space-y-2">
                      <div>
                        <span class="text-sm font-medium text-gray-700">Full Match:</span>
                        <code class="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{{ match.value }}</code>
                      </div>
                      
                      <div v-if="match.groups && match.groups.length > 0">
                        <span class="text-sm font-medium text-gray-700">Capture Groups:</span>
                        <div class="mt-1 space-y-1">
                          <div
                            v-for="(group, groupIndex) in match.groups"
                            :key="groupIndex"
                            class="ml-4 text-sm"
                          >
                            <span class="text-gray-600">Group {{ groupIndex + 1 }}:</span>
                            <code class="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ group || '(empty)' }}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Replace Tool -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Replace Tool</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Replace with</label>
                <input
                  v-model="replacement"
                  @input="performReplace"
                  type="text"
                  placeholder="Enter replacement text (use $1, $2, etc. for groups)..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              
              <div v-if="replacement" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Result</label>
                  <div class="bg-gray-50 p-4 rounded border font-mono text-sm whitespace-pre-wrap min-h-[100px]">{{ replacedText }}</div>
                </div>
                
                <div class="flex gap-2">
                  <button
                    @click="copyReplaced"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Patterns -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Common Patterns
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(sample, index) in commonPatterns"
              :key="index"
              class="p-3 bg-white rounded border cursor-pointer hover:border-blue-300 transition-colors"
              @click="loadPattern(sample)"
            >
              <div class="font-medium text-blue-800 mb-1">{{ sample.name }}</div>
              <code class="text-sm text-blue-600 font-mono">{{ sample.pattern }}</code>
              <div class="text-xs text-blue-700 mt-1">{{ sample.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

interface RegexMatch {
  value: string
  index: number
  groups: string[]
}

const pattern = ref('')
const testString = ref('')
const replacement = ref('')
const flags = ref({
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false
})

const regexError = ref('')
const matches = ref<RegexMatch[]>([])
const compiledRegex = ref<RegExp | null>(null)
const highlightedText = ref('')
const replacedText = ref('')
const copyButtonText = ref('Copy Result')

// Common regex patterns
const commonPatterns = [
  {
    name: 'Email Address',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Matches most email addresses'
  },
  {
    name: 'URL',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    description: 'Matches HTTP and HTTPS URLs'
  },
  {
    name: 'Phone Number (US)',
    pattern: '\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}',
    description: 'Matches US phone numbers'
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    description: 'Matches IPv4 addresses'
  },
  {
    name: 'Credit Card Number',
    pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b',
    description: 'Matches credit card numbers'
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '\\b\\d{4}-\\d{2}-\\d{2}\\b',
    description: 'Matches dates in YYYY-MM-DD format'
  },
  {
    name: 'HTML Tag',
    pattern: '<[^>]+>',
    description: 'Matches HTML tags'
  },
  {
    name: 'Hexadecimal Color',
    pattern: '#[0-9A-Fa-f]{6}\\b',
    description: 'Matches hex color codes'
  }
]

const fullPattern = computed(() => {
  if (!pattern.value) return ''
  let flagString = ''
  if (flags.value.global) flagString += 'g'
  if (flags.value.ignoreCase) flagString += 'i'
  if (flags.value.multiline) flagString += 'm'
  if (flags.value.dotAll) flagString += 's'
  return `/${pattern.value}/${flagString}`
})

const testRegex = () => {
  regexError.value = ''
  matches.value = []
  highlightedText.value = ''
  compiledRegex.value = null

  if (!pattern.value || !testString.value) {
    return
  }

  try {
    let flagString = ''
    if (flags.value.global) flagString += 'g'
    if (flags.value.ignoreCase) flagString += 'i'
    if (flags.value.multiline) flagString += 'm'
    if (flags.value.dotAll) flagString += 's'

    const regex = new RegExp(pattern.value, flagString)
    compiledRegex.value = regex

    const foundMatches: RegexMatch[] = []
    let match: RegExpExecArray | null

    if (flags.value.global) {
      while ((match = regex.exec(testString.value)) !== null) {
        foundMatches.push({
          value: match[0],
          index: match.index!,
          groups: match.slice(1)
        })
        // Prevent infinite loop for empty matches
        if (match[0] === '') {
          regex.lastIndex++
        }
      }
    } else {
      match = regex.exec(testString.value)
      if (match) {
        foundMatches.push({
          value: match[0],
          index: match.index!,
          groups: match.slice(1)
        })
      }
    }

    matches.value = foundMatches
    generateHighlightedText()
    if (replacement.value) {
      performReplace()
    }

  } catch (error: any) {
    regexError.value = error.message || 'Invalid regular expression'
  }
}

const generateHighlightedText = () => {
  if (matches.value.length === 0) {
    highlightedText.value = escapeHtml(testString.value)
    return
  }

  let result = ''
  let lastIndex = 0

  // Sort matches by index to handle overlapping matches
  const sortedMatches = [...matches.value].sort((a, b) => a.index - b.index)

  for (const match of sortedMatches) {
    // Add text before the match
    result += escapeHtml(testString.value.slice(lastIndex, match.index))
    
    // Add highlighted match
    result += `<mark class="bg-yellow-300 font-bold">${escapeHtml(match.value)}</mark>`
    
    lastIndex = match.index + match.value.length
  }

  // Add remaining text
  result += escapeHtml(testString.value.slice(lastIndex))
  
  highlightedText.value = result
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const performReplace = () => {
  if (!compiledRegex.value || !replacement.value) {
    replacedText.value = ''
    return
  }

  try {
    replacedText.value = testString.value.replace(compiledRegex.value, replacement.value)
  } catch (error) {
    replacedText.value = 'Error in replacement string'
  }
}

const loadSample = () => {
  pattern.value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'
  flags.value.global = true
  flags.value.ignoreCase = true
  testRegex()
}

const loadSampleText = () => {
  testString.value = `Contact us at:
support@example.com
sales@company.org
info@website.net

Or call us at:
(555) 123-4567
555.987.6543

Visit our website:
https://www.example.com
http://blog.company.org

Our office address:
123 Main Street, Suite 456
New York, NY 10001

IP Address: 192.168.1.1
Date: 2023-12-25`
  
  testRegex()
}

const loadPattern = (sample: any) => {
  pattern.value = sample.pattern
  flags.value.global = true
  flags.value.ignoreCase = false
  testRegex()
}

const clearAll = () => {
  pattern.value = ''
  testString.value = ''
  replacement.value = ''
  regexError.value = ''
  matches.value = []
  highlightedText.value = ''
  replacedText.value = ''
  compiledRegex.value = null
}

const copyReplaced = async () => {
  if (!replacedText.value) return

  try {
    await navigator.clipboard.writeText(replacedText.value)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy Result'
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

// Watch for changes
watch([replacement], () => {
  if (matches.value.length > 0) {
    performReplace()
  }
})
</script>
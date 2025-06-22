<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <div class="flex-1 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">String Converter</h1>
          </div>
          <div class="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Convert strings between various formats: Base64, URL encoding, HTML escaping, case conversion and more</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Conversion Type Selector -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Conversion Type</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="type in conversionTypes"
              :key="type.id"
              @click="selectedType = type.id"
              :class="[
                'p-3 text-left border rounded-lg transition-colors',
                selectedType === type.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 text-blue-900 dark:text-blue-100' 
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              ]"  
            >
              <div class="font-medium text-sm">{{ type.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ type.description }}</div>
            </button>
          </div>
        </div>

        <!-- Conversion Area -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Input -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Input</h3>
              <div class="flex gap-2">
                <button
                  @click="clearInput"
                  class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  @click="pasteFromClipboard"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Paste
                </button>
              </div>
            </div>
            <textarea
              v-model="inputText"
              placeholder="Enter text to convert..."
              rows="12"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-colors"
            ></textarea>
            <div class="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Characters: {{ inputText.length }}</span>
              <span>Bytes: {{ new TextEncoder().encode(inputText).length }}</span>
            </div>
          </div>

          <!-- Output -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Output</h3>
              <div class="flex gap-2">
                <button
                  @click="copyOutput"
                  :disabled="!outputText"
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Copy
                </button>
                <button
                  v-if="currentConverter?.reversible"
                  @click="swapInputOutput"
                  :disabled="!outputText"
                  class="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  Swap
                </button>
              </div>
            </div>
            <textarea
              :value="outputText"
              readonly
              rows="12"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm transition-colors"
              :class="{ 'text-red-600 dark:text-red-400': errorMessage }"
            ></textarea>
            <div class="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span v-if="errorMessage" class="text-red-600 dark:text-red-400">{{ errorMessage }}</span>
              <span v-else>Characters: {{ outputText.length }}</span>
              <span v-if="!errorMessage">Bytes: {{ new TextEncoder().encode(outputText).length }}</span>
            </div>
          </div>
        </div>

        <!-- Batch Conversion -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch Conversion</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Multiple Inputs (one per line)</label>
              <textarea
                v-model="batchInput"
                placeholder="Enter multiple strings, one per line..."
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-colors"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Batch Results</label>
              <textarea
                :value="batchOutput"
                readonly
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm transition-colors"
              ></textarea>
              <button
                @click="copyBatchOutput"
                :disabled="!batchOutput"
                class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Copy Batch Results
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Examples -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Examples</h3>
          <div v-if="currentConverter?.examples" class="space-y-3">
            <div
              v-for="example in currentConverter.examples"
              :key="example.input"
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">Input:</div>
                  <div class="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">{{ example.input }}</div>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">Output:</div>
                  <div class="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">{{ example.output }}</div>
                </div>
                <button
                  @click="useExample(example)"
                  class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Use Example
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Copy notification -->
      <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-colors">
        {{ copyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as he from 'he'

interface ConversionType {
  id: string
  name: string
  description: string
  convert: (input: string, options?: any) => string
  reversible?: boolean
  examples?: Array<{
    input: string
    output: string
  }>
}

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const inputText = ref('')
const outputText = ref('')
const selectedType = ref('base64-encode')
const errorMessage = ref('')
const copyMessage = ref('')
const batchInput = ref('')

const conversionTypes: ConversionType[] = [
  {
    id: 'base64-encode',
    name: 'Base64 Encode',
    description: 'Encode to Base64',
    convert: (input: string) => {
      if (!input) return ''
      return btoa(unescape(encodeURIComponent(input)))
    },
    reversible: true,
    examples: [
      { input: 'Hello World', output: 'SGVsbG8gV29ybGQ=' },
      { input: 'こんにちは', output: '44GT44KT44Gr44Gh44Gv' }
    ]
  },
  {
    id: 'base64-decode',
    name: 'Base64 Decode',
    description: 'Decode from Base64',
    convert: (input: string) => {
      if (!input) return ''
      try {
        return decodeURIComponent(escape(atob(input)))
      } catch (error) {
        throw new Error('Invalid Base64 input')
      }
    },
    reversible: true,
    examples: [
      { input: 'SGVsbG8gV29ybGQ=', output: 'Hello World' },
      { input: '44GT44KT44Gr44Gh44Gv', output: 'こんにちは' }
    ]
  },
  {
    id: 'url-encode',
    name: 'URL Encode',
    description: 'Encode for URL',
    convert: (input: string) => {
      if (!input) return ''
      return encodeURIComponent(input)
    },
    reversible: true,
    examples: [
      { input: 'Hello World!', output: 'Hello%20World!' },
      { input: 'https://example.com/search?q=test', output: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtest' }
    ]
  },
  {
    id: 'url-decode',
    name: 'URL Decode',
    description: 'Decode from URL',
    convert: (input: string) => {
      if (!input) return ''
      try {
        return decodeURIComponent(input)
      } catch (error) {
        throw new Error('Invalid URL encoded input')
      }
    },
    reversible: true,
    examples: [
      { input: 'Hello%20World!', output: 'Hello World!' },
      { input: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtest', output: 'https://example.com/search?q=test' }
    ]
  },
  {
    id: 'html-escape',
    name: 'HTML Escape',
    description: 'Escape HTML entities',
    convert: (input: string) => {
      if (!input) return ''
      return he.encode(input)
    },
    reversible: true,
    examples: [
      { input: '<scr' + 'ipt>alert("hello")</scr' + 'ipt>', output: '&lt;script&gt;alert(&quot;hello&quot;)&lt;/script&gt;' },
      { input: 'A & B > C', output: 'A &amp; B &gt; C' }
    ]
  },
  {
    id: 'html-unescape',
    name: 'HTML Unescape',
    description: 'Unescape HTML entities',
    convert: (input: string) => {
      if (!input) return ''
      return he.decode(input)
    },
    reversible: true,
    examples: [
      { input: '&lt;script&gt;alert(&quot;hello&quot;)&lt;/script&gt;', output: '<scr' + 'ipt>alert("hello")</scr' + 'ipt>' },
      { input: 'A &amp; B &gt; C', output: 'A & B > C' }
    ]
  },
  {
    id: 'snake-to-camel',
    name: 'snake_case → camelCase',
    description: 'Convert to camelCase',
    convert: (input: string) => {
      if (!input) return ''
      return input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    },
    reversible: true,
    examples: [
      { input: 'user_name', output: 'userName' },
      { input: 'api_response_data', output: 'apiResponseData' }
    ]
  },
  {
    id: 'camel-to-snake',
    name: 'camelCase → snake_case',
    description: 'Convert to snake_case',
    convert: (input: string) => {
      if (!input) return ''
      return input.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
    },
    reversible: true,
    examples: [
      { input: 'userName', output: 'user_name' },
      { input: 'apiResponseData', output: 'api_response_data' }
    ]
  },
  {
    id: 'uppercase',
    name: 'UPPERCASE',
    description: 'Convert to uppercase',
    convert: (input: string) => {
      if (!input) return ''
      return input.toUpperCase()
    },
    examples: [
      { input: 'Hello World', output: 'HELLO WORLD' },
      { input: 'test data', output: 'TEST DATA' }
    ]
  },
  {
    id: 'lowercase',
    name: 'lowercase',
    description: 'Convert to lowercase',
    convert: (input: string) => {
      if (!input) return ''
      return input.toLowerCase()
    },
    examples: [
      { input: 'Hello World', output: 'hello world' },
      { input: 'TEST DATA', output: 'test data' }
    ]
  }
]

const currentConverter = computed(() => {
  return conversionTypes.find(type => type.id === selectedType.value)
})

const batchOutput = computed(() => {
  if (!batchInput.value || !currentConverter.value) return ''
  
  const lines = batchInput.value.split('\n').filter(line => line.trim())
  const results = lines.map(line => {
    try {
      return currentConverter.value!.convert(line.trim())
    } catch (error) {
      return `Error: ${(error as Error).message}`
    }
  })
  
  return results.join('\n')
})

const convertText = () => {
  errorMessage.value = ''
  outputText.value = ''
  
  if (!inputText.value || !currentConverter.value) return
  
  try {
    outputText.value = currentConverter.value.convert(inputText.value)
  } catch (error) {
    errorMessage.value = (error as Error).message
    outputText.value = ''
  }
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (err) {
    console.error('Failed to read clipboard:', err)
  }
}

const copyOutput = async () => {
  if (!outputText.value) return
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    showCopyMessage('Output copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    showCopyMessage('Failed to copy to clipboard')
  }
}

const copyBatchOutput = async () => {
  if (!batchOutput.value) return
  
  try {
    await navigator.clipboard.writeText(batchOutput.value)
    showCopyMessage('Batch results copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    showCopyMessage('Failed to copy to clipboard')
  }
}

const swapInputOutput = () => {
  if (!outputText.value) return
  
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = ''
  
  // Try to find the reverse conversion
  const reverseMapping: Record<string, string> = {
    'base64-encode': 'base64-decode',
    'base64-decode': 'base64-encode',
    'url-encode': 'url-decode',
    'url-decode': 'url-encode',
    'html-escape': 'html-unescape',
    'html-unescape': 'html-escape',
    'snake-to-camel': 'camel-to-snake',
    'camel-to-snake': 'snake-to-camel'
  }
  
  if (reverseMapping[selectedType.value]) {
    selectedType.value = reverseMapping[selectedType.value]
  }
}

const useExample = (example: { input: string; output: string }) => {
  inputText.value = example.input
}

const showCopyMessage = (message: string) => {
  copyMessage.value = message
  setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

// Watch for changes and auto-convert
watch([inputText, selectedType], () => {
  convertText()
})

onMounted(() => {
  convertText()
  
  // Initialize dark mode
  const { initializeTheme } = useDarkMode()
  initializeTheme()
})
</script>
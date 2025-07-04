<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Hash Generator</h1>
        <p class="text-gray-600 dark:text-gray-300">Generate secure cryptographic hashes from your text</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <label for="input-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input Text
          </label>
          <textarea
            id="input-text"
            v-model="inputText"
            class="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter text to hash..."
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="hashType in hashTypes"
            :key="hashType.name"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ hashType.name }}</h3>
              <button
                v-if="hashes[hashType.key]"
                @click="copyToClipboard(hashes[hashType.key])"
                class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded p-3 min-h-[60px] flex items-center border border-gray-200 dark:border-gray-600">
              <code class="text-sm text-gray-700 dark:text-gray-300 break-all">
                {{ hashes[hashType.key] || 'Enter text to generate hash' }}
              </code>
            </div>
          </div>
        </div>

        <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {{ copyMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'

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

const inputText = ref('')
const copyMessage = ref('')

const hashTypes = [
  { name: 'SHA-256', key: 'sha256' },
  { name: 'SHA-1', key: 'sha1' },
  { name: 'MD5', key: 'md5' },
  { name: 'SHA-512', key: 'sha512' }
]

const hashes = computed(() => {
  if (!inputText.value) return {}
  
  return {
    sha256: CryptoJS.SHA256(inputText.value).toString(),
    sha1: CryptoJS.SHA1(inputText.value).toString(), 
    md5: CryptoJS.MD5(inputText.value).toString(),
    sha512: CryptoJS.SHA512(inputText.value).toString()
  }
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyMessage.value = 'Copied to clipboard!'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
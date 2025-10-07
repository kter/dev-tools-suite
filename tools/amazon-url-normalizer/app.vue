<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-12 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Amazon URL Normalizer
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-300">Clean and shorten Amazon product URLs</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <!-- Input Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <label for="input-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste Amazon Product URL
          </label>
          <textarea
            id="input-url"
            v-model="inputUrl"
            class="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Example: https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1?keywords=laptop..."
          />
        </div>

        <!-- Output Section -->
        <div v-if="validationResult" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <!-- Success State -->
          <div v-if="validationResult.isValid && normalizedUrl">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Normalized URL</h3>
              <button
                @click="copyToClipboard(normalizedUrl.normalizedUrl)"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                Copy
              </button>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-md p-4 border border-gray-200 dark:border-gray-600">
              <code class="text-sm text-gray-700 dark:text-gray-300 break-all">
                {{ normalizedUrl.normalizedUrl }}
              </code>
            </div>
            <!-- Already Normalized Message -->
            <div v-if="isAlreadyNormalized" class="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              This URL is already in the shortest format
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="!validationResult.isValid">
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              Invalid URL
            </h3>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-md p-4 border border-red-200 dark:border-red-800">
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ validationResult.errorMessage }}
              </p>
            </div>
          </div>
        </div>

        <!-- Copy Confirmation Toast -->
        <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {{ copyMessage }}
        </div>
      </div>
    </div>

    <footer class="mt-20 text-center text-gray-500 dark:text-gray-400">
      <p>
        &copy; 2025 DevTools. Built with Nuxt 3 and deployed on AWS.
        <span class="mx-2">|</span>
        <a
          href="https://www.tomohiko.io/legal-disclosure"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
        >
          特定商取引法に基づく表記
        </a>
      </p>
    </footer>

    <!-- Universal Support Me Button -->
    <KofiButton kofi-username="kterr" />
  </div>
</template>

<script setup lang="ts">
import KofiButton from '../shared/components/KofiButton.vue'
import { useAmazonUrlParser } from './composables/useAmazonUrlParser'
import { useAmazonUrlNormalizer } from './composables/useAmazonUrlNormalizer'

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

// State
const inputUrl = ref('')
const copyMessage = ref('')

// Composables
const { parseAmazonUrl } = useAmazonUrlParser()
const { normalizeUrl, isAlreadyNormalized: checkIfAlreadyNormalized } = useAmazonUrlNormalizer()

// Computed properties
const validationResult = computed(() => {
  if (!inputUrl.value.trim()) {
    return null
  }
  return parseAmazonUrl(inputUrl.value)
})

const normalizedUrl = computed(() => {
  if (!validationResult.value) {
    return null
  }
  return normalizeUrl(validationResult.value)
})

const isAlreadyNormalized = computed(() => {
  if (!normalizedUrl.value || !inputUrl.value.trim()) {
    return false
  }
  return checkIfAlreadyNormalized(inputUrl.value, normalizedUrl.value.normalizedUrl)
})

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyMessage.value = 'Copied to clipboard!'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      copyMessage.value = 'Copied to clipboard!'
      setTimeout(() => {
        copyMessage.value = ''
      }, 2000)
    } catch (fallbackErr) {
      console.error('Fallback copy failed: ', fallbackErr)
    }
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>

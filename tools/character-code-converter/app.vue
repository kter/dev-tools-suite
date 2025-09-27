<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">Character Code Converter</h1>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="mb-4">
            <label for="input" class="block text-sm font-medium mb-2">
              Input Text
            </label>
            <textarea
              id="input"
              v-model="inputText"
              @input="convertCharacters"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows="4"
              placeholder="Enter text to convert..."
            ></textarea>
          </div>

          <div v-if="results.length > 0" class="space-y-6">
            <h2 class="text-xl font-semibold mb-4">Character Analysis</h2>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Character
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ASCII (Dec)
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ASCII (Hex)
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unicode
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      UTF-8 (Hex)
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Binary
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(char, index) in results" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ char.character }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ char.ascii }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ char.hex }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ char.unicode }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ char.utf8 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ char.binary }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-6 space-y-4">
              <div>
                <h3 class="text-lg font-semibold mb-2">Full Text Encodings</h3>
                <div class="space-y-3">
                  <div>
                    <label class="text-sm font-medium">Base64:</label>
                    <div class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm break-all">
                      {{ fullTextEncodings.base64 }}
                    </div>
                  </div>
                  <div>
                    <label class="text-sm font-medium">URL Encoded:</label>
                    <div class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm break-all">
                      {{ fullTextEncodings.urlEncoded }}
                    </div>
                  </div>
                  <div>
                    <label class="text-sm font-medium">HTML Entities:</label>
                    <div class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm break-all">
                      {{ fullTextEncodings.htmlEntities }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

    <!-- Ko-fi Widget Container (for testing) -->
    <div v-if="kofiWidget.state.value.isVisible" data-testid="kofi-widget" class="kofi-widget-container"></div>
</template>

<script setup lang="ts">
import { useKofiWidget } from '~/shared/composables/useKofiWidget'
import KOFI_CONFIG from '~/shared/config/kofi'
import { ref, onMounted } from 'vue'
import { useDarkMode } from './composables/useDarkMode'

const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget
const kofiWidget = useKofiWidget()

const inputText = ref('')
const results = ref<CharacterInfo[]>([])
const fullTextEncodings = ref({
  base64: '',
  urlEncoded: '',
  htmlEntities: ''
})

interface CharacterInfo {
  character: string
  ascii: string
  hex: string
  unicode: string
  utf8: string
  binary: string
}

const convertCharacters = () => {
  if (!inputText.value) {
    results.value = []
    fullTextEncodings.value = {
      base64: '',
      urlEncoded: '',
      htmlEntities: ''
    }
    return
  }

  results.value = Array.from(inputText.value).map(char => {
    const code = char.charCodeAt(0)
    const utf8Bytes = new TextEncoder().encode(char)
    
    return {
      character: char === ' ' ? '(space)' : char === '\n' ? '(newline)' : char === '\t' ? '(tab)' : char,
      ascii: code <= 127 ? code.toString() : 'N/A',
      hex: '0x' + code.toString(16).toUpperCase().padStart(2, '0'),
      unicode: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
      utf8: Array.from(utf8Bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' '),
      binary: code.toString(2).padStart(8, '0')
    }
  })

  // Full text encodings
  fullTextEncodings.value = {
    base64: btoa(unescape(encodeURIComponent(inputText.value))),
    urlEncoded: encodeURIComponent(inputText.value),
    htmlEntities: inputText.value.split('').map(char => {
      const code = char.charCodeAt(0)
      return code > 127 || ['<', '>', '&', '"', "'"].includes(char) 
        ? `&#${code};` 
        : char
    }).join('')
  }
}

onMounted(() => {
  kofiWidget.init(KOFI_CONFIG)
  kofiWidget.load()
  initializeTheme()

  // Add noindex meta tag if in development
  if (import.meta.env.DEV) {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
  }
})
</script>
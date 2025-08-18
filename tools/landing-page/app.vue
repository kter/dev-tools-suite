<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12">
      <header class="text-center mb-16 relative">
        <!-- テーマ切り替えボタン -->
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            DevTools
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A collection of useful developer utilities to boost your productivity
        </p>
      </header>

      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Available Tools -->
          <div
            v-for="tool in availableTools"
            :key="tool.name"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:scale-105"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">{{ tool.icon }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ tool.name }}</h3>
                <span class="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  Available
                </span>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{{ tool.description }}</p>
            <a
              :href="tool.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block w-full text-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Launch Tool
            </a>
          </div>

          <!-- Coming Soon Tools -->
          <div
            v-for="tool in comingSoonTools"
            :key="tool.name"
            class="bg-white rounded-xl shadow-md p-6 border border-gray-100 opacity-75"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">{{ tool.icon }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-700">{{ tool.name }}</h3>
                <span class="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
            <p class="text-gray-500 text-sm mb-4">{{ tool.description }}</p>
            <div class="w-full text-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
              Coming Soon
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="mt-20 text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why DevTools?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast & Reliable</h3>
              <p class="text-gray-600 dark:text-gray-300">Optimized for speed and built with modern web technologies</p>
            </div>
            <div class="p-6">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
              <p class="text-gray-600 dark:text-gray-300">All processing happens in your browser - your data never leaves your device</p>
            </div>
            <div class="p-6">
              <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Open Source</h3>
              <p class="text-gray-600 dark:text-gray-300">Built with love by developers for developers</p>
            </div>
          </div>
        </div>
      </div>

      <footer class="mt-20 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 DevTools. Built with Nuxt 3 and deployed on AWS.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $config } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

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

// Determine URLs based on environment
const isDevEnvironment = process.client && window.location.hostname.includes('dev.devtools.site')
const hashGeneratorUrl = isDevEnvironment 
  ? 'https://hash-generator.dev.devtools.site'
  : 'https://hash-generator.devtools.site'
const qrGeneratorUrl = isDevEnvironment 
  ? 'https://qr-generator.dev.devtools.site'
  : 'https://qr-generator.devtools.site'
const unixTimeConverterUrl = isDevEnvironment 
  ? 'https://unix-time-converter.dev.devtools.site'
  : 'https://unix-time-converter.devtools.site'
const passwordGeneratorUrl = isDevEnvironment 
  ? 'https://password-generator.dev.devtools.site'
  : 'https://password-generator.devtools.site'
const ipCalculatorUrl = isDevEnvironment 
  ? 'https://ip-calculator.dev.devtools.site'
  : 'https://ip-calculator.devtools.site'
const markdownPreviewUrl = isDevEnvironment 
  ? 'https://markdown-preview.dev.devtools.site'
  : 'https://markdown-preview.devtools.site'
const placeholderGeneratorUrl = isDevEnvironment 
  ? 'https://placeholder-generator.dev.devtools.site'
  : 'https://placeholder-generator.devtools.site'
const ipInfoUrl = isDevEnvironment 
  ? 'https://ip-info.dev.devtools.site'
  : 'https://ip-info.devtools.site'
const timezoneConverterUrl = isDevEnvironment 
  ? 'https://timezone-converter.dev.devtools.site'
  : 'https://timezone-converter.devtools.site'
const stringConverterUrl = isDevEnvironment 
  ? 'https://string-converter.dev.devtools.site'
  : 'https://string-converter.devtools.site'
const codeDiffUrl = isDevEnvironment 
  ? 'https://code-diff.dev.devtools.site'
  : 'https://code-diff.devtools.site'
const micTestUrl = isDevEnvironment 
  ? 'https://mic-test.dev.devtools.site'
  : 'https://mic-test.devtools.site'
const jsonYamlConverterUrl = isDevEnvironment 
  ? 'https://json-yaml-converter.dev.devtools.site'
  : 'https://json-yaml-converter.devtools.site'
const jwtDecoderUrl = isDevEnvironment 
  ? 'https://jwt-decoder.dev.devtools.site'
  : 'https://jwt-decoder.devtools.site'
const regexTesterUrl = isDevEnvironment 
  ? 'https://regex-tester.dev.devtools.site'
  : 'https://regex-tester.devtools.site'
const loremIpsumGeneratorUrl = isDevEnvironment 
  ? 'https://lorem-ipsum-generator.dev.devtools.site'
  : 'https://lorem-ipsum-generator.devtools.site'
const imageConverterUrl = isDevEnvironment 
  ? 'https://image-converter.dev.devtools.site'
  : 'https://image-converter.devtools.site'
const timerUrl = isDevEnvironment 
  ? 'https://timer.dev.devtools.site'
  : 'https://timer.devtools.site'
const characterCodeConverterUrl = isDevEnvironment 
  ? 'https://character-code-converter.dev.devtools.site'
  : 'https://character-code-converter.devtools.site'
const badgerImageGeneratorUrl = isDevEnvironment 
  ? 'https://badger-image-generator.dev.devtools.site'
  : 'https://badger-image-generator.devtools.site'

const availableTools = [
  {
    name: 'Hash Generator',
    description: 'Generate SHA-256, SHA-1, MD5, and SHA-512 hashes from text input',
    icon: '#',
    url: hashGeneratorUrl
  },
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes from text, URLs, or any content with customizable options',
    icon: '⬛',
    url: qrGeneratorUrl
  },
  {
    name: 'Unix Time Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    icon: '🕐',
    url: unixTimeConverterUrl
  },
  {
    name: 'Password Generator',
    description: 'Generate secure passwords with customizable options',
    icon: '🔐',
    url: passwordGeneratorUrl
  },
  {
    name: 'IP Calculator',
    description: 'Calculate subnet masks, network addresses, and IP ranges',
    icon: '🌐',
    url: ipCalculatorUrl
  },
  {
    name: 'Markdown Preview',
    description: 'Preview Markdown files with live rendering and syntax highlighting',
    icon: '📋',
    url: markdownPreviewUrl
  },
  {
    name: 'Placeholder Generator',
    description: 'Generate custom placeholder images with various sizes and colors',
    icon: '🖼️',
    url: placeholderGeneratorUrl
  },
  {
    name: 'IP Info',
    description: 'Display your IP address information including location and ISP details',
    icon: '🌍',
    url: ipInfoUrl
  },
  {
    name: 'Timezone Converter',
    description: 'Convert time between different timezones with world clock display',
    icon: '🌐',
    url: timezoneConverterUrl
  },
  {
    name: 'String Converter',
    description: 'Convert strings between formats: Base64, URL encoding, case conversion and more',
    icon: '🔤',
    url: stringConverterUrl
  },
  {
    name: 'Code Diff',
    description: 'Compare and visualize differences between text files or code snippets',
    icon: '📊',
    url: codeDiffUrl
  },
  {
    name: 'Mic Test',
    description: 'Test your microphone by recording and playing back audio to verify it works correctly',
    icon: '🎤',
    url: micTestUrl
  },
  {
    name: 'JSON/YAML Converter',
    description: 'Convert between JSON, YAML, and TOML formats with validation and formatting',
    icon: '📝',
    url: jsonYamlConverterUrl
  },
  {
    name: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens with detailed information display',
    icon: '🔍',
    url: jwtDecoderUrl
  },
  {
    name: 'Regex Tester',
    description: 'Test and validate regular expressions with live matching and detailed explanations',
    icon: '✅',
    url: regexTesterUrl
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your projects with customizable options',
    icon: '📄',
    url: loremIpsumGeneratorUrl
  },
  {
    name: 'Image Converter',
    description: 'Convert image formats and resize images with quality controls',
    icon: '🖼️',
    url: imageConverterUrl
  },
  {
    name: 'Timer',
    description: 'Countdown timer, stopwatch, and Pomodoro technique timer for productivity',
    icon: '⏱️',
    url: timerUrl
  },
  {
    name: 'Character Code Converter',
    description: 'Convert characters to various encoding formats including ASCII, Unicode, UTF-8, and more',
    icon: '🔢',
    url: characterCodeConverterUrl
  },
  {
    name: 'Badger2040 Image Generator',
    description: 'Generate 296x128 pixel monochrome images for Badger2040 e-ink display with text and formatting options',
    icon: '🦡',
    url: badgerImageGeneratorUrl
  }
]

const comingSoonTools = [
  // All tools have been implemented!
  // Future tools can be added here
]

// Initialize theme on mount
onMounted(() => {
  initializeTheme()
})
</script>
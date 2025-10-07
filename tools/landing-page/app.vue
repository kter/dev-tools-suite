<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Search Modal (Teleported to body via component) -->
    <ToolSearch
      v-model="isSearchOpen"
      :tools="allTools"
      @select="handleToolSelect"
      @close="handleSearchClose"
    />

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
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Press <kbd class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded border">
            /
          </kbd> to search tools
        </p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Tool Grid Component -->
        <ToolGrid
          :tools="allTools"
          @select="handleToolSelect"
        />

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
    </div>

    <!-- Ko-fi Support Button -->
    <KofiButton kofi-username="kterr" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ToolSearch from './components/ToolSearch.vue'
import ToolGrid from './components/ToolGrid.vue'
import KofiButton from './components/KofiButton.vue'
import type { Tool } from './types/tool'

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

// Search modal state
const isSearchOpen = ref(false)


// Determine URLs based on environment and platform
const isDevEnvironment = ref(false)
onMounted(() => {
  isDevEnvironment.value = window.location.hostname.includes('dev.devtools.site')
})

const getToolUrl = computed(() => (toolName) => {
  // AWS URLs only
  return isDevEnvironment.value
    ? `https://${toolName}.dev.devtools.site`
    : `https://${toolName}.devtools.site`
})

const hashGeneratorUrl = computed(() => getToolUrl.value('hash-generator'))
const qrGeneratorUrl = computed(() => getToolUrl.value('qr-generator'))
const unixTimeConverterUrl = computed(() => getToolUrl.value('unix-time-converter'))
const passwordGeneratorUrl = computed(() => getToolUrl.value('password-generator'))
const ipCalculatorUrl = computed(() => getToolUrl.value('ip-calculator'))
const markdownPreviewUrl = computed(() => getToolUrl.value('markdown-preview'))
const placeholderGeneratorUrl = computed(() => getToolUrl.value('placeholder-generator'))
const ipInfoUrl = computed(() => getToolUrl.value('ip-info'))
const timezoneConverterUrl = computed(() => getToolUrl.value('timezone-converter'))
const stringConverterUrl = computed(() => getToolUrl.value('string-converter'))
const codeDiffUrl = computed(() => getToolUrl.value('code-diff'))
const micTestUrl = computed(() => getToolUrl.value('mic-test'))
const jsonYamlConverterUrl = computed(() => getToolUrl.value('json-yaml-converter'))
const jwtDecoderUrl = computed(() => getToolUrl.value('jwt-decoder'))
const regexTesterUrl = computed(() => getToolUrl.value('regex-tester'))
const loremIpsumGeneratorUrl = computed(() => getToolUrl.value('lorem-ipsum-generator'))
const imageConverterUrl = computed(() => getToolUrl.value('image-converter'))
const timerUrl = computed(() => getToolUrl.value('timer'))
const characterCodeConverterUrl = computed(() => getToolUrl.value('character-code-converter'))
const badgerImageGeneratorUrl = computed(() => getToolUrl.value('badger-image-generator'))
const posterSplitterUrl = computed(() => getToolUrl.value('poster-splitter'))
const mapDistanceCalculatorUrl = computed(() => getToolUrl.value('map-distance-calculator'))
const amazonUrlNormalizerUrl = computed(() => getToolUrl.value('amazon-url-normalizer'))

// Tool data provider using Tool interface
const allTools = computed<Tool[]>(() => [
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA-256, SHA-1, MD5, and SHA-512 hashes from text input',
    icon: '#',
    url: hashGeneratorUrl.value,
    tags: ['hash', 'crypto', 'security', 'sha256', 'md5']
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text, URLs, or any content with customizable options',
    icon: '⬛',
    url: qrGeneratorUrl.value,
    tags: ['qr', 'code', 'generator', 'url', 'mobile']
  },
  {
    id: 'unix-time-converter',
    name: 'Unix Time Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    icon: '🕐',
    url: unixTimeConverterUrl.value,
    tags: ['unix', 'time', 'timestamp', 'date', 'convert']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords with customizable options',
    icon: '🔐',
    url: passwordGeneratorUrl.value,
    tags: ['password', 'security', 'generator', 'random', 'secure']
  },
  {
    id: 'ip-calculator',
    name: 'IP Calculator',
    description: 'Calculate subnet masks, network addresses, and IP ranges',
    icon: '🌐',
    url: ipCalculatorUrl.value,
    tags: ['ip', 'network', 'subnet', 'cidr', 'calculator']
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Preview Markdown files with live rendering and syntax highlighting',
    icon: '📋',
    url: markdownPreviewUrl.value,
    tags: ['markdown', 'preview', 'editor', 'rendering', 'docs']
  },
  {
    id: 'placeholder-generator',
    name: 'Placeholder Generator',
    description: 'Generate custom placeholder images with various sizes and colors',
    icon: '🖼️',
    url: placeholderGeneratorUrl.value,
    tags: ['placeholder', 'image', 'generator', 'design', 'mockup']
  },
  {
    id: 'ip-info',
    name: 'IP Info',
    description: 'Display your IP address information including location and ISP details',
    icon: '🌍',
    url: ipInfoUrl.value,
    tags: ['ip', 'info', 'location', 'isp', 'geolocation']
  },
  {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Convert time between different timezones with world clock display',
    icon: '🌐',
    url: timezoneConverterUrl.value,
    tags: ['timezone', 'time', 'convert', 'world', 'clock']
  },
  {
    id: 'string-converter',
    name: 'String Converter',
    description: 'Convert strings between formats: Base64, URL encoding, case conversion and more',
    icon: '🔤',
    url: stringConverterUrl.value,
    tags: ['string', 'convert', 'base64', 'url', 'encoding']
  },
  {
    id: 'code-diff',
    name: 'Code Diff',
    description: 'Compare and visualize differences between text files or code snippets',
    icon: '📊',
    url: codeDiffUrl.value,
    tags: ['diff', 'compare', 'code', 'text', 'merge']
  },
  {
    id: 'mic-test',
    name: 'Mic Test',
    description: 'Test your microphone by recording and playing back audio to verify it works correctly',
    icon: '🎤',
    url: micTestUrl.value,
    tags: ['microphone', 'audio', 'test', 'recording', 'voice']
  },
  {
    id: 'json-yaml-converter',
    name: 'JSON/YAML Converter',
    description: 'Convert between JSON, YAML, and TOML formats with validation and formatting',
    icon: '📝',
    url: jsonYamlConverterUrl.value,
    tags: ['json', 'yaml', 'toml', 'convert', 'format']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens with detailed information display',
    icon: '🔍',
    url: jwtDecoderUrl.value,
    tags: ['jwt', 'token', 'decode', 'auth', 'security']
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and validate regular expressions with live matching and detailed explanations',
    icon: '✅',
    url: regexTesterUrl.value,
    tags: ['regex', 'pattern', 'test', 'match', 'validation']
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your projects with customizable options',
    icon: '📄',
    url: loremIpsumGeneratorUrl.value,
    tags: ['lorem', 'ipsum', 'text', 'placeholder', 'content']
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert image formats and resize images with quality controls',
    icon: '🖼️',
    url: imageConverterUrl.value,
    tags: ['image', 'convert', 'resize', 'format', 'quality']
  },
  {
    id: 'timer',
    name: 'Timer',
    description: 'Countdown timer, stopwatch, and Pomodoro technique timer for productivity',
    icon: '⏱️',
    url: timerUrl.value,
    tags: ['timer', 'countdown', 'stopwatch', 'pomodoro', 'productivity']
  },
  {
    id: 'character-code-converter',
    name: 'Character Code Converter',
    description: 'Convert characters to various encoding formats including ASCII, Unicode, UTF-8, and more',
    icon: '🔢',
    url: characterCodeConverterUrl.value,
    tags: ['character', 'ascii', 'unicode', 'utf8', 'encoding']
  },
  {
    id: 'badger-image-generator',
    name: 'Badger2040 Image Generator',
    description: 'Generate 296x128 pixel monochrome images for Badger2040 e-ink display with text and formatting options',
    icon: '🦡',
    url: badgerImageGeneratorUrl.value,
    tags: ['badger2040', 'eink', 'display', 'monochrome', 'embed']
  },
  {
    id: 'poster-splitter',
    name: 'Poster Splitter',
    description: 'Split A3 images and PDFs into A4 pages for easy printing on standard printers',
    icon: '📐',
    url: posterSplitterUrl.value,
    tags: ['poster', 'split', 'print', 'a3', 'a4']
  },
  {
    id: 'map-distance-calculator',
    name: 'Map Distance Calculator',
    description: 'Calculate great-circle distance and bearing between two points on a map',
    icon: '🗺️',
    url: mapDistanceCalculatorUrl.value,
    tags: ['map', 'distance', 'bearing', 'geolocation', 'coordinates']
  },
  {
    id: 'amazon-url-normalizer',
    name: 'Amazon URL Normalizer',
    description: 'Clean and shorten Amazon product URLs by removing tracking parameters',
    icon: '🔗',
    url: amazonUrlNormalizerUrl.value,
    tags: ['amazon', 'url', 'asin', 'normalize', 'shortener', 'clean']
  }
])

// Event handlers for search and tool interaction
const handleToolSelect = (tool: Tool): void => {
  // Navigate to tool URL when selected
  window.open(tool.url, '_blank', 'noopener,noreferrer')
}

const handleSearchClose = (): void => {
  // Additional cleanup when search is closed (if needed)
  isSearchOpen.value = false
}

// Initialize theme on mount
onMounted(() => {
  initializeTheme()
})
</script>
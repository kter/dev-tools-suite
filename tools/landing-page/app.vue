<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-12">
      <header class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            DevTools
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          A collection of useful developer utilities to boost your productivity
        </p>
      </header>

      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Available Tools -->
          <div
            v-for="tool in availableTools"
            :key="tool.name"
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">{{ tool.icon }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ tool.name }}</h3>
                <span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Available
                </span>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ tool.description }}</p>
            <a
              :href="tool.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Why DevTools?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p class="text-gray-600">Optimized for speed and built with modern web technologies</p>
            </div>
            <div class="p-6">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p class="text-gray-600">All processing happens in your browser - your data never leaves your device</p>
            </div>
            <div class="p-6">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Open Source</h3>
              <p class="text-gray-600">Built with love by developers for developers</p>
            </div>
          </div>
        </div>
      </div>

      <footer class="mt-20 text-center text-gray-500">
        <p>&copy; 2025 DevTools. Built with Nuxt 3 and deployed on AWS.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $config } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

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
  }
]

const comingSoonTools = [
  {
    name: 'JSON/YAML Converter',
    description: 'Convert between JSON, YAML, and TOML formats',
    icon: '📝'
  },
  {
    name: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens',
    icon: '🔍'
  },
  {
    name: 'Regex Tester',
    description: 'Test and validate regular expressions with live matching',
    icon: '✅'
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your projects',
    icon: '📄'
  },
  {
    name: 'Markdown Preview',
    description: 'Preview Markdown files with live rendering',
    icon: '📋'
  }
]
</script>
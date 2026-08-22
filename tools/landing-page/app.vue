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
import { buildToolCatalog } from './utils/tool-catalog'

// Initialize dark mode
const { initializeTheme } = useDarkMode()

// Add noindex for development environment
if (import.meta.client && window.location.hostname.includes('dev.devtools.site')) {
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

// Tool data provider using Tool interface
const allTools = computed<Tool[]>(() => buildToolCatalog(isDevEnvironment.value))

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

/**
 * useToolSearch composable
 * Implements search logic with debounced filtering, case-insensitive matching
 * Based on data-model.md search algorithm and research.md decisions
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { refDebounced } from '@vueuse/core'
import type { Tool } from '../types/tool'
import type { SearchConfig } from '../types/search'
import type { UseToolSearchReturn } from '../types/components'

/**
 * Default search configuration
 */
const DEFAULT_CONFIG: SearchConfig = {
  fields: ['name', 'description'],
  caseSensitive: false,
  debounceMs: 200
}

/**
 * Filter tools based on search query and configuration
 * Implements algorithm from data-model.md
 */
export function filterTools(tools: Tool[], query: string, config: Partial<SearchConfig> = {}): Tool[] {
  // If query is empty or whitespace-only, return all tools
  if (!query.trim()) {
    return tools
  }

  const searchConfig = { ...DEFAULT_CONFIG, ...config }
  const searchQuery = searchConfig.caseSensitive ? query : query.toLowerCase()

  return tools.filter(tool => {
    // Search in name
    const toolName = searchConfig.caseSensitive ? tool.name : tool.name.toLowerCase()
    if (toolName.includes(searchQuery)) {
      return true
    }

    // Search in description
    const toolDescription = searchConfig.caseSensitive ? tool.description : tool.description.toLowerCase()
    if (toolDescription.includes(searchQuery)) {
      return true
    }

    // Search in tags (if available)
    if (tool.tags) {
      const matchingTag = tool.tags.some(tag => {
        const tagText = searchConfig.caseSensitive ? tag : tag.toLowerCase()
        return tagText.includes(searchQuery)
      })
      if (matchingTag) {
        return true
      }
    }

    return false
  })
}

/**
 * Main useToolSearch composable
 * Provides reactive search functionality with debounced filtering
 */
export function useToolSearch(
  tools: Ref<Tool[]>,
  config: Partial<SearchConfig> = {}
): UseToolSearchReturn {
  const searchConfig = { ...DEFAULT_CONFIG, ...config }

  // Reactive search query
  const searchQuery = ref('')

  // Debounced query for performance (200ms default from research.md)
  const debouncedQuery = refDebounced(searchQuery, searchConfig.debounceMs)

  // Computed filtered results
  const filteredTools: ComputedRef<Tool[]> = computed(() => {
    return filterTools(tools.value, debouncedQuery.value, searchConfig)
  })

  // Results count
  const resultsCount: ComputedRef<number> = computed(() => {
    return filteredTools.value.length
  })

  // Clear search function
  const clearSearch = (): void => {
    searchQuery.value = ''
  }

  // Set query function
  const setQuery = (query: string): void => {
    searchQuery.value = query
  }

  return {
    searchQuery,
    filteredTools,
    resultsCount,
    clearSearch,
    setQuery
  }
}

/**
 * Utility function for immediate (non-debounced) filtering
 * Useful for testing or cases where immediate response is needed
 */
export function useImmediateToolSearch(
  tools: Ref<Tool[]>,
  query: Ref<string>,
  config: Partial<SearchConfig> = {}
): ComputedRef<Tool[]> {
  return computed(() => {
    return filterTools(tools.value, query.value, config)
  })
}

/**
 * Utility for search query validation
 */
export function validateSearchQuery(query: string): boolean {
  // Basic validation - ensure it's a string and not too long
  if (typeof query !== 'string') {
    return false
  }

  // Reasonable length limit (1000 chars from research.md test)
  if (query.length > 1000) {
    return false
  }

  return true
}

/**
 * Utility for search term highlighting (if needed in future)
 * Returns positions where search term appears in text
 */
export function findSearchMatches(text: string, query: string, caseSensitive = false): Array<{ start: number; end: number }> {
  if (!query.trim()) {
    return []
  }

  const searchText = caseSensitive ? text : text.toLowerCase()
  const searchQuery = caseSensitive ? query : query.toLowerCase()
  const matches: Array<{ start: number; end: number }> = []

  let index = searchText.indexOf(searchQuery)
  while (index !== -1) {
    matches.push({
      start: index,
      end: index + searchQuery.length
    })
    index = searchText.indexOf(searchQuery, index + 1)
  }

  return matches
}
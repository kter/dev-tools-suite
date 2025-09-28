/**
 * Component prop interfaces for tool search components
 * Based on contracts/tool-search-api.ts specifications
 */

import type { Tool, SearchConfig } from './search'

/**
 * Props for ToolSearch overlay component
 */
export interface ToolSearchProps {
  /** List of tools to search through */
  tools: Tool[]
  /** Search configuration options */
  config?: Partial<SearchConfig>
  /** Whether search modal is open */
  modelValue?: boolean
}

/**
 * Events emitted by ToolSearch component
 */
export interface ToolSearchEmits {
  /** Emitted when modal open/close state changes */
  'update:modelValue': [value: boolean]
  /** Emitted when user selects a tool */
  'select': [tool: Tool]
  /** Emitted when user closes search without selection */
  'close': []
}

/**
 * Props for ToolGrid component
 */
export interface ToolGridProps {
  /** Tools to display in grid */
  tools: Tool[]
  /** Current search query for highlighting */
  searchQuery?: string
  /** Whether to show filtered results only */
  filtered?: boolean
}

/**
 * Events emitted by ToolGrid component
 */
export interface ToolGridEmits {
  /** Emitted when user clicks on a tool */
  'select': [tool: Tool]
}

/**
 * Return type for useToolSearch composable
 */
export interface UseToolSearchReturn {
  /** Current search query */
  searchQuery: Ref<string>
  /** Filtered results */
  filteredTools: ComputedRef<Tool[]>
  /** Number of results */
  resultsCount: ComputedRef<number>
  /** Clear search query */
  clearSearch: () => void
  /** Set search query */
  setQuery: (query: string) => void
}

/**
 * Return type for useSearchModal composable
 */
export interface UseSearchModalReturn {
  /** Whether modal is open */
  isOpen: Readonly<Ref<boolean>>
  /** Search input element ref */
  searchInput: Ref<HTMLInputElement | undefined>
  /** Open search modal */
  open: () => void
  /** Close search modal */
  close: () => void
  /** Return focus to trigger element */
  returnFocus: () => void
}

/**
 * Return type for useKeyboardNavigation composable
 */
export interface UseKeyboardNavigationReturn {
  /** Currently selected index */
  selectedIndex: Readonly<Ref<number>>
  /** Select next item */
  selectNext: () => void
  /** Select previous item */
  selectPrevious: () => void
  /** Reset selection */
  resetSelection: () => void
  /** Get currently selected item */
  getSelectedItem: <T>(items: T[]) => T | undefined
}

/**
 * Keyboard event interface
 */
export interface SearchKeyboardEvent {
  key: string
  preventDefault: () => void
  target: EventTarget | null
}

/**
 * Tool selection event interface
 */
export interface ToolSelectEvent {
  tool: Tool
  source: 'click' | 'keyboard' | 'enter'
  timestamp: number
}
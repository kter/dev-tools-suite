/**
 * Tool Search Component API Contracts
 * Defines interfaces for search functionality components
 */

// Core data interfaces
export interface Tool {
  id: string
  name: string
  description: string
  url: string
  icon?: string
  tags?: string[]
}

export interface SearchState {
  isOpen: boolean
  query: string
  selectedIndex: number
  results: Tool[]
}

export interface SearchConfig {
  fields: string[]
  caseSensitive: boolean
  debounceMs: number
}

// Component prop interfaces
export interface ToolSearchProps {
  /** List of tools to search through */
  tools: Tool[]
  /** Search configuration options */
  config?: Partial<SearchConfig>
  /** Whether search modal is open */
  modelValue?: boolean
}

export interface ToolSearchEmits {
  /** Emitted when modal open/close state changes */
  'update:modelValue': [value: boolean]
  /** Emitted when user selects a tool */
  'select': [tool: Tool]
  /** Emitted when user closes search without selection */
  'close': []
}

export interface ToolGridProps {
  /** Tools to display in grid */
  tools: Tool[]
  /** Current search query for highlighting */
  searchQuery?: string
  /** Whether to show filtered results only */
  filtered?: boolean
}

// Composable interfaces
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

// Event interfaces
export interface SearchKeyboardEvent {
  key: string
  preventDefault: () => void
  target: EventTarget | null
}

export interface ToolSelectEvent {
  tool: Tool
  source: 'click' | 'keyboard' | 'enter'
  timestamp: number
}

// Validation schemas (for runtime type checking)
export const ToolSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  url: 'string',
  icon: 'string?',
  tags: 'string[]?'
} as const

export const SearchConfigSchema = {
  fields: 'string[]',
  caseSensitive: 'boolean',
  debounceMs: 'number'
} as const
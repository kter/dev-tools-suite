/**
 * Search state interfaces for tool search functionality
 * Based on data-model.md SearchState and SearchFilters entities
 */

import type { Tool } from './tool'

/**
 * Represents the current state of the search interface
 */
export interface SearchState {
  /** Whether search modal is visible */
  isOpen: boolean
  /** Current search input value */
  query: string
  /** Currently highlighted result index (-1 for none) */
  selectedIndex: number
  /** Filtered tools matching current query */
  results: Tool[]
}

/**
 * Configuration for search behavior and matching
 */
export interface SearchConfig {
  /** Tool fields to search against (default: ['name', 'description']) */
  fields: string[]
  /** Whether search is case sensitive (default: false) */
  caseSensitive: boolean
  /** Input debounce delay in milliseconds (default: 200) */
  debounceMs: number
}

/**
 * Default search configuration
 */
export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  fields: ['name', 'description'],
  caseSensitive: false,
  debounceMs: 200
}

/**
 * Search state transitions:
 * - CLOSED → OPEN: Triggered by '/' keypress or manual trigger
 * - OPEN → CLOSED: Triggered by Escape key, click outside, or tool selection
 * - query changes → results update: Real-time filtering with debounce
 * - keyboard navigation → selectedIndex update: Arrow keys modify selection
 */
export type SearchStateTransition =
  | 'open'
  | 'close'
  | 'updateQuery'
  | 'selectNext'
  | 'selectPrevious'
  | 'resetSelection'

/**
 * Search filter function type
 */
export type SearchFilterFunction = (tools: Tool[], query: string, config?: Partial<SearchConfig>) => Tool[]
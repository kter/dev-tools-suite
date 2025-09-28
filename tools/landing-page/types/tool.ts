/**
 * Tool interface definitions for the dev tools landing page
 * Based on data-model.md entity definitions
 */

export interface Tool {
  /** Unique identifier for the tool */
  id: string
  /** Display name of the tool (e.g., "Password Generator") */
  name: string
  /** Brief description of tool functionality */
  description: string
  /** Navigation URL (relative or absolute) */
  url: string
  /** Optional icon identifier or URL */
  icon?: string
  /** Optional search tags for enhanced discoverability */
  tags?: string[]
}

/**
 * Validation rules for Tool interface:
 * - id must be non-empty and unique within tool list
 * - name must be non-empty string
 * - description must be non-empty string
 * - url must be valid URL format
 * - tags array elements must be non-empty strings if provided
 */
export function validateTool(tool: unknown): tool is Tool {
  if (!tool || typeof tool !== 'object') {
    return false
  }

  const t = tool as Record<string, unknown>

  // Required fields validation
  if (!t.id || typeof t.id !== 'string' || t.id.trim() === '') {
    return false
  }
  if (!t.name || typeof t.name !== 'string' || t.name.trim() === '') {
    return false
  }
  if (!t.description || typeof t.description !== 'string' || t.description.trim() === '') {
    return false
  }
  if (!t.url || typeof t.url !== 'string' || t.url.trim() === '') {
    return false
  }

  // Optional fields validation
  if (t.icon !== undefined && (typeof t.icon !== 'string' || t.icon.trim() === '')) {
    return false
  }
  if (t.tags !== undefined) {
    if (!Array.isArray(t.tags)) {
      return false
    }
    for (const tag of t.tags) {
      if (typeof tag !== 'string' || tag.trim() === '') {
        return false
      }
    }
  }

  return true
}

/**
 * Type guard for array of tools
 */
export function validateToolArray(tools: unknown): tools is Tool[] {
  if (!Array.isArray(tools)) {
    return false
  }
  return tools.every(validateTool)
}
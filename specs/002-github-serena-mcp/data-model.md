# Data Model: Tool Search Feature

## Entity Definitions

### Tool
Represents a development tool available on the landing page.

**Fields**:
- `id: string` - Unique identifier for the tool
- `name: string` - Display name of the tool (e.g., "Password Generator")
- `description: string` - Brief description of tool functionality
- `url: string` - Navigation URL (relative or absolute)
- `icon?: string` - Optional icon identifier or URL
- `tags?: string[]` - Optional search tags for enhanced discoverability

**Example**:
```typescript
interface Tool {
  id: string
  name: string
  description: string
  url: string
  icon?: string
  tags?: string[]
}
```

**Validation Rules**:
- `id` must be non-empty and unique within tool list
- `name` must be non-empty string
- `description` must be non-empty string
- `url` must be valid URL format
- `tags` array elements must be non-empty strings if provided

### SearchState
Represents the current state of the search interface.

**Fields**:
- `isOpen: boolean` - Whether search modal is visible
- `query: string` - Current search input value
- `selectedIndex: number` - Currently highlighted result index (-1 for none)
- `results: Tool[]` - Filtered tools matching current query

**State Transitions**:
- `CLOSED → OPEN`: Triggered by '/' keypress or manual trigger
- `OPEN → CLOSED`: Triggered by Escape key, click outside, or tool selection
- `query changes → results update`: Real-time filtering with 200ms debounce
- `keyboard navigation → selectedIndex update`: Arrow keys modify selection

### SearchFilters
Configuration for search behavior and matching.

**Fields**:
- `fields: string[]` - Tool fields to search against (default: ['name', 'description'])
- `caseSensitive: boolean` - Whether search is case sensitive (default: false)
- `debounceMs: number` - Input debounce delay (default: 200)

## Data Relationships

```
Tool (static data)
  ↓ (filtered by)
SearchState.results
  ↓ (selected from)
SearchState.selectedIndex → Tool navigation
```

## Search Algorithm

**Input**: `query: string`, `tools: Tool[]`
**Output**: `Tool[]` (filtered results)

**Logic**:
1. If query is empty or whitespace-only, return all tools
2. Convert query to lowercase for case-insensitive matching
3. Filter tools where query appears in:
   - Tool name (case-insensitive substring match)
   - Tool description (case-insensitive substring match)
   - Tool tags array (any tag contains query as substring)
4. Return filtered array maintaining original order

**Performance**: O(n*m) where n = tools count, m = average field length
**Acceptable**: For expected dataset size (10-20 tools)

## Component Data Flow

```
Landing Page
  ↓ (provides)
Tool[] data
  ↓ (filtered by)
useToolSearch composable
  ↓ (manages)
SearchState
  ↓ (displayed by)
ToolSearch component
  ↓ (navigates to)
Selected Tool
```

## Storage Requirements

- **Client-side only**: No persistent storage required
- **Memory usage**: <1KB for typical tool dataset
- **Session persistence**: Search state resets on page reload
- **Tool data source**: Static data from landing page component
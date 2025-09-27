# Data Model: Ko-fi Widget Integration

## Entities

### KofiWidgetConfig
**Purpose**: Configuration object for Ko-fi widget settings
**Lifecycle**: Static configuration, no state changes

**Fields**:
- `accountId`: string - Ko-fi account identifier ('kterr')
- `type`: string - Widget type ('floating-chat')
- `buttonText`: string - Display text ('Support me')
- `backgroundColor`: string - Button background color ('#00b9fe')
- `textColor`: string - Button text color ('#fff')
- `position`: object - Widget positioning configuration

**Validation Rules**:
- `accountId` must be non-empty string
- `backgroundColor` must be valid hex color
- `textColor` must be valid hex color
- `buttonText` must be non-empty string

### KofiWidgetState
**Purpose**: Runtime state tracking for widget behavior
**Lifecycle**: Created on page load, destroyed on page unload

**Fields**:
- `isLoaded`: boolean - Whether Ko-fi script has loaded successfully
- `isVisible`: boolean - Whether widget is currently visible
- `loadError`: boolean - Whether loading failed (triggers hide behavior)

**State Transitions**:
- Initial: `{ isLoaded: false, isVisible: false, loadError: false }`
- Script loads successfully: `isLoaded: true, isVisible: true`
- Script fails to load: `loadError: true, isVisible: false`

## Relationships

**KofiWidgetConfig** → **KofiWidgetState**: One-to-many (one config used across all tool instances)

## Data Flow

1. Static configuration loaded at build time
2. Runtime state initialized on page mount
3. Ko-fi script loaded asynchronously
4. State updated based on load success/failure
5. Widget visibility controlled by state

## Persistence

- **Configuration**: Static compile-time constants
- **State**: In-memory only, no persistence required
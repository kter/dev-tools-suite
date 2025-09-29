# Data Model: Universal Support Me Button Implementation

**Date**: 2025-09-29
**Feature**: Universal Support Me Button Implementation

## Entity Definitions

### KofiButtonState
Represents the current state and configuration of the Support Me button component.

**Attributes**:
- `isVisible: boolean` - Current visibility state (computed from scroll position)
- `isAtThreshold: boolean` - Whether scroll position is at or beyond 70% threshold
- `isShortPage: boolean` - Whether page content is shorter than viewport height
- `animationDuration: number` - CSS transition duration in milliseconds (default: 300)
- `threshold: number` - Scroll percentage threshold for state change (default: 70)
- `position: 'bottom-left' | 'bottom-right'` - Button positioning (default: 'bottom-left')

**Relationships**:
- Consumes `ScrollPosition` data
- Produces `ButtonVisibility` events

**Validation Rules**:
- `threshold` must be between 0 and 100
- `animationDuration` must be positive integer
- `position` must be valid positioning enum value

**State Transitions**:
```
Initial Load → Visible (isVisible: true)
Scroll < 70% → Visible (isVisible: true)
Scroll ≥ 70% → Hidden (isVisible: false)
Short Page → Always Visible (isVisible: true, regardless of scroll)
```

### ScrollPosition
Represents scroll tracking state and calculations across different page layouts.

**Attributes**:
- `scrollTop: number` - Current vertical scroll position in pixels
- `scrollHeight: number` - Total scrollable height of the detected container
- `clientHeight: number` - Viewport height of the detected container
- `scrollPercentage: number` - Calculated scroll percentage (0-100)
- `container: HTMLElement` - Auto-detected scroll container (document.body or main content)
- `isThrottled: boolean` - Whether scroll events are currently throttled

**Relationships**:
- Feeds into `KofiButtonState`
- Managed by `useScrollPosition` composable

**Validation Rules**:
- `scrollPercentage` must be between 0 and 100
- `container` must be valid HTML element
- Scroll calculations must handle edge cases (short pages, no scroll)

### ToolIntegration
Represents the integration configuration for each individual tool.

**Attributes**:
- `toolName: string` - Name of the tool (e.g., 'hash-generator', 'qr-generator')
- `kofiUsername: string` - Ko-fi username (always 'kterr')
- `hasCustomLayout: boolean` - Whether tool has non-standard layout requiring special handling
- `scrollContainer: HTMLElement | null` - Auto-detected or manually specified scroll container
- `testCoverage: boolean` - Whether E2E tests are implemented for this tool

**Relationships**:
- Uses `KofiButtonState` and `ScrollPosition`
- One per tool (23 total instances)

**Validation Rules**:
- `toolName` must match existing tool directory name
- `kofiUsername` must be 'kterr' (validated by specification)
- All tools must have `testCoverage: true` before production deployment

## Data Flow

```
User Scroll Event
    ↓
ScrollPosition (auto-detect container, calculate percentage)
    ↓
KofiButtonState (determine visibility based on threshold)
    ↓
KofiButton Component (render with appropriate CSS classes)
    ↓
User Interaction (click → Ko-fi page with 'kterr' username)
```

## Storage Requirements

**Client-Side State Only**: All data is ephemeral and exists only during page session.

- No persistent storage required
- No backend database needed
- No user data collection or retention
- State reset on page refresh/navigation

## Performance Considerations

**Scroll Event Optimization**:
- 100ms throttling on scroll events
- Efficient percentage calculations
- Minimal DOM queries through auto-detection caching

**Memory Management**:
- Event listener cleanup on component unmount
- Throttled function cleanup
- Scroll container reference cleanup

## Accessibility Requirements

**ARIA Attributes**:
- `aria-hidden: "false"` when visible, `"true"` when hidden
- `aria-label: "Support me on Ko-fi"` for screen readers
- `tabindex: "0"` when visible, `"-1"` when hidden

**Reduced Motion Support**:
- Disable CSS transitions when `prefers-reduced-motion: reduce`
- Instant state changes without animation
- Maintain functionality without visual transitions
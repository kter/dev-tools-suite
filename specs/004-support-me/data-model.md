# Data Model: Support Me Button Visibility Reversal

**Feature**: Support Me Button Visibility Reversal
**Date**: 2025-09-29
**Status**: Complete

## Entity Overview

This feature involves primarily UI state management with no persistent data storage. All state is client-side reactive state managed by Vue 3 composables.

## Core Entities

### KofiButtonState
**Description**: Reactive state for Ko-fi button visibility and behavior
**Lifecycle**: Created on component mount, destroyed on component unmount
**Storage**: Client-side reactive state (Vue refs)

**Fields**:
- `isVisible: boolean` - Current visibility state of the button
- `scrollPercentage: number` - Current scroll position as percentage (0-100)
- `isAtThreshold: boolean` - Whether scroll has reached the 70% threshold
- `isShortPage: boolean` - Whether page content is shorter than viewport

**Validation Rules**:
- `scrollPercentage` must be between 0-100
- `isVisible` must be inverted from `isAtThreshold` (when ≥70% scroll, button hidden)
- `isShortPage` when true forces `isVisible` to true (always visible on short pages)

**State Transitions**:
```
Initial Load:
  scrollPercentage = 0
  isAtThreshold = false
  isVisible = true (REVERSED from previous implementation)

On Scroll ≥70%:
  isAtThreshold = true
  isVisible = false (fade out with 300ms animation)

On Scroll <70%:
  isAtThreshold = false
  isVisible = true (fade in with 300ms animation)

Short Page (no scrollable content):
  isShortPage = true
  isVisible = true (always visible, no threshold check)
```

### KofiButtonProps
**Description**: Configuration props for Ko-fi button component
**Storage**: Component props (immutable during component lifecycle)

**Fields**:
- `kofiUsername: string` - Ko-fi account username (required)
- `position?: string` - Button position override (default: 'bottom-left')
- `threshold?: number` - Scroll threshold percentage (default: 70)

**Validation Rules**:
- `kofiUsername` must be non-empty string
- `threshold` must be between 0-100 if provided
- `position` must be valid CSS position if provided

## Relationships

```
KofiButton (Component)
├── Uses KofiButtonProps (configuration)
├── Manages KofiButtonState (reactive state)
└── Consumes useScrollPosition (scroll tracking)

useScrollPosition (Composable)
├── Tracks scroll position
├── Calculates scroll percentage
├── Detects threshold crossing
└── Handles window resize events
```

## Component Interface

### KofiButton.vue
**Props**:
- `kofiUsername: string` (required)
- `threshold?: number = 70`

**Emits**: None (handles Ko-fi widget opening internally)

**Computed Properties**:
- `isVisible`: Inverted from `isAtThreshold` logic
- `buttonClasses`: CSS classes for visibility and positioning
- `ariaAttributes`: Accessibility attributes based on visibility

### useScrollPosition.ts
**Parameters**:
- `threshold: number = 70` - Scroll percentage threshold

**Returns**:
- `scrollPercentage: Ref<number>` - Current scroll percentage
- `isAtThreshold: Ref<boolean>` - Whether at/past threshold
- `isShortPage: Ref<boolean>` - Whether page is too short to scroll
- `cleanup: () => void` - Manual cleanup function

## Data Flow

```
Page Load → useScrollPosition initializes → calculates initial state
     ↓
KofiButton receives scroll state → computes isVisible (inverted logic)
     ↓
User scrolls → throttled scroll handler → updates scroll percentage
     ↓
Threshold check → isAtThreshold updates → isVisible recalculates
     ↓
CSS animation triggers → button fades in/out over 300ms
```

## Edge Cases

1. **Short Page**: When `scrollableHeight ≤ 0`, button remains always visible
2. **Rapid Scrolling**: Throttling prevents excessive state updates (100ms intervals)
3. **Window Resize**: Scroll calculations update automatically on resize events
4. **Reduced Motion**: CSS respects `prefers-reduced-motion` for accessibility

## Technical Constraints

- All state is client-side only (no persistence required)
- State must be reactive for real-time UI updates
- Scroll throttling required for 60fps performance
- Accessibility attributes must update with visibility state

## Migration Impact

**From Previous Implementation (003-ko-fi-com)**:
- Logic inversion: `isVisible = !isAtThreshold` instead of `isVisible = isAtThreshold`
- All other data structures remain identical
- No breaking changes to component API
- Test assertions need inversion to match new behavior

This maintains full backward compatibility while achieving the desired behavior reversal.
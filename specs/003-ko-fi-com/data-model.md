# Data Model: Ko-fi.com Support Me Float Button

## Component State

### KofiButton Component
**Purpose**: Manages the visibility and behavior of the Ko-fi support button

**State Properties**:
- `isVisible`: boolean - Whether the button is currently visible
- `scrollPercentage`: number - Current scroll position as percentage (0-100)
- `isShortPage`: boolean - Whether page content is shorter than viewport

**Props**:
- `kofiUsername`: string - Ko-fi account username (required)
- `threshold`: number - Scroll percentage to trigger visibility (default: 70)
- `animationDuration`: number - Fade animation duration in ms (default: 300)
- `position`: 'bottom-left' | 'bottom-right' - Button position (default: 'bottom-left')

## Composable State

### useScrollPosition
**Purpose**: Tracks scroll position and calculates scroll percentage

**Returns**:
- `scrollPercentage`: Ref<number> - Current scroll percentage (0-100)
- `isAtThreshold`: Ref<boolean> - Whether scroll has reached threshold
- `isShortPage`: Ref<boolean> - Whether content is shorter than viewport

**Internal State**:
- Throttled scroll handler
- Window resize observer
- Cleanup functions for event listeners

## CSS Classes

### Animation States
- `.kofi-button-hidden`: opacity: 0, pointer-events: none
- `.kofi-button-visible`: opacity: 1, pointer-events: auto
- `.kofi-button-transitioning`: transition properties applied

### Position Classes
- `.kofi-bottom-left`: bottom: 20px, left: 20px
- `.kofi-bottom-right`: bottom: 20px, right: 20px

## Events

### Component Events
- `kofi:shown` - Emitted when button becomes visible
- `kofi:hidden` - Emitted when button becomes hidden
- `kofi:clicked` - Emitted when button is clicked

### Window Events Handled
- `scroll` - Throttled, updates scroll percentage
- `resize` - Recalculates page dimensions
- `orientationchange` - Mobile orientation changes

## Accessibility Attributes

### ARIA Properties
- `aria-hidden`: Dynamic based on visibility state
- `aria-label`: "Support me on Ko-fi"
- `role`: "button"
- `tabindex`: -1 when hidden, 0 when visible

## Configuration

### Default Values
```typescript
const defaults = {
  threshold: 70,
  animationDuration: 300,
  position: 'bottom-left',
  throttleDelay: 100
}
```

## State Transitions

### Visibility State Machine
1. **Initial Load**:
   - Check if short page → Show immediately
   - Otherwise → Hide button

2. **Scrolling Down**:
   - Scroll >= threshold → Transition to visible
   - Start fade-in animation

3. **Scrolling Up**:
   - Scroll < threshold → Transition to hidden
   - Start fade-out animation

4. **Window Resize**:
   - Recalculate short page status
   - Update visibility accordingly
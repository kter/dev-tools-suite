# Research: Support Me Button Visibility Reversal

**Feature**: Support Me Button Visibility Reversal
**Date**: 2025-09-29
**Status**: Complete

## Technical Decisions

### Current Implementation Analysis
**Decision**: Reverse existing Ko-fi button fade-in behavior to fade-out behavior
**Rationale**: The current implementation (feature 003-ko-fi-com) shows the button when scrolling to 70% page height. User feedback indicates this is intrusive. Reversing to show-by-default-hide-on-scroll provides immediate support access while becoming non-intrusive as users approach content end.
**Alternatives considered**:
- Different scroll thresholds (rejected - 70% already validated)
- Time-based hiding (rejected - scroll-based more intuitive)
- Toggle button (rejected - adds UI complexity)

### Existing Component Architecture
**Decision**: Modify existing KofiButton.vue and useScrollPosition.ts composable
**Rationale**: All necessary infrastructure exists from feature 003-ko-fi-com. The useScrollPosition composable already provides scroll percentage tracking and threshold detection. The KofiButton component already handles visibility states and animations.
**Alternatives considered**:
- Create new components (rejected - violates DRY principle)
- Separate composable (rejected - existing one handles all requirements)

### State Logic Reversal Pattern
**Decision**: Invert the `isAtThreshold` logic in visibility calculation
**Rationale**: Current logic shows button when `isAtThreshold` is true (≥70%). New logic should show button when `isAtThreshold` is false (<70%). This maintains all existing animation timing, accessibility features, and edge case handling.
**Alternatives considered**:
- New threshold variable (rejected - adds complexity)
- Separate visibility state (rejected - existing reactive state sufficient)

### Animation and Performance
**Decision**: Maintain existing 300ms fade animation and 100ms scroll throttling
**Rationale**: These values were already validated in feature 003-ko-fi-com for smooth 60fps performance and good user experience. No technical reason to change them.
**Alternatives considered**:
- Faster animation (rejected - user feedback indicated 300ms feels right)
- Different throttling (rejected - 100ms provides good balance of responsiveness vs performance)

### Accessibility Preservation
**Decision**: Keep all existing accessibility features (ARIA attributes, reduced motion support)
**Rationale**: Accessibility requirements don't change with behavior reversal. The existing implementation already handles screen readers, keyboard navigation, and motion preferences correctly.
**Alternatives considered**: None - accessibility is non-negotiable

### Testing Strategy
**Decision**: Update existing E2E tests to assert reversed behavior
**Rationale**: The test structure and approach from landing-kofi.spec.js is comprehensive and well-designed. Only the assertions need to be inverted (visible→hidden, hidden→visible).
**Alternatives considered**:
- New test file (rejected - would duplicate test infrastructure)
- Additional test scenarios (deferred - existing coverage is comprehensive)

### Browser Compatibility
**Decision**: Maintain support for last 2 versions of Chrome, Firefox, Safari, Edge
**Rationale**: No new CSS or JavaScript features required. Existing implementation already works across these browsers.
**Alternatives considered**: None - no reason to change browser support

## Implementation Approach

### Phase 1: Component Logic Update
1. Modify KofiButton.vue visibility computed property to invert logic
2. Update CSS classes to match new behavior
3. Preserve all existing props, animations, and accessibility features

### Phase 2: Test Updates
1. Update E2E test assertions in landing-kofi.spec.js
2. Invert visibility expectations (visible on load, hidden at 70%)
3. Verify all edge cases still work (short pages, reduced motion, etc.)

### Phase 3: Integration Verification
1. Test with actual landing page content
2. Verify scroll behavior on different viewport sizes
3. Confirm Ko-fi widget integration still works correctly

## Technical Constraints

- Must work with existing useScrollPosition composable
- Must maintain 300ms animation timing for consistency
- Must preserve all accessibility features
- Must work with existing Ko-fi widget SDK integration
- Must maintain multi-browser compatibility

## Risk Mitigation

- **Risk**: Existing tests fail during development
  **Mitigation**: Update tests systematically, one assertion at a time

- **Risk**: Animation timing feels different
  **Mitigation**: Keep exact same timing values (300ms fade, 100ms throttle)

- **Risk**: Accessibility regression
  **Mitigation**: Preserve all existing ARIA attributes and reduced motion support

## Research Complete

All technical unknowns resolved. Ready for Phase 1 design and contracts.
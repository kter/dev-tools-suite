# Test Contract: Support Me Button Visibility Reversal

**Feature**: Support Me Button Visibility Reversal
**Date**: 2025-09-29
**Status**: Draft

## Test Requirements

### E2E Test Scenarios (Playwright)

#### TC-001: Initial Visibility
**Given** a user visits the landing page
**When** the page loads
**Then** the Ko-fi button must be visible
**And** the button must have `aria-hidden="false"`
**And** the button must have `tabindex="0"`

**Assertion Example**:
```javascript
await expect(kofiButton).toBeVisible();
await expect(kofiButton).toHaveAttribute('aria-hidden', 'false');
```

#### TC-002: Hide on Scroll Threshold
**Given** the Ko-fi button is visible
**When** the user scrolls to 70% of the page height
**Then** the button must fade out smoothly
**And** the button must have class `kofi-button-hidden`
**And** the button must have `aria-hidden="true"`
**And** the button must have `tabindex="-1"`

**Assertion Example**:
```javascript
await page.evaluate(() => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo(0, totalHeight * 0.7);
});
await page.waitForTimeout(400); // Wait for animation
await expect(kofiButton).toHaveClass(/kofi-button-hidden/);
```

#### TC-003: Show on Scroll Back
**Given** the Ko-fi button is hidden after scrolling down
**When** the user scrolls back up above the 70% threshold
**Then** the button must fade in smoothly
**And** the button must have class `kofi-button-visible`
**And** the button must have `aria-hidden="false"`
**And** the button must have `tabindex="0"`

#### TC-004: Short Page Behavior
**Given** the page content is shorter than the viewport height
**When** the page loads
**Then** the button must remain always visible
**And** the button must have class `kofi-button-visible`
**And** no threshold-based hiding should occur

**Implementation**:
```javascript
await page.setViewportSize({ width: 1200, height: 2000 });
await page.reload();
```

#### TC-005: Ko-fi Integration
**Given** the Ko-fi button is visible
**When** the user clicks the button
**Then** a new page/tab must open
**And** the URL must contain 'ko-fi.com'

**Assertion Example**:
```javascript
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  kofiButton.click()
]);
await expect(newPage.url()).toContain('ko-fi.com');
```

#### TC-006: Accessibility - Reduced Motion
**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** the button visibility changes
**Then** no CSS transitions must be applied
**And** the button must appear/disappear instantly

**Implementation**:
```javascript
await page.emulateMedia({ reducedMotion: 'reduce' });
```

#### TC-007: Positioning
**Given** the Ko-fi button is visible
**When** the button is rendered
**Then** it must be positioned at bottom-left corner
**And** it must have `position: fixed`
**And** it must have `bottom: 20px`
**And** it must have `left: 20px`

#### TC-008: Animation Timing
**Given** the Ko-fi button visibility changes
**When** the fade animation occurs
**Then** the transition duration must be exactly 300ms
**And** the animation must complete within 350ms total

#### TC-009: Window Resize
**Given** the Ko-fi button is in any state
**When** the window is resized
**Then** the scroll threshold calculations must update
**And** the button behavior must remain consistent

#### TC-010: Rapid Scroll Handling
**Given** the user rapidly scrolls up and down across the threshold
**When** multiple scroll events occur quickly
**Then** the button state must update correctly
**And** no animation glitches should occur

### Component Test Scenarios (Vue Test Utils)

#### CT-001: Props Validation
**Test**: Verify component accepts required props correctly
```typescript
const wrapper = mount(KofiButton, {
  props: { kofiUsername: 'testuser' }
});
expect(wrapper.props('kofiUsername')).toBe('testuser');
```

#### CT-002: Computed Visibility Logic
**Test**: Verify visibility computation is inverted from threshold state
```typescript
// When isAtThreshold = false (< 70%), button should be visible
expect(wrapper.vm.isVisible).toBe(true);
// When isAtThreshold = true (≥ 70%), button should be hidden
expect(wrapper.vm.isVisible).toBe(false);
```

#### CT-003: CSS Class Assignment
**Test**: Verify correct CSS classes are applied based on state
```typescript
// Visible state
expect(wrapper.classes()).toContain('kofi-button-visible');
// Hidden state
expect(wrapper.classes()).toContain('kofi-button-hidden');
```

### Performance Test Requirements

#### PT-001: Scroll Performance
**Requirement**: Scroll handling must maintain 60fps
**Measurement**: Frame time must not exceed 16.67ms during scroll
**Implementation**: Use browser dev tools performance monitoring

#### PT-002: Animation Performance
**Requirement**: Fade animation must use hardware acceleration
**Measurement**: Only transform and opacity properties should change
**Implementation**: Verify CSS uses `transform` and `opacity` only

#### PT-003: Memory Usage
**Requirement**: No memory leaks during component lifecycle
**Measurement**: Memory usage must return to baseline after unmount
**Implementation**: Monitor heap size during mount/unmount cycles

## Test Data Requirements

### Test Environment Setup
- **Browser Targets**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Viewport Sizes**: 1200x800 (desktop), 375x667 (mobile)
- **Page Content**: Must have sufficient height to enable scrolling (> 1500px)
- **Ko-fi Username**: Use test account or mock implementation

### Test Fixtures
```javascript
const TEST_CONFIG = {
  scrollThreshold: 70,
  animationDuration: 300,
  throttleInterval: 100,
  kofiUsername: 'devtoolssuite',
  buttonPosition: { bottom: '20px', left: '20px' }
};
```

## Success Criteria

### Functional Acceptance
- [ ] All E2E tests pass (TC-001 through TC-010)
- [ ] All component tests pass (CT-001 through CT-003)
- [ ] All performance requirements met (PT-001 through PT-003)

### Quality Gates
- [ ] Cross-browser compatibility verified
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance benchmarks met
- [ ] No console errors or warnings

### Regression Prevention
- [ ] Existing landing page functionality unaffected
- [ ] Ko-fi widget integration maintains compatibility
- [ ] Multi-platform deployment works (AWS + GCP)

## Test Execution Strategy

### Phase 1: Component Testing
1. Write failing component tests first (TDD approach)
2. Implement component changes to make tests pass
3. Verify all component behavior contracts

### Phase 2: E2E Testing
1. Update existing E2E tests with inverted assertions
2. Run tests against modified component
3. Verify all user interaction scenarios

### Phase 3: Performance Validation
1. Run performance tests in browser dev tools
2. Verify 60fps scroll performance maintained
3. Confirm memory usage stays within bounds

### Phase 4: Cross-browser Testing
1. Execute test suite on all supported browsers
2. Verify consistent behavior across platforms
3. Test responsive behavior on different screen sizes

This test contract ensures comprehensive validation of the reversed button behavior while maintaining quality, performance, and accessibility standards.
# Research: Ko-fi.com Support Me Float Button

## Ko-fi Widget Integration

**Decision**: Use Ko-fi's official floating widget script
**Rationale**: Ko-fi provides an official widget script that can be embedded directly, ensuring compatibility and proper functionality
**Alternatives considered**:
- Custom implementation with Ko-fi API - More complex, requires API key management
- Static button with link - Less interactive, no native Ko-fi modal support

## Scroll Detection Strategy

**Decision**: Use Vue 3 composable with passive scroll listeners
**Rationale**:
- Composables are the Vue 3 pattern for reusable logic
- Passive listeners improve scroll performance
- Throttling prevents excessive recalculation
**Alternatives considered**:
- Intersection Observer API - Overkill for simple percentage-based threshold
- CSS-only solution - Cannot achieve percentage-based scroll detection

## Animation Implementation

**Decision**: CSS transitions with opacity and transform
**Rationale**:
- Hardware-accelerated for smooth performance
- Respects prefers-reduced-motion automatically with CSS
- Simple to implement and maintain
**Alternatives considered**:
- JavaScript animations - More complex, worse performance
- Vue transitions - Unnecessary overhead for simple fade

## Accessibility Approach

**Decision**: Keep button in DOM with aria-hidden when not visible
**Rationale**:
- Maintains screen reader accessibility
- Prevents layout shift when appearing
- Simpler state management
**Alternatives considered**:
- v-if conditional rendering - Would remove from DOM entirely
- display: none - Would make inaccessible to screen readers

## Mobile Behavior

**Decision**: Same behavior as desktop with touch scroll support
**Rationale**:
- Consistent user experience across devices
- Modern mobile browsers handle scroll events well
- No special mobile detection needed
**Alternatives considered**:
- Different threshold for mobile - Adds complexity without clear benefit
- Always visible on mobile - Defeats purpose of non-intrusive design

## Browser Compatibility

**Decision**: Use standard web APIs with no polyfills needed
**Rationale**:
- All required APIs (scroll events, CSS transitions) are well-supported
- Target browsers (last 2 versions) all support needed features
- Simpler maintenance without polyfills
**Alternatives considered**:
- Adding polyfills for older browsers - Outside scope of requirements
- Using cutting-edge APIs - Would require fallbacks

## Performance Optimization

**Decision**: Throttle scroll handler to 100ms intervals
**Rationale**:
- Reduces computation during scroll
- Still responsive enough for smooth UX
- Standard practice for scroll handlers
**Alternatives considered**:
- Debouncing - Would delay response too much
- No throttling - Unnecessary performance overhead
- RAF-based throttling - More complex with minimal benefit

## Ko-fi Configuration

**Decision**: Configure Ko-fi username as environment variable or prop
**Rationale**:
- Allows easy configuration without code changes
- Follows existing pattern in landing-page tool
- Secure and flexible
**Alternatives considered**:
- Hardcoded username - Inflexible
- Dynamic API lookup - Unnecessary complexity

## Testing Strategy

**Decision**: Playwright E2E tests with scroll simulation
**Rationale**:
- Follows existing test patterns in the project
- Can properly test scroll behavior and animations
- Ensures cross-browser compatibility
**Alternatives considered**:
- Unit tests only - Cannot properly test scroll behavior
- Manual testing only - Not repeatable or reliable

## All Clarifications Resolved
✅ No remaining NEEDS CLARIFICATION items from Technical Context
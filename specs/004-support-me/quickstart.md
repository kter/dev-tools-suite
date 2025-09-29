# Quickstart: Support Me Button Visibility Reversal

**Feature**: Support Me Button Visibility Reversal
**Date**: 2025-09-29
**Estimated Time**: 30 minutes

## Prerequisites

- Feature branch `004-support-me` checked out
- Node.js 20+ and npm installed
- Playwright installed for E2E testing
- Landing page development environment running

## Quick Validation Steps

### Step 1: Environment Setup (2 minutes)
```bash
# Ensure you're on the correct branch
git branch
# Should show: * 004-support-me

# Navigate to landing page tool
cd tools/landing-page

# Install dependencies if needed
npm install

# Start development server
npm run dev
```

**Expected Result**: Development server starts on `http://localhost:3000`

### Step 2: Initial Behavior Verification (3 minutes)
1. Open browser to `http://localhost:3000`
2. **Observe**: Ko-fi button should be visible immediately (bottom-left corner)
3. Scroll down slowly to ~70% of page height
4. **Observe**: Button should fade out smoothly
5. Scroll back up
6. **Observe**: Button should fade in again

**Expected Result**: Button behavior is reversed from previous implementation

### Step 3: Component Implementation Check (5 minutes)
```bash
# Check if KofiButton component exists
ls tools/landing-page/components/KofiButton.vue

# Check if useScrollPosition composable exists
ls tools/landing-page/composables/useScrollPosition.ts

# Review current implementation
cat tools/landing-page/components/KofiButton.vue
```

**Expected Result**: Components exist and contain visibility logic

### Step 4: Test Execution (10 minutes)
```bash
# Run E2E tests from repository root
cd ../..
npx playwright test tests/landing-kofi.spec.js

# If tests fail (expected during development):
# Review test output for specific assertion failures
# Tests should be updated to match new behavior
```

**Expected Result**: Tests should validate reversed visibility behavior

### Step 5: Accessibility Verification (5 minutes)
1. Open browser developer tools
2. Navigate to Accessibility tab
3. Verify Ko-fi button has proper ARIA attributes:
   - `aria-hidden="false"` when visible
   - `aria-hidden="true"` when hidden
   - `tabindex="0"` when visible
   - `tabindex="-1"` when hidden

**Expected Result**: Accessibility attributes update correctly with visibility

### Step 6: Performance Check (3 minutes)
1. Open browser Performance tab
2. Start recording
3. Scroll up and down multiple times
4. Stop recording
5. Verify smooth 60fps performance

**Expected Result**: No frame drops during scroll/animation

### Step 7: Cross-Browser Quick Test (2 minutes)
Test in at least 2 different browsers:
- Chrome/Chromium
- Firefox
- Safari (if on macOS)

**Expected Result**: Consistent behavior across browsers

## Troubleshooting

### Issue: Button not visible on page load
**Solution**: Check `isVisible` computed property logic in KofiButton.vue
```vue
// Should be inverted from isAtThreshold
computed: {
  isVisible() {
    return !this.isAtThreshold || this.isShortPage;
  }
}
```

### Issue: Button doesn't hide when scrolling
**Solution**: Verify useScrollPosition composable is being called correctly
```typescript
const { isAtThreshold, isShortPage } = useScrollPosition(70);
```

### Issue: Animation not smooth
**Solution**: Check CSS transition timing
```css
.kofi-button {
  transition: opacity 0.3s ease-in-out;
}
```

### Issue: Tests failing
**Solution**: Update test assertions to match reversed behavior
```javascript
// OLD: Button hidden on load
await expect(kofiButton).toBeHidden();
// NEW: Button visible on load
await expect(kofiButton).toBeVisible();
```

## Success Validation Checklist

- [ ] Button visible immediately on page load
- [ ] Button hides smoothly when scrolling to 70%
- [ ] Button shows again when scrolling back up
- [ ] Short pages keep button always visible
- [ ] Ko-fi click opens support page
- [ ] ARIA attributes update correctly
- [ ] Smooth 60fps scroll performance
- [ ] 300ms fade animation timing
- [ ] Works consistently across browsers
- [ ] E2E tests pass with updated assertions

## Development Commands

```bash
# Run development server
cd tools/landing-page && npm run dev

# Run E2E tests
npx playwright test tests/landing-kofi.spec.js

# Run component tests (if available)
cd tools/landing-page && npm run test

# Build for production
cd tools/landing-page && npm run generate

# Check build output
ls tools/landing-page/.output/public/
```

## Integration Notes

### For Other Developers
- This feature modifies existing components, no new dependencies
- Animation timing and scroll thresholds unchanged from 003-ko-fi-com
- All accessibility features preserved
- Ko-fi widget integration unchanged

### For Testing
- Update existing test assertions to match reversed behavior
- No new test scenarios needed beyond existing coverage
- Performance requirements same as previous implementation

### For Deployment
- No infrastructure changes required
- Uses existing CI/CD pipeline
- Deploys to same AWS and GCP environments
- No environment variables or configuration changes

This quickstart provides a fast path to validate the feature implementation and identify any issues early in the development cycle.
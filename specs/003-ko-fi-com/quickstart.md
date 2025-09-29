# Quickstart: Ko-fi Support Button Feature

## Prerequisites
- Node.js 20+ installed
- Access to the dev-tools-suite repository
- Ko-fi account username

## Setup Steps

### 1. Switch to Feature Branch
```bash
git checkout 003-ko-fi-com
```

### 2. Install Dependencies
```bash
cd tools/landing-page
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Configure Ko-fi Username
In `tools/landing-page/app.vue`, add the Ko-fi button component with your username:
```vue
<KofiButton kofi-username="YOUR_KOFI_USERNAME" />
```

## Verification Steps

### Step 1: Initial Page Load
1. Open http://localhost:3000 in your browser
2. Verify the Ko-fi button is NOT visible on initial load
3. Check browser console for any errors

### Step 2: Scroll Behavior
1. Scroll down the page slowly
2. When you reach approximately 70% of the page height, the Ko-fi button should fade in
3. The button should appear in the bottom-left corner
4. The fade animation should take approximately 300ms

### Step 3: Scroll Back Up
1. After the button is visible, scroll back to the top of the page
2. The button should fade out smoothly
3. Verify the fade-out animation also takes 300ms

### Step 4: Button Interaction
1. Scroll down to make the button visible
2. Click on the Ko-fi button
3. Verify it opens the Ko-fi support page or modal
4. The Ko-fi interface should load correctly

### Step 5: Short Page Test
1. Create a test page with minimal content (less than viewport height)
2. Load the page
3. Verify the Ko-fi button is immediately visible
4. No scrolling should be required

### Step 6: Accessibility Check
1. Open browser DevTools
2. Inspect the Ko-fi button element
3. When hidden, verify:
   - `aria-hidden="true"`
   - `tabindex="-1"`
4. When visible, verify:
   - `aria-hidden="false"`
   - `tabindex="0"`
   - `aria-label="Support me on Ko-fi"`

### Step 7: Reduced Motion Test
1. Enable reduced motion in your OS settings:
   - macOS: System Preferences → Accessibility → Display → Reduce motion
   - Windows: Settings → Accessibility → Visual effects → Animation effects off
2. Refresh the page
3. Scroll to trigger the button
4. Verify the button appears/disappears without animation

### Step 8: Mobile Responsiveness
1. Open browser DevTools
2. Toggle device emulation (mobile view)
3. Test scroll behavior on mobile viewport
4. Verify button positioning adjusts correctly
5. Test touch scrolling behavior

## Running Tests

### E2E Tests
```bash
# From repository root
npx playwright test tests/landing-kofi.spec.js

# Run with UI mode for debugging
npx playwright test tests/landing-kofi.spec.js --ui

# Run specific test
npx playwright test tests/landing-kofi.spec.js -g "shows button when scrolled"
```

### Component Tests
```bash
# From tools/landing-page directory
npm run test
```

## Build & Deploy

### Local Build
```bash
cd tools/landing-page
npm run generate
# Output will be in .output/public/
```

### Preview Production Build
```bash
npm run preview
# Opens production build at http://localhost:3000
```

## Troubleshooting

### Button Not Appearing
- Check browser console for JavaScript errors
- Verify Ko-fi username is configured correctly
- Ensure page has enough content to scroll
- Check scroll percentage calculation in DevTools

### Animation Issues
- Verify CSS transitions are not disabled
- Check for conflicting CSS rules
- Test in different browsers
- Ensure reduced motion preference is not enabled

### Ko-fi Widget Not Loading
- Verify internet connection
- Check Ko-fi service status
- Ensure Ko-fi username exists and is public
- Check browser console for network errors

### Accessibility Problems
- Use browser accessibility inspector
- Test with screen reader (NVDA, JAWS, or VoiceOver)
- Verify keyboard navigation works when button is visible
- Check ARIA attributes are updating correctly

## Success Criteria
✅ Button hidden on initial load
✅ Button fades in at 70% scroll
✅ Button fades out when scrolling up
✅ 300ms fade animation
✅ Bottom-left positioning
✅ Ko-fi functionality works
✅ Short page handling
✅ Accessibility maintained
✅ Reduced motion respected
✅ All tests passing
# Quickstart: Ko-fi Widget Integration Testing

## Prerequisites

- Dev environment running (`npm run dev` in any tool directory)
- Playwright installed and configured
- Internet connection (for Ko-fi script loading)

## Manual Verification Steps

### 1. Widget Presence Test
```bash
# Start any tool in dev mode
cd tools/hash-generator
npm run dev
```

**Expected Result**:
- Floating Ko-fi button appears in consistent position
- Button shows "Support me" text
- Button has blue background (#00b9fe)

### 2. Widget Functionality Test
1. Click the Ko-fi widget button
2. **Expected Result**: Ko-fi donation overlay opens
3. Close the overlay
4. **Expected Result**: Widget remains visible and functional

### 3. Cross-Tool Consistency Test
```bash
# Test on multiple tools
cd ../qr-generator && npm run dev  # Open in new tab
cd ../unix-time-converter && npm run dev  # Open in new tab
```

**Expected Result**:
- Widget appears in identical position on all tools
- Same styling and behavior across all tools

### 4. Error Handling Test
1. Block Ko-fi domain in browser developer tools (Network tab)
2. Refresh page
3. **Expected Result**: No widget visible, no error messages, tool works normally

### 5. Mobile Responsiveness Test
1. Open browser developer tools
2. Switch to mobile device simulation
3. **Expected Result**: Widget maintains same position as desktop

## Automated Testing

### Run E2E Tests
```bash
# From repository root
npx playwright test --grep "ko-fi"
```

**Expected Results**:
- All widget presence tests pass
- No functional regressions in tools
- Consistent behavior across test environments

## Acceptance Criteria Validation

- ✅ Widget appears on all 22 applications
- ✅ Widget maintains consistent position
- ✅ Widget links to 'kterr' Ko-fi account
- ✅ Widget hides completely when service unavailable
- ✅ Widget works in all environments (dev, staging, production)
- ✅ Widget does not interfere with tool functionality

## Troubleshooting

**Widget not appearing**: Check browser console for script loading errors
**Position inconsistent**: Verify composable configuration is identical across tools
**Tool functionality broken**: Check for JavaScript errors in console
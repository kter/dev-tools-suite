# Quickstart: Amazon URL Normalizer

## Purpose
This quickstart guide provides step-by-step verification scenarios to validate that the Amazon URL Normalizer tool meets all functional requirements from the specification.

---

## Prerequisites

### Development Environment
- Node.js 20+ installed
- Tool built and running locally: `cd tools/amazon-url-normalizer && npm run dev`
- Browser open to `http://localhost:3000` (or appropriate dev port)

### Production Environment
- Tool deployed to dev environment: `https://amazon-url-normalizer.dev.devtools.site`
- Tool deployed to production: `https://amazon-url-normalizer.devtools.site`

---

## Test Scenario 1: Basic URL Normalization

**Requirement**: FR-001, FR-002, FR-003, FR-004
**User Story**: As a user, I can paste a long Amazon URL and receive the shortest valid format.

### Steps:
1. Open the tool in browser
2. Copy this test URL:
   ```
   https://www.amazon.co.jp/dp/B08N5WRWNW/ref=sr_1_1?keywords=laptop&qid=1234567890&sr=8-1&tag=affiliate
   ```
3. Paste the URL into the input field
4. Observe the result

### Expected Result:
- ✅ Tool displays normalized URL: `https://www.amazon.co.jp/dp/B08N5WRWNW`
- ✅ Tracking parameters (`ref`, `keywords`, `qid`, `sr`, `tag`) are removed
- ✅ Domain is preserved (`amazon.co.jp` not changed to `.com`)
- ✅ ASIN `B08N5WRWNW` is correctly extracted

### Pass Criteria:
- Normalized URL is exactly `https://www.amazon.co.jp/dp/B08N5WRWNW`
- No query parameters remain
- No path segments after ASIN

---

## Test Scenario 2: Copy to Clipboard

**Requirement**: FR-007, FR-008
**User Story**: As a user, I can copy the normalized URL to my clipboard with one click.

### Steps:
1. Complete Scenario 1 to generate a normalized URL
2. Click the "Copy" button next to the normalized URL
3. Open a text editor (Notepad, TextEdit, etc.)
4. Paste (Ctrl+V / Cmd+V)

### Expected Result:
- ✅ Toast notification appears: "Copied to clipboard!"
- ✅ Toast auto-dismisses after 2 seconds
- ✅ Pasted text matches normalized URL exactly
- ✅ Green success indicator visible

### Pass Criteria:
- Clipboard contains: `https://www.amazon.co.jp/dp/B08N5WRWNW`
- Toast message displays and auto-hides
- No console errors

---

## Test Scenario 3: Already Normalized URL

**Requirement**: FR-013
**User Story**: As a user, I am informed when a URL is already in the shortest format.

### Steps:
1. Open the tool in browser
2. Paste this already-normalized URL:
   ```
   https://www.amazon.com/dp/B0XYZ12345
   ```
3. Observe the result

### Expected Result:
- ✅ Tool displays the same URL: `https://www.amazon.com/dp/B0XYZ12345`
- ✅ Message indicates URL is already normalized (e.g., "This URL is already in the shortest format")
- ✅ Copy button still works

### Pass Criteria:
- Output matches input exactly
- User is clearly informed URL needs no changes
- All functionality remains available

---

## Test Scenario 4: Invalid Amazon URL (Wrong Domain)

**Requirement**: FR-005, FR-006
**User Story**: As a user, I receive clear error messages for invalid URLs.

### Steps:
1. Open the tool in browser
2. Paste this non-Amazon URL:
   ```
   https://www.ebay.com/itm/123456789012
   ```
3. Observe the result

### Expected Result:
- ✅ Error message displayed: "Not a valid Amazon URL. Please enter an Amazon product link."
- ✅ No normalized URL shown
- ✅ Copy button is disabled or hidden
- ✅ Error styling applied (red text, alert icon, etc.)

### Pass Criteria:
- Clear, user-friendly error message
- No crash or console errors
- UI clearly indicates invalid state

---

## Test Scenario 5: Invalid Amazon URL (No ASIN)

**Requirement**: FR-005, FR-006
**User Story**: As a user, I receive specific errors for URLs without product IDs.

### Steps:
1. Open the tool in browser
2. Paste this Amazon search results URL (no ASIN):
   ```
   https://www.amazon.com/s?k=laptop&ref=nb_sb_noss
   ```
3. Observe the result

### Expected Result:
- ✅ Error message displayed: "Could not find product ID in URL. Make sure it's a product page link."
- ✅ Error distinguishes "no ASIN" from "wrong domain" (Scenario 4)
- ✅ No normalized URL shown
- ✅ Copy button is disabled or hidden

### Pass Criteria:
- Specific error message for missing ASIN
- Different from wrong-domain error
- UI clearly indicates invalid state

---

## Test Scenario 6: Malformed URL

**Requirement**: FR-005, FR-006
**User Story**: As a user, I receive helpful errors for malformed URLs.

### Steps:
1. Open the tool in browser
2. Paste this incomplete URL (no protocol):
   ```
   amazon.com/dp/B123456789
   ```
3. Observe the result

### Expected Result:
- ✅ Error message displayed: "Invalid URL format. Please enter a complete Amazon URL."
- ✅ No crash or exception
- ✅ No normalized URL shown

### Pass Criteria:
- Tool handles malformed input gracefully
- Error message guides user to correct format
- No console errors or crashes

---

## Test Scenario 7: Multiple Regional Domains

**Requirement**: FR-001, FR-014
**User Story**: As a user, I can normalize URLs from any Amazon regional site.

### Test Cases:

#### 7.1: Amazon US
- Input: `https://www.amazon.com/dp/B0US123456?ref=tracking`
- Expected: `https://www.amazon.com/dp/B0US123456`

#### 7.2: Amazon UK
- Input: `https://www.amazon.co.uk/gp/product/B0UK123456`
- Expected: `https://www.amazon.co.uk/dp/B0UK123456`

#### 7.3: Amazon Germany
- Input: `https://www.amazon.de/product/B0DE123456?psc=1`
- Expected: `https://www.amazon.de/dp/B0DE123456`

#### 7.4: Amazon Japan
- Input: `https://www.amazon.co.jp/dp/B0JP123456/ref=nav`
- Expected: `https://www.amazon.co.jp/dp/B0JP123456`

#### 7.5: Amazon Canada
- Input: `https://amazon.ca/dp/B0CA123456?th=1`
- Expected: `https://amazon.ca/dp/B0CA123456`

### Pass Criteria:
- All regional domains are supported
- Original domain is preserved in output
- No cross-region conversion occurs

---

## Test Scenario 8: Dark Mode Support

**Requirement**: FR-011
**User Story**: As a user, I can use the tool in dark mode.

### Steps:
1. Open the tool in browser (light mode default)
2. Locate the theme toggle button (usually top-right)
3. Click to switch to dark mode
4. Paste and normalize a test URL
5. Click theme toggle again to return to light mode

### Expected Result:
- ✅ Dark mode applies to entire page (background, text, cards)
- ✅ Theme toggle icon changes (sun ↔ moon)
- ✅ All functionality works in both modes
- ✅ Theme preference persists on reload
- ✅ Smooth transition between modes

### Pass Criteria:
- Consistent with other DevTools Suite tools
- No broken styling in either mode
- Theme preference saved to localStorage

---

## Test Scenario 9: Mobile Responsive Design

**Requirement**: FR-012
**User Story**: As a user, I can use the tool on my mobile device.

### Steps:
1. Open DevTools (F12) and toggle device emulation
2. Select "iPhone 12 Pro" or similar mobile device
3. Paste a long Amazon URL
4. Normalize the URL
5. Copy the result
6. Test theme toggle

### Expected Result:
- ✅ Layout adapts to mobile screen width
- ✅ Input field is touch-friendly (not too small)
- ✅ Copy button is easily tappable (min 44px touch target)
- ✅ Text is readable without zoom
- ✅ No horizontal scrolling required
- ✅ Theme toggle accessible on mobile

### Pass Criteria:
- Usable on screens 375px wide and above
- Touch targets meet accessibility standards
- Consistent with other mobile tools

---

## Test Scenario 10: Ko-fi Support Button

**Requirement**: FR-010
**User Story**: As a user, I can support the developer via Ko-fi.

### Steps:
1. Open the tool in browser
2. Scroll to bottom-left of page
3. Locate the Ko-fi support button
4. Scroll down the page (if content is long enough)
5. Observe button behavior

### Expected Result:
- ✅ Ko-fi button visible at bottom-left
- ✅ Button matches style of other DevTools Suite tools
- ✅ Button auto-hides when scrolling past threshold (70%)
- ✅ Clicking button opens Ko-fi page in new tab
- ✅ Button is non-intrusive to main functionality

### Pass Criteria:
- Ko-fi username is "kterr"
- Button behavior matches hash-generator tool
- Opens `https://ko-fi.com/kterr` on click

---

## Test Scenario 11: Performance Validation

**Requirement**: Performance goals (<100ms normalization, <50ms copy)
**User Story**: As a user, I experience instant feedback when using the tool.

### Steps:
1. Open browser DevTools → Performance tab
2. Start performance recording
3. Paste a long Amazon URL
4. Stop recording when normalized URL appears
5. Measure time to normalize
6. Repeat for copy operation

### Expected Result:
- ✅ URL normalization completes in <100ms
- ✅ Copy to clipboard completes in <50ms
- ✅ No noticeable lag or delay
- ✅ UI updates are immediate

### Pass Criteria:
- Parse + validate + normalize < 100ms total
- Clipboard write < 50ms
- No main thread blocking

---

## Test Scenario 12: Edge Case - Empty Input

**Requirement**: FR-006
**User Story**: As a user, I see appropriate handling of edge cases.

### Steps:
1. Open the tool in browser
2. Clear the input field (if not empty)
3. Do not enter any URL
4. Observe the state

### Expected Result:
- ✅ No error message (empty is not invalid)
- ✅ No normalized URL shown
- ✅ Copy button disabled/hidden
- ✅ Placeholder text visible in input
- ✅ No console errors

### Pass Criteria:
- Clean initial state
- No misleading errors for empty input
- UI clearly indicates "ready for input" state

---

## Test Scenario 13: E2E Workflow

**Requirement**: All FRs (comprehensive workflow)
**User Story**: As a user, I complete a typical workflow from start to finish.

### Steps:
1. Open the tool
2. Paste: `https://www.amazon.com/gp/product/B0WORKFLOW/ref=sr_1_3?keywords=test&qid=99999&sr=8-3`
3. Verify normalized result displays
4. Click copy button
5. Verify toast notification
6. Paste result in text editor
7. Toggle dark mode
8. Paste the same URL again
9. Verify "already normalized" message
10. Clear input and paste invalid URL
11. Verify error message

### Expected Result:
- ✅ Complete workflow works without errors
- ✅ All features integrate correctly
- ✅ UI state transitions are smooth
- ✅ No console errors throughout

### Pass Criteria:
- All steps complete successfully
- Features work together cohesively
- No crashes or unexpected behavior

---

## Deployment Verification

### Dev Environment Checklist
- [ ] Tool accessible at `https://amazon-url-normalizer.dev.devtools.site`
- [ ] All scenarios (1-13) pass on dev deployment
- [ ] No console errors in browser
- [ ] Lighthouse score: Performance >90, Accessibility >95
- [ ] Mobile testing on real device

### Production Environment Checklist
- [ ] Tool accessible at `https://amazon-url-normalizer.devtools.site`
- [ ] All scenarios (1-13) pass on production deployment
- [ ] SSL certificate valid
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Analytics tracking working (if implemented)

### Infrastructure Verification
- [ ] AWS CDK stack deployed (S3 + CloudFront)
- [ ] GCP Terraform deployed (Firebase Hosting)
- [ ] DNS routing configured (Route53)
- [ ] GitHub Actions workflow passing
- [ ] Landing page updated with new tool entry

---

## Acceptance Criteria Summary

This quickstart validates all functional requirements:

| FR ID | Requirement | Test Scenario |
|-------|-------------|---------------|
| FR-001 | Accept Amazon URLs from any domain | Scenario 7 |
| FR-002 | Extract ASIN | Scenario 1 |
| FR-003 | Remove unnecessary parameters | Scenario 1 |
| FR-004 | Generate shortest valid format | Scenario 1 |
| FR-005 | Validate URLs | Scenarios 4, 5, 6 |
| FR-006 | Display error messages | Scenarios 4, 5, 6 |
| FR-007 | Copy to clipboard | Scenario 2 |
| FR-008 | Visual feedback on copy | Scenario 2 |
| FR-009 | Consistent visual design | Manual inspection |
| FR-010 | Ko-fi support button | Scenario 10 |
| FR-011 | Dark mode support | Scenario 8 |
| FR-012 | Mobile responsive | Scenario 9 |
| FR-013 | Indicate already normalized | Scenario 3 |
| FR-014 | Preserve original domain | Scenario 7 |

---

**Status**: Quickstart complete ✓
**Next Step**: Update agent context (CLAUDE.md)

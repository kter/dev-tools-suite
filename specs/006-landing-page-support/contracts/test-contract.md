# Test Contract: Universal Support Me Button

**Purpose**: Define the testing requirements for Support Me button integration across all 23 tools.

## E2E Test Requirements

Each tool MUST have a corresponding test file: `tests/support-button-[tool-name].spec.js`

### Required Test Cases

#### 1. Initial Visibility Test
```javascript
test('shows Support Me button on initial page load', async ({ page }) => {
  await page.goto('http://localhost:3000/'); // Tool-specific URL
  const kofiButton = page.locator('[data-testid="kofi-button"]');
  await expect(kofiButton).toHaveClass(/kofi-button-visible/);

  // Verify opacity is 1
  const opacity = await kofiButton.evaluate(el => window.getComputedStyle(el).opacity);
  expect(parseFloat(opacity)).toBe(1);
});
```

#### 2. Scroll Hide Test
```javascript
test('hides button when scrolled to 70% of page', async ({ page }) => {
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Scroll to 80% to ensure we're well past the 70% threshold
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = totalHeight * 0.8;
    window.scrollTo(0, targetScroll);
  });

  // Wait for throttled scroll handler + animation
  await page.waitForTimeout(800);

  await expect(kofiButton).toHaveClass(/kofi-button-hidden/);
  const opacity = await kofiButton.evaluate(el => window.getComputedStyle(el).opacity);
  expect(parseFloat(opacity)).toBe(0);
});
```

#### 3. Scroll Show Test
```javascript
test('shows button when scrolled back above threshold', async ({ page }) => {
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Scroll down to hide button
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, totalHeight * 0.8);
  });
  await page.waitForTimeout(400);
  await expect(kofiButton).toHaveClass(/kofi-button-hidden/);

  // Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await expect(kofiButton).toHaveClass(/kofi-button-visible/);
});
```

#### 4. Short Page Test
```javascript
test('shows button immediately on short pages', async ({ page }) => {
  // Create a page with minimal content by setting viewport larger than content
  await page.setViewportSize({ width: 1200, height: 2000 });
  await page.reload();

  const kofiButton = page.locator('[data-testid="kofi-button"]');
  await page.waitForTimeout(500); // Wait for component to initialize
  await expect(kofiButton).toHaveClass(/kofi-button-visible/);
});
```

#### 5. Ko-fi Integration Test
```javascript
test('button opens Ko-fi page when clicked', async ({ page, context }) => {
  const kofiButton = page.locator('[data-testid="kofi-button"]');
  await page.waitForTimeout(1000); // Wait for component and Ko-fi widget to initialize

  // Verify button is in visible state first
  await expect(kofiButton).toHaveClass(/kofi-button-visible/);

  // Listen for new page/popup
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    kofiButton.click({ force: true })
  ]);

  // Verify Ko-fi page opened with correct username
  await expect(newPage.url()).toContain('ko-fi.com/kterr');
});
```

#### 6. Accessibility Test
```javascript
test('maintains accessibility attributes', async ({ page }) => {
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // When visible (initial state)
  await expect(kofiButton).toHaveAttribute('aria-hidden', 'false');
  await expect(kofiButton).toHaveAttribute('tabindex', '0');
  await expect(kofiButton).toHaveAttribute('aria-label', 'Support me on Ko-fi');

  // Scroll to hide
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, totalHeight * 0.8);
  });
  await page.waitForTimeout(400);

  // When hidden
  await expect(kofiButton).toHaveAttribute('aria-hidden', 'true');
  await expect(kofiButton).toHaveAttribute('tabindex', '-1');
});
```

#### 7. Reduced Motion Test
```javascript
test('respects prefers-reduced-motion', async ({ page }) => {
  // Enable reduced motion preference
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Scroll to trigger hiding
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, totalHeight * 0.8);
  });

  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Should be hidden without animation
  await expect(kofiButton).toHaveClass(/kofi-button-hidden/);

  // Verify no transition is applied
  const hasTransition = await kofiButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.transition !== 'none' && styles.transition !== '';
  });

  expect(hasTransition).toBe(false);
});
```

## Test File Template

Each tool's test file should follow this naming pattern and structure:

**File**: `tests/support-button-[tool-name].spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Support Me Button - [Tool Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/'); // Adjust port if needed
  });

  // Include all 7 required test cases above
  // Customize URLs and viewport sizes as needed for each tool
});
```

## Validation Requirements

- All 7 test cases must pass for each tool
- Tests must run in the existing Playwright framework
- CI/CD pipeline must validate all 23 tool tests pass before deployment
- Test failures block production deployment

## Tool-Specific Adaptations

Some tools may require minor adaptations:

- **Port numbers**: Tools may run on different development ports
- **Content height**: Tools with very short content may need viewport adjustments
- **Load timing**: Tools with heavy assets may need longer wait times
- **Layout detection**: Auto-detection should handle most cases, but complex layouts may need verification

## Test Maintenance

- Test patterns should be consistent across all 23 tools
- Updates to shared component should be reflected in all test files
- Test utilities can be shared to reduce duplication
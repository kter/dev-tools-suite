# Test Contract: Ko-fi Support Button

## E2E Test Scenarios

### Scenario 1: Initial Page Load
```typescript
test('hides button on initial page load', async ({ page }) => {
  await page.goto('/');
  const kofiButton = page.locator('[data-testid="kofi-button"]');
  await expect(kofiButton).toBeHidden();
});
```

### Scenario 2: Scroll to Threshold
```typescript
test('shows button when scrolled to 70% of page', async ({ page }) => {
  await page.goto('/');
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Scroll to 70% of page height
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight;
    const targetScroll = totalHeight * 0.7;
    window.scrollTo(0, targetScroll);
  });

  await expect(kofiButton).toBeVisible();
});
```

### Scenario 3: Scroll Back Up
```typescript
test('hides button when scrolled back above threshold', async ({ page }) => {
  await page.goto('/');
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Scroll down to show button
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));
  await expect(kofiButton).toBeVisible();

  // Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(kofiButton).toBeHidden();
});
```

### Scenario 4: Short Page Behavior
```typescript
test('shows button immediately on short pages', async ({ page }) => {
  // Navigate to a page with minimal content
  await page.goto('/short-content');
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  await expect(kofiButton).toBeVisible();
});
```

### Scenario 5: Button Click
```typescript
test('opens Ko-fi page when button clicked', async ({ page }) => {
  await page.goto('/');

  // Scroll to show button
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));

  const kofiButton = page.locator('[data-testid="kofi-button"]');
  await kofiButton.click();

  // Verify Ko-fi modal or new tab opened
  // Exact assertion depends on Ko-fi widget behavior
});
```

### Scenario 6: Animation Duration
```typescript
test('fades in with 300ms animation', async ({ page }) => {
  await page.goto('/');

  // Start observing CSS transitions
  const transitionPromise = page.evaluate(() => {
    return new Promise(resolve => {
      const button = document.querySelector('[data-testid="kofi-button"]');
      button.addEventListener('transitionend', (e) => {
        resolve(e.propertyName === 'opacity');
      });
    });
  });

  // Trigger scroll
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));

  // Wait for transition to complete
  const isOpacityTransition = await transitionPromise;
  expect(isOpacityTransition).toBe(true);
});
```

### Scenario 7: Accessibility
```typescript
test('maintains accessibility attributes', async ({ page }) => {
  await page.goto('/');
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // When hidden
  await expect(kofiButton).toHaveAttribute('aria-hidden', 'true');
  await expect(kofiButton).toHaveAttribute('tabindex', '-1');

  // Scroll to show
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));

  // When visible
  await expect(kofiButton).toHaveAttribute('aria-hidden', 'false');
  await expect(kofiButton).toHaveAttribute('tabindex', '0');
  await expect(kofiButton).toHaveAttribute('aria-label', 'Support me on Ko-fi');
});
```

### Scenario 8: Reduced Motion
```typescript
test('respects prefers-reduced-motion', async ({ page }) => {
  // Enable reduced motion preference
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  // Scroll to trigger
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));

  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Should appear without animation
  await expect(kofiButton).toBeVisible();

  // Verify no transition is applied
  const hasTransition = await kofiButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.transition !== 'none';
  });

  expect(hasTransition).toBe(false);
});
```

### Scenario 9: Window Resize
```typescript
test('recalculates on window resize', async ({ page }) => {
  await page.goto('/');
  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Set initial viewport
  await page.setViewportSize({ width: 1200, height: 800 });

  // Scroll to 70%
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.7));
  await expect(kofiButton).toBeVisible();

  // Resize to trigger recalculation
  await page.setViewportSize({ width: 1200, height: 400 });

  // Button should recalculate visibility based on new dimensions
  // Exact behavior depends on content height vs new viewport
});
```

### Scenario 10: Position Configuration
```typescript
test('positions button at bottom-left corner', async ({ page }) => {
  await page.goto('/');

  // Scroll to show button
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.8));

  const kofiButton = page.locator('[data-testid="kofi-button"]');

  // Check computed styles for positioning
  const position = await kofiButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      bottom: styles.bottom,
      left: styles.left,
      position: styles.position
    };
  });

  expect(position.position).toBe('fixed');
  expect(position.bottom).toBe('20px');
  expect(position.left).toBe('20px');
});
```
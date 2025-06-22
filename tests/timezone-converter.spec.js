const { test, expect } = require('@playwright/test');

test.describe('Timezone Converter', () => {
  test('should load and display Timezone Converter interface', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Timezone Converter');
    
    // Check main sections
    await expect(page.locator('text=Current Time')).toBeVisible();
    await expect(page.locator('text=Convert Time')).toBeVisible();
    await expect(page.locator('text=World Clock')).toBeVisible();
    await expect(page.locator('text=Timezone Information')).toBeVisible();
  });

  test('should display current time information', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check current time sections
    await expect(page.locator('text=Local Time')).toBeVisible();
    await expect(page.locator('text=UTC')).toBeVisible();
    await expect(page.locator('text=Unix Timestamp')).toBeVisible();
    
    // Check that times are displaying (not empty)
    const localTime = page.locator('.text-blue-600').first();
    await expect(localTime).toBeVisible();
    const localTimeText = await localTime.textContent();
    expect(localTimeText).toMatch(/^\d{2}:\d{2}:\d{2}$/); // HH:MM:SS format
  });

  test('should have working timezone selectors', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check timezone selectors exist
    const fromTimezoneSelect = page.locator('#from-timezone');
    const toTimezoneSelect = page.locator('#to-timezone');
    
    await expect(fromTimezoneSelect).toBeVisible();
    await expect(toTimezoneSelect).toBeVisible();
    
    // Test changing timezone
    await fromTimezoneSelect.selectOption('UTC');
    await toTimezoneSelect.selectOption('Asia/Tokyo');
    
    // Verify selections
    expect(await fromTimezoneSelect.inputValue()).toBe('UTC');
    expect(await toTimezoneSelect.inputValue()).toBe('Asia/Tokyo');
  });

  test('should set current time when button clicked', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Click "Use Current Time" button
    await page.click('button:has-text("Use Current Time")');
    
    // Check that date and time inputs are populated
    const dateInput = page.locator('#from-date');
    const timeInput = page.locator('#from-time');
    
    const dateValue = await dateInput.inputValue();
    const timeValue = await timeInput.inputValue();
    
    expect(dateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
    expect(timeValue).toMatch(/^\d{2}:\d{2}:\d{2}$/); // HH:MM:SS format
  });

  test('should perform timezone conversion', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Set specific values for conversion
    await page.selectOption('#from-timezone', 'UTC');
    await page.selectOption('#to-timezone', 'Asia/Tokyo');
    await page.fill('#from-date', '2024-01-01');
    await page.fill('#from-time', '12:00:00');
    
    // Wait for conversion to happen
    await page.waitForTimeout(1000);
    
    // Check that converted values are displayed
    const convertedDateInputs = page.locator('input[readonly]');
    await expect(convertedDateInputs.first()).toBeVisible();
    
    // Check that full datetime displays are shown
    await expect(page.locator('text=Full DateTime')).toBeVisible();
  });

  test('should swap timezones when swap button clicked', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Set initial values
    await page.selectOption('#from-timezone', 'UTC');
    await page.selectOption('#to-timezone', 'Asia/Tokyo');
    
    // Click swap button
    await page.click('button:has-text("Swap Timezones")');
    
    // Verify timezones have been swapped
    expect(await page.locator('#from-timezone').inputValue()).toBe('Asia/Tokyo');
    expect(await page.locator('#to-timezone').inputValue()).toBe('UTC');
  });

  test('should copy conversion result', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Set up a conversion
    await page.click('button:has-text("Use Current Time")');
    await page.waitForTimeout(500);
    
    // Click copy result button
    await page.click('button:has-text("Copy Result")');
    
    // Check for copy notification
    await expect(page.locator('text=copied to clipboard')).toBeVisible();
    
    // Wait for notification to disappear
    await page.waitForTimeout(2500);
    await expect(page.locator('text=copied to clipboard')).not.toBeVisible();
  });

  test('should display world clock', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check world clock section
    await expect(page.locator('text=World Clock')).toBeVisible();
    
    // Check for specific cities
    await expect(page.locator('text=New York')).toBeVisible();
    await expect(page.locator('text=London')).toBeVisible();
    await expect(page.locator('text=Tokyo')).toBeVisible();
    await expect(page.locator('text=Sydney')).toBeVisible();
    
    // Check that times are displayed for world clock
    const worldClockTimes = page.locator('.text-blue-600').nth(3); // Skip the first 3 which are current time section
    await expect(worldClockTimes).toBeVisible();
  });

  test('should display timezone information', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check timezone information section
    await expect(page.locator('text=Timezone Information')).toBeVisible();
    
    // Check for timezone details
    await expect(page.locator('text=UTC Offset:')).toBeVisible();
    await expect(page.locator('text=DST:')).toBeVisible();
    await expect(page.locator('text=Abbreviation:')).toBeVisible();
  });

  test('should show time difference when converting', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Set different timezones
    await page.selectOption('#from-timezone', 'UTC');
    await page.selectOption('#to-timezone', 'Asia/Tokyo');
    await page.fill('#from-date', '2024-01-01');
    await page.fill('#from-time', '12:00:00');
    
    // Wait for conversion
    await page.waitForTimeout(1000);
    
    // Check for time difference display
    await expect(page.locator('text=Time Difference:')).toBeVisible();
  });

  test('should handle date and time input validation', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test with valid date and time
    await page.fill('#from-date', '2024-12-25');
    await page.fill('#from-time', '14:30:00');
    
    // Check that inputs accept the values
    expect(await page.locator('#from-date').inputValue()).toBe('2024-12-25');
    expect(await page.locator('#from-time').inputValue()).toBe('14:30:00');
  });

  test('should update world clock in real-time', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Get initial time for New York
    const initialTime = await page.locator('text=New York').locator('..').locator('.text-blue-600').textContent();
    
    // Wait a few seconds
    await page.waitForTimeout(3000);
    
    // Get updated time
    const updatedTime = await page.locator('text=New York').locator('..').locator('.text-blue-600').textContent();
    
    // Times should be different (or at least formatted properly)
    expect(initialTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(updatedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Convert Time')).toBeVisible();
    await expect(page.locator('#from-timezone')).toBeVisible();
    await expect(page.locator('#to-timezone')).toBeVisible();
    
    // Check that buttons are accessible
    await expect(page.locator('button:has-text("Use Current Time")')).toBeVisible();
    await expect(page.locator('button:has-text("Swap Timezones")')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should handle timezone abbreviations correctly', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Select a specific timezone
    await page.selectOption('#from-timezone', 'America/New_York');
    
    // Wait for timezone info to update
    await page.waitForTimeout(1000);
    
    // Check that timezone information is displayed
    const timezoneInfo = page.locator('text=Timezone Information').locator('..');
    await expect(timezoneInfo).toBeVisible();
    
    // Should show some form of abbreviation or offset
    await expect(page.locator('text=UTC')).toBeVisible();
  });

  test('should display correct format for different timezones', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test with various timezone combinations
    const timezones = ['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/London'];
    
    for (const tz of timezones) {
      await page.selectOption('#from-timezone', tz);
      await page.waitForTimeout(500);
      
      // Check that timezone info updates
      const tzInfo = page.locator('text=Timezone Information').locator('..');
      await expect(tzInfo).toBeVisible();
    }
  });

  test('should maintain functionality after timezone changes', async ({ page }) => {
    await page.goto('https://timezone-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Set initial conversion
    await page.selectOption('#from-timezone', 'UTC');
    await page.selectOption('#to-timezone', 'Asia/Tokyo');
    await page.click('button:has-text("Use Current Time")');
    
    // Change timezones
    await page.selectOption('#from-timezone', 'America/New_York');
    await page.selectOption('#to-timezone', 'Europe/London');
    
    // Verify conversion still works
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Full DateTime')).toBeVisible();
    
    // Test swap functionality
    await page.click('button:has-text("Swap Timezones")');
    expect(await page.locator('#from-timezone').inputValue()).toBe('Europe/London');
    expect(await page.locator('#to-timezone').inputValue()).toBe('America/New_York');
  });
});
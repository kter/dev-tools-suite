const { test, expect } = require('@playwright/test');

test.describe('IP Calculator', () => {
  test('should load and display IP Calculator interface', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('IP Calculator');
    
    // Check input field
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('label:has-text("IP Address with CIDR")')).toBeVisible();
    
    // Check placeholder text
    await expect(page.locator('input[placeholder="192.168.1.1/24"]')).toBeVisible();
  });

  test('should calculate network information for default IP', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Default IP should be 192.168.1.1/24
    await expect(page.locator('input[type="text"]')).toHaveValue('192.168.1.1/24');
    
    // Check Network Information section
    await expect(page.locator('text=Network Information')).toBeVisible();
    await expect(page.locator('text=IP Address:')).toBeVisible();
    await expect(page.locator('text=Subnet Mask:')).toBeVisible();
    await expect(page.locator('text=CIDR Notation:')).toBeVisible();
    await expect(page.locator('text=Network Address:')).toBeVisible();
    await expect(page.locator('text=Broadcast Address:')).toBeVisible();
    
    // Check Host Information section
    await expect(page.locator('text=Host Information')).toBeVisible();
    await expect(page.locator('text=First Host:')).toBeVisible();
    await expect(page.locator('text=Last Host:')).toBeVisible();
    await expect(page.locator('text=Total Hosts:')).toBeVisible();
    await expect(page.locator('text=Usable Hosts:')).toBeVisible();
    await expect(page.locator('text=Network Class:')).toBeVisible();
    
    // Check Binary Representation section
    await expect(page.locator('text=Binary Representation')).toBeVisible();
    await expect(page.locator('text=IP Address (Binary):')).toBeVisible();
    await expect(page.locator('text=Subnet Mask (Binary):')).toBeVisible();
  });

  test('should calculate Class A network correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter Class A IP
    await page.fill('input[type="text"]', '10.0.0.1/8');
    
    // Verify network class
    await expect(page.locator('code:has-text("A")')).toBeVisible();
    
    // Verify subnet mask
    await expect(page.locator('code:has-text("255.0.0.0")')).toBeVisible();
    
    // Verify network address
    await expect(page.locator('code:has-text("10.0.0.0")')).toBeVisible();
    
    // Verify broadcast address
    await expect(page.locator('code:has-text("10.255.255.255")')).toBeVisible();
    
    // Verify total hosts (should be 16,777,216)
    await expect(page.locator('code:has-text("16,777,216")')).toBeVisible();
  });

  test('should calculate Class B network correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter Class B IP
    await page.fill('input[type="text"]', '172.16.1.1/16');
    
    // Verify network class
    await expect(page.locator('code:has-text("B")')).toBeVisible();
    
    // Verify subnet mask
    await expect(page.locator('code:has-text("255.255.0.0")')).toBeVisible();
    
    // Verify network address
    await expect(page.locator('code:has-text("172.16.0.0")')).toBeVisible();
    
    // Verify broadcast address
    await expect(page.locator('code:has-text("172.16.255.255")')).toBeVisible();
    
    // Verify total hosts (should be 65,536)
    await expect(page.locator('code:has-text("65,536")')).toBeVisible();
  });

  test('should calculate Class C network correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Default is already Class C, but let's test another one
    await page.fill('input[type="text"]', '192.168.100.50/24');
    
    // Verify network class
    await expect(page.locator('code:has-text("C")')).toBeVisible();
    
    // Verify subnet mask
    await expect(page.locator('code:has-text("255.255.255.0")')).toBeVisible();
    
    // Verify network address
    await expect(page.locator('code:has-text("192.168.100.0")')).toBeVisible();
    
    // Verify broadcast address
    await expect(page.locator('code:has-text("192.168.100.255")')).toBeVisible();
    
    // Verify total hosts (should be 256)
    await expect(page.locator('code:has-text("256")')).toBeVisible();
    
    // Verify usable hosts (should be 254)
    await expect(page.locator('code:has-text("254")')).toBeVisible();
  });

  test('should handle subnet calculations correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test /30 subnet (point-to-point link)
    await page.fill('input[type="text"]', '192.168.1.1/30');
    
    // Verify subnet mask
    await expect(page.locator('code:has-text("255.255.255.252")')).toBeVisible();
    
    // Verify network address
    await expect(page.locator('code:has-text("192.168.1.0")')).toBeVisible();
    
    // Verify broadcast address
    await expect(page.locator('code:has-text("192.168.1.3")')).toBeVisible();
    
    // Verify first host
    await expect(page.locator('code:has-text("192.168.1.1")')).toBeVisible();
    
    // Verify last host
    await expect(page.locator('code:has-text("192.168.1.2")')).toBeVisible();
    
    // Verify total hosts (should be 4)
    await expect(page.locator('code:has-text("4")')).toBeVisible();
    
    // Verify usable hosts (should be 2)
    await expect(page.locator('code:has-text("2")')).toBeVisible();
  });

  test('should display binary representation correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Use simple IP for easy binary verification
    await page.fill('input[type="text"]', '192.168.1.1/24');
    
    // Check IP binary representation (192.168.1.1 = 11000000.10101000.00000001.00000001)
    await expect(page.locator('code:has-text("11000000.10101000.00000001.00000001")')).toBeVisible();
    
    // Check subnet mask binary representation (/24 = 255.255.255.0 = 11111111.11111111.11111111.00000000)
    await expect(page.locator('code:has-text("11111111.11111111.11111111.00000000")')).toBeVisible();
  });

  test('should show error for invalid IP address', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter invalid IP
    await page.fill('input[type="text"]', '256.256.256.256/24');
    
    // Check error message
    await expect(page.locator('text=Invalid IP address format')).toBeVisible();
    
    // Network information should not be displayed
    await expect(page.locator('text=Network Information')).not.toBeVisible();
  });

  test('should show error for invalid CIDR', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter invalid CIDR
    await page.fill('input[type="text"]', '192.168.1.1/33');
    
    // Check error message
    await expect(page.locator('text=CIDR must be between 0 and 32')).toBeVisible();
    
    // Network information should not be displayed
    await expect(page.locator('text=Network Information')).not.toBeVisible();
  });

  test('should show error for missing CIDR notation', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Enter IP without CIDR
    await page.fill('input[type="text"]', '192.168.1.1');
    
    // Check error message
    await expect(page.locator('text=Please enter IP address in CIDR notation')).toBeVisible();
    
    // Network information should not be displayed
    await expect(page.locator('text=Network Information')).not.toBeVisible();
  });

  test('should handle edge cases correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test /31 subnet (RFC 3021 - point-to-point links)
    await page.fill('input[type="text"]', '192.168.1.1/31');
    
    // Verify total hosts (should be 2)
    await expect(page.locator('code:has-text("2")')).toBeVisible();
    
    // Verify usable hosts (should be 0 for /31)
    await expect(page.locator('code:has-text("0")')).toBeVisible();
    
    // Test /32 subnet (host route)
    await page.fill('input[type="text"]', '192.168.1.1/32');
    
    // Verify total hosts (should be 1)
    await expect(page.locator('code:has-text("1")')).toBeVisible();
    
    // Verify usable hosts (should be 0 for /32)
    await expect(page.locator('code:has-text("0")')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    
    // Check that sections stack properly on mobile
    await expect(page.locator('text=Network Information')).toBeVisible();
    await expect(page.locator('text=Host Information')).toBeVisible();
    
    // Input should be full width on mobile
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();
  });

  test('should calculate various subnet sizes correctly', async ({ page }) => {
    await page.goto('https://ip-calculator.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    const testCases = [
      { cidr: '192.168.1.1/25', totalHosts: '128', usableHosts: '126' },
      { cidr: '192.168.1.1/26', totalHosts: '64', usableHosts: '62' },
      { cidr: '192.168.1.1/27', totalHosts: '32', usableHosts: '30' },
      { cidr: '192.168.1.1/28', totalHosts: '16', usableHosts: '14' }
    ];
    
    for (const testCase of testCases) {
      await page.fill('input[type="text"]', testCase.cidr);
      await page.waitForTimeout(500);
      
      // Verify total hosts
      await expect(page.locator(`code:has-text("${testCase.totalHosts}")`)).toBeVisible();
      
      // Verify usable hosts
      await expect(page.locator(`code:has-text("${testCase.usableHosts}")`)).toBeVisible();
    }
  });
});
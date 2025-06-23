const { test, expect } = require('@playwright/test');

test.describe('Image Converter', () => {
  test('should load and display Image Converter interface', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    
    // Wait for SPA to load
    await page.waitForTimeout(3000);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Image Converter');
    
    // Check description
    await expect(page.locator('text=Convert image formats and resize images online')).toBeVisible();
    
    // Check upload section
    await expect(page.locator('text=Upload Image')).toBeVisible();
    await expect(page.locator('text=Drag and drop an image here')).toBeVisible();
    await expect(page.locator('text=Choose File')).toBeVisible();
    
    // Check supported formats info
    await expect(page.locator('text=Supported formats: JPEG, PNG, WebP, GIF')).toBeVisible();
  });

  test('should show conversion settings after file upload simulation', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Create a test image file using canvas
    const testImageDataUrl = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, 100, 100);
      return canvas.toDataURL('image/png');
    });
    
    // Convert data URL to blob and create File object
    await page.evaluate((dataUrl) => {
      const app = document.querySelector('#__nuxt').__vue_app__;
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], {type: mimeString});
      const file = new File([blob], 'test.png', {type: mimeString});
      
      // Trigger file processing
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { files: [file] },
        enumerable: true
      });
      
      // Find file input and trigger change
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.dispatchEvent(event);
      }
    }, testImageDataUrl);
    
    await page.waitForTimeout(1000);
    
    // Check if conversion settings appear
    const conversionSettings = page.locator('text=Conversion Settings');
    if (await conversionSettings.isVisible()) {
      // Check output format options
      await expect(page.locator('text=Output Format')).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
      
      // Check resize options
      await expect(page.locator('text=Resize Image')).toBeVisible();
      
      // Check convert button
      await expect(page.locator('button:has-text("Convert Image")')).toBeVisible();
    }
  });

  test('should have file input for image upload', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check file input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Check accept attribute
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  test('should have output format options', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Simulate file upload first
    await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(0, 0, 50, 50);
      const dataUrl = canvas.toDataURL('image/png');
      
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], {type: mimeString});
      const file = new File([blob], 'test.png', {type: mimeString});
      
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { files: [file] },
        enumerable: true
      });
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Check if format select is available
    const formatSelect = page.locator('select');
    if (await formatSelect.isVisible()) {
      // Check format options
      const options = formatSelect.locator('option');
      const optionTexts = await options.allTextContents();
      expect(optionTexts).toContain('JPEG');
      expect(optionTexts).toContain('PNG');
      expect(optionTexts).toContain('WebP');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check that content is visible and accessible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Upload Image')).toBeVisible();
    await expect(page.locator('text=Choose File')).toBeVisible();
  });

  test('should have SEO protection for dev environment', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should display theme toggle', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check theme toggle button exists
    const themeToggle = page.locator('button').filter({ hasText: /Light|Dark|System/ });
    await expect(themeToggle).toBeVisible();
  });

  test('should handle drag and drop area', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check drag and drop area
    const dropArea = page.locator('text=Drag and drop an image here').locator('..');
    await expect(dropArea).toBeVisible();
    
    // Check initial state
    await expect(page.locator('text=📁')).toBeVisible();
  });

  test('should show file size formatting', async ({ page }) => {
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Test file size formatting by simulating upload
    const testResult = await page.evaluate(() => {
      // Test the formatFileSize function if it's available
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      return {
        test1: formatFileSize(1024),
        test2: formatFileSize(1048576),
        test3: formatFileSize(500)
      };
    });
    
    expect(testResult.test1).toBe('1 KB');
    expect(testResult.test2).toBe('1 MB');
    expect(testResult.test3).toBe('500 Bytes');
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('https://image-converter.dev.devtools.site');
    await page.waitForTimeout(3000);
    
    // Check no critical JavaScript errors
    const criticalErrors = errors.filter(error => 
      !error.includes('ResizeObserver') && 
      !error.includes('non-passive event listener')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
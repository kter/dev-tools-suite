const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Contract test: Vue component cleanup verification
 * Validates that GCP navigation and references are removed from Vue components.
 */

test.describe('Vue Component Cleanup Contract', () => {
  const landingPageApp = path.join(__dirname, '../../tools/landing-page/app.vue');
  const hashGeneratorApp = path.join(__dirname, '../../tools/hash-generator/app.vue');

  test('should have landing page app.vue file', async () => {
    const landingExists = fs.existsSync(landingPageApp);
    expect(landingExists).toBe(true);
  });

  test('should not have GCP navigation in landing page', async () => {
    const content = fs.readFileSync(landingPageApp, 'utf8');

    // Check for GCP navigation elements
    const gcpNavTerms = [
      'gcp.dev.devtools.site',
      'gcp.devtools.site',
      'Switch to GCP',
      'Google Cloud',
      'Firebase',
      'platform switch',
      'cross-platform'
    ];

    const hasGcpNav = gcpNavTerms.some(term =>
      content.toLowerCase().includes(term.toLowerCase())
    );

    expect(hasGcpNav).toBe(false);
  });

  test('should preserve AWS functionality in landing page', async () => {
    const content = fs.readFileSync(landingPageApp, 'utf8');

    // Verify AWS links and functionality remain
    const awsTerms = [
      'dev.devtools.site',
      'devtools.site'
    ];

    // At least one AWS reference should remain (but not GCP variants)
    const hasAwsRefs = awsTerms.some(term =>
      content.includes(term) && !content.includes(`gcp.${term}`)
    );

    expect(hasAwsRefs).toBe(true);
  });

  test('should have hash generator app.vue file', async () => {
    const hashExists = fs.existsSync(hashGeneratorApp);
    expect(hashExists).toBe(true);
  });

  test('should not have GCP platform references in hash generator', async () => {
    const content = fs.readFileSync(hashGeneratorApp, 'utf8');

    // Check for GCP platform switching elements
    const gcpPlatformTerms = [
      'gcp.dev.devtools.site',
      'gcp.devtools.site',
      'platform: gcp',
      'firebase',
      'google cloud platform'
    ];

    const hasGcpPlatform = gcpPlatformTerms.some(term =>
      content.toLowerCase().includes(term.toLowerCase())
    );

    expect(hasGcpPlatform).toBe(false);
  });

  test('should not have broken links after GCP removal', async () => {
    // Check landing page for any remaining gcp.* links
    const landingContent = fs.readFileSync(landingPageApp, 'utf8');
    const hasGcpLinks = landingContent.includes('gcp.');

    expect(hasGcpLinks).toBe(false);

    // Check hash generator for any remaining gcp.* links
    const hashContent = fs.readFileSync(hashGeneratorApp, 'utf8');
    const hashHasGcpLinks = hashContent.includes('gcp.');

    expect(hashHasGcpLinks).toBe(false);
  });

  test('should maintain consistent UI without platform switching', async () => {
    const landingContent = fs.readFileSync(landingPageApp, 'utf8');

    // Check that platform switching UI elements are removed
    const platformSwitchTerms = [
      'platform-switch',
      'toggle-platform',
      'switch-cloud',
      'cloud-provider-toggle'
    ];

    const hasPlatformSwitch = platformSwitchTerms.some(term =>
      landingContent.toLowerCase().includes(term.toLowerCase())
    );

    expect(hasPlatformSwitch).toBe(false);
  });

  test('should check other tool components for GCP references', async () => {
    // Check all other tool app.vue files for GCP references
    const toolsDir = path.join(__dirname, '../../tools');
    const toolDirs = fs.readdirSync(toolsDir).filter(item => {
      const toolPath = path.join(toolsDir, item);
      return fs.statSync(toolPath).isDirectory();
    });

    for (const toolDir of toolDirs) {
      const appVuePath = path.join(toolsDir, toolDir, 'app.vue');
      if (fs.existsSync(appVuePath)) {
        const content = fs.readFileSync(appVuePath, 'utf8');

        // Check for any GCP references
        const gcpTerms = [
          'gcp.dev.devtools.site',
          'gcp.devtools.site',
          'firebase',
          'google cloud'
        ];

        const hasGcpRefs = gcpTerms.some(term =>
          content.toLowerCase().includes(term.toLowerCase())
        );

        expect(hasGcpRefs).toBe(false);
      }
    }
  });

  test('should preserve tool functionality after cleanup', async () => {
    // Verify that Vue components are still valid after cleanup
    const landingContent = fs.readFileSync(landingPageApp, 'utf8');
    const hashContent = fs.readFileSync(hashGeneratorApp, 'utf8');

    // Check for basic Vue structure
    expect(landingContent).toContain('<template>');
    expect(landingContent).toContain('</template>');
    expect(hashContent).toContain('<template>');
    expect(hashContent).toContain('</template>');

    // Check that essential functionality indicators remain
    expect(landingContent.toLowerCase()).toContain('dev tools');
    expect(hashContent.toLowerCase()).toContain('hash');
  });
});
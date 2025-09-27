const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Contract test: CDK build success verification
 * Validates that CDK builds successfully without GCP references.
 */

test.describe('CDK Build Success Contract', () => {
  const cdkDir = path.join(__dirname, '../../infrastructure/cdk');

  test('should have CDK infrastructure directory', async () => {
    const cdkExists = fs.existsSync(cdkDir);
    expect(cdkExists).toBe(true);
  });

  test('should not have MultiCloudRoutingStack file', async () => {
    const multiCloudStack = path.join(cdkDir, 'lib/multi-cloud-routing-stack.ts');
    const multiCloudExists = fs.existsSync(multiCloudStack);
    expect(multiCloudExists).toBe(false);
  });

  test('should not have GCP references in dev-tools-stack.ts', async () => {
    const devToolsStack = path.join(cdkDir, 'lib/dev-tools-stack.ts');
    if (fs.existsSync(devToolsStack)) {
      const content = fs.readFileSync(devToolsStack, 'utf8');

      // Check for GCP-specific references
      const gcpTerms = [
        'gcp',
        'MultiCloudRoutingStack',
        'gcpLoadBalancerIp',
        'firebase',
        'google cloud'
      ];

      const hasGcpRefs = gcpTerms.some(term =>
        content.toLowerCase().includes(term.toLowerCase())
      );

      expect(hasGcpRefs).toBe(false);
    }
  });

  test('should not have GCP references in deploy.ts', async () => {
    const deployFile = path.join(cdkDir, 'bin/deploy.ts');
    if (fs.existsSync(deployFile)) {
      const content = fs.readFileSync(deployFile, 'utf8');

      // Check for GCP deployment logic
      const gcpTerms = [
        'MultiCloudRoutingStack',
        'gcpLoadBalancerIp',
        'gcp',
        'firebase'
      ];

      const hasGcpRefs = gcpTerms.some(term =>
        content.toLowerCase().includes(term.toLowerCase())
      );

      expect(hasGcpRefs).toBe(false);
    }
  });

  test('should build CDK successfully', async () => {
    // Change to CDK directory and run build
    const originalCwd = process.cwd();
    let buildSuccess = false;

    try {
      process.chdir(cdkDir);

      // Run npm install and build
      execSync('npm install', { stdio: 'pipe' });
      execSync('npm run build', { stdio: 'pipe' });

      buildSuccess = true;
    } catch (error) {
      console.error('CDK build failed:', error.message);
      buildSuccess = false;
    } finally {
      process.chdir(originalCwd);
    }

    expect(buildSuccess).toBe(true);
  });

  test('should have AWS-only CDK stacks', async () => {
    const devToolsStack = path.join(cdkDir, 'lib/dev-tools-stack.ts');
    if (fs.existsSync(devToolsStack)) {
      const content = fs.readFileSync(devToolsStack, 'utf8');

      // Verify AWS services are still referenced
      const awsServices = [
        'cloudfront',
        's3',
        'certificate',
        'route53'
      ];

      const hasAwsRefs = awsServices.some(service =>
        content.toLowerCase().includes(service.toLowerCase())
      );

      expect(hasAwsRefs).toBe(true);
    }
  });

  test('should not import MultiCloudRoutingStack', async () => {
    // Check all TypeScript files for MultiCloudRoutingStack imports
    const findTsFiles = (dir) => {
      const files = [];
      if (!fs.existsSync(dir)) return files;

      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (item === 'node_modules') continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findTsFiles(fullPath));
        } else if (item.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const tsFiles = findTsFiles(cdkDir);

    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const hasMultiCloudImport = content.includes('MultiCloudRoutingStack');
      expect(hasMultiCloudImport).toBe(false);
    }
  });
});
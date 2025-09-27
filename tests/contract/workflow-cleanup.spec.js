const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Contract test: GitHub Actions workflow cleanup verification
 * Validates that GCP deployment steps are removed while AWS steps remain.
 */

test.describe('GitHub Actions Workflow Cleanup Contract', () => {
  const workflowFile = path.join(__dirname, '../../.github/workflows/deploy.yml');

  test('should have deploy.yml workflow file', async () => {
    const workflowExists = fs.existsSync(workflowFile);
    expect(workflowExists).toBe(true);
  });

  test('should not have GCP deployment steps', async () => {
    const content = fs.readFileSync(workflowFile, 'utf8');

    // Check for GCP-specific deployment steps
    const gcpTerms = [
      'firebase deploy',
      'firebase-tools',
      'firebase hosting',
      'google cloud',
      'gcloud',
      'terraform apply',
      'terraform plan',
      'terraform init'
    ];

    const hasGcpRefs = gcpTerms.some(term =>
      content.toLowerCase().includes(term.toLowerCase())
    );

    expect(hasGcpRefs).toBe(false);
  });

  test('should preserve AWS deployment steps', async () => {
    const content = fs.readFileSync(workflowFile, 'utf8');

    // Check for AWS-specific deployment steps that should remain
    const awsTerms = [
      'aws',
      's3 sync',
      'cloudfront',
      'AWS_PROFILE'
    ];

    const hasAwsRefs = awsTerms.some(term =>
      content.toLowerCase().includes(term.toLowerCase())
    );

    expect(hasAwsRefs).toBe(true);
  });

  test('should not have multi-cloud matrix deployment', async () => {
    const content = fs.readFileSync(workflowFile, 'utf8');

    // Check that matrix strategy doesn't include GCP deployment targets
    const hasGcpMatrix = content.includes('gcp') || content.includes('firebase');
    expect(hasGcpMatrix).toBe(false);
  });

  test('should have working AWS deployment configuration', async () => {
    const content = fs.readFileSync(workflowFile, 'utf8');

    // Verify essential AWS deployment components are present
    const requiredAwsComponents = [
      'AWS_PROFILE=dev',
      'AWS_PROFILE=prd',
      'aws s3 sync'
    ];

    for (const component of requiredAwsComponents) {
      expect(content).toContain(component);
    }
  });

  test('should not reference GCP environment variables', async () => {
    const content = fs.readFileSync(workflowFile, 'utf8');

    // Check for GCP-specific environment variables
    const gcpEnvVars = [
      'GOOGLE_CLOUD_PROJECT',
      'FIREBASE_TOKEN',
      'GCP_SA_KEY',
      'TERRAFORM_VAR'
    ];

    const hasGcpEnvVars = gcpEnvVars.some(envVar =>
      content.includes(envVar)
    );

    expect(hasGcpEnvVars).toBe(false);
  });
});
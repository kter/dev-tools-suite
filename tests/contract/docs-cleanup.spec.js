const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Contract test: Documentation cleanup verification
 * Validates that all GCP references are removed from documentation.
 */

test.describe('Documentation Cleanup Contract', () => {
  const claudeFile = path.join(__dirname, '../../CLAUDE.md');

  test('should have CLAUDE.md file', async () => {
    const claudeExists = fs.existsSync(claudeFile);
    expect(claudeExists).toBe(true);
  });

  test('should not have Multi-Cloud Architecture section', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for multi-cloud architecture section
    const hasMultiCloudSection = content.includes('Multi-Cloud Architecture') ||
                                content.includes('multi-cloud') ||
                                content.includes('Multi-cloud');

    expect(hasMultiCloudSection).toBe(false);
  });

  test('should not have Google Cloud Infrastructure section', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for Google Cloud Infrastructure references
    const hasGoogleCloudSection = content.includes('Google Cloud Infrastructure') ||
                                 content.includes('#### Google Cloud') ||
                                 content.includes('#### GCP Infrastructure');

    expect(hasGoogleCloudSection).toBe(false);
  });

  test('should not have Terraform commands', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for Terraform command blocks
    const terraformCommands = [
      './deploy.sh dev plan',
      './deploy.sh prd apply',
      'terraform apply',
      'terraform plan',
      'terraform init'
    ];

    const hasTerraformCommands = terraformCommands.some(cmd =>
      content.includes(cmd)
    );

    expect(hasTerraformCommands).toBe(false);
  });

  test('should not have GCP Custom Domains documentation', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for GCP domain documentation
    const gcpDomainTerms = [
      'gcp.dev.devtools.site',
      'gcp.devtools.site',
      'GCP Custom Domains',
      'Firebase Hosting'
    ];

    const hasGcpDomainRefs = gcpDomainTerms.some(term =>
      content.includes(term)
    );

    expect(hasGcpDomainRefs).toBe(false);
  });

  test('should not have SSL Certificate Troubleshooting (GCP) section', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for GCP SSL troubleshooting section
    const hasSslGcpSection = content.includes('SSL Certificate Troubleshooting (GCP)') ||
                            content.includes('GCP custom domains show SSL') ||
                            content.includes('ACME challenge records');

    expect(hasSslGcpSection).toBe(false);
  });

  test('should not have Multi-Cloud DNS Routing section', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for multi-cloud DNS routing
    const hasMultiCloudDns = content.includes('Multi-Cloud DNS Routing') ||
                             content.includes('MultiCloudRoutingStack') ||
                             content.includes('gcpLoadBalancerIp');

    expect(hasMultiCloudDns).toBe(false);
  });

  test('should preserve AWS documentation', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Verify AWS documentation remains
    const awsTerms = [
      'AWS Infrastructure (CDK)',
      'CloudFront',
      'S3',
      'AWS_PROFILE=dev',
      'aws s3 sync'
    ];

    const hasAwsRefs = awsTerms.some(term =>
      content.includes(term)
    );

    expect(hasAwsRefs).toBe(true);
  });

  test('should have updated environment URLs without GCP', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check that environment URLs don't mention GCP versions
    const hasGcpUrls = content.includes('GCP Dev:') ||
                       content.includes('GCP Production:') ||
                       content.includes('Cross-Platform Navigation');

    expect(hasGcpUrls).toBe(false);
  });

  test('should not reference removed infrastructure in new tool integration', async () => {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check new tool integration section doesn't reference removed components
    const hasRemovedRefs = content.includes('infrastructure/terraform/modules/gcp-infrastructure/main.tf') ||
                          content.includes('add tool to `locals.tools` array');

    expect(hasRemovedRefs).toBe(false);
  });
});
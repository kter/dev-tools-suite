const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Contract test: Terraform directory removal verification
 * Validates that infrastructure/terraform/ directory is completely removed
 * and no Terraform references remain in the codebase.
 */

test.describe('Terraform Removal Contract', () => {
  const terraformDir = path.join(__dirname, '../../infrastructure/terraform');

  test('should not have infrastructure/terraform directory', async () => {
    // Verify the terraform directory doesn't exist
    const terraformExists = fs.existsSync(terraformDir);
    expect(terraformExists).toBe(false);
  });

  test('should not have any .tf files in the repository', async () => {
    // Recursively search for any .tf files (except in node_modules)
    const findTerraformFiles = (dir) => {
      const files = [];
      if (!fs.existsSync(dir)) return files;

      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (item === 'node_modules' || item === '.git') continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findTerraformFiles(fullPath));
        } else if (item.endsWith('.tf')) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const rootDir = path.join(__dirname, '../../');
    const terraformFiles = findTerraformFiles(rootDir);

    expect(terraformFiles).toEqual([]);
  });

  test('should not have terraform references in CLAUDE.md', async () => {
    const claudeFile = path.join(__dirname, '../../CLAUDE.md');
    if (fs.existsSync(claudeFile)) {
      const content = fs.readFileSync(claudeFile, 'utf8');

      // Check for terraform references (case insensitive)
      const terraformRefs = content.toLowerCase().includes('terraform');
      expect(terraformRefs).toBe(false);
    }
  });

  test('should not have GCP infrastructure references in documentation', async () => {
    const claudeFile = path.join(__dirname, '../../CLAUDE.md');
    if (fs.existsSync(claudeFile)) {
      const content = fs.readFileSync(claudeFile, 'utf8');

      // Check for various GCP infrastructure terms
      const gcpTerms = ['google cloud', 'gcp', 'firebase', 'terraform'];
      const hasGcpRefs = gcpTerms.some(term =>
        content.toLowerCase().includes(term.toLowerCase())
      );

      expect(hasGcpRefs).toBe(false);
    }
  });
});
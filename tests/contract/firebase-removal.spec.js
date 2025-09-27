const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Contract test: Firebase configuration removal verification
 * Validates that firebase.json is removed and no Firebase references remain.
 */

test.describe('Firebase Removal Contract', () => {
  const firebaseConfig = path.join(__dirname, '../../firebase.json');
  const firebaserc = path.join(__dirname, '../../.firebaserc');

  test('should not have firebase.json file', async () => {
    const firebaseExists = fs.existsSync(firebaseConfig);
    expect(firebaseExists).toBe(false);
  });

  test('should not have .firebaserc file', async () => {
    const firebasercExists = fs.existsSync(firebaserc);
    expect(firebasercExists).toBe(false);
  });

  test('should not have firebase references in package.json files', async () => {
    // Check root package.json
    const rootPackageJson = path.join(__dirname, '../../package.json');
    if (fs.existsSync(rootPackageJson)) {
      const content = fs.readFileSync(rootPackageJson, 'utf8');
      const packageData = JSON.parse(content);

      // Check dependencies and devDependencies
      const allDeps = {
        ...packageData.dependencies || {},
        ...packageData.devDependencies || {}
      };

      const firebaseDeps = Object.keys(allDeps).filter(dep =>
        dep.includes('firebase')
      );

      expect(firebaseDeps).toEqual([]);
    }

    // Check tool package.json files
    const toolsDir = path.join(__dirname, '../../tools');
    if (fs.existsSync(toolsDir)) {
      const toolDirs = fs.readdirSync(toolsDir).filter(item => {
        const toolPath = path.join(toolsDir, item);
        return fs.statSync(toolPath).isDirectory();
      });

      for (const toolDir of toolDirs) {
        const packageJsonPath = path.join(toolsDir, toolDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const content = fs.readFileSync(packageJsonPath, 'utf8');
          const packageData = JSON.parse(content);

          const allDeps = {
            ...packageData.dependencies || {},
            ...packageData.devDependencies || {}
          };

          const firebaseDeps = Object.keys(allDeps).filter(dep =>
            dep.includes('firebase')
          );

          expect(firebaseDeps).toEqual([]);
        }
      }
    }
  });

  test('should not have firebase hosting references in workflow files', async () => {
    const workflowFile = path.join(__dirname, '../../.github/workflows/deploy.yml');
    if (fs.existsSync(workflowFile)) {
      const content = fs.readFileSync(workflowFile, 'utf8');

      // Check for Firebase hosting deployment steps
      const firebaseRefs = [
        'firebase deploy',
        'firebase-tools',
        'firebase hosting',
        'firebase-action'
      ];

      const hasFirebaseRefs = firebaseRefs.some(ref =>
        content.toLowerCase().includes(ref.toLowerCase())
      );

      expect(hasFirebaseRefs).toBe(false);
    }
  });

  test('should not have firebase references in documentation', async () => {
    const claudeFile = path.join(__dirname, '../../CLAUDE.md');
    if (fs.existsSync(claudeFile)) {
      const content = fs.readFileSync(claudeFile, 'utf8');

      // Check for firebase-specific terms
      const firebaseTerms = ['firebase', 'firebase hosting', 'firebase.json'];
      const hasFirebaseRefs = firebaseTerms.some(term =>
        content.toLowerCase().includes(term.toLowerCase())
      );

      expect(hasFirebaseRefs).toBe(false);
    }
  });
});
# Quickstart: Validate GCP Removal

## Prerequisites
- Node.js 20+ installed
- AWS CLI configured with dev profile
- All dev tools running background processes stopped

## Verification Steps

### 1. Verify Infrastructure Files Removed
```bash
# Should return no results
find . -name "*.tf" -not -path "*/node_modules/*"
ls infrastructure/terraform/ 2>/dev/null || echo "✅ Terraform directory removed"
ls firebase.json 2>/dev/null || echo "✅ Firebase config removed"
```

### 2. Verify CDK Build Success
```bash
cd infrastructure/cdk
npm install
npm run build
# Should complete without errors mentioning GCP or MultiCloudRoutingStack
```

### 3. Verify GitHub Actions Workflow
```bash
# Check workflow file for GCP references
grep -i "gcp\|firebase\|google" .github/workflows/deploy.yml || echo "✅ No GCP references in workflow"
```

### 4. Verify Documentation Clean
```bash
# Check CLAUDE.md for GCP references
grep -i "gcp\|firebase\|google\|terraform" CLAUDE.md || echo "✅ Documentation cleaned"
```

### 5. Verify Landing Page Navigation
```bash
# Start landing page and verify no GCP links
cd tools/landing-page
npm install
npm run dev &
LANDING_PID=$!

# Wait for startup
sleep 5

# Check for GCP references in app.vue
grep -i "gcp" app.vue || echo "✅ Landing page cleaned"

# Cleanup
kill $LANDING_PID
```

### 6. Test AWS Deployment (Development)
```bash
# Deploy to AWS dev environment
cd infrastructure/cdk
AWS_PROFILE=dev npm run cdk deploy DevToolsStack-dev -c environment=dev --require-approval never

# Verify deployment succeeded
echo "✅ AWS deployment successful"
```

### 7. Verify Application Functionality
```bash
# Test one tool deployment
cd tools/hash-generator
npm install
npm run generate
echo "✅ Tool builds successfully"
```

## Success Criteria
- [ ] No Terraform files remain
- [ ] No Firebase configuration files
- [ ] CDK builds without GCP references
- [ ] GitHub Actions workflow GCP-free
- [ ] Documentation contains no GCP references
- [ ] Landing page has no GCP navigation
- [ ] AWS deployment succeeds
- [ ] Individual tools build successfully
- [ ] No broken links or 404 errors
- [ ] All Playwright tests pass

## Rollback Procedure
If verification fails:
1. Check git status for uncommitted changes
2. Use `git checkout .` to revert changes
3. Investigate specific failure point
4. Re-run individual verification steps
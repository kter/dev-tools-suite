# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Principles

### NEVER（絶対禁止）:
- NEVER: パスワードやAPIキーをハードコーディングしない
- NEVER: ユーザーの確認なしにデータを削除しない
- NEVER: テストなしで本番環境にデプロイしない

### YOU MUST（必須事項）：
- YOU MUST: すべての公開APIにドキュメントを記載
- YOU MUST: エラーハンドリングを実装
- YOU MUST: 変更前に既存テストが通ることを確認
- YOU MUST: 生成したコードの動作原理を説明できること

### IMPORTANT（重要事項）：
- IMPORTANT: パフォーマンスへの影響を考慮
- IMPORTANT: 後方互換性を維持
- IMPORTANT: セキュリティベストプラクティスに従う
- IMPORTANT: 複雑な型定義には必ず使用例とコメントを追加
- IMPORTANT: シンプルで明快な実装を優先する
- IMPORTANT: 複雑なロジックにはコメントを付ける
- IMPORTANT: 既にIaCでコード化されているインフラのリソースを変更する際はawsコマンドではなくIaCを使用する
- IMPORTANT: エラーが発生したらエラー文をWebで検索し修正する

## Project Overview

This contains a collection of developer utility tools (Hash Generator, QR Code Generator, Unix Time Converter, Password Generator, and Landing Page) built with Nuxt 3 and deployed on AWS using Infrastructure as Code.

## Architecture

### Directory Structure
- **tools/***: Individual Nuxt 3 applications (SPA mode, TypeScript, Tailwind CSS) with their own package.json and dependencies
- **infrastructure/cdk**: AWS CDK infrastructure code (TypeScript)
- **infrastructure/terraform**: Google Cloud Terraform infrastructure code
- **tests/**: Playwright E2E tests

### Multi-Cloud Architecture
The application now supports deployment to both AWS and Google Cloud Platform:
- **AWS**: CloudFront + S3 (primary platform)
- **Google Cloud**: Firebase Hosting with custom domains and SSL certificates
- **DNS**: Route53 manages custom domain routing for both platforms
- **GCP Custom Domains**: `*.gcp.dev.devtools.site` format with automatic SSL provisioning

### Key Architectural Decisions
- **Independent Tools**: Each tool has its own npm package with individual dependency management
- **Static Site Generation**: All tools use `nuxt generate` for deployment
- **CI/CD**: Matrix-based deployment per tool
- **Environment Branching**: `develop` → dev environment, `main` → production

## Development Commands

### Testing Commands
```bash
# Run E2E tests (from root)
npx playwright test

# Run specific tool test
npx playwright test tests/password-generator.spec.js
```

### Tool Development
```bash
# Run individual tool in dev mode
cd tools/hash-generator
npm install  # Install dependencies first
npm run dev

# Build specific tool for production
cd tools/hash-generator
npm run generate

# Build all tools (run from root)
for dir in tools/*/; do
  echo "Building $(basename "$dir")..."
  cd "$dir"
  npm install && npm run generate
  cd ../..
done
```

### Infrastructure Management

#### AWS Infrastructure (CDK)
```bash
# Deploy AWS infrastructure to dev environment
cd infrastructure/cdk
AWS_PROFILE=dev npm run cdk deploy DevToolsStack-dev -c environment=dev --require-approval never

# Deploy AWS infrastructure to production
cd infrastructure/cdk  
AWS_PROFILE=prd npm run cdk deploy DevToolsStack-prd -c environment=prd --require-approval never

# Destroy AWS infrastructure (careful!)
AWS_PROFILE=dev npm run cdk destroy DevToolsStack-dev -c environment=dev --require-approval never
```

#### Google Cloud Infrastructure (Terraform)
```bash
# Deploy Google Cloud infrastructure to dev environment
cd infrastructure/terraform
./deploy.sh dev plan    # Review changes
./deploy.sh dev apply   # Deploy

# Deploy Google Cloud infrastructure to production
./deploy.sh prd plan    # Review changes
./deploy.sh prd apply   # Deploy

# Destroy Google Cloud infrastructure (careful!)
./deploy.sh dev destroy
```

#### Multi-Cloud DNS Routing
```bash
# Deploy multi-cloud routing after both AWS and GCP are deployed
cd infrastructure/cdk
AWS_PROFILE=dev npm run cdk deploy MultiCloudRoutingStack-dev \
  -c environment=dev -c gcpLoadBalancerIp=<GCP_LB_IP> --require-approval never
```

### Version Management
```bash
# Increment patch version for all tools
sh verup.sh
```

## Tool Configuration

### Dependencies
- Each tool has its own `package.json` with independent dependency management
- Tool-specific dependencies are managed in individual `tools/*/package.json`

### Nuxt Configuration Pattern
All tools use standard Nuxt configuration in their `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,              // SPA mode for static deployment
  nitro: {
    preset: 'static'       // Static site generation
  },
  // ... other config
})
```

### Build Process Requirements
- Build output is always in `.output/public/` directory

### Google Analytics Configuration
All tools are configured with `nuxt-gtag` module for Google Analytics 4 tracking.

#### Setup Google Analytics 4
1. Visit https://analytics.google.com/ and log in
2. Create a new property:
   - Click "Admin" (gear icon) → "Create Property"
   - Enter property name (e.g., "DevTools Suite")
   - Select timezone and currency
3. Create a data stream:
   - Select "Web" platform
   - Enter website URL (e.g., https://devtools.site)
   - Enter stream name (e.g., "DevTools Suite Web")
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

#### Environment Variable Configuration
Set the `NUXT_PUBLIC_GTAG_ID` environment variable with your Google Analytics measurement ID:

**For Local Development:**
Create a `.env` file in each tool directory:
```bash
# tools/hash-generator/.env
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX
```

**For GitHub Actions:**
Add the measurement ID as a repository secret:
1. Go to repository Settings → Secrets and variables → Actions
2. Add new repository secret:
   - Name: `NUXT_PUBLIC_GTAG_ID`
   - Value: `G-XXXXXXXXXX`
3. Update `.github/workflows/deploy.yml` to include the environment variable in build steps

**For AWS CDK Deployment:**
The Google Analytics tracking is injected at build time, so no additional AWS infrastructure changes are needed.

#### Verification
After deployment, you can verify Google Analytics is working:
1. Open any tool in your browser
2. Open browser DevTools → Console
3. Look for `gtag` function calls (no errors should appear)
4. Check Google Analytics Real-Time reports to see active users

**Note:** If `NUXT_PUBLIC_GTAG_ID` is not set, the tools will build successfully but Google Analytics tracking will be disabled.

## Deployment Architecture

### Multi-Cloud Infrastructure as Code
The application supports deployment to both AWS and Google Cloud:

#### AWS Infrastructure (CDK)
- **ALL AWS infrastructure is managed by CDK in TypeScript** (`infrastructure/cdk/`)
- **NEVER use AWS CLI or console for infrastructure changes** - always update CDK code
- **Each tool gets**: S3 bucket, CloudFront distribution, and SSL certificate
- **Stack naming**: `DevToolsStack-{environment}` (dev/prd)

#### Google Cloud Infrastructure (Terraform)  
- **ALL GCP infrastructure is managed by Terraform** (`infrastructure/terraform/`)
- **Each tool gets**: Firebase Hosting site with custom domain and SSL certificate
- **Project**: `dev-tools-suite`
- **Custom Domain Format**: 
  - Landing: `gcp.{environment}.devtools.site`
  - Tools: `{tool-name}.gcp.{environment}.devtools.site`
- **SSL Certificate Management**: Automatic provisioning via Firebase Hosting with Route53 DNS verification

#### DNS Routing (Route53)
- **GCP Custom Domains**: Direct CNAME routing to Firebase Hosting
- **SSL Certificate Verification**: ACME challenge DNS TXT records managed via Route53
- **Domain Structure**: 
  - AWS: `{tool-name}.{environment}.devtools.site`
  - GCP: `{tool-name}.gcp.{environment}.devtools.site`

#### New Tool Integration
**When adding new tools, update these files**:
- `infrastructure/cdk/lib/dev-tools-stack.ts` (add `createToolInfrastructure` call)
- `infrastructure/terraform/modules/gcp-infrastructure/main.tf` (add tool to `locals.tools` array)
- `.github/workflows/deploy.yml` (add to paths-filter)

#### SSL Certificate Troubleshooting (GCP)
**If GCP custom domains show SSL certificate errors**:
1. **Check Certificate Status**: Use `terraform show` to verify certificate state
2. **DNS Verification Records**: Extract ACME challenge records from Terraform state
3. **Add DNS Records to Route53**: Create TXT records for domain verification
4. **Monitor Certificate Activation**: Certificates typically activate within 15-60 minutes

**Common SSL Certificate Issues**:
- `CERT_PROPAGATING`: Certificate is being provisioned, DNS verification needed
- `CERT_ACTIVE`: Certificate is working properly
- `net::ERR_CERT_COMMON_NAME_INVALID`: DNS verification records missing from Route53

### GitHub Actions Workflow
- **Multi-Cloud Workflow**: `.github/workflows/deploy.yml` (AWS + Firebase Hosting)
- **Matrix Strategy**: Deploys each tool independently to both platforms
- **Environment Detection**: Branch-based (`develop` = dev, `main` = prd)
- **Independent Builds**: Each tool installs its own dependencies and builds independently
- **Deployment Targets**: S3 + CloudFront (AWS) and Firebase Hosting (GCP) simultaneously

### Environment URLs
- **AWS Dev**: `https://[tool-name].dev.devtools.site` (landing page: `https://dev.devtools.site`)  
- **GCP Dev**: `https://[tool-name].gcp.dev.devtools.site` (landing page: `https://gcp.dev.devtools.site`)
- **AWS Production**: `https://[tool-name].devtools.site` (landing page: `https://devtools.site`)
- **GCP Production**: `https://[tool-name].gcp.devtools.site` (landing page: `https://gcp.devtools.site`)
- **Cross-Platform Navigation**: Landing pages include links to switch between AWS and GCP versions

### AWS Resource Naming Convention
- Stack: `DevToolsStack-{environment}`
- S3 Bucket outputs: `{toolname}bucketname` (hyphens removed)
- CloudFront outputs: `{toolname}distributionid` (hyphens removed)

## Build Troubleshooting

### Common Issues
- **"nuxt: not found"**: Use `npm run` commands or `npx nuxt` instead of direct binary paths
- **Dependencies not found**: Run `npm install` in the specific tool directory

### CI/CD Debugging
- Each tool installs and builds independently in CI/CD
- Check S3 bucket and CloudFront distribution naming matches AWS CDK outputs
- Verify AWS role permissions for deployment

## File Structure Patterns

### Tool Structure
```
tools/[tool-name]/
├── pages/              # Nuxt pages (SPA)
├── components/         # Vue components
├── nuxt.config.ts      # Must include workspaceDir
├── package.json        # Tool-specific dependencies
└── tailwind.config.js  # Tailwind configuration
```

### Testing Structure
```
tests/
├── [tool-name].spec.js # Playwright E2E tests
└── playwright.config.js # Test configuration
```

## Prerequisites

- Node.js 20+ (LTS) - managed via Volta (recommended)
- AWS CLI with configured profiles (`dev`, `prd`)
- AWS CDK CLI (`npm install -g aws-cdk`)
- Playwright for testing (`npx playwright install`)

## Node.js Version Management with Volta

This project uses [Volta](https://volta.sh/) for Node.js version management to ensure consistent Node.js versions across all development environments and CI/CD pipelines.

### What is Volta?

Volta is a hassle-free JavaScript tool manager that:
- Automatically switches to the correct Node.js version for each project
- Ensures team members use the same Node.js version
- Eliminates "works on my machine" issues
- Integrates seamlessly with CI/CD environments

### Installing Volta

**macOS/Linux:**
```bash
curl https://get.volta.sh | bash
```

**After installation, restart your terminal and verify:**
```bash
volta --version
```

### Using Volta in This Project

The project has Node.js version pinned to **20.19.5** in all tool `package.json` files:

```json
{
  "volta": {
    "node": "20.19.5"
  }
}
```

When you `cd` into any tool directory, Volta automatically switches to Node.js 20.19.5.

### Common Volta Commands

```bash
# Install a specific Node.js version globally
volta install node@20.19.5

# Pin Node.js version for current project
volta pin node@20.19.5

# Check current Node.js version
node --version

# List all installed Node.js versions
volta list node
```

### Updating Node.js Version

To update the Node.js version across all tools:

```bash
# Install new Node.js version
volta install node@20.x.x

# Pin the version in each tool
for dir in tools/*/; do
  cd "$dir"
  volta pin node@20.x.x
  cd ../..
done
```

This will update the `volta` field in each tool's `package.json`.

### CI/CD Integration

GitHub Actions workflow automatically uses Volta when the `volta` field is present in `package.json`. The workflow includes:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version-file: 'tools/${{ matrix.tool }}/package.json'
```

If Volta is not available in CI/CD, the build will fall back to the Node.js version specified in the workflow (Node.js 20).

### Troubleshooting

**Volta not switching versions:**
```bash
# Ensure Volta is in your PATH
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

**To verify Volta is managing Node.js:**
```bash
which node
# Should show: ~/.volta/bin/node
```

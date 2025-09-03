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

- Node.js 20+ (LTS)
- AWS CLI with configured profiles (`dev`, `prd`)
- AWS CDK CLI (`npm install -g aws-cdk`)
- Playwright for testing (`npx playwright install`)
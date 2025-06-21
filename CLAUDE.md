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
- **tests/**: Playwright E2E tests

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
```bash
# Deploy infrastructure to dev environment
cd infrastructure/cdk
npm run deploy:dev

# Deploy infrastructure to production
cd infrastructure/cdk  
npm run deploy:prd

# Destroy infrastructure (careful!)
npm run destroy:dev  # or destroy:prd
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

### GitHub Actions Workflow
- **Matrix Strategy**: Deploys each tool independently
- **Environment Detection**: Branch-based (`develop` = dev, `main` = prd)
- **Independent Builds**: Each tool installs its own dependencies and builds independently
- **S3 + CloudFront**: Static assets deployed to S3, served via CloudFront

### Environment URLs
- **Dev**: `https://[tool-name].dev.devtools.site` (landing page: `https://dev.devtools.site`)
- **Production**: `https://[tool-name].devtools.site` (landing page: `https://devtools.site`)

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
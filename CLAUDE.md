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


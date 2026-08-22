# AGENTS.md

## Scope

These instructions apply to all AI agents working in this repository.

## Overview

This repository contains a collection of developer utility tools (Hash Generator, QR Code Generator, Unix Time Converter, Password Generator, and Landing Page) built with Nuxt 3 and deployed on AWS/Google Cloud using Infrastructure as Code.

### Directory Structure

- **tools/***: Individual Nuxt 3 applications (SPA mode, TypeScript, Tailwind CSS) with their own package.json and dependencies
- **infrastructure/cdk**: AWS CDK infrastructure code (TypeScript)
- **infrastructure/terraform**: Google Cloud Terraform infrastructure code
- **tests/unit/**: Vitest unit tests for tool utility functions
- **tests/e2e/**: Playwright E2E tests

## Shared Rules

### NEVER（絶対禁止）

- NEVER: パスワードやAPIキーをハードコーディングしない
- NEVER: ユーザーの確認なしにデータを削除しない
- NEVER: テストなしで本番環境にデプロイしない

### YOU MUST（必須事項）

- YOU MUST: すべての公開APIにドキュメントを記載
- YOU MUST: エラーハンドリングを実装
- YOU MUST: 変更前に既存テストが通ることを確認
- YOU MUST: 生成したコードの動作原理を説明できること

### IMPORTANT（重要事項）

- IMPORTANT: パフォーマンスへの影響を考慮
- IMPORTANT: 後方互換性を維持
- IMPORTANT: セキュリティベストプラクティスに従う
- IMPORTANT: 複雑な型定義には必ず使用例とコメントを追加
- IMPORTANT: シンプルで明快な実装を優先する
- IMPORTANT: 複雑なロジックにはコメントを付ける
- IMPORTANT: 既にIaCでコード化されているインフラのリソースを変更する際はawsコマンドではなくIaCを使用する
- IMPORTANT: エラーが発生したらエラー文をWebで検索し修正する

## Common Commands

### Testing

```bash
# Run unit tests (from root)
bun run test:unit
# or
make test

# Run unit tests for a specific tool
make test TOOL=ip-calculator

# Run unit tests with coverage
bun run test:unit:coverage
# or
make test-unit

# Run unit tests in watch mode
bun run test:unit:watch
# or
make test-unit-watch

# Run E2E tests against localhost (requires dev servers running)
bun run test:e2e
# or
make test-e2e

# Run E2E tests against dev.devtools.site
make test-e2e-dev

# Run all tests (unit + E2E)
bun run test:all
# or
make test-all

# Run specific E2E spec file
bun run playwright test tests/e2e/ip-calculator.spec.ts
```

#### Notes on unit testing setup

Some tools (ip-calculator, string-converter, unix-time-converter, character-code-converter) require a `.nuxt/tsconfig.json` stub file to be present before running unit tests. These stubs are created automatically in CI (see deploy.yml), but for local testing, if you see a `TSConfckParseError`, run:

```bash
for tool in ip-calculator string-converter unix-time-converter character-code-converter; do
  mkdir -p tools/$tool/.nuxt
  echo '{"compilerOptions":{}}' > tools/$tool/.nuxt/tsconfig.json
done
```

These files are gitignored (`.nuxt/` is in `.gitignore`).

### Tool Development

```bash
# Run individual tool in dev mode
cd tools/hash-generator
bun install --frozen-lockfile  # Install dependencies first
bun run dev

# Build specific tool for production
cd tools/hash-generator
bun run generate

# Build all tools (run from root)
for dir in tools/*/; do
  echo "Building $(basename "$dir")..."
  cd "$dir"
  bun install --frozen-lockfile && bun run generate
  cd ../..
done
```

### Infrastructure Management

#### AWS Infrastructure (CDK)

```bash
# Deploy AWS infrastructure to dev environment
cd infrastructure/cdk
AWS_PROFILE=dev bun run cdk deploy DevToolsStack-dev -c environment=dev --require-approval never

# Deploy AWS infrastructure to production
cd infrastructure/cdk
AWS_PROFILE=prd bun run cdk deploy DevToolsStack-prd -c environment=prd --require-approval never

# Destroy AWS infrastructure (careful! requires explicit user approval)
AWS_PROFILE=dev bun run cdk destroy DevToolsStack-dev -c environment=dev --require-approval never
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

# Destroy Google Cloud infrastructure (careful! requires explicit user approval)
./deploy.sh dev destroy
```

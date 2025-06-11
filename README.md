# Dev Tools Suite

A collection of developer utility tools built with Nuxt 3 and deployed on AWS.

## 🚀 Available Tools

- **Hash Generator** - Generate SHA-256, SHA-1, MD5, and SHA-512 hashes from text

## 🏗️ Architecture

- **Frontend**: Nuxt 3 (SPA mode) + TypeScript + Tailwind CSS
- **Infrastructure**: AWS CDK (TypeScript)
- **Deployment**: S3 + CloudFront + Route 53
- **CI/CD**: GitHub Actions

## 🛠️ Development

### Prerequisites

- Node.js 20+ (LTS)
- AWS CLI configured with dev/prd profiles
- AWS CDK CLI (`npm install -g aws-cdk`)

### Local Development

```bash
# Install dependencies
npm install

# Run hash-generator locally
cd tools/hash-generator
npm run dev
```

### Deployment

#### Dev Environment

```bash
# Deploy infrastructure
cd infrastructure/cdk
npm run deploy:dev

# Build and deploy hash-generator
cd tools/hash-generator
npm run generate

# Upload to S3 (after CDK deployment)
aws s3 sync dist/ s3://[bucket-name]/ --delete --profile dev
```

## 🌍 Environments

- **Development**: `https://hash-generator.dev.devtools.site`
- **Production**: `https://hash-generator.devtools.site` (not yet deployed)

## 📁 Project Structure

```
dev-tools-suite/
├── tools/
│   └── hash-generator/          # Nuxt 3 SPA
├── infrastructure/
│   └── cdk/                     # AWS CDK Infrastructure
├── .github/
│   └── workflows/               # GitHub Actions
└── README.md
```
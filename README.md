# Dev Tools Suite

A collection of developer utility tools built with Nuxt 3 and deployed on AWS.

## 🚀 Available Tools

- **Hash Generator** - Generate SHA-256, SHA-1, MD5, and SHA-512 hashes from text
- **QR Code Generator** - Generate QR codes from text, URLs, or any content with customizable options
- **Unix Time Converter** - Convert between Unix timestamps and human-readable dates
- **Password Generator** - Generate secure passwords with customizable options

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

#### Infrastructure (Manual)

CDK infrastructure should be deployed manually by administrators:

```bash
# Deploy development environment
cd infrastructure/cdk
npm run deploy:dev

# Deploy production environment
npm run deploy:prd
```

#### Applications (Automatic via GitHub Actions)

Applications are automatically deployed when changes are pushed:

- **Development**: Push to `develop` branch
- **Production**: Push to `main` branch

The `deploy-applications.yml` workflow handles:
- Change detection for each tool
- Building and deploying to appropriate S3 buckets
- CloudFront cache invalidation

## 🌍 Environments

### Development
- **Landing Page**: `https://dev.devtools.site`
- **Hash Generator**: `https://hash-generator.dev.devtools.site`
- **QR Generator**: `https://qr-generator.dev.devtools.site`
- **Unix Time Converter**: `https://unix-time-converter.dev.devtools.site`
- **Password Generator**: `https://password-generator.dev.devtools.site`

### Production
- **Landing Page**: `https://devtools.site`
- **Hash Generator**: `https://hash-generator.devtools.site`
- **QR Generator**: `https://qr-generator.devtools.site`
- **Unix Time Converter**: `https://unix-time-converter.devtools.site`
- **Password Generator**: `https://password-generator.devtools.site`

## 📁 Project Structure

```
dev-tools-suite/
├── tools/
│   ├── landing-page/            # Main landing page
│   ├── hash-generator/          # Hash generator tool
│   ├── qr-generator/            # QR code generator tool
│   ├── unix-time-converter/     # Unix time converter tool
│   └── password-generator/      # Password generator tool
├── infrastructure/
│   └── cdk/                     # AWS CDK Infrastructure
├── tests/                       # Playwright E2E tests
├── .github/
│   └── workflows/
│       └── deploy-applications.yml  # Application deployment workflow
└── README.md
```

## 🧪 Testing

Each tool includes comprehensive Playwright E2E tests:

```bash
# Run tests for a specific tool
npx playwright test tests/password-generator.spec.js

# Run all tests
npx playwright test
```

## 🔧 Troubleshooting

### Common Issues

- **fsevents errors on GitHub Actions**: Fixed by using `npm install` instead of `npm ci` in workflows
- **Platform-specific packages**: Root package.json is kept minimal to avoid platform conflicts
# Dev Tools Suite

A collection of developer utility tools built with Nuxt 3 and deployed on AWS and Google Cloud Platform.

## 🚀 Available Tools

- **Hash Generator** - Generate SHA-256, SHA-1, MD5, and SHA-512 hashes from text
- **QR Code Generator** - Generate QR codes from text, URLs, or any content with customizable options  
- **Unix Time Converter** - Convert between Unix timestamps and human-readable dates
- **Password Generator** - Generate secure passwords with customizable options
- **IP Calculator** - Calculate subnet masks, network addresses, and IP ranges
- **Markdown Preview** - Preview Markdown files with live rendering
- **String Converter** - Convert strings between various formats (Base64, URL encoding, etc.)
- **Code Diff** - Compare and visualize differences between text files
- **And many more...** - 21 tools total with both AWS and GCP deployment

## 🏗️ Multi-Cloud Architecture

- **Frontend**: Nuxt 3 (SPA mode) + TypeScript + Tailwind CSS
- **Infrastructure as Code**: 
  - AWS: CDK (TypeScript)
  - Google Cloud: Terraform
- **Deployment Platforms**:
  - **AWS**: S3 + CloudFront + Route53
  - **Google Cloud**: Firebase Hosting with custom domains
- **CI/CD**: GitHub Actions with multi-cloud deployment matrix
- **SSL Certificates**: Automatic provisioning on both platforms

## 🛠️ Development

### Prerequisites

- Node.js 20+ (LTS)
- AWS CLI configured with dev/prd profiles
- AWS CDK CLI (`npm install -g aws-cdk`)
- Google Cloud SDK and Terraform (for GCP infrastructure)
- Firebase CLI (`npm install -g firebase-tools`)

### Local Development

```bash
# Install dependencies
npm install

# Run hash-generator locally
cd tools/hash-generator
npm run dev
```

### Deployment

#### Multi-Cloud Infrastructure (Manual)

Infrastructure should be deployed manually by administrators:

**AWS Infrastructure (CDK)**:
```bash
# Deploy AWS development environment
cd infrastructure/cdk
AWS_PROFILE=dev npm run cdk deploy DevToolsStack-dev -c environment=dev --require-approval never

# Deploy AWS production environment
AWS_PROFILE=prd npm run cdk deploy DevToolsStack-prd -c environment=prd --require-approval never
```

**Google Cloud Infrastructure (Terraform)**:
```bash
# Deploy GCP development environment
cd infrastructure/terraform/environments/dev
terraform init
terraform apply

# Deploy GCP production environment  
cd infrastructure/terraform/environments/prd
terraform init
terraform apply
```

#### Applications (Automatic via GitHub Actions)

Applications are automatically deployed to both clouds when changes are pushed:

- **Development**: Push to `develop` branch → deploys to dev environment
- **Production**: Push to `main` branch → deploys to production environment

The `deploy.yml` workflow handles:
- Change detection for each tool
- Matrix-based deployment to both AWS and GCP
- Building and deploying to S3 buckets + Firebase Hosting
- CloudFront cache invalidation
- Multi-cloud deployment status reporting

## 🌍 Multi-Cloud Environments

### Development Environment

**AWS (Primary)**:
- **Landing Page**: `https://dev.devtools.site`
- **Hash Generator**: `https://hash-generator.dev.devtools.site`
- **QR Generator**: `https://qr-generator.dev.devtools.site`
- **Password Generator**: `https://password-generator.dev.devtools.site`
- **All 21 tools**: `https://[tool-name].dev.devtools.site`

**Google Cloud (Mirror)**:
- **Landing Page**: `https://gcp.dev.devtools.site`
- **Hash Generator**: `https://hash-generator.gcp.dev.devtools.site`
- **QR Generator**: `https://qr-generator.gcp.dev.devtools.site`  
- **Password Generator**: `https://password-generator.gcp.dev.devtools.site`
- **All 21 tools**: `https://[tool-name].gcp.dev.devtools.site`

### Production Environment

**AWS (Primary)**:
- **Landing Page**: `https://devtools.site`
- **All 21 tools**: `https://[tool-name].devtools.site`

**Google Cloud (Mirror)**:
- **Landing Page**: `https://gcp.devtools.site`
- **All 21 tools**: `https://[tool-name].gcp.devtools.site`

🔄 **Cross-Platform Navigation**: Each landing page includes links to switch between AWS and GCP versions.

## 📁 Project Structure

```
dev-tools-suite/
├── tools/                       # All 21 developer tools
│   ├── landing-page/            # Main landing page with cross-platform nav
│   ├── hash-generator/          # Hash generator tool
│   ├── qr-generator/            # QR code generator tool
│   ├── unix-time-converter/     # Unix time converter tool
│   ├── password-generator/      # Password generator tool
│   ├── ip-calculator/           # IP subnet calculator
│   ├── markdown-preview/        # Markdown preview tool
│   ├── string-converter/        # String format converter
│   ├── code-diff/               # Text/code diff tool
│   └── [...17 more tools]       # Additional utility tools
├── infrastructure/
│   ├── cdk/                     # AWS CDK Infrastructure (TypeScript)
│   └── terraform/               # Google Cloud Terraform Infrastructure
│       ├── environments/        # Environment-specific configs
│       └── modules/             # Reusable Terraform modules
├── tests/                       # Playwright E2E tests for all tools
├── .github/
│   └── workflows/
│       └── deploy.yml           # Multi-cloud deployment workflow
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

### Multi-Cloud Specific Issues

**SSL Certificate Issues (GCP)**:
- If GCP custom domains show `net::ERR_CERT_COMMON_NAME_INVALID`, DNS verification records may be missing
- Check certificate status with `terraform show` and look for `CERT_PROPAGATING` state
- Add required DNS TXT records to Route53 for ACME challenge verification

**Deployment Failures**:
- Verify AWS profiles are configured correctly (`dev`, `prd`)
- Ensure Google Cloud credentials are set up for Terraform
- Check GitHub Actions secrets for `GOOGLE_CLOUD_SA_KEY` and repository variables

For detailed troubleshooting steps, see `CLAUDE.md` in the project root.
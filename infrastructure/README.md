# Infrastructure

This directory contains the infrastructure as code for the DevTools Suite, supporting both AWS and Google Cloud deployments.

## Multi-Cloud Architecture

The DevTools Suite is designed to run on both AWS and Google Cloud Platform, with intelligent routing via Route53:

- **AWS**: CloudFront + S3 (primary, 70% traffic weight)
- **Google Cloud**: Cloud Storage + Load Balancer + Cloud CDN (secondary, 30% traffic weight)
- **DNS**: Route53 with weighted routing and health checks

## Directory Structure

```
infrastructure/
├── cdk/                    # AWS CDK (TypeScript)
│   ├── lib/
│   │   ├── dev-tools-stack.ts           # Main AWS infrastructure
│   │   └── multi-cloud-routing-stack.ts # Route53 multi-cloud routing
│   └── bin/
│       └── app.ts
├── terraform/              # Google Cloud Terraform
│   ├── main.tf             # Main Terraform configuration
│   ├── variables.tf        # Variable definitions
│   ├── dev.tfvars         # Development environment variables
│   ├── prd.tfvars         # Production environment variables
│   └── deploy.sh          # Deployment script
└── README.md              # This file
```

## Prerequisites

### For AWS (CDK)
- AWS CLI configured with appropriate profiles (`dev`, `prd`)
- AWS CDK CLI (`npm install -g aws-cdk`)
- Node.js 20+

### For Google Cloud (Terraform)
- Google Cloud CLI (`gcloud`)
- Terraform 1.0+
- Google Cloud project: `dev-tools-suite`

## Deployment

### AWS Infrastructure (CDK)

```bash
# Deploy to development
cd infrastructure/cdk
AWS_PROFILE=dev npm run cdk deploy DevToolsStack-dev -- -c environment=dev --require-approval never

# Deploy to production
cd infrastructure/cdk
AWS_PROFILE=prd npm run cdk deploy DevToolsStack-prd -- -c environment=prd --require-approval never
```

### Google Cloud Infrastructure (Terraform)

```bash
# Plan development deployment
cd infrastructure/terraform
./deploy.sh dev plan

# Apply development deployment
./deploy.sh dev apply

# Plan production deployment
./deploy.sh prd plan

# Apply production deployment
./deploy.sh prd apply
```

### Multi-Cloud DNS Routing (CDK)

After both AWS and GCP infrastructures are deployed, set up multi-cloud routing:

```bash
# Deploy multi-cloud routing stack
cd infrastructure/cdk
AWS_PROFILE=dev npm run cdk deploy MultiCloudRoutingStack-dev -- -c environment=dev \
  -c gcpLoadBalancerIp=<GCP_LB_IP> --require-approval never
```

## Environment URLs

### Development Environment
- **Primary (AWS)**: `*.dev.devtools.site`
- **Secondary (GCP)**: Same domains, routed via weighted DNS

### Production Environment
- **Primary (AWS)**: `*.devtools.site`
- **Secondary (GCP)**: Same domains, routed via weighted DNS

## Traffic Routing Strategy

1. **Weighted Routing**: 70% AWS, 30% GCP
2. **Health Checks**: Automatic failover if one provider is down
3. **Geographic Optimization**: Future enhancement for region-based routing

## Monitoring and Health Checks

- Route53 health checks monitor both AWS CloudFront and GCP Load Balancer endpoints
- Automatic failover to healthy endpoint if one provider fails
- CloudWatch alarms for AWS resources
- Google Cloud Monitoring for GCP resources

## CI/CD Integration

The multi-cloud deployment is integrated with GitHub Actions:

- **Single-cloud workflow**: `.github/workflows/deploy.yml`
- **Multi-cloud workflow**: `.github/workflows/deploy-multicloud.yml`

Deployment options:
- Deploy to both clouds: `cloud_provider: both`
- Deploy to AWS only: `cloud_provider: aws`
- Deploy to GCP only: `cloud_provider: gcp`

## Cost Optimization

- **AWS**: CloudFront edge locations, S3 storage classes
- **GCP**: Cloud CDN, nearline storage for infrequent access
- **DNS**: Route53 health checks only for production

## Security

- **AWS**: IAM roles, CloudFront OAI, S3 bucket policies
- **GCP**: IAM service accounts, uniform bucket-level access
- **DNS**: DNSSEC enabled on Route53 hosted zone

## Troubleshooting

### Common Issues

1. **SSL Certificate Provisioning**: GCP managed certificates take 10-15 minutes
2. **DNS Propagation**: Route53 changes may take up to 5 minutes
3. **CDN Cache**: Both CloudFront and Cloud CDN cache content (TTL: 1 hour)

### Useful Commands

```bash
# Check AWS CloudFormation stacks
aws cloudformation list-stacks --region ap-northeast-1

# Check GCP resources
gcloud compute addresses list
gcloud compute ssl-certificates list

# Test DNS resolution
dig devtools.site
nslookup poster-splitter.devtools.site
```

## Future Enhancements

1. **Geographic Routing**: Route traffic based on user location
2. **Azure Support**: Add Microsoft Azure as a third cloud provider
3. **Edge Computing**: Implement serverless functions at edge locations
4. **Advanced Monitoring**: Centralized logging and metrics across clouds
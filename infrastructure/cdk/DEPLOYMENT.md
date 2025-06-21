# CDK Deployment Instructions

## Certificate Manager Setup

Due to Route 53 permissions limitations in CDK execution roles, SSL certificates need to be created manually first.

### Step 1: Create SSL Certificate Manually

1. Go to AWS Certificate Manager in **us-east-1** region (required for CloudFront)
2. Request a public certificate for:
   - Domain: `devtools.site`
   - Subject Alternative Names: `*.devtools.site`
3. Use DNS validation and add the required CNAME records to Route 53
4. Wait for certificate to be issued
5. Copy the Certificate ARN

### Step 2: Deploy with Existing Certificate

```bash
# Deploy development environment with existing certificate
npx cdk deploy CertificateStack-dev --context existingCertificateArn=arn:aws:acm:us-east-1:ACCOUNT:certificate/CERTIFICATE-ID

# Deploy production environment with existing certificate
npx cdk deploy CertificateStack-prd --context existingCertificateArn=arn:aws:acm:us-east-1:ACCOUNT:certificate/CERTIFICATE-ID
```

### Alternative: Fix CDK Execution Role Permissions

If you have admin access, you can add Route 53 permissions to the CDK execution role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets",
                "route53:GetChange",
                "route53:ListHostedZones",
                "route53:ListResourceRecordSets"
            ],
            "Resource": "*"
        }
    ]
}
```

Attach this policy to the role: `cdk-hnb659fds-cfn-exec-role-ACCOUNT-us-east-1`
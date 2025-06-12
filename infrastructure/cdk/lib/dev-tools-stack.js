"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevToolsStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const route53 = require("aws-cdk-lib/aws-route53");
const targets = require("aws-cdk-lib/aws-route53-targets");
const acm = require("aws-cdk-lib/aws-certificatemanager");
class DevToolsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Import existing hosted zone
        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: props.hostedZoneId,
            zoneName: props.domain
        });
        // Import certificate from certificate stack
        const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn);
        // Create tool-specific infrastructure
        this.createToolInfrastructure('hash-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('qr-generator', props.domain, certificate, hostedZone);
        // Create landing page for root domain
        this.createLandingPageInfrastructure(props.domain, certificate, hostedZone);
    }
    createToolInfrastructure(toolName, domain, certificate, hostedZone) {
        // S3 Bucket for static files
        const bucket = new s3.Bucket(this, `${toolName}-bucket`, {
            bucketName: `${toolName}-${domain.replace(/\./g, '-')}`,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        // Origin Access Identity
        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, `${toolName}-oai`);
        bucket.grantRead(originAccessIdentity);
        // CloudFront Distribution
        const distribution = new cloudfront.Distribution(this, `${toolName}-distribution`, {
            defaultBehavior: {
                origin: new origins.S3Origin(bucket, {
                    originAccessIdentity
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true
            },
            domainNames: [`${toolName}.${domain}`],
            certificate,
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html'
                }
            ]
        });
        // Route53 Record
        new route53.ARecord(this, `${toolName}-record`, {
            zone: hostedZone,
            recordName: toolName,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
        });
        // Output values
        new cdk.CfnOutput(this, `${toolName}-bucket-name`, {
            value: bucket.bucketName,
            description: `S3 bucket name for ${toolName}`
        });
        new cdk.CfnOutput(this, `${toolName}-distribution-id`, {
            value: distribution.distributionId,
            description: `CloudFront distribution ID for ${toolName}`
        });
        new cdk.CfnOutput(this, `${toolName}-url`, {
            value: `https://${toolName}.${domain}`,
            description: `URL for ${toolName}`
        });
    }
    createLandingPageInfrastructure(domain, certificate, hostedZone) {
        // S3 Bucket for landing page
        const bucket = new s3.Bucket(this, 'landing-page-bucket', {
            bucketName: `landing-page-${domain.replace(/\./g, '-')}`,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        // Origin Access Identity
        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'landing-page-oai');
        bucket.grantRead(originAccessIdentity);
        // CloudFront Distribution for root domain
        const distribution = new cloudfront.Distribution(this, 'landing-page-distribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(bucket, {
                    originAccessIdentity
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true
            },
            domainNames: [domain],
            certificate,
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html'
                }
            ]
        });
        // Route53 Record for root domain
        new route53.ARecord(this, 'landing-page-record', {
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
        });
        // Output values
        new cdk.CfnOutput(this, 'landing-page-bucket-name', {
            value: bucket.bucketName,
            description: 'S3 bucket name for landing page'
        });
        new cdk.CfnOutput(this, 'landing-page-distribution-id', {
            value: distribution.distributionId,
            description: 'CloudFront distribution ID for landing page'
        });
        new cdk.CfnOutput(this, 'landing-page-url', {
            value: `https://${domain}`,
            description: 'URL for landing page'
        });
    }
}
exports.DevToolsStack = DevToolsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LXRvb2xzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGV2LXRvb2xzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDhEQUE4RDtBQUM5RCxtREFBbUQ7QUFDbkQsMkRBQTJEO0FBQzNELDBEQUEwRDtBQVcxRCxNQUFhLGFBQWMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMxQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDhCQUE4QjtRQUM5QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakYsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTTtTQUN2QixDQUFDLENBQUM7UUFFSCw0Q0FBNEM7UUFDNUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVsRyxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFckYsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU8sd0JBQXdCLENBQzlC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RUFBRSxHQUFHO29CQUNmLGtCQUFrQixFQUFFLEdBQUc7b0JBQ3ZCLGdCQUFnQixFQUFFLGFBQWE7aUJBQ2hDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxpQ0FBaUM7UUFDakMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUMvQyxJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ3BDLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUMzQztTQUNGLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ2xELEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVTtZQUN4QixXQUFXLEVBQUUsaUNBQWlDO1NBQy9DLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsOEJBQThCLEVBQUU7WUFDdEQsS0FBSyxFQUFFLFlBQVksQ0FBQyxjQUFjO1lBQ2xDLFdBQVcsRUFBRSw2Q0FBNkM7U0FDM0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUMxQyxLQUFLLEVBQUUsV0FBVyxNQUFNLEVBQUU7WUFDMUIsV0FBVyxFQUFFLHNCQUFzQjtTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFsS0Qsc0NBa0tDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJvdXRlNTMtdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBhY20gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBEZXZUb29sc1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIGRvbWFpbjogc3RyaW5nO1xuICBob3N0ZWRab25lSWQ6IHN0cmluZztcbiAgY2VydGlmaWNhdGVBcm46IHN0cmluZztcbiAgZW52aXJvbm1lbnQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERldlRvb2xzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRGV2VG9vbHNTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBJbXBvcnQgZXhpc3RpbmcgaG9zdGVkIHpvbmVcbiAgICBjb25zdCBob3N0ZWRab25lID0gcm91dGU1My5Ib3N0ZWRab25lLmZyb21Ib3N0ZWRab25lQXR0cmlidXRlcyh0aGlzLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIGhvc3RlZFpvbmVJZDogcHJvcHMuaG9zdGVkWm9uZUlkLFxuICAgICAgem9uZU5hbWU6IHByb3BzLmRvbWFpblxuICAgIH0pO1xuXG4gICAgLy8gSW1wb3J0IGNlcnRpZmljYXRlIGZyb20gY2VydGlmaWNhdGUgc3RhY2tcbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IGFjbS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4odGhpcywgJ0NlcnRpZmljYXRlJywgcHJvcHMuY2VydGlmaWNhdGVBcm4pO1xuXG4gICAgLy8gQ3JlYXRlIHRvb2wtc3BlY2lmaWMgaW5mcmFzdHJ1Y3R1cmVcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgnaGFzaC1nZW5lcmF0b3InLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgncXItZ2VuZXJhdG9yJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGxhbmRpbmcgcGFnZSBmb3Igcm9vdCBkb21haW5cbiAgICB0aGlzLmNyZWF0ZUxhbmRpbmdQYWdlSW5mcmFzdHJ1Y3R1cmUocHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZShcbiAgICB0b29sTmFtZTogc3RyaW5nLFxuICAgIGRvbWFpbjogc3RyaW5nLFxuICAgIGNlcnRpZmljYXRlOiBhY20uSUNlcnRpZmljYXRlLFxuICAgIGhvc3RlZFpvbmU6IHJvdXRlNTMuSUhvc3RlZFpvbmVcbiAgKSB7XG4gICAgLy8gUzMgQnVja2V0IGZvciBzdGF0aWMgZmlsZXNcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke3Rvb2xOYW1lfS1idWNrZXRgLCB7XG4gICAgICBidWNrZXROYW1lOiBgJHt0b29sTmFtZX0tJHtkb21haW4ucmVwbGFjZSgvXFwuL2csICctJyl9YCxcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxuICAgIH0pO1xuXG4gICAgLy8gT3JpZ2luIEFjY2VzcyBJZGVudGl0eVxuICAgIGNvbnN0IG9yaWdpbkFjY2Vzc0lkZW50aXR5ID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkoXG4gICAgICB0aGlzLFxuICAgICAgYCR7dG9vbE5hbWV9LW9haWBcbiAgICApO1xuICAgIGJ1Y2tldC5ncmFudFJlYWQob3JpZ2luQWNjZXNzSWRlbnRpdHkpO1xuXG4gICAgLy8gQ2xvdWRGcm9udCBEaXN0cmlidXRpb25cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24odGhpcywgYCR7dG9vbE5hbWV9LWRpc3RyaWJ1dGlvbmAsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICBvcmlnaW46IG5ldyBvcmlnaW5zLlMzT3JpZ2luKGJ1Y2tldCwge1xuICAgICAgICAgIG9yaWdpbkFjY2Vzc0lkZW50aXR5XG4gICAgICAgIH0pLFxuICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQUyxcbiAgICAgICAgYWxsb3dlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQWxsb3dlZE1ldGhvZHMuQUxMT1dfR0VUX0hFQUQsXG4gICAgICAgIGNhY2hlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQ2FjaGVkTWV0aG9kcy5DQUNIRV9HRVRfSEVBRCxcbiAgICAgICAgY2FjaGVQb2xpY3k6IGNsb3VkZnJvbnQuQ2FjaGVQb2xpY3kuQ0FDSElOR19PUFRJTUlaRUQsXG4gICAgICAgIGNvbXByZXNzOiB0cnVlXG4gICAgICB9LFxuICAgICAgZG9tYWluTmFtZXM6IFtgJHt0b29sTmFtZX0uJHtkb21haW59YF0sXG4gICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgIGRlZmF1bHRSb290T2JqZWN0OiAnaW5kZXguaHRtbCcsXG4gICAgICBlcnJvclJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgaHR0cFN0YXR1czogNDA0LFxuICAgICAgICAgIHJlc3BvbnNlSHR0cFN0YXR1czogMjAwLFxuICAgICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgLy8gUm91dGU1MyBSZWNvcmRcbiAgICBuZXcgcm91dGU1My5BUmVjb3JkKHRoaXMsIGAke3Rvb2xOYW1lfS1yZWNvcmRgLCB7XG4gICAgICB6b25lOiBob3N0ZWRab25lLFxuICAgICAgcmVjb3JkTmFtZTogdG9vbE5hbWUsXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhcbiAgICAgICAgbmV3IHRhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pXG4gICAgICApXG4gICAgfSk7XG5cbiAgICAvLyBPdXRwdXQgdmFsdWVzXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYCR7dG9vbE5hbWV9LWJ1Y2tldC1uYW1lYCwge1xuICAgICAgdmFsdWU6IGJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgZGVzY3JpcHRpb246IGBTMyBidWNrZXQgbmFtZSBmb3IgJHt0b29sTmFtZX1gXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgJHt0b29sTmFtZX0tZGlzdHJpYnV0aW9uLWlkYCwge1xuICAgICAgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gSUQgZm9yICR7dG9vbE5hbWV9YFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYCR7dG9vbE5hbWV9LXVybGAsIHtcbiAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke3Rvb2xOYW1lfS4ke2RvbWFpbn1gLFxuICAgICAgZGVzY3JpcHRpb246IGBVUkwgZm9yICR7dG9vbE5hbWV9YFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVMYW5kaW5nUGFnZUluZnJhc3RydWN0dXJlKFxuICAgIGRvbWFpbjogc3RyaW5nLFxuICAgIGNlcnRpZmljYXRlOiBhY20uSUNlcnRpZmljYXRlLFxuICAgIGhvc3RlZFpvbmU6IHJvdXRlNTMuSUhvc3RlZFpvbmVcbiAgKSB7XG4gICAgLy8gUzMgQnVja2V0IGZvciBsYW5kaW5nIHBhZ2VcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdsYW5kaW5nLXBhZ2UtYnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogYGxhbmRpbmctcGFnZS0ke2RvbWFpbi5yZXBsYWNlKC9cXC4vZywgJy0nKX1gLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBPcmlnaW4gQWNjZXNzIElkZW50aXR5XG4gICAgY29uc3Qgb3JpZ2luQWNjZXNzSWRlbnRpdHkgPSBuZXcgY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NJZGVudGl0eShcbiAgICAgIHRoaXMsXG4gICAgICAnbGFuZGluZy1wYWdlLW9haSdcbiAgICApO1xuICAgIGJ1Y2tldC5ncmFudFJlYWQob3JpZ2luQWNjZXNzSWRlbnRpdHkpO1xuXG4gICAgLy8gQ2xvdWRGcm9udCBEaXN0cmlidXRpb24gZm9yIHJvb3QgZG9tYWluXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uKHRoaXMsICdsYW5kaW5nLXBhZ2UtZGlzdHJpYnV0aW9uJywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XG4gICAgICAgIG9yaWdpbjogbmV3IG9yaWdpbnMuUzNPcmlnaW4oYnVja2V0LCB7XG4gICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHlcbiAgICAgICAgfSksXG4gICAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBjbG91ZGZyb250LlZpZXdlclByb3RvY29sUG9saWN5LlJFRElSRUNUX1RPX0hUVFBTLFxuICAgICAgICBhbGxvd2VkTWV0aG9kczogY2xvdWRmcm9udC5BbGxvd2VkTWV0aG9kcy5BTExPV19HRVRfSEVBRCxcbiAgICAgICAgY2FjaGVkTWV0aG9kczogY2xvdWRmcm9udC5DYWNoZWRNZXRob2RzLkNBQ0hFX0dFVF9IRUFELFxuICAgICAgICBjYWNoZVBvbGljeTogY2xvdWRmcm9udC5DYWNoZVBvbGljeS5DQUNISU5HX09QVElNSVpFRCxcbiAgICAgICAgY29tcHJlc3M6IHRydWVcbiAgICAgIH0sXG4gICAgICBkb21haW5OYW1lczogW2RvbWFpbl0sXG4gICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgIGRlZmF1bHRSb290T2JqZWN0OiAnaW5kZXguaHRtbCcsXG4gICAgICBlcnJvclJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgaHR0cFN0YXR1czogNDA0LFxuICAgICAgICAgIHJlc3BvbnNlSHR0cFN0YXR1czogMjAwLFxuICAgICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgLy8gUm91dGU1MyBSZWNvcmQgZm9yIHJvb3QgZG9tYWluXG4gICAgbmV3IHJvdXRlNTMuQVJlY29yZCh0aGlzLCAnbGFuZGluZy1wYWdlLXJlY29yZCcsIHtcbiAgICAgIHpvbmU6IGhvc3RlZFpvbmUsXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhcbiAgICAgICAgbmV3IHRhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pXG4gICAgICApXG4gICAgfSk7XG5cbiAgICAvLyBPdXRwdXQgdmFsdWVzXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2xhbmRpbmctcGFnZS1idWNrZXQtbmFtZScsIHtcbiAgICAgIHZhbHVlOiBidWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUzMgYnVja2V0IG5hbWUgZm9yIGxhbmRpbmcgcGFnZSdcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdsYW5kaW5nLXBhZ2UtZGlzdHJpYnV0aW9uLWlkJywge1xuICAgICAgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gSUQgZm9yIGxhbmRpbmcgcGFnZSdcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdsYW5kaW5nLXBhZ2UtdXJsJywge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7ZG9tYWlufWAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VSTCBmb3IgbGFuZGluZyBwYWdlJ1xuICAgIH0pO1xuICB9XG59Il19
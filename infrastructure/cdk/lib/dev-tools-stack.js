"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevToolsStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const route53 = require("aws-cdk-lib/aws-route53");
const acm = require("aws-cdk-lib/aws-certificatemanager");
class DevToolsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.cloudFrontDistributions = {};
        // Import existing hosted zone
        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: props.hostedZoneId,
            zoneName: props.domain
        });
        // Import certificate from certificate stack (created in us-east-1)
        const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn);
        // Create tool-specific infrastructure
        this.createToolInfrastructure('hash-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('qr-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('unix-time-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('password-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('ip-calculator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('markdown-preview', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('placeholder-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('ip-info', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('timezone-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('string-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('code-diff', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('mic-test', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('json-yaml-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('jwt-decoder', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('regex-tester', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('lorem-ipsum-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('image-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('timer', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('character-code-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('badger-image-generator', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('poster-splitter', props.domain, certificate, hostedZone);
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
        // Route53 Record (only for single-cloud mode, commented out for multi-cloud)
        // new route53.ARecord(this, `${toolName}-record`, {
        //   zone: hostedZone,
        //   recordName: toolName,
        //   target: route53.RecordTarget.fromAlias(
        //     new targets.CloudFrontTarget(distribution)
        //   )
        // });
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
        new cdk.CfnOutput(this, `${toolName}-cloudfront-domain`, {
            value: distribution.distributionDomainName,
            description: `CloudFront domain for ${toolName}`
        });
        // Store CloudFront domain for multi-cloud routing
        this.cloudFrontDistributions[toolName] = distribution.distributionDomainName;
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
        // Route53 Record for root domain (commented out for multi-cloud)
        // new route53.ARecord(this, 'landing-page-record', {
        //   zone: hostedZone,
        //   target: route53.RecordTarget.fromAlias(
        //     new targets.CloudFrontTarget(distribution)
        //   )
        // });
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
        new cdk.CfnOutput(this, 'landing-page-cloudfront-domain', {
            value: distribution.distributionDomainName,
            description: 'CloudFront domain for landing page'
        });
        // Store CloudFront domain for multi-cloud routing
        this.cloudFrontDistributions['landing-page'] = distribution.distributionDomainName;
    }
}
exports.DevToolsStack = DevToolsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LXRvb2xzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGV2LXRvb2xzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDhEQUE4RDtBQUM5RCxtREFBbUQ7QUFFbkQsMERBQTBEO0FBVzFELE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFIViw0QkFBdUIsR0FBbUMsRUFBRSxDQUFDO1FBSzNFLDhCQUE4QjtRQUM5QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakYsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTTtTQUN2QixDQUFDLENBQUM7UUFFSCxtRUFBbUU7UUFDbkUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVsRyxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FB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UUFFSCxpRUFBaUU7UUFDakUscURBQXFEO1FBQ3JELHNCQUFzQjtRQUN0Qiw0Q0FBNEM7UUFDNUMsaURBQWlEO1FBQ2pELE1BQU07UUFDTixNQUFNO1FBRU4sZ0JBQWdCO1FBQ2hCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsMEJBQTBCLEVBQUU7WUFDbEQsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQ3hCLFdBQVcsRUFBRSxpQ0FBaUM7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSw4QkFBOEIsRUFBRTtZQUN0RCxLQUFLLEVBQUUsWUFBWSxDQUFDLGNBQWM7WUFDbEMsV0FBVyxFQUFFLDZDQUE2QztTQUMzRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzFDLEtBQUssRUFBRSxXQUFXLE1BQU0sRUFBRTtZQUMxQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZ0NBQWdDLEVBQUU7WUFDeEQsS0FBSyxFQUFFLFlBQVksQ0FBQyxzQkFBc0I7WUFDMUMsV0FBVyxFQUFFLG9DQUFvQztTQUNsRCxDQUFDLENBQUM7UUFFSCxrREFBa0Q7UUFDbEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQztJQUNyRixDQUFDO0NBQ0Y7QUF2TUQsc0NBdU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJvdXRlNTMtdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBhY20gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBEZXZUb29sc1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIGRvbWFpbjogc3RyaW5nO1xuICBob3N0ZWRab25lSWQ6IHN0cmluZztcbiAgY2VydGlmaWNhdGVBcm46IHN0cmluZztcbiAgZW52aXJvbm1lbnQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERldlRvb2xzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgY2xvdWRGcm9udERpc3RyaWJ1dGlvbnM6IHsgW3Rvb2xOYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEZXZUb29sc1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIEltcG9ydCBleGlzdGluZyBob3N0ZWQgem9uZVxuICAgIGNvbnN0IGhvc3RlZFpvbmUgPSByb3V0ZTUzLkhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgaG9zdGVkWm9uZUlkOiBwcm9wcy5ob3N0ZWRab25lSWQsXG4gICAgICB6b25lTmFtZTogcHJvcHMuZG9tYWluXG4gICAgfSk7XG5cbiAgICAvLyBJbXBvcnQgY2VydGlmaWNhdGUgZnJvbSBjZXJ0aWZpY2F0ZSBzdGFjayAoY3JlYXRlZCBpbiB1cy1lYXN0LTEpXG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHRoaXMsICdDZXJ0aWZpY2F0ZScsIHByb3BzLmNlcnRpZmljYXRlQXJuKTtcblxuICAgIC8vIENyZWF0ZSB0b29sLXNwZWNpZmljIGluZnJhc3RydWN0dXJlXG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ2hhc2gtZ2VuZXJhdG9yJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ3FyLWdlbmVyYXRvcicsIHByb3BzLmRvbWFpbiwgY2VydGlmaWNhdGUsIGhvc3RlZFpvbmUpO1xuICAgIHRoaXMuY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKCd1bml4LXRpbWUtY29udmVydGVyJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ3Bhc3N3b3JkLWdlbmVyYXRvcicsIHByb3BzLmRvbWFpbiwgY2VydGlmaWNhdGUsIGhvc3RlZFpvbmUpO1xuICAgIHRoaXMuY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKCdpcC1jYWxjdWxhdG9yJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ21hcmtkb3duLXByZXZpZXcnLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgncGxhY2Vob2xkZXItZ2VuZXJhdG9yJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ2lwLWluZm8nLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgndGltZXpvbmUtY29udmVydGVyJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ3N0cmluZy1jb252ZXJ0ZXInLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgnY29kZS1kaWZmJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ21pYy10ZXN0JywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ2pzb24teWFtbC1jb252ZXJ0ZXInLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgnand0LWRlY29kZXInLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgncmVnZXgtdGVzdGVyJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ2xvcmVtLWlwc3VtLWdlbmVyYXRvcicsIHByb3BzLmRvbWFpbiwgY2VydGlmaWNhdGUsIGhvc3RlZFpvbmUpO1xuICAgIHRoaXMuY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKCdpbWFnZS1jb252ZXJ0ZXInLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgndGltZXInLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgnY2hhcmFjdGVyLWNvZGUtY29udmVydGVyJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgdGhpcy5jcmVhdGVUb29sSW5mcmFzdHJ1Y3R1cmUoJ2JhZGdlci1pbWFnZS1nZW5lcmF0b3InLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgncG9zdGVyLXNwbGl0dGVyJywgcHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGxhbmRpbmcgcGFnZSBmb3Igcm9vdCBkb21haW5cbiAgICB0aGlzLmNyZWF0ZUxhbmRpbmdQYWdlSW5mcmFzdHJ1Y3R1cmUocHJvcHMuZG9tYWluLCBjZXJ0aWZpY2F0ZSwgaG9zdGVkWm9uZSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZShcbiAgICB0b29sTmFtZTogc3RyaW5nLFxuICAgIGRvbWFpbjogc3RyaW5nLFxuICAgIGNlcnRpZmljYXRlOiBhY20uSUNlcnRpZmljYXRlLFxuICAgIGhvc3RlZFpvbmU6IHJvdXRlNTMuSUhvc3RlZFpvbmVcbiAgKSB7XG4gICAgLy8gUzMgQnVja2V0IGZvciBzdGF0aWMgZmlsZXNcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke3Rvb2xOYW1lfS1idWNrZXRgLCB7XG4gICAgICBidWNrZXROYW1lOiBgJHt0b29sTmFtZX0tJHtkb21haW4ucmVwbGFjZSgvXFwuL2csICctJyl9YCxcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxuICAgIH0pO1xuXG4gICAgLy8gT3JpZ2luIEFjY2VzcyBJZGVudGl0eVxuICAgIGNvbnN0IG9yaWdpbkFjY2Vzc0lkZW50aXR5ID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkoXG4gICAgICB0aGlzLFxuICAgICAgYCR7dG9vbE5hbWV9LW9haWBcbiAgICApO1xuICAgIGJ1Y2tldC5ncmFudFJlYWQob3JpZ2luQWNjZXNzSWRlbnRpdHkpO1xuXG4gICAgLy8gQ2xvdWRGcm9udCBEaXN0cmlidXRpb25cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24odGhpcywgYCR7dG9vbE5hbWV9LWRpc3RyaWJ1dGlvbmAsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICBvcmlnaW46IG5ldyBvcmlnaW5zLlMzT3JpZ2luKGJ1Y2tldCwge1xuICAgICAgICAgIG9yaWdpbkFjY2Vzc0lkZW50aXR5XG4gICAgICAgIH0pLFxuICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQUyxcbiAgICAgICAgYWxsb3dlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQWxsb3dlZE1ldGhvZHMuQUxMT1dfR0VUX0hFQUQsXG4gICAgICAgIGNhY2hlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQ2FjaGVkTWV0aG9kcy5DQUNIRV9HRVRfSEVBRCxcbiAgICAgICAgY2FjaGVQb2xpY3k6IGNsb3VkZnJvbnQuQ2FjaGVQb2xpY3kuQ0FDSElOR19PUFRJTUlaRUQsXG4gICAgICAgIGNvbXByZXNzOiB0cnVlXG4gICAgICB9LFxuICAgICAgZG9tYWluTmFtZXM6IFtgJHt0b29sTmFtZX0uJHtkb21haW59YF0sXG4gICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgIGRlZmF1bHRSb290T2JqZWN0OiAnaW5kZXguaHRtbCcsXG4gICAgICBlcnJvclJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgaHR0cFN0YXR1czogNDA0LFxuICAgICAgICAgIHJlc3BvbnNlSHR0cFN0YXR1czogMjAwLFxuICAgICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgLy8gUm91dGU1MyBSZWNvcmQgKG9ubHkgZm9yIHNpbmdsZS1jbG91ZCBtb2RlLCBjb21tZW50ZWQgb3V0IGZvciBtdWx0aS1jbG91ZClcbiAgICAvLyBuZXcgcm91dGU1My5BUmVjb3JkKHRoaXMsIGAke3Rvb2xOYW1lfS1yZWNvcmRgLCB7XG4gICAgLy8gICB6b25lOiBob3N0ZWRab25lLFxuICAgIC8vICAgcmVjb3JkTmFtZTogdG9vbE5hbWUsXG4gICAgLy8gICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhcbiAgICAvLyAgICAgbmV3IHRhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pXG4gICAgLy8gICApXG4gICAgLy8gfSk7XG5cbiAgICAvLyBPdXRwdXQgdmFsdWVzXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYCR7dG9vbE5hbWV9LWJ1Y2tldC1uYW1lYCwge1xuICAgICAgdmFsdWU6IGJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgZGVzY3JpcHRpb246IGBTMyBidWNrZXQgbmFtZSBmb3IgJHt0b29sTmFtZX1gXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgJHt0b29sTmFtZX0tZGlzdHJpYnV0aW9uLWlkYCwge1xuICAgICAgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gSUQgZm9yICR7dG9vbE5hbWV9YFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYCR7dG9vbE5hbWV9LXVybGAsIHtcbiAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke3Rvb2xOYW1lfS4ke2RvbWFpbn1gLFxuICAgICAgZGVzY3JpcHRpb246IGBVUkwgZm9yICR7dG9vbE5hbWV9YFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYCR7dG9vbE5hbWV9LWNsb3VkZnJvbnQtZG9tYWluYCwge1xuICAgICAgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25Eb21haW5OYW1lLFxuICAgICAgZGVzY3JpcHRpb246IGBDbG91ZEZyb250IGRvbWFpbiBmb3IgJHt0b29sTmFtZX1gXG4gICAgfSk7XG5cbiAgICAvLyBTdG9yZSBDbG91ZEZyb250IGRvbWFpbiBmb3IgbXVsdGktY2xvdWQgcm91dGluZ1xuICAgIHRoaXMuY2xvdWRGcm9udERpc3RyaWJ1dGlvbnNbdG9vbE5hbWVdID0gZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWU7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUxhbmRpbmdQYWdlSW5mcmFzdHJ1Y3R1cmUoXG4gICAgZG9tYWluOiBzdHJpbmcsXG4gICAgY2VydGlmaWNhdGU6IGFjbS5JQ2VydGlmaWNhdGUsXG4gICAgaG9zdGVkWm9uZTogcm91dGU1My5JSG9zdGVkWm9uZVxuICApIHtcbiAgICAvLyBTMyBCdWNrZXQgZm9yIGxhbmRpbmcgcGFnZVxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ2xhbmRpbmctcGFnZS1idWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBgbGFuZGluZy1wYWdlLSR7ZG9tYWluLnJlcGxhY2UoL1xcLi9nLCAnLScpfWAsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHlcbiAgICBjb25zdCBvcmlnaW5BY2Nlc3NJZGVudGl0eSA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KFxuICAgICAgdGhpcyxcbiAgICAgICdsYW5kaW5nLXBhZ2Utb2FpJ1xuICAgICk7XG4gICAgYnVja2V0LmdyYW50UmVhZChvcmlnaW5BY2Nlc3NJZGVudGl0eSk7XG5cbiAgICAvLyBDbG91ZEZyb250IERpc3RyaWJ1dGlvbiBmb3Igcm9vdCBkb21haW5cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24odGhpcywgJ2xhbmRpbmctcGFnZS1kaXN0cmlidXRpb24nLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHtcbiAgICAgICAgb3JpZ2luOiBuZXcgb3JpZ2lucy5TM09yaWdpbihidWNrZXQsIHtcbiAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eVxuICAgICAgICB9KSxcbiAgICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IGNsb3VkZnJvbnQuVmlld2VyUHJvdG9jb2xQb2xpY3kuUkVESVJFQ1RfVE9fSFRUUFMsXG4gICAgICAgIGFsbG93ZWRNZXRob2RzOiBjbG91ZGZyb250LkFsbG93ZWRNZXRob2RzLkFMTE9XX0dFVF9IRUFELFxuICAgICAgICBjYWNoZWRNZXRob2RzOiBjbG91ZGZyb250LkNhY2hlZE1ldGhvZHMuQ0FDSEVfR0VUX0hFQUQsXG4gICAgICAgIGNhY2hlUG9saWN5OiBjbG91ZGZyb250LkNhY2hlUG9saWN5LkNBQ0hJTkdfT1BUSU1JWkVELFxuICAgICAgICBjb21wcmVzczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGRvbWFpbk5hbWVzOiBbZG9tYWluXSxcbiAgICAgIGNlcnRpZmljYXRlLFxuICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIGVycm9yUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBodHRwU3RhdHVzOiA0MDQsXG4gICAgICAgICAgcmVzcG9uc2VIdHRwU3RhdHVzOiAyMDAsXG4gICAgICAgICAgcmVzcG9uc2VQYWdlUGF0aDogJy9pbmRleC5odG1sJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBSb3V0ZTUzIFJlY29yZCBmb3Igcm9vdCBkb21haW4gKGNvbW1lbnRlZCBvdXQgZm9yIG11bHRpLWNsb3VkKVxuICAgIC8vIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ2xhbmRpbmctcGFnZS1yZWNvcmQnLCB7XG4gICAgLy8gICB6b25lOiBob3N0ZWRab25lLFxuICAgIC8vICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tQWxpYXMoXG4gICAgLy8gICAgIG5ldyB0YXJnZXRzLkNsb3VkRnJvbnRUYXJnZXQoZGlzdHJpYnV0aW9uKVxuICAgIC8vICAgKVxuICAgIC8vIH0pO1xuXG4gICAgLy8gT3V0cHV0IHZhbHVlc1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdsYW5kaW5nLXBhZ2UtYnVja2V0LW5hbWUnLCB7XG4gICAgICB2YWx1ZTogYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ1MzIGJ1Y2tldCBuYW1lIGZvciBsYW5kaW5nIHBhZ2UnXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnbGFuZGluZy1wYWdlLWRpc3RyaWJ1dGlvbi1pZCcsIHtcbiAgICAgIHZhbHVlOiBkaXN0cmlidXRpb24uZGlzdHJpYnV0aW9uSWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Nsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIElEIGZvciBsYW5kaW5nIHBhZ2UnXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnbGFuZGluZy1wYWdlLXVybCcsIHtcbiAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke2RvbWFpbn1gLFxuICAgICAgZGVzY3JpcHRpb246ICdVUkwgZm9yIGxhbmRpbmcgcGFnZSdcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdsYW5kaW5nLXBhZ2UtY2xvdWRmcm9udC1kb21haW4nLCB7XG4gICAgICB2YWx1ZTogZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Nsb3VkRnJvbnQgZG9tYWluIGZvciBsYW5kaW5nIHBhZ2UnXG4gICAgfSk7XG5cbiAgICAvLyBTdG9yZSBDbG91ZEZyb250IGRvbWFpbiBmb3IgbXVsdGktY2xvdWQgcm91dGluZ1xuICAgIHRoaXMuY2xvdWRGcm9udERpc3RyaWJ1dGlvbnNbJ2xhbmRpbmctcGFnZSddID0gZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWU7XG4gIH1cbn0iXX0=
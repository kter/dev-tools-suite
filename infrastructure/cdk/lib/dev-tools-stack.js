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
        this.createToolInfrastructure('unix-time-converter', props.domain, certificate, hostedZone);
        this.createToolInfrastructure('password-generator', props.domain, certificate, hostedZone);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LXRvb2xzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGV2LXRvb2xzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDhEQUE4RDtBQUM5RCxtREFBbUQ7QUFDbkQsMkRBQTJEO0FBQzNELDBEQUEwRDtBQVcxRCxNQUFhLGFBQWMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMxQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDhCQUE4QjtRQUM5QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakYsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTTtTQUN2QixDQUFDLENBQUM7UUFFSCw0Q0FBNEM7UUFDNUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVsRyxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUUzRixzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLCtCQUErQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFTyx3QkFBd0IsQ0FDOUIsUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLFdBQTZCLEVBQzdCLFVBQStCO1FBRS9CLDZCQUE2QjtRQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsUUFBUSxTQUFTLEVBQUU7WUFDdkQsVUFBVSxFQUFFLEdBQUcsUUFBUSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZELGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7WUFDakQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUN6QixNQUFNLG9CQUFvQixHQUFHLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUM5RCxJQUFJLEVBQ0osR0FBRyxRQUFRLE1BQU0sQ0FDbEIsQ0FBQztRQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUV2QywwQkFBMEI7UUFDMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLFFBQVEsZUFBZSxFQUFFO1lBQ2pGLGVBQWUsRUFBRTtnQkFDZixNQUFNLEVBQUUsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDbkMsb0JBQW9CO2lCQUNyQixDQUFDO2dCQUNGLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUI7Z0JBQ3ZFLGNBQWMsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLGNBQWM7Z0JBQ3hELGFBQWEsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLGNBQWM7Z0JBQ3RELFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGlCQUFpQjtnQkFDckQsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNELFdBQVcsRUFBRSxDQUFDLEdBQUcsUUFBUSxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ3RDLFdBQVc7WUFDWCxpQkFBaUIsRUFBRSxZQUFZO1lBQy9CLGNBQWMsRUFBRTtnQkFDZDtvQkFDRSxVQUFVLEVBQUUsR0FBRztvQkFDZixrQkFBa0IsRUFBRSxHQUFHO29CQUN2QixnQkFBZ0IsRUFBRSxhQUFhO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCO1FBQ2pCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxRQUFRLFNBQVMsRUFBRTtZQUM5QyxJQUFJLEVBQUUsVUFBVTtZQUNoQixVQUFVLEVBQUUsUUFBUTtZQUNwQixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ3BDLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUMzQztTQUNGLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsUUFBUSxjQUFjLEVBQUU7WUFDakQsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQ3hCLFdBQVcsRUFBRSxzQkFBc0IsUUFBUSxFQUFFO1NBQzlDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxRQUFRLGtCQUFrQixFQUFFO1lBQ3JELEtBQUssRUFBRSxZQUFZLENBQUMsY0FBYztZQUNsQyxXQUFXLEVBQUUsa0NBQWtDLFFBQVEsRUFBRTtTQUMxRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsUUFBUSxNQUFNLEVBQUU7WUFDekMsS0FBSyxFQUFFLFdBQVcsUUFBUSxJQUFJLE1BQU0sRUFBRTtZQUN0QyxXQUFXLEVBQUUsV0FBVyxRQUFRLEVBQUU7U0FDbkMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLCtCQUErQixDQUNyQyxNQUFjLEVBQ2QsV0FBNkIsRUFDN0IsVUFBK0I7UUFFL0IsNkJBQTZCO1FBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDeEQsVUFBVSxFQUFFLGdCQUFnQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRTtZQUN4RCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFDekIsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FDOUQsSUFBSSxFQUNKLGtCQUFrQixDQUNuQixDQUFDO1FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRXZDLDBDQUEwQztRQUMxQyxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFO1lBQ2xGLGVBQWUsRUFBRTtnQkFDZixNQUFNLEVBQUUsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDbkMsb0JBQW9CO2lCQUNyQixDQUFDO2dCQUNGLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUI7Z0JBQ3ZFLGNBQWMsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLGNBQWM7Z0JBQ3hELGFBQWEsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLGNBQWM7Z0JBQ3RELFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGlCQUFpQjtnQkFDckQsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNELFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUNyQixXQUFXO1lBQ1gsaUJBQWlCLEVBQUUsWUFBWTtZQUMvQixjQUFjLEVBQUU7Z0JBQ2Q7b0JBQ0UsVUFBVSxFQUFFLEdBQUc7b0JBQ2Ysa0JBQWtCLEVBQUUsR0FBRztvQkFDdkIsZ0JBQWdCLEVBQUUsYUFBYTtpQkFDaEM7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILGlDQUFpQztRQUNqQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQy9DLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FDcEMsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQzNDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsZ0JBQWdCO1FBQ2hCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsMEJBQTBCLEVBQUU7WUFDbEQsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQ3hCLFdBQVcsRUFBRSxpQ0FBaUM7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSw4QkFBOEIsRUFBRTtZQUN0RCxLQUFLLEVBQUUsWUFBWSxDQUFDLGNBQWM7WUFDbEMsV0FBVyxFQUFFLDZDQUE2QztTQUMzRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzFDLEtBQUssRUFBRSxXQUFXLE1BQU0sRUFBRTtZQUMxQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXBLRCxzQ0FvS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQnO1xuaW1wb3J0ICogYXMgb3JpZ2lucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udC1vcmlnaW5zJztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJvdXRlNTMnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1My10YXJnZXRzJztcbmltcG9ydCAqIGFzIGFjbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCAqIGFzIHMzZGVwbG95IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1kZXBsb3ltZW50JztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIERldlRvb2xzU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgZG9tYWluOiBzdHJpbmc7XG4gIGhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nO1xuICBlbnZpcm9ubWVudDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRGV2VG9vbHNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEZXZUb29sc1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIEltcG9ydCBleGlzdGluZyBob3N0ZWQgem9uZVxuICAgIGNvbnN0IGhvc3RlZFpvbmUgPSByb3V0ZTUzLkhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgaG9zdGVkWm9uZUlkOiBwcm9wcy5ob3N0ZWRab25lSWQsXG4gICAgICB6b25lTmFtZTogcHJvcHMuZG9tYWluXG4gICAgfSk7XG5cbiAgICAvLyBJbXBvcnQgY2VydGlmaWNhdGUgZnJvbSBjZXJ0aWZpY2F0ZSBzdGFja1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnQ2VydGlmaWNhdGUnLCBwcm9wcy5jZXJ0aWZpY2F0ZUFybik7XG5cbiAgICAvLyBDcmVhdGUgdG9vbC1zcGVjaWZpYyBpbmZyYXN0cnVjdHVyZVxuICAgIHRoaXMuY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKCdoYXNoLWdlbmVyYXRvcicsIHByb3BzLmRvbWFpbiwgY2VydGlmaWNhdGUsIGhvc3RlZFpvbmUpO1xuICAgIHRoaXMuY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKCdxci1nZW5lcmF0b3InLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICB0aGlzLmNyZWF0ZVRvb2xJbmZyYXN0cnVjdHVyZSgndW5peC10aW1lLWNvbnZlcnRlcicsIHByb3BzLmRvbWFpbiwgY2VydGlmaWNhdGUsIGhvc3RlZFpvbmUpO1xuICAgIHRoaXMuY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKCdwYXNzd29yZC1nZW5lcmF0b3InLCBwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgICBcbiAgICAvLyBDcmVhdGUgbGFuZGluZyBwYWdlIGZvciByb290IGRvbWFpblxuICAgIHRoaXMuY3JlYXRlTGFuZGluZ1BhZ2VJbmZyYXN0cnVjdHVyZShwcm9wcy5kb21haW4sIGNlcnRpZmljYXRlLCBob3N0ZWRab25lKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVG9vbEluZnJhc3RydWN0dXJlKFxuICAgIHRvb2xOYW1lOiBzdHJpbmcsXG4gICAgZG9tYWluOiBzdHJpbmcsXG4gICAgY2VydGlmaWNhdGU6IGFjbS5JQ2VydGlmaWNhdGUsXG4gICAgaG9zdGVkWm9uZTogcm91dGU1My5JSG9zdGVkWm9uZVxuICApIHtcbiAgICAvLyBTMyBCdWNrZXQgZm9yIHN0YXRpYyBmaWxlc1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7dG9vbE5hbWV9LWJ1Y2tldGAsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IGAke3Rvb2xOYW1lfS0ke2RvbWFpbi5yZXBsYWNlKC9cXC4vZywgJy0nKX1gLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBPcmlnaW4gQWNjZXNzIElkZW50aXR5XG4gICAgY29uc3Qgb3JpZ2luQWNjZXNzSWRlbnRpdHkgPSBuZXcgY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NJZGVudGl0eShcbiAgICAgIHRoaXMsXG4gICAgICBgJHt0b29sTmFtZX0tb2FpYFxuICAgICk7XG4gICAgYnVja2V0LmdyYW50UmVhZChvcmlnaW5BY2Nlc3NJZGVudGl0eSk7XG5cbiAgICAvLyBDbG91ZEZyb250IERpc3RyaWJ1dGlvblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbih0aGlzLCBgJHt0b29sTmFtZX0tZGlzdHJpYnV0aW9uYCwge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XG4gICAgICAgIG9yaWdpbjogbmV3IG9yaWdpbnMuUzNPcmlnaW4oYnVja2V0LCB7XG4gICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHlcbiAgICAgICAgfSksXG4gICAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBjbG91ZGZyb250LlZpZXdlclByb3RvY29sUG9saWN5LlJFRElSRUNUX1RPX0hUVFBTLFxuICAgICAgICBhbGxvd2VkTWV0aG9kczogY2xvdWRmcm9udC5BbGxvd2VkTWV0aG9kcy5BTExPV19HRVRfSEVBRCxcbiAgICAgICAgY2FjaGVkTWV0aG9kczogY2xvdWRmcm9udC5DYWNoZWRNZXRob2RzLkNBQ0hFX0dFVF9IRUFELFxuICAgICAgICBjYWNoZVBvbGljeTogY2xvdWRmcm9udC5DYWNoZVBvbGljeS5DQUNISU5HX09QVElNSVpFRCxcbiAgICAgICAgY29tcHJlc3M6IHRydWVcbiAgICAgIH0sXG4gICAgICBkb21haW5OYW1lczogW2Ake3Rvb2xOYW1lfS4ke2RvbWFpbn1gXSxcbiAgICAgIGNlcnRpZmljYXRlLFxuICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIGVycm9yUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBodHRwU3RhdHVzOiA0MDQsXG4gICAgICAgICAgcmVzcG9uc2VIdHRwU3RhdHVzOiAyMDAsXG4gICAgICAgICAgcmVzcG9uc2VQYWdlUGF0aDogJy9pbmRleC5odG1sJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBSb3V0ZTUzIFJlY29yZFxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgYCR7dG9vbE5hbWV9LXJlY29yZGAsIHtcbiAgICAgIHpvbmU6IGhvc3RlZFpvbmUsXG4gICAgICByZWNvcmROYW1lOiB0b29sTmFtZSxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKFxuICAgICAgICBuZXcgdGFyZ2V0cy5DbG91ZEZyb250VGFyZ2V0KGRpc3RyaWJ1dGlvbilcbiAgICAgIClcbiAgICB9KTtcblxuICAgIC8vIE91dHB1dCB2YWx1ZXNcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgJHt0b29sTmFtZX0tYnVja2V0LW5hbWVgLCB7XG4gICAgICB2YWx1ZTogYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogYFMzIGJ1Y2tldCBuYW1lIGZvciAke3Rvb2xOYW1lfWBcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIGAke3Rvb2xOYW1lfS1kaXN0cmlidXRpb24taWRgLCB7XG4gICAgICB2YWx1ZTogZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbklkLFxuICAgICAgZGVzY3JpcHRpb246IGBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiBJRCBmb3IgJHt0b29sTmFtZX1gXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgJHt0b29sTmFtZX0tdXJsYCwge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7dG9vbE5hbWV9LiR7ZG9tYWlufWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFVSTCBmb3IgJHt0b29sTmFtZX1gXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUxhbmRpbmdQYWdlSW5mcmFzdHJ1Y3R1cmUoXG4gICAgZG9tYWluOiBzdHJpbmcsXG4gICAgY2VydGlmaWNhdGU6IGFjbS5JQ2VydGlmaWNhdGUsXG4gICAgaG9zdGVkWm9uZTogcm91dGU1My5JSG9zdGVkWm9uZVxuICApIHtcbiAgICAvLyBTMyBCdWNrZXQgZm9yIGxhbmRpbmcgcGFnZVxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ2xhbmRpbmctcGFnZS1idWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBgbGFuZGluZy1wYWdlLSR7ZG9tYWluLnJlcGxhY2UoL1xcLi9nLCAnLScpfWAsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHlcbiAgICBjb25zdCBvcmlnaW5BY2Nlc3NJZGVudGl0eSA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KFxuICAgICAgdGhpcyxcbiAgICAgICdsYW5kaW5nLXBhZ2Utb2FpJ1xuICAgICk7XG4gICAgYnVja2V0LmdyYW50UmVhZChvcmlnaW5BY2Nlc3NJZGVudGl0eSk7XG5cbiAgICAvLyBDbG91ZEZyb250IERpc3RyaWJ1dGlvbiBmb3Igcm9vdCBkb21haW5cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24odGhpcywgJ2xhbmRpbmctcGFnZS1kaXN0cmlidXRpb24nLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHtcbiAgICAgICAgb3JpZ2luOiBuZXcgb3JpZ2lucy5TM09yaWdpbihidWNrZXQsIHtcbiAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eVxuICAgICAgICB9KSxcbiAgICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IGNsb3VkZnJvbnQuVmlld2VyUHJvdG9jb2xQb2xpY3kuUkVESVJFQ1RfVE9fSFRUUFMsXG4gICAgICAgIGFsbG93ZWRNZXRob2RzOiBjbG91ZGZyb250LkFsbG93ZWRNZXRob2RzLkFMTE9XX0dFVF9IRUFELFxuICAgICAgICBjYWNoZWRNZXRob2RzOiBjbG91ZGZyb250LkNhY2hlZE1ldGhvZHMuQ0FDSEVfR0VUX0hFQUQsXG4gICAgICAgIGNhY2hlUG9saWN5OiBjbG91ZGZyb250LkNhY2hlUG9saWN5LkNBQ0hJTkdfT1BUSU1JWkVELFxuICAgICAgICBjb21wcmVzczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGRvbWFpbk5hbWVzOiBbZG9tYWluXSxcbiAgICAgIGNlcnRpZmljYXRlLFxuICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIGVycm9yUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBodHRwU3RhdHVzOiA0MDQsXG4gICAgICAgICAgcmVzcG9uc2VIdHRwU3RhdHVzOiAyMDAsXG4gICAgICAgICAgcmVzcG9uc2VQYWdlUGF0aDogJy9pbmRleC5odG1sJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBSb3V0ZTUzIFJlY29yZCBmb3Igcm9vdCBkb21haW5cbiAgICBuZXcgcm91dGU1My5BUmVjb3JkKHRoaXMsICdsYW5kaW5nLXBhZ2UtcmVjb3JkJywge1xuICAgICAgem9uZTogaG9zdGVkWm9uZSxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKFxuICAgICAgICBuZXcgdGFyZ2V0cy5DbG91ZEZyb250VGFyZ2V0KGRpc3RyaWJ1dGlvbilcbiAgICAgIClcbiAgICB9KTtcblxuICAgIC8vIE91dHB1dCB2YWx1ZXNcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnbGFuZGluZy1wYWdlLWJ1Y2tldC1uYW1lJywge1xuICAgICAgdmFsdWU6IGJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdTMyBidWNrZXQgbmFtZSBmb3IgbGFuZGluZyBwYWdlJ1xuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2xhbmRpbmctcGFnZS1kaXN0cmlidXRpb24taWQnLCB7XG4gICAgICB2YWx1ZTogZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbklkLFxuICAgICAgZGVzY3JpcHRpb246ICdDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiBJRCBmb3IgbGFuZGluZyBwYWdlJ1xuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2xhbmRpbmctcGFnZS11cmwnLCB7XG4gICAgICB2YWx1ZTogYGh0dHBzOi8vJHtkb21haW59YCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVVJMIGZvciBsYW5kaW5nIHBhZ2UnXG4gICAgfSk7XG4gIH1cbn0iXX0=
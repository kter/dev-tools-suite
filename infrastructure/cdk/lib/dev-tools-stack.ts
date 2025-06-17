import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface DevToolsStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneId: string;
  certificateArn: string;
  environment: string;
}

export class DevToolsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DevToolsStackProps) {
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

  private createToolInfrastructure(
    toolName: string,
    domain: string,
    certificate: acm.ICertificate,
    hostedZone: route53.IHostedZone
  ) {
    // S3 Bucket for static files
    const bucket = new s3.Bucket(this, `${toolName}-bucket`, {
      bucketName: `${toolName}-${domain.replace(/\./g, '-')}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    // Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      `${toolName}-oai`
    );
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
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      )
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

  private createLandingPageInfrastructure(
    domain: string,
    certificate: acm.ICertificate,
    hostedZone: route53.IHostedZone
  ) {
    // S3 Bucket for landing page
    const bucket = new s3.Bucket(this, 'landing-page-bucket', {
      bucketName: `landing-page-${domain.replace(/\./g, '-')}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    // Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'landing-page-oai'
    );
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
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      )
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
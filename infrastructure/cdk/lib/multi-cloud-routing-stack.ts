import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface MultiCloudRoutingStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneId: string;
  environment: string;
  // AWS CloudFront distributions
  awsDistributions: { [toolName: string]: string };
  // Firebase Hosting URLs (without https://)
  firebaseHostingUrls: { [toolName: string]: string };
  firebaseLandingUrl: string;
}

export class MultiCloudRoutingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MultiCloudRoutingStackProps) {
    super(scope, id, props);

    // Import existing hosted zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.domain
    });

    // List of tools
    const tools = [
      'hash-generator',
      'qr-generator', 
      'unix-time-converter',
      'password-generator',
      'ip-calculator',
      'markdown-preview',
      'placeholder-generator',
      'ip-info',
      'timezone-converter',
      'string-converter',
      'code-diff',
      'mic-test',
      'json-yaml-converter',
      'jwt-decoder',
      'regex-tester',
      'lorem-ipsum-generator',
      'image-converter',
      'timer',
      'character-code-converter',
      'badger-image-generator',
      'poster-splitter'
    ];

    // Create weighted routing for each tool
    tools.forEach(toolName => {
      this.createWeightedRouting(
        hostedZone,
        toolName,
        props.domain,
        props.awsDistributions[toolName] || '',
        props.firebaseHostingUrls[toolName] || ''
      );
    });

    // Create weighted routing for landing page
    this.createWeightedRouting(
      hostedZone,
      'landing-page',
      props.domain,
      props.awsDistributions['landing-page'] || '',
      props.firebaseLandingUrl,
      true // isLandingPage
    );
  }

  private createWeightedRouting(
    hostedZone: route53.IHostedZone,
    toolName: string,
    domain: string,
    awsDistributionDomain: string,
    firebaseHostingUrl: string,
    isLandingPage: boolean = false
  ) {
    const recordName = isLandingPage ? undefined : toolName;
    const recordSetName = isLandingPage ? 'root' : toolName;

    // For now, use only AWS CloudFront to avoid DNS complexity
    // Firebase Hosting can be accessed via direct URLs (e.g., devtools-hash-generator-dev.web.app)
    // In the future, we could implement client-side routing or CloudFront origins to Firebase
    
    // AWS CloudFront A record (100% weight initially)
    new route53.ARecord(this, `${recordSetName}-aws-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget({
          distributionDomainName: awsDistributionDomain,
          distributionId: '', // Not needed for alias target
        } as any)
      ),
    });

    // Output information
    new cdk.CfnOutput(this, `${recordSetName}-aws-domain`, {
      value: awsDistributionDomain,
      description: `AWS CloudFront domain for ${toolName}`
    });

    new cdk.CfnOutput(this, `${recordSetName}-firebase-domain`, {
      value: firebaseHostingUrl,
      description: `Firebase Hosting domain for ${toolName} (direct access)`
    });

    new cdk.CfnOutput(this, `${recordSetName}-firebase-url`, {
      value: `https://${firebaseHostingUrl}`,
      description: `Firebase Hosting URL for ${toolName} (direct access)`
    });
  }
}
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export interface MultiCloudRoutingStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneId: string;
  environment: string;
  // AWS CloudFront distributions
  awsDistributions: { [toolName: string]: string };
  // Google Cloud Load Balancer IP
  gcpLoadBalancerIp: string;
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
        props.gcpLoadBalancerIp
      );
    });

    // Create weighted routing for landing page
    this.createWeightedRouting(
      hostedZone,
      'landing-page',
      props.domain,
      props.awsDistributions['landing-page'] || '',
      props.gcpLoadBalancerIp,
      true // isLandingPage
    );
  }

  private createWeightedRouting(
    hostedZone: route53.IHostedZone,
    toolName: string,
    domain: string,
    awsDistributionDomain: string,
    gcpLoadBalancerIp: string,
    isLandingPage: boolean = false
  ) {
    const recordName = isLandingPage ? undefined : toolName;
    const recordSetName = isLandingPage ? 'root' : toolName;

    // AWS CloudFront record (70% weight)
    new route53.ARecord(this, `${recordSetName}-aws-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromAlias({
        bind: () => ({
          dnsName: awsDistributionDomain,
          hostedZoneId: 'Z2FDTNDATAQYW2' // CloudFront hosted zone ID
        })
      }),
      weight: 70,
      setIdentifier: `${toolName}-aws`
    });

    // Google Cloud Load Balancer record (30% weight)
    new route53.ARecord(this, `${recordSetName}-gcp-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromIpAddresses(gcpLoadBalancerIp),
      weight: 30,
      setIdentifier: `${toolName}-gcp`
    });

    // Health checks for failover (optional)
    const awsHealthCheck = new route53.CfnHealthCheck(this, `${recordSetName}-aws-health-check`, {
      type: 'HTTPS',
      resourcePath: '/',
      fullyQualifiedDomainName: isLandingPage ? domain : `${toolName}.${domain}`,
      requestInterval: 30,
      failureThreshold: 3,
      tags: [{
        key: 'Name',
        value: `${toolName}-aws-health-check`
      }]
    });

    const gcpHealthCheck = new route53.CfnHealthCheck(this, `${recordSetName}-gcp-health-check`, {
      type: 'HTTPS',
      resourcePath: '/',
      fullyQualifiedDomainName: isLandingPage ? domain : `${toolName}.${domain}`,
      requestInterval: 30,
      failureThreshold: 3,
      tags: [{
        key: 'Name',
        value: `${toolName}-gcp-health-check`
      }]
    });

    // Output health check IDs
    new cdk.CfnOutput(this, `${recordSetName}-aws-health-check-id`, {
      value: awsHealthCheck.attrHealthCheckId,
      description: `AWS health check ID for ${toolName}`
    });

    new cdk.CfnOutput(this, `${recordSetName}-gcp-health-check-id`, {
      value: gcpHealthCheck.attrHealthCheckId,
      description: `GCP health check ID for ${toolName}`
    });
  }

  // Alternative: Geolocation-based routing
  private createGeolocationRouting(
    hostedZone: route53.IHostedZone,
    toolName: string,
    domain: string,
    awsDistributionDomain: string,
    gcpLoadBalancerIp: string,
    isLandingPage: boolean = false
  ) {
    const recordName = isLandingPage ? undefined : toolName;
    const recordSetName = isLandingPage ? 'root' : toolName;

    // AWS CloudFront for North America and Europe
    new route53.ARecord(this, `${recordSetName}-aws-na-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromAlias({
        bind: () => ({
          dnsName: awsDistributionDomain,
          hostedZoneId: 'Z2FDTNDATAQYW2'
        })
      }),
      geoLocation: route53.GeoLocation.continent(route53.Continent.NORTH_AMERICA),
      setIdentifier: `${toolName}-aws-na`
    });

    new route53.ARecord(this, `${recordSetName}-aws-eu-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromAlias({
        bind: () => ({
          dnsName: awsDistributionDomain,
          hostedZoneId: 'Z2FDTNDATAQYW2'
        })
      }),
      geoLocation: route53.GeoLocation.continent(route53.Continent.EUROPE),
      setIdentifier: `${toolName}-aws-eu`
    });

    // Google Cloud Load Balancer for Asia and default
    new route53.ARecord(this, `${recordSetName}-gcp-asia-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromIpAddresses(gcpLoadBalancerIp),
      geoLocation: route53.GeoLocation.continent(route53.Continent.ASIA),
      setIdentifier: `${toolName}-gcp-asia`
    });

    // Default record (fallback)
    new route53.ARecord(this, `${recordSetName}-default-record`, {
      zone: hostedZone,
      recordName: recordName,
      target: route53.RecordTarget.fromAlias({
        bind: () => ({
          dnsName: awsDistributionDomain,
          hostedZoneId: 'Z2FDTNDATAQYW2'
        })
      }),
      geoLocation: route53.GeoLocation.default(),
      setIdentifier: `${toolName}-default`
    });
  }
}
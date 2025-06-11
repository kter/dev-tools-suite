#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DevToolsStack } from '../lib/dev-tools-stack';
import { CertificateStack } from '../lib/certificate-stack';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';

const config = {
  dev: {
    domain: 'dev.devtools.site',
    hostedZoneId: 'Z10172453BI2WPR9N2H36',
    env: {
      region: 'ap-northeast-1'
    }
  },
  prd: {
    domain: 'devtools.site', 
    hostedZoneId: 'Z07774093R2W7AB97P21C',
    env: {
      region: 'ap-northeast-1'
    }
  }
};

// Certificate stack in us-east-1 for CloudFront
const certificateStack = new CertificateStack(app, `CertificateStack-${environment}`, {
  env: { region: 'us-east-1' },
  domain: config[environment as keyof typeof config].domain,
  hostedZoneId: config[environment as keyof typeof config].hostedZoneId
});

// Main stack with application resources
const devToolsStack = new DevToolsStack(app, `DevToolsStack-${environment}`, {
  env: config[environment as keyof typeof config].env,
  domain: config[environment as keyof typeof config].domain,
  hostedZoneId: config[environment as keyof typeof config].hostedZoneId,
  certificateArn: certificateStack.certificate.certificateArn,
  environment,
  crossRegionReferences: true
});

devToolsStack.addDependency(certificateStack);
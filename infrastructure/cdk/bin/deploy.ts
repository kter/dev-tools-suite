#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DevToolsStack } from '../lib/dev-tools-stack';
import { CertificateStack } from '../lib/certificate-stack';
import { GitHubActionsStack } from '../lib/github-actions-stack';
// import { MultiCloudRoutingStack } from '../lib/multi-cloud-routing-stack';

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

// GitHub Actions IAM Stack
const githubActionsStack = new GitHubActionsStack(app, `GitHubActionsStack-${environment}`, {
  env: config[environment as keyof typeof config].env,
  environment: environment as 'dev' | 'prd',
  githubRepo: 'kter/dev-tools-suite'
});

// Multi-Cloud Routing Stack (conditional)
// Temporarily disabled due to missing multi-cloud-routing-stack module
// if (app.node.tryGetContext('deployMultiCloud') === 'true') {
//   const firebaseHostingUrls: { [toolName: string]: string } = {
//     'hash-generator': `devtools-hash-generator-${environment}.web.app`,
//     'qr-generator': `devtools-qr-generator-${environment}.web.app`,
//     'unix-time-converter': `devtools-unix-time-converter-${environment}.web.app`,
//     'password-generator': `devtools-password-generator-${environment}.web.app`,
//     'ip-calculator': `devtools-ip-calculator-${environment}.web.app`,
//     'markdown-preview': `devtools-markdown-preview-${environment}.web.app`,
//     'placeholder-generator': `devtools-placeholder-generator-${environment}.web.app`,
//     'ip-info': `devtools-ip-info-${environment}.web.app`,
//     'timezone-converter': `devtools-timezone-converter-${environment}.web.app`,
//     'string-converter': `devtools-string-converter-${environment}.web.app`,
//     'code-diff': `devtools-code-diff-${environment}.web.app`,
//     'mic-test': `devtools-mic-test-${environment}.web.app`,
//     'json-yaml-converter': `devtools-json-yaml-converter-${environment}.web.app`,
//     'jwt-decoder': `devtools-jwt-decoder-${environment}.web.app`,
//     'regex-tester': `devtools-regex-tester-${environment}.web.app`,
//     'lorem-ipsum-generator': `devtools-lorem-ipsum-generator-${environment}.web.app`,
//     'image-converter': `devtools-image-converter-${environment}.web.app`,
//     'timer': `devtools-timer-${environment}.web.app`,
//     'character-code-converter': `devtools-character-code-converter-${environment}.web.app`,
//     'badger-image-generator': `devtools-badger-image-generator-${environment}.web.app`,
//     'poster-splitter': `devtools-poster-splitter-${environment}.web.app`
//   };

//   const multiCloudStack = new MultiCloudRoutingStack(app, `MultiCloudRoutingStack-${environment}`, {
//     env: config[environment as keyof typeof config].env,
//     domain: config[environment as keyof typeof config].domain,
//     hostedZoneId: config[environment as keyof typeof config].hostedZoneId,
//     environment,
//     awsDistributions: devToolsStack.cloudFrontDistributions,
//     firebaseHostingUrls,
//     firebaseLandingUrl: `devtools-landing-page-${environment}.web.app`
//   });

//   multiCloudStack.addDependency(devToolsStack);
// }
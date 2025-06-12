import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GitHubActionsStackProps extends cdk.StackProps {
  environment: 'dev' | 'prd';
  githubRepo: string;
}

export class GitHubActionsStack extends cdk.Stack {
  public readonly roleArn: string;

  constructor(scope: Construct, id: string, props: GitHubActionsStackProps) {
    super(scope, id, props);

    // GitHub OIDC プロバイダー（既存のものを参照）
    const oidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      this, 
      'GitHubOidcProvider',
      `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`
    );

    // GitHub Actions用IAMロール
    const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: `GitHubActions-DevToolsSuite-${props.environment}`,
      assumedBy: new iam.WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
        'StringEquals': {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
        },
        'StringLike': {
          'token.actions.githubusercontent.com:sub': [
            // ブランチ別アクセス制御
            props.environment === 'dev' 
              ? `repo:${props.githubRepo}:ref:refs/heads/develop`
              : `repo:${props.githubRepo}:ref:refs/heads/main`,
            // Environment経由のアクセス（修正版）
            props.environment === 'dev'
              ? `repo:${props.githubRepo}:environment:develop`
              : `repo:${props.githubRepo}:environment:main`
          ]
        }
      }),
      description: `GitHub Actions role for ${props.environment} environment`
    });

    // CDK実行権限（PowerUserAccess相当）
    githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess')
    );

    // S3フルアクセス（アプリケーションデプロイ用）
    githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
    );

    // CloudFrontフルアクセス（キャッシュ無効化用）
    githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudFrontFullAccess')
    );

    // Route53アクセス（DNS管理用）
    githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRoute53FullAccess')
    );

    // Certificate Manager（SSL証明書管理用）
    githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCertificateManagerFullAccess')
    );

    // IAMロールARNを出力
    this.roleArn = githubActionsRole.roleArn;

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: githubActionsRole.roleArn,
      description: `GitHub Actions IAM Role ARN for ${props.environment} environment`,
      exportName: `GitHubActionsRoleArn-${props.environment}`
    });

    new cdk.CfnOutput(this, 'OidcProviderArn', {
      value: `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
      description: 'GitHub OIDC Provider ARN'
    });
  }
}
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface GitHubActionsStackProps extends cdk.StackProps {
    environment: 'dev' | 'prd';
    githubRepo: string;
}
export declare class GitHubActionsStack extends cdk.Stack {
    readonly roleArn: string;
    constructor(scope: Construct, id: string, props: GitHubActionsStackProps);
}

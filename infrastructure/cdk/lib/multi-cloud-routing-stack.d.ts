import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface MultiCloudRoutingStackProps extends cdk.StackProps {
    domain: string;
    hostedZoneId: string;
    environment: string;
    awsDistributions: {
        [toolName: string]: string;
    };
    firebaseHostingUrls: {
        [toolName: string]: string;
    };
    firebaseLandingUrl: string;
}
export declare class MultiCloudRoutingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: MultiCloudRoutingStackProps);
    private createWeightedRouting;
}

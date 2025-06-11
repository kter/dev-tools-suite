import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface DevToolsStackProps extends cdk.StackProps {
    domain: string;
    hostedZoneId: string;
    certificateArn: string;
    environment: string;
}
export declare class DevToolsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: DevToolsStackProps);
    private createToolInfrastructure;
    private createLandingPageInfrastructure;
}

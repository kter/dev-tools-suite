"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiCloudRoutingStack = void 0;
const cdk = require("aws-cdk-lib");
const route53 = require("aws-cdk-lib/aws-route53");
class MultiCloudRoutingStack extends cdk.Stack {
    constructor(scope, id, props) {
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
            this.createWeightedRouting(hostedZone, toolName, props.domain, props.awsDistributions[toolName] || '', props.firebaseHostingUrls[toolName] || '');
        });
        // Create weighted routing for landing page
        this.createWeightedRouting(hostedZone, 'landing-page', props.domain, props.awsDistributions['landing-page'] || '', props.firebaseLandingUrl, true // isLandingPage
        );
    }
    createWeightedRouting(hostedZone, toolName, domain, awsDistributionDomain, firebaseHostingUrl, isLandingPage = false) {
        const recordName = isLandingPage ? undefined : toolName;
        const recordSetName = isLandingPage ? 'root' : toolName;
        // AWS CloudFront record (70% weight) using CfnRecordSet for advanced features
        new route53.CfnRecordSet(this, `${recordSetName}-aws-record`, {
            hostedZoneId: hostedZone.hostedZoneId,
            name: isLandingPage ? domain : `${toolName}.${domain}`,
            type: 'A',
            aliasTarget: {
                dnsName: awsDistributionDomain,
                hostedZoneId: 'Z2FDTNDATAQYW2' // CloudFront hosted zone ID
            },
            weight: 70,
            setIdentifier: `${toolName}-aws`
        });
        // Firebase Hosting CNAME record (30% weight) using CfnRecordSet
        new route53.CfnRecordSet(this, `${recordSetName}-firebase-record`, {
            hostedZoneId: hostedZone.hostedZoneId,
            name: isLandingPage ? domain : `${toolName}.${domain}`,
            type: 'CNAME',
            resourceRecords: [firebaseHostingUrl],
            ttl: '300',
            weight: 30,
            setIdentifier: `${toolName}-firebase`
        });
        // Output information
        new cdk.CfnOutput(this, `${recordSetName}-aws-domain`, {
            value: awsDistributionDomain,
            description: `AWS CloudFront domain for ${toolName}`
        });
        new cdk.CfnOutput(this, `${recordSetName}-firebase-domain`, {
            value: firebaseHostingUrl,
            description: `Firebase Hosting domain for ${toolName}`
        });
    }
}
exports.MultiCloudRoutingStack = MultiCloudRoutingStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktY2xvdWQtcm91dGluZy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm11bHRpLWNsb3VkLXJvdXRpbmctc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQWNuRCxNQUFhLHNCQUF1QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0M7UUFDMUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsOEJBQThCO1FBQzlCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNqRixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNO1NBQ3ZCLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixNQUFNLEtBQUssR0FBRztZQUNaLGdCQUFnQjtZQUNoQixjQUFjO1lBQ2QscUJBQXFCO1lBQ3JCLG9CQUFvQjtZQUNwQixlQUFlO1lBQ2Ysa0JBQWtCO1lBQ2xCLHVCQUF1QjtZQUN2QixTQUFTO1lBQ1Qsb0JBQW9CO1lBQ3BCLGtCQUFrQjtZQUNsQixXQUFXO1lBQ1gsVUFBVTtZQUNWLHFCQUFxQjtZQUNyQixhQUFhO1lBQ2IsY0FBYztZQUNkLHVCQUF1QjtZQUN2QixpQkFBaUI7WUFDakIsT0FBTztZQUNQLDBCQUEwQjtZQUMxQix3QkFBd0I7WUFDeEIsaUJBQWlCO1NBQ2xCLENBQUM7UUFFRix3Q0FBd0M7UUFDeEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMscUJBQXFCLENBQ3hCLFVBQVUsRUFDVixRQUFRLEVBQ1IsS0FBSyxDQUFDLE1BQU0sRUFDWixLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUN0QyxLQUFLLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUMxQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCwyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLHFCQUFxQixDQUN4QixVQUFVLEVBQ1YsY0FBYyxFQUNkLEtBQUssQ0FBQyxNQUFNLEVBQ1osS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFDNUMsS0FBSyxDQUFDLGtCQUFrQixFQUN4QixJQUFJLENBQUMsZ0JBQWdCO1NBQ3RCLENBQUM7SUFDSixDQUFDO0lBRU8scUJBQXFCLENBQzNCLFVBQStCLEVBQy9CLFFBQWdCLEVBQ2hCLE1BQWMsRUFDZCxxQkFBNkIsRUFDN0Isa0JBQTBCLEVBQzFCLGdCQUF5QixLQUFLO1FBRTlCLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDeEQsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUV4RCw4RUFBOEU7UUFDOUUsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLGFBQWEsYUFBYSxFQUFFO1lBQzVELFlBQVksRUFBRSxVQUFVLENBQUMsWUFBWTtZQUNyQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLE1BQU0sRUFBRTtZQUN0RCxJQUFJLEVBQUUsR0FBRztZQUNULFdBQVcsRUFBRTtnQkFDWCxPQUFPLEVBQUUscUJBQXFCO2dCQUM5QixZQUFZLEVBQUUsZ0JBQWdCLENBQUMsNEJBQTRCO2FBQzVEO1lBQ0QsTUFBTSxFQUFFLEVBQUU7WUFDVixhQUFhLEVBQUUsR0FBRyxRQUFRLE1BQU07U0FDakMsQ0FBQyxDQUFDO1FBRUgsZ0VBQWdFO1FBQ2hFLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxhQUFhLGtCQUFrQixFQUFFO1lBQ2pFLFlBQVksRUFBRSxVQUFVLENBQUMsWUFBWTtZQUNyQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLE1BQU0sRUFBRTtZQUN0RCxJQUFJLEVBQUUsT0FBTztZQUNiLGVBQWUsRUFBRSxDQUFDLGtCQUFrQixDQUFDO1lBQ3JDLEdBQUcsRUFBRSxLQUFLO1lBQ1YsTUFBTSxFQUFFLEVBQUU7WUFDVixhQUFhLEVBQUUsR0FBRyxRQUFRLFdBQVc7U0FDdEMsQ0FBQyxDQUFDO1FBRUgscUJBQXFCO1FBQ3JCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxhQUFhLGFBQWEsRUFBRTtZQUNyRCxLQUFLLEVBQUUscUJBQXFCO1lBQzVCLFdBQVcsRUFBRSw2QkFBNkIsUUFBUSxFQUFFO1NBQ3JELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxhQUFhLGtCQUFrQixFQUFFO1lBQzFELEtBQUssRUFBRSxrQkFBa0I7WUFDekIsV0FBVyxFQUFFLCtCQUErQixRQUFRLEVBQUU7U0FDdkQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdkdELHdEQXVHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE11bHRpQ2xvdWRSb3V0aW5nU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgZG9tYWluOiBzdHJpbmc7XG4gIGhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBlbnZpcm9ubWVudDogc3RyaW5nO1xuICAvLyBBV1MgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25zXG4gIGF3c0Rpc3RyaWJ1dGlvbnM6IHsgW3Rvb2xOYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgLy8gRmlyZWJhc2UgSG9zdGluZyBVUkxzICh3aXRob3V0IGh0dHBzOi8vKVxuICBmaXJlYmFzZUhvc3RpbmdVcmxzOiB7IFt0b29sTmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG4gIGZpcmViYXNlTGFuZGluZ1VybDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTXVsdGlDbG91ZFJvdXRpbmdTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNdWx0aUNsb3VkUm91dGluZ1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIEltcG9ydCBleGlzdGluZyBob3N0ZWQgem9uZVxuICAgIGNvbnN0IGhvc3RlZFpvbmUgPSByb3V0ZTUzLkhvc3RlZFpvbmUuZnJvbUhvc3RlZFpvbmVBdHRyaWJ1dGVzKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgaG9zdGVkWm9uZUlkOiBwcm9wcy5ob3N0ZWRab25lSWQsXG4gICAgICB6b25lTmFtZTogcHJvcHMuZG9tYWluXG4gICAgfSk7XG5cbiAgICAvLyBMaXN0IG9mIHRvb2xzXG4gICAgY29uc3QgdG9vbHMgPSBbXG4gICAgICAnaGFzaC1nZW5lcmF0b3InLFxuICAgICAgJ3FyLWdlbmVyYXRvcicsIFxuICAgICAgJ3VuaXgtdGltZS1jb252ZXJ0ZXInLFxuICAgICAgJ3Bhc3N3b3JkLWdlbmVyYXRvcicsXG4gICAgICAnaXAtY2FsY3VsYXRvcicsXG4gICAgICAnbWFya2Rvd24tcHJldmlldycsXG4gICAgICAncGxhY2Vob2xkZXItZ2VuZXJhdG9yJyxcbiAgICAgICdpcC1pbmZvJyxcbiAgICAgICd0aW1lem9uZS1jb252ZXJ0ZXInLFxuICAgICAgJ3N0cmluZy1jb252ZXJ0ZXInLFxuICAgICAgJ2NvZGUtZGlmZicsXG4gICAgICAnbWljLXRlc3QnLFxuICAgICAgJ2pzb24teWFtbC1jb252ZXJ0ZXInLFxuICAgICAgJ2p3dC1kZWNvZGVyJyxcbiAgICAgICdyZWdleC10ZXN0ZXInLFxuICAgICAgJ2xvcmVtLWlwc3VtLWdlbmVyYXRvcicsXG4gICAgICAnaW1hZ2UtY29udmVydGVyJyxcbiAgICAgICd0aW1lcicsXG4gICAgICAnY2hhcmFjdGVyLWNvZGUtY29udmVydGVyJyxcbiAgICAgICdiYWRnZXItaW1hZ2UtZ2VuZXJhdG9yJyxcbiAgICAgICdwb3N0ZXItc3BsaXR0ZXInXG4gICAgXTtcblxuICAgIC8vIENyZWF0ZSB3ZWlnaHRlZCByb3V0aW5nIGZvciBlYWNoIHRvb2xcbiAgICB0b29scy5mb3JFYWNoKHRvb2xOYW1lID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlV2VpZ2h0ZWRSb3V0aW5nKFxuICAgICAgICBob3N0ZWRab25lLFxuICAgICAgICB0b29sTmFtZSxcbiAgICAgICAgcHJvcHMuZG9tYWluLFxuICAgICAgICBwcm9wcy5hd3NEaXN0cmlidXRpb25zW3Rvb2xOYW1lXSB8fCAnJyxcbiAgICAgICAgcHJvcHMuZmlyZWJhc2VIb3N0aW5nVXJsc1t0b29sTmFtZV0gfHwgJydcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgd2VpZ2h0ZWQgcm91dGluZyBmb3IgbGFuZGluZyBwYWdlXG4gICAgdGhpcy5jcmVhdGVXZWlnaHRlZFJvdXRpbmcoXG4gICAgICBob3N0ZWRab25lLFxuICAgICAgJ2xhbmRpbmctcGFnZScsXG4gICAgICBwcm9wcy5kb21haW4sXG4gICAgICBwcm9wcy5hd3NEaXN0cmlidXRpb25zWydsYW5kaW5nLXBhZ2UnXSB8fCAnJyxcbiAgICAgIHByb3BzLmZpcmViYXNlTGFuZGluZ1VybCxcbiAgICAgIHRydWUgLy8gaXNMYW5kaW5nUGFnZVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVdlaWdodGVkUm91dGluZyhcbiAgICBob3N0ZWRab25lOiByb3V0ZTUzLklIb3N0ZWRab25lLFxuICAgIHRvb2xOYW1lOiBzdHJpbmcsXG4gICAgZG9tYWluOiBzdHJpbmcsXG4gICAgYXdzRGlzdHJpYnV0aW9uRG9tYWluOiBzdHJpbmcsXG4gICAgZmlyZWJhc2VIb3N0aW5nVXJsOiBzdHJpbmcsXG4gICAgaXNMYW5kaW5nUGFnZTogYm9vbGVhbiA9IGZhbHNlXG4gICkge1xuICAgIGNvbnN0IHJlY29yZE5hbWUgPSBpc0xhbmRpbmdQYWdlID8gdW5kZWZpbmVkIDogdG9vbE5hbWU7XG4gICAgY29uc3QgcmVjb3JkU2V0TmFtZSA9IGlzTGFuZGluZ1BhZ2UgPyAncm9vdCcgOiB0b29sTmFtZTtcblxuICAgIC8vIEFXUyBDbG91ZEZyb250IHJlY29yZCAoNzAlIHdlaWdodCkgdXNpbmcgQ2ZuUmVjb3JkU2V0IGZvciBhZHZhbmNlZCBmZWF0dXJlc1xuICAgIG5ldyByb3V0ZTUzLkNmblJlY29yZFNldCh0aGlzLCBgJHtyZWNvcmRTZXROYW1lfS1hd3MtcmVjb3JkYCwge1xuICAgICAgaG9zdGVkWm9uZUlkOiBob3N0ZWRab25lLmhvc3RlZFpvbmVJZCxcbiAgICAgIG5hbWU6IGlzTGFuZGluZ1BhZ2UgPyBkb21haW4gOiBgJHt0b29sTmFtZX0uJHtkb21haW59YCxcbiAgICAgIHR5cGU6ICdBJyxcbiAgICAgIGFsaWFzVGFyZ2V0OiB7XG4gICAgICAgIGRuc05hbWU6IGF3c0Rpc3RyaWJ1dGlvbkRvbWFpbixcbiAgICAgICAgaG9zdGVkWm9uZUlkOiAnWjJGRFROREFUQVFZVzInIC8vIENsb3VkRnJvbnQgaG9zdGVkIHpvbmUgSURcbiAgICAgIH0sXG4gICAgICB3ZWlnaHQ6IDcwLFxuICAgICAgc2V0SWRlbnRpZmllcjogYCR7dG9vbE5hbWV9LWF3c2BcbiAgICB9KTtcblxuICAgIC8vIEZpcmViYXNlIEhvc3RpbmcgQ05BTUUgcmVjb3JkICgzMCUgd2VpZ2h0KSB1c2luZyBDZm5SZWNvcmRTZXRcbiAgICBuZXcgcm91dGU1My5DZm5SZWNvcmRTZXQodGhpcywgYCR7cmVjb3JkU2V0TmFtZX0tZmlyZWJhc2UtcmVjb3JkYCwge1xuICAgICAgaG9zdGVkWm9uZUlkOiBob3N0ZWRab25lLmhvc3RlZFpvbmVJZCxcbiAgICAgIG5hbWU6IGlzTGFuZGluZ1BhZ2UgPyBkb21haW4gOiBgJHt0b29sTmFtZX0uJHtkb21haW59YCxcbiAgICAgIHR5cGU6ICdDTkFNRScsXG4gICAgICByZXNvdXJjZVJlY29yZHM6IFtmaXJlYmFzZUhvc3RpbmdVcmxdLFxuICAgICAgdHRsOiAnMzAwJyxcbiAgICAgIHdlaWdodDogMzAsXG4gICAgICBzZXRJZGVudGlmaWVyOiBgJHt0b29sTmFtZX0tZmlyZWJhc2VgXG4gICAgfSk7XG5cbiAgICAvLyBPdXRwdXQgaW5mb3JtYXRpb25cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBgJHtyZWNvcmRTZXROYW1lfS1hd3MtZG9tYWluYCwge1xuICAgICAgdmFsdWU6IGF3c0Rpc3RyaWJ1dGlvbkRvbWFpbixcbiAgICAgIGRlc2NyaXB0aW9uOiBgQVdTIENsb3VkRnJvbnQgZG9tYWluIGZvciAke3Rvb2xOYW1lfWBcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIGAke3JlY29yZFNldE5hbWV9LWZpcmViYXNlLWRvbWFpbmAsIHtcbiAgICAgIHZhbHVlOiBmaXJlYmFzZUhvc3RpbmdVcmwsXG4gICAgICBkZXNjcmlwdGlvbjogYEZpcmViYXNlIEhvc3RpbmcgZG9tYWluIGZvciAke3Rvb2xOYW1lfWBcbiAgICB9KTtcbiAgfVxufSJdfQ==
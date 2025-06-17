"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubActionsStack = void 0;
const cdk = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
class GitHubActionsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // GitHub OIDC プロバイダー（既存のものを参照）
        const oidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'GitHubOidcProvider', `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`);
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
                            ? `repo:${props.githubRepo}:environment:dev`
                            : `repo:${props.githubRepo}:environment:prd`
                    ]
                }
            }),
            description: `GitHub Actions role for ${props.environment} environment`
        });
        // CDK実行権限（PowerUserAccess相当）
        githubActionsRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess'));
        // S3フルアクセス（アプリケーションデプロイ用）
        githubActionsRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
        // CloudFrontフルアクセス（キャッシュ無効化用）
        githubActionsRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudFrontFullAccess'));
        // Route53アクセス（DNS管理用）
        githubActionsRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRoute53FullAccess'));
        // Certificate Manager（SSL証明書管理用）
        githubActionsRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCertificateManagerFullAccess'));
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
exports.GitHubActionsStack = GitHubActionsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLWFjdGlvbnMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnaXRodWItYWN0aW9ucy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsMkNBQTJDO0FBUTNDLE1BQWEsa0JBQW1CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QiwrQkFBK0I7UUFDL0IsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLDRCQUE0QixDQUN6RSxJQUFJLEVBQ0osb0JBQW9CLEVBQ3BCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxvREFBb0QsQ0FDakYsQ0FBQztRQUVGLHdCQUF3QjtRQUN4QixNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDaEUsUUFBUSxFQUFFLCtCQUErQixLQUFLLENBQUMsV0FBVyxFQUFFO1lBQzVELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsd0JBQXdCLEVBQUU7Z0JBQzdFLGNBQWMsRUFBRTtvQkFDZCx5Q0FBeUMsRUFBRSxtQkFBbUI7aUJBQy9EO2dCQUNELFlBQVksRUFBRTtvQkFDWix5Q0FBeUMsRUFBRTt3QkFDekMsY0FBYzt3QkFDZCxLQUFLLENBQUMsV0FBVyxLQUFLLEtBQUs7NEJBQ3pCLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxVQUFVLHlCQUF5Qjs0QkFDbkQsQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLFVBQVUsc0JBQXNCO3dCQUNsRCwwQkFBMEI7d0JBQzFCLEtBQUssQ0FBQyxXQUFXLEtBQUssS0FBSzs0QkFDekIsQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLFVBQVUsa0JBQWtCOzRCQUM1QyxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsVUFBVSxrQkFBa0I7cUJBQy9DO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLFdBQVcsRUFBRSwyQkFBMkIsS0FBSyxDQUFDLFdBQVcsY0FBYztTQUN4RSxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsaUJBQWlCLENBQUMsZ0JBQWdCLENBQ2hDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsaUJBQWlCLENBQUMsQ0FDOUQsQ0FBQztRQUVGLDBCQUEwQjtRQUMxQixpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FDaEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUNqRSxDQUFDO1FBRUYsOEJBQThCO1FBQzlCLGlCQUFpQixDQUFDLGdCQUFnQixDQUNoQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLHNCQUFzQixDQUFDLENBQ25FLENBQUM7UUFFRixzQkFBc0I7UUFDdEIsaUJBQWlCLENBQUMsZ0JBQWdCLENBQ2hDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMseUJBQXlCLENBQUMsQ0FDdEUsQ0FBQztRQUVGLGlDQUFpQztRQUNqQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FDaEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUM5RSxDQUFDO1FBRUYsZUFBZTtRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDO1FBRXpDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDOUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLE9BQU87WUFDaEMsV0FBVyxFQUFFLG1DQUFtQyxLQUFLLENBQUMsV0FBVyxjQUFjO1lBQy9FLFVBQVUsRUFBRSx3QkFBd0IsS0FBSyxDQUFDLFdBQVcsRUFBRTtTQUN4RCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLEtBQUssRUFBRSxnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sb0RBQW9EO1lBQ3ZGLFdBQVcsRUFBRSwwQkFBMEI7U0FDeEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBM0VELGdEQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBHaXRIdWJBY3Rpb25zU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgZW52aXJvbm1lbnQ6ICdkZXYnIHwgJ3ByZCc7XG4gIGdpdGh1YlJlcG86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEdpdEh1YkFjdGlvbnNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSByb2xlQXJuOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEdpdEh1YkFjdGlvbnNTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBHaXRIdWIgT0lEQyDjg5fjg63jg5DjgqTjg4Djg7zvvIjml6LlrZjjga7jgoLjga7jgpLlj4LnhafvvIlcbiAgICBjb25zdCBvaWRjUHJvdmlkZXIgPSBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyLmZyb21PcGVuSWRDb25uZWN0UHJvdmlkZXJBcm4oXG4gICAgICB0aGlzLCBcbiAgICAgICdHaXRIdWJPaWRjUHJvdmlkZXInLFxuICAgICAgYGFybjphd3M6aWFtOjoke3RoaXMuYWNjb3VudH06b2lkYy1wcm92aWRlci90b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbWBcbiAgICApO1xuXG4gICAgLy8gR2l0SHViIEFjdGlvbnPnlKhJQU3jg63jg7zjg6tcbiAgICBjb25zdCBnaXRodWJBY3Rpb25zUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnR2l0SHViQWN0aW9uc1JvbGUnLCB7XG4gICAgICByb2xlTmFtZTogYEdpdEh1YkFjdGlvbnMtRGV2VG9vbHNTdWl0ZS0ke3Byb3BzLmVudmlyb25tZW50fWAsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uV2ViSWRlbnRpdHlQcmluY2lwYWwob2lkY1Byb3ZpZGVyLm9wZW5JZENvbm5lY3RQcm92aWRlckFybiwge1xuICAgICAgICAnU3RyaW5nRXF1YWxzJzoge1xuICAgICAgICAgICd0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbTphdWQnOiAnc3RzLmFtYXpvbmF3cy5jb20nXG4gICAgICAgIH0sXG4gICAgICAgICdTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICd0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbTpzdWInOiBbXG4gICAgICAgICAgICAvLyDjg5bjg6njg7Pjg4HliKXjgqLjgq/jgrvjgrnliLblvqFcbiAgICAgICAgICAgIHByb3BzLmVudmlyb25tZW50ID09PSAnZGV2JyBcbiAgICAgICAgICAgICAgPyBgcmVwbzoke3Byb3BzLmdpdGh1YlJlcG99OnJlZjpyZWZzL2hlYWRzL2RldmVsb3BgXG4gICAgICAgICAgICAgIDogYHJlcG86JHtwcm9wcy5naXRodWJSZXBvfTpyZWY6cmVmcy9oZWFkcy9tYWluYCxcbiAgICAgICAgICAgIC8vIEVudmlyb25tZW5057WM55Sx44Gu44Ki44Kv44K744K577yI5L+u5q2j54mI77yJXG4gICAgICAgICAgICBwcm9wcy5lbnZpcm9ubWVudCA9PT0gJ2RldidcbiAgICAgICAgICAgICAgPyBgcmVwbzoke3Byb3BzLmdpdGh1YlJlcG99OmVudmlyb25tZW50OmRldmBcbiAgICAgICAgICAgICAgOiBgcmVwbzoke3Byb3BzLmdpdGh1YlJlcG99OmVudmlyb25tZW50OnByZGBcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgZGVzY3JpcHRpb246IGBHaXRIdWIgQWN0aW9ucyByb2xlIGZvciAke3Byb3BzLmVudmlyb25tZW50fSBlbnZpcm9ubWVudGBcbiAgICB9KTtcblxuICAgIC8vIENES+Wun+ihjOaoqemZkO+8iFBvd2VyVXNlckFjY2Vzc+ebuOW9k++8iVxuICAgIGdpdGh1YkFjdGlvbnNSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ1Bvd2VyVXNlckFjY2VzcycpXG4gICAgKTtcblxuICAgIC8vIFMz44OV44Or44Ki44Kv44K744K577yI44Ki44OX44Oq44Kx44O844K344On44Oz44OH44OX44Ot44Kk55So77yJXG4gICAgZ2l0aHViQWN0aW9uc1JvbGUuYWRkTWFuYWdlZFBvbGljeShcbiAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uUzNGdWxsQWNjZXNzJylcbiAgICApO1xuXG4gICAgLy8gQ2xvdWRGcm9udOODleODq+OCouOCr+OCu+OCue+8iOOCreODo+ODg+OCt+ODpeeEoeWKueWMlueUqO+8iVxuICAgIGdpdGh1YkFjdGlvbnNSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0Nsb3VkRnJvbnRGdWxsQWNjZXNzJylcbiAgICApO1xuXG4gICAgLy8gUm91dGU1M+OCouOCr+OCu+OCue+8iEROU+euoeeQhueUqO+8iVxuICAgIGdpdGh1YkFjdGlvbnNSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvblJvdXRlNTNGdWxsQWNjZXNzJylcbiAgICApO1xuXG4gICAgLy8gQ2VydGlmaWNhdGUgTWFuYWdlcu+8iFNTTOiovOaYjuabuOeuoeeQhueUqO+8iVxuICAgIGdpdGh1YkFjdGlvbnNSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FXU0NlcnRpZmljYXRlTWFuYWdlckZ1bGxBY2Nlc3MnKVxuICAgICk7XG5cbiAgICAvLyBJQU3jg63jg7zjg6tBUk7jgpLlh7rliptcbiAgICB0aGlzLnJvbGVBcm4gPSBnaXRodWJBY3Rpb25zUm9sZS5yb2xlQXJuO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0dpdEh1YkFjdGlvbnNSb2xlQXJuJywge1xuICAgICAgdmFsdWU6IGdpdGh1YkFjdGlvbnNSb2xlLnJvbGVBcm4sXG4gICAgICBkZXNjcmlwdGlvbjogYEdpdEh1YiBBY3Rpb25zIElBTSBSb2xlIEFSTiBmb3IgJHtwcm9wcy5lbnZpcm9ubWVudH0gZW52aXJvbm1lbnRgLFxuICAgICAgZXhwb3J0TmFtZTogYEdpdEh1YkFjdGlvbnNSb2xlQXJuLSR7cHJvcHMuZW52aXJvbm1lbnR9YFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ09pZGNQcm92aWRlckFybicsIHtcbiAgICAgIHZhbHVlOiBgYXJuOmF3czppYW06OiR7dGhpcy5hY2NvdW50fTpvaWRjLXByb3ZpZGVyL3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tYCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnR2l0SHViIE9JREMgUHJvdmlkZXIgQVJOJ1xuICAgIH0pO1xuICB9XG59Il19
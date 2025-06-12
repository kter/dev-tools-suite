# GitHub Actions AWS OIDC Setup Guide

## 1. GitHub設定

### デフォルトブランチ変更
1. GitHubリポジトリページで **Settings** → **General** → **Default branch**
2. `develop` を選択してデフォルトブランチに設定
3. `main` ブランチは本番環境用として保持

### ブランチ戦略
- `develop` ブランチ → dev環境 (dev.devtools.site)
- `main` ブランチ → prd環境 (devtools.site)

## 2. AWS IAMロール作成（dev環境）

### GitHub OIDC プロバイダー作成
```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  --client-id-list sts.amazonaws.com \
  --profile dev
```

### IAMロール作成（dev環境用）
```bash
# Trust Policy作成
cat > github-actions-dev-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::031921999648:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:kter/dev-tools-suite:ref:refs/heads/develop"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::031921999648:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:kter/dev-tools-suite:environment:dev"
        }
      }
    }
  ]
}
EOF

# ロール作成
aws iam create-role \
  --role-name GitHubActions-DevToolsSuite-Dev \
  --assume-role-policy-document file://github-actions-dev-trust-policy.json \
  --profile dev

# CDK実行権限ポリシーをアタッチ
aws iam attach-role-policy \
  --role-name GitHubActions-DevToolsSuite-Dev \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess \
  --profile dev

# S3フルアクセス（デプロイ用）
aws iam attach-role-policy \
  --role-name GitHubActions-DevToolsSuite-Dev \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
  --profile dev

# CloudFrontフルアクセス（キャッシュ無効化用）
aws iam attach-role-policy \
  --role-name GitHubActions-DevToolsSuite-Dev \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess \
  --profile dev
```

### IAMロール作成（prd環境用）
```bash
# Trust Policy作成
cat > github-actions-prd-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_PRD_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:kter/dev-tools-suite:ref:refs/heads/main"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_PRD_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:kter/dev-tools-suite:environment:prd"
        }
      }
    }
  ]
}
EOF

# prd環境でも同様にOIDCプロバイダーとロール作成（プロファイルをprdに変更）
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  --client-id-list sts.amazonaws.com \
  --profile prd

aws iam create-role \
  --role-name GitHubActions-DevToolsSuite-Prd \
  --assume-role-policy-document file://github-actions-prd-trust-policy.json \
  --profile prd

# 必要なポリシーをアタッチ
aws iam attach-role-policy \
  --role-name GitHubActions-DevToolsSuite-Prd \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess \
  --profile prd

aws iam attach-role-policy \
  --role-name GitHubActions-DevToolsSuite-Prd \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
  --profile prd

aws iam attach-role-policy \
  --role-name GitHubActions-DevToolsSuite-Prd \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess \
  --profile prd
```

## 3. GitHub Variables設定

GitHub リポジトリの **Settings** → **Secrets and variables** → **Actions** → **Variables** タブで以下を設定：

### Repository Variables
- `AWS_ROLE_ARN_DEV`: `arn:aws:iam::031921999648:role/GitHubActions-DevToolsSuite-Dev`
- `AWS_ROLE_ARN_PRD`: `arn:aws:iam::YOUR_PRD_ACCOUNT_ID:role/GitHubActions-DevToolsSuite-Prd`

## 4. 動作確認

### dev環境テスト
```bash
# developブランチにプッシュしてdev環境デプロイをテスト
git checkout develop
git push origin develop
```

### prd環境テスト
```bash
# mainブランチにマージしてprd環境デプロイをテスト
git checkout main
git merge develop
git push origin main
```

## 5. セキュリティ考慮事項

- IAMロールの信頼ポリシーで特定のブランチのみに制限
- 最小権限の原則に従ったポリシー設定
- 定期的なアクセスログの監査
- 不要になったロールの削除

## 6. トラブルシューティング

### よくあるエラー
1. **OIDC認証エラー**: Trust Policyの条件を確認
2. **権限不足エラー**: IAMポリシーの追加
3. **S3アクセスエラー**: バケット名とリージョンを確認
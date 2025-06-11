このリポジトリは、エンジニア向けのユーティリティツールを集約したWebアプリ集です。各ツールは `tools/` 以下に独立したNuxt 3（SPA）アプリ、またはNuxt 3 + FastAPI構成として実装します。全体のインフラは TypeScript 製の AWS CDK で構築します。

---

## ✅ リポジトリ構成

repo-root/
├── tools/
│ ├── qr-generator/ # Nuxt 3 SPA
│ ├── mic-checker/ # Nuxt 3 SPA
│ ├── jwt-decoder/
│ │ ├── frontend/ # Nuxt 3 SPA
│ │ └── backend/ # FastAPI
│ ├── ip-calc/ # Nuxt 3 SPA
│ └── ... # 他のツールも同様に配置
├── infrastructure/
│ └── cdk/ # TypeScript CDK App
│ ├── lib/
│ │ └──各ツール用のS3バケット・CloudFront・API Gateway構築コード
│ └── bin/
│ └── deploy.ts
├── README.md
└── package.json

---

## 🔧 各ツールのルールと目的

- **Nuxt 3 を使用し SPA モード（`ssr: false`）で構築**
- 各アプリの `nuxt.config.ts` に `app.baseURL` をディレクトリ名に対応させる（例：`'/qr-generator/'`）
- バックエンドが必要なツールは `backend/` ディレクトリに FastAPI アプリを作成
- API Gateway + Lambda で FastAPI をデプロイ（CDKで構築）
- Nuxt の静的ビルド成果物は S3 にデプロイし、CloudFront 経由で配信
- ツールは完全に独立したルーティング・スタイリング・ビルドを持つ
- Tailwind CSS は利用可（強制ではない）

---

## 🌍 AWS CDK インフラ構成（infrastructure/cdk）

- 各ツールごとに S3バケット（静的SPA用）とCloudFrontディストリビューションを作成
- FastAPIを使うツールには：
  - Lambda（FastAPIのデプロイ）
  - API Gateway（エンドポイント公開）
- ドメイン管理があれば、Route 53とACMも導入可能（後で対応）

---

## 🛠️ 実装対象ツール（抜粋）

| ディレクトリ名 | 内容 | Nuxt | FastAPI |
|----------------|------|------|---------|
| `qr-generator` | QRコード生成（qrcode使用） | ✅ | ❌ |
| `mic-checker` | マイク波形、音量表示 | ✅ | ❌ |
| `jwt-decoder` | JWTペイロード表示 | ✅ | ✅ |
| `ip-calc` | CIDR・IP範囲計算 | ✅ | ❌ |
| `password-generator` | ランダムPW生成 | ✅ | ❌ |
| `json-yaml-converter` | JSON ⇔ YAML ⇔ TOML | ✅ | ❌ |
| `hash-generator` | SHA256などのハッシュ | ✅ | ❌ |
| `unix-time-converter` | UNIX ↔ ISO日時 | ✅ | ❌ |
| `cron-viewer` | Cron式を自然言語化 | ✅ | ❌ |
| `regex-tester` | 正規表現マッチ確認 | ✅ | ❌ |
| `lorem-ipsum` | ダミーテキスト生成 | ✅ | ❌ |
| `markdown-preview` | Markdownレンダリング | ✅ | ❌ |

---

## 🚀 最初にやりたいこと

以下の順で取り組みたい：

1. `tools/qr-generator/` に Nuxt 3 SPA を作成
   - 入力 → QRコード生成（`qrcode` ライブラリ）
   - `nuxt.config.ts` の `ssr: false`, `baseURL: '/qr-generator/'`
   - `npm run generate` で `dist/` 作成
2. `infrastructure/cdk/` に、qr-generator 用の S3 + CloudFront 構築コードを作成
3. `npm run cdk deploy` で S3に静的サイトをアップロードし、CloudFrontで配信
4. 他のツールも順次追加（mic-checker → jwt-decoder …）

---

## 📦 開発補足

- Nuxt 3の各ツールは完全独立（monorepoではない）
- ただし、ルートパッケージに `workspaces` を設定してもよい（任意）
- FastAPIアプリはAPI Gateway + Lambda(Python)で動かす前提
- S3デプロイ用に `aws s3 sync dist s3://bucket-name` コマンドを併用可


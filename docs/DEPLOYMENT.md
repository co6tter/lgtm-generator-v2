# Vercel Deployment Guide

このドキュメントは、LGTM Generator v2をVercelにデプロイする手順を説明します。

## 目次

- [必要な準備](#必要な準備)
- [環境変数の設定](#環境変数の設定)
- [Vercelプロジェクトの設定](#vercelプロジェクトの設定)
- [GitHub Actionsの設定](#github-actionsの設定)
- [デプロイメントの確認](#デプロイメントの確認)
- [トラブルシューティング](#トラブルシューティング)

## 必要な準備

### 1. Vercelアカウント

- [Vercel](https://vercel.com)にサインアップ
- GitHubアカウントと連携

### 2. 外部APIキーの取得

以下のサービスからAPIキーを取得してください:

1. **Unsplash API**
   - [https://unsplash.com/developers](https://unsplash.com/developers)
   - アカウント作成 → New Application → Access Keyを取得

2. **Pexels API**
   - [https://www.pexels.com/api/](https://www.pexels.com/api/)
   - アカウント作成 → API Keyを取得

3. **Pixabay API**
   - [https://pixabay.com/api/docs/](https://pixabay.com/api/docs/)
   - アカウント作成 → API Keyを取得

## 環境変数の設定

### Vercelでの設定

1. Vercelダッシュボードでプロジェクトを開く
2. Settings → Environment Variables
3. 以下の環境変数を追加:

#### Production環境

```bash
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PEXELS_API_KEY=your_pexels_api_key
PIXABAY_API_KEY=your_pixabay_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Preview環境

同じ変数をPreview環境にも設定することを推奨します。

## Vercelプロジェクトの設定

### 方法1: Vercel CLI (推奨)

```bash
# Vercel CLIのインストール
npm install -g vercel

# プロジェクトのルートディレクトリで実行
vercel

# プロジェクトの設定を確認
vercel env ls
```

### 方法2: Vercelダッシュボード

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New..." → "Project"
3. GitHubリポジトリを選択
4. 以下の設定を確認:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

## GitHub Actionsの設定

### 必要なシークレット

GitHub リポジトリの Settings → Secrets and variables → Actions で以下を設定:

```bash
VERCEL_TOKEN         # Vercel Settings → Tokens で生成
VERCEL_ORG_ID        # .vercel/project.json に記載
VERCEL_PROJECT_ID    # .vercel/project.json に記載
UNSPLASH_ACCESS_KEY  # Unsplash API Key
PEXELS_API_KEY       # Pexels API Key
PIXABAY_API_KEY      # Pixabay API Key
NEXT_PUBLIC_APP_URL  # デプロイ後のURL
```

### ワークフローの動作

- **PRマージ時**: Preview環境にデプロイ
- **mainブランチプッシュ時**: Production環境にデプロイ

## デプロイメントの確認

### 1. ヘルスチェック

デプロイ後、以下のエンドポイントで正常性を確認:

```bash
curl https://your-domain.vercel.app/healthz
```

期待されるレスポンス:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T12:00:00.000Z",
  "environment": "production",
  "uptime": 123.45
}
```

### 2. パフォーマンス確認

Vercel ダッシュボードで以下を確認:

- **Analytics**: ページビュー、ユニークビジター
- **Speed Insights**: Core Web Vitals (FCP, LCP, CLS)
- **Build Logs**: ビルドエラーの有無

### 3. セキュリティヘッダーの確認

```bash
curl -I https://your-domain.vercel.app
```

以下のヘッダーが含まれていることを確認:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

## パフォーマンス最適化

### 画像最適化

- Next.js Image Componentを使用
- AVIF/WebP形式に自動変換
- 遅延ロード (Lazy Loading) 有効化

### キャッシュ戦略

- **静的アセット**: `Cache-Control: public, max-age=31536000, immutable`
- **API レスポンス**: `s-maxage=1, stale-while-revalidate=59`
- **画像**: CDN経由で自動キャッシュ

### Edge Runtime

一部のAPIルートでEdge Runtimeを使用してレイテンシを削減:

```typescript
export const runtime = 'edge';
```

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build

# ログを確認
vercel logs
```

### 環境変数エラー

```bash
# 環境変数の確認
vercel env ls

# 環境変数の追加
vercel env add VARIABLE_NAME
```

### デプロイメントの再実行

```bash
# 最新のデプロイメントを再デプロイ
vercel --prod

# 特定のコミットをデプロイ
git push origin main --force-with-lease
```

### パフォーマンス問題

1. **Vercel Analytics** で遅いページを特定
2. **Lighthouse** でパフォーマンス監査
3. **Next.js Bundle Analyzer** でバンドルサイズを確認

```bash
npm install @next/bundle-analyzer
```

## モニタリング

### Vercel Analytics

- リアルタイムトラフィック監視
- Core Web Vitals追跡
- デバイス/ブラウザ分析

### エラートラッキング

本番環境でのエラーを監視するため、以下の統合を検討:

- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)
- [Datadog](https://www.datadoghq.com/)

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions for Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

## サポート

問題が発生した場合:

1. [GitHub Issues](https://github.com/co6tter/lgtm-generator-v2/issues)で報告
2. Vercelサポート: [https://vercel.com/support](https://vercel.com/support)

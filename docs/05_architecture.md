# アーキテクチャ設計書

**バージョン**: 1.0
**作成日**: 2025-11-08
**プロジェクト名**: LGTM Generator v2

---

## 1. システム概要

### 1.1 アーキテクチャパターン

**Jamstack Architecture**
- フロントエンド: React (Next.js App Router)
- API: Next.js API Routes (Serverless Functions)
- ホスティング: Vercel Edge Network
- データベース: なし（Phase 1）

### 1.2 設計原則

- **サーバーレスファースト**: 運用コスト最小化
- **エッジファースト**: 低レイテンシ、高速レスポンス
- **スケーラビリティ**: Vercel の自動スケーリング活用
- **セキュリティ**: API キー隠蔽、HTTPS 通信
- **パフォーマンス**: 画像最適化、コード分割

---

## 2. システム構成図

### 2.1 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                        Users (Browser)                       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Vercel Edge Network (CDN)                       │
│  - Static Assets Caching                                     │
│  - Edge Functions                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────────┐    ┌──────────────────────┐
│  Next.js Pages   │    │ Next.js API Routes   │
│  (Frontend)      │    │ (Serverless)         │
│                  │    │                      │
│ - React 18       │    │ - Image Search Proxy │
│ - Tailwind CSS   │    │ - Error Handling     │
│ - Canvas API     │    │ - Rate Limiting      │
└──────────────────┘    └──────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ↓              ↓              ↓
            ┌──────────────┐ ┌──────────┐ ┌──────────┐
            │  Unsplash    │ │  Pexels  │ │ Pixabay  │
            │     API      │ │   API    │ │   API    │
            └──────────────┘ └──────────┘ └──────────┘
```

### 2.2 フロントエンドアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                      App Router (Next.js 14+)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  app/                                                         │
│  ├─ layout.tsx              ← ルートレイアウト                │
│  ├─ page.tsx                ← トップページ                    │
│  ├─ search/                                                   │
│  │  └─ page.tsx            ← 検索結果ページ                   │
│  └─ error.tsx               ← エラー境界                      │
│                                                               │
│  components/                                                  │
│  ├─ Header.tsx                                                │
│  ├─ SearchBar.tsx                                             │
│  ├─ TabSelector.tsx                                           │
│  ├─ ImageGrid.tsx                                             │
│  ├─ ImageCard.tsx                                             │
│  ├─ PreviewModal.tsx                                          │
│  ├─ Pagination.tsx                                            │
│  └─ ui/                     ← 共通 UI コンポーネント          │
│     ├─ Button.tsx                                             │
│     ├─ LoadingSpinner.tsx                                     │
│     └─ ErrorMessage.tsx                                       │
│                                                               │
│  hooks/                                                       │
│  ├─ useSearch.ts            ← 画像検索ロジック                │
│  ├─ useLGTM.ts              ← LGTM 生成ロジック               │
│  └─ useLocalStorage.ts      ← ローカルストレージ管理          │
│                                                               │
│  lib/                                                         │
│  ├─ api-client.ts           ← API クライアント                │
│  ├─ image-processor.ts      ← Canvas 画像処理                 │
│  ├─ cache.ts                ← キャッシュ管理                  │
│  └─ utils.ts                ← ユーティリティ関数              │
│                                                               │
│  types/                                                       │
│  └─ index.ts                ← TypeScript 型定義               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 バックエンドアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Serverless)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  app/api/                                                     │
│  ├─ search/                                                   │
│  │  ├─ unsplash/                                              │
│  │  │  └─ route.ts          ← Unsplash 検索エンドポイント     │
│  │  ├─ pexels/                                                │
│  │  │  └─ route.ts          ← Pexels 検索エンドポイント       │
│  │  └─ pixabay/                                               │
│  │     └─ route.ts          ← Pixabay 検索エンドポイント      │
│  └─ health/                                                   │
│     └─ route.ts              ← ヘルスチェック                 │
│                                                               │
│  lib/api/                                                     │
│  ├─ unsplash-client.ts       ← Unsplash API クライアント      │
│  ├─ pexels-client.ts         ← Pexels API クライアント        │
│  ├─ pixabay-client.ts        ← Pixabay API クライアント       │
│  ├─ validators.ts            ← リクエストバリデーション        │
│  ├─ error-handler.ts         ← エラーハンドリング             │
│  └─ rate-limiter.ts          ← レート制限管理                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. データフロー

### 3.1 画像検索フロー

```
[ユーザー入力]
    ↓
[SearchBar コンポーネント]
    ↓
[useSearch カスタムフック]
    ↓
[API Client (SWR)]
    ↓ HTTP GET
[Next.js API Route]
    ↓
[バリデーション]
    ↓
[外部 API クライアント]
    ↓ HTTP GET
[External API (Unsplash/Pexels/Pixabay)]
    ↓ JSON Response
[データ変換（統一形式へ）]
    ↓
[Next.js API Route レスポンス]
    ↓ JSON Response
[SWR キャッシュ]
    ↓
[React State 更新]
    ↓
[ImageGrid レンダリング]
```

### 3.2 LGTM 生成フロー

```
[画像選択]
    ↓
[PreviewModal 表示]
    ↓
[useLGTM カスタムフック]
    ↓
[Canvas API で画像読み込み]
    ↓
[Canvas にテキスト描画]
    ↓
[Canvas → Data URL 変換]
    ↓
[プレビュー表示]
    ↓
[ユーザーアクション]
    ├─ コピー → クリップボード API
    └─ ダウンロード → Blob ダウンロード
```

---

## 4. 非機能要件（NFR）

### 4.1 パフォーマンス要件

| 項目 | 目標値 | 計測方法 |
|------|--------|---------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.0s | Lighthouse |
| API レスポンスタイム | < 1.0s | Server Logs |
| LGTM 生成時間 | < 1.0s | Performance API |

### 4.2 可用性要件

| 項目 | 目標値 | 対策 |
|------|--------|------|
| アップタイム | 99% 以上 | Vercel の SLA |
| エラー率 | < 1% | エラーハンドリング、リトライ |
| 障害復旧時間 | < 1 時間 | Vercel の自動復旧 |

### 4.3 スケーラビリティ要件

| 項目 | 目標値 | 対策 |
|------|--------|------|
| 同時接続ユーザー数 | 1,000+ | Vercel Auto-scaling |
| リクエスト処理能力 | 100 req/s | Edge Functions |
| ストレージ容量 | 不要 | ステートレス設計 |

### 4.4 セキュリティ要件

| 項目 | 対策 |
|------|------|
| HTTPS 通信 | Vercel 自動 SSL 証明書 |
| API キー保護 | 環境変数、Next.js API Routes |
| XSS 対策 | React の自動エスケープ、CSP ヘッダー |
| CSRF 対策 | GET のみ、認証なし |
| レート制限 | API Routes でレート制限実装 |

---

## 5. 技術スタック詳細

### 5.1 フロントエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|----------|------|
| フレームワーク | Next.js | 14+ | SSR, SSG, API Routes |
| UI ライブラリ | React | 18+ | コンポーネント構築 |
| 言語 | TypeScript | 5+ | 型安全性 |
| スタイリング | Tailwind CSS | 3+ | ユーティリティファースト CSS |
| 状態管理 | SWR | 2+ | データフェッチング、キャッシュ |
| フォーム | React Hook Form | 7+ | フォーム管理 |
| バリデーション | Zod | 3+ | スキーマ検証 |
| 画像処理 | Canvas API | - | LGTM テキスト合成 |

### 5.2 バックエンド

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| ランタイム | Next.js API Routes | サーバーレス関数 |
| ランタイム環境 | Vercel Edge Runtime | エッジコンピューティング |
| バリデーション | Zod | リクエスト検証 |
| HTTP クライアント | Fetch API | 外部 API 呼び出し |

### 5.3 外部サービス

| サービス | 用途 | プラン |
|---------|------|--------|
| Unsplash API | 画像検索（写真） | 無料（50 req/h） |
| Pexels API | 画像検索（写真） | 無料（200 req/h） |
| Pixabay API | 画像検索（写真+イラスト） | 無料（5,000 req/h） |
| Vercel | ホスティング、デプロイ | Hobby（無料） |

### 5.4 開発ツール

| ツール | 用途 |
|--------|------|
| ESLint | コード品質チェック |
| Prettier | コードフォーマット |
| TypeScript | 型チェック |
| Biome | 高速リンター（ESLint/Prettier 代替検討） |
| GitHub Actions | CI/CD |

---

## 6. デプロイメント

### 6.1 デプロイフロー

```
[開発者がコミット]
    ↓
[GitHub にプッシュ]
    ↓
[Vercel が自動検知]
    ↓
[ビルド実行]
    ├─ npm install
    ├─ TypeScript コンパイル
    ├─ Next.js ビルド
    └─ 静的アセット最適化
    ↓
[プレビューデプロイ（ブランチごと）]
    ↓
[main ブランチマージ]
    ↓
[本番デプロイ]
    ↓
[Edge Network に配信]
```

### 6.2 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `UNSPLASH_ACCESS_KEY` | Unsplash API キー | ✓ |
| `PEXELS_API_KEY` | Pexels API キー | ✓ |
| `PIXABAY_API_KEY` | Pixabay API キー | ✓ |
| `NEXT_PUBLIC_APP_URL` | アプリケーション URL | ✓ |
| `NODE_ENV` | 実行環境 | ✓ |

### 6.3 ビルド設定

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

## 7. 監視・運用

### 7.1 監視項目

| 項目 | ツール | アラート条件 |
|------|--------|------------|
| エラー率 | Vercel Analytics | > 5% |
| レスポンスタイム | Vercel Analytics | > 3s |
| アップタイム | Vercel Status | < 99% |
| API レート制限 | カスタムログ | 残り < 10% |

### 7.2 ログ管理

```typescript
// ログ出力例
console.log({
  level: 'INFO',
  timestamp: Date.now(),
  endpoint: '/api/search/unsplash',
  query: 'cat',
  duration: 234,
  statusCode: 200,
});
```

### 7.3 エラートラッキング

Phase 2 で Sentry 導入を検討:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 8. セキュリティアーキテクチャ

### 8.1 セキュリティレイヤー

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Network Security (HTTPS, Vercel Edge)             │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Application Security (CSP, CORS)                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: API Security (Rate Limiting, Validation)          │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Data Security (No PII, API Key Protection)        │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Content Security Policy (CSP)

```typescript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://images.unsplash.com https://images.pexels.com https://pixabay.com;
  font-src 'self';
  connect-src 'self' https://api.unsplash.com https://api.pexels.com https://pixabay.com;
  frame-ancestors 'none';
`;

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};
```

### 8.3 API キー保護

```
- 環境変数で管理（.env.local）
- Git にコミットしない（.gitignore）
- Vercel ダッシュボードで設定
- Next.js API Routes 経由のみアクセス
```

---

## 9. パフォーマンス最適化

### 9.1 画像最適化

```typescript
// Next.js Image コンポーネント使用
import Image from 'next/image';

<Image
  src={image.thumbnailUrl}
  alt={image.alt}
  width={300}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 9.2 コード分割

```typescript
// 動的インポート
import dynamic from 'next/dynamic';

const PreviewModal = dynamic(() => import('@/components/PreviewModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### 9.3 キャッシュ戦略

| リソース | 戦略 | TTL |
|---------|------|-----|
| 静的アセット | Vercel CDN | 1 年 |
| API レスポンス | SWR | 5 分 |
| 画像 | Browser Cache | 1 時間 |
| HTML ページ | Vercel Edge | 5 分 |

---

## 10. スケーリング戦略

### 10.1 水平スケーリング

- Vercel の自動スケーリング機能を活用
- Edge Functions による地理的分散
- CDN によるグローバル配信

### 10.2 垂直スケーリング

Phase 1 では不要（サーバーレスのため）

### 10.3 ボトルネック対策

| ボトルネック | 対策 |
|------------|------|
| API レート制限 | 複数 API 併用、キャッシュ |
| 画像読み込み | 遅延読み込み、WebP 形式 |
| Canvas 処理 | Web Worker 検討（Phase 2） |

---

## 11. ディザスタリカバリ

### 11.1 バックアップ戦略

- **コード**: GitHub リポジトリ
- **設定**: Vercel ダッシュボード
- **データ**: なし（ステートレス）

### 11.2 復旧手順

1. Vercel ダッシュボードで前のデプロイにロールバック
2. または、Git で前のコミットに戻してデプロイ
3. 環境変数の再設定（必要に応じて）

---

## 12. Phase 2 拡張アーキテクチャ

### 12.1 データベース導入（検討中）

```
- Vercel Postgres（お気に入り、履歴保存）
- または Supabase（無料プラン）
```

### 12.2 認証機能（検討中）

```
- NextAuth.js
- GitHub OAuth
```

### 12.3 アーキテクチャ拡張図

```
┌─────────────────────────────────────────────────────────────┐
│                        Users (Browser)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Vercel Edge Network                             │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────────┐    ┌──────────────────────┐
│  Next.js Pages   │    │ Next.js API Routes   │
└──────────────────┘    └──────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ↓              ↓              ↓
            ┌──────────────┐ ┌──────────┐ ┌─────────────┐
            │  External    │ │  Google  │ │   Vercel    │
            │  Image APIs  │ │  Search  │ │  Postgres   │
            └──────────────┘ └──────────┘ └─────────────┘
                                            (Phase 2)
```

---

## 13. 依存関係管理

### 13.1 package.json（主要依存）

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "swr": "^2.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 13.2 更新戦略

- 毎月 1 回、依存パッケージの更新確認
- セキュリティパッチは即座に適用
- メジャーバージョンアップは慎重に検証

---

## 改定履歴

| バージョン | 日付 | 変更者 | 変更内容 |
|----------|------|--------|---------|
| 1.0 | 2025-11-08 | Claude | 初版作成 |

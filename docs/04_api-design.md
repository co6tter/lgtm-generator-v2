# API 設計書

**バージョン**: 1.0
**作成日**: 2025-11-08
**プロジェクト名**: LGTM Generator v2

---

## 1. API 設計概要

### 1.1 設計方針

- **RESTful API**: REST 原則に準拠した設計
- **Next.js API Routes**: サーバーレス関数として実装
- **プロキシパターン**: 外部 API への直接アクセスを隠蔽
- **統一レスポンス**: 全エンドポイントで一貫した形式
- **エラーハンドリング**: 詳細なエラーコードとメッセージ

### 1.2 ベース URL

```
開発環境: http://localhost:3000/api
本番環境: https://lgtm-generator.vercel.app/api
```

---

## 2. エンドポイント一覧

| メソッド | エンドポイント | 説明 | 認証 |
|---------|--------------|------|------|
| GET | `/api/search/unsplash` | Unsplash 画像検索 | 不要 |
| GET | `/api/search/pexels` | Pexels 画像検索 | 不要 |
| GET | `/api/search/pixabay` | Pixabay 画像検索 | 不要 |
| GET | `/api/health` | ヘルスチェック | 不要 |

### Phase 2 で追加予定

| メソッド | エンドポイント | 説明 | 認証 |
|---------|--------------|------|------|
| GET | `/api/search/google` | Google 画像検索 | 不要 |

---

## 3. 共通仕様

### 3.1 リクエストヘッダー

```http
Content-Type: application/json
Accept: application/json
```

### 3.2 レスポンス形式

#### 成功レスポンス

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: number;        // Unix timestamp
    requestId?: string;       // リクエスト ID（デバッグ用）
  };
}
```

#### エラーレスポンス

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;             // エラーコード
    message: string;          // ユーザー向けメッセージ
    details?: unknown;        // 詳細情報（開発環境のみ）
  };
  meta?: {
    timestamp: number;
    requestId?: string;
  };
}
```

### 3.3 ステータスコード

| コード | 説明 | 使用例 |
|--------|------|--------|
| 200 | 成功 | 検索成功 |
| 400 | リクエスト不正 | バリデーションエラー |
| 429 | レート制限超過 | API 制限到達 |
| 500 | サーバーエラー | 予期しないエラー |
| 502 | 外部 API エラー | 外部 API からの不正なレスポンス |
| 503 | サービス利用不可 | メンテナンス中 |

### 3.4 エラーコード一覧

| コード | 説明 | HTTP ステータス |
|--------|------|----------------|
| `VALIDATION_ERROR` | バリデーションエラー | 400 |
| `MISSING_QUERY` | 検索クエリが未指定 | 400 |
| `INVALID_SOURCE` | 無効な検索ソース | 400 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `EXTERNAL_API_ERROR` | 外部 API エラー | 502 |
| `NETWORK_ERROR` | ネットワークエラー | 502 |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー | 500 |
| `SERVICE_UNAVAILABLE` | サービス利用不可 | 503 |

---

## 4. API 詳細仕様

### 4.1 Unsplash 画像検索

#### `GET /api/search/unsplash`

**説明**: Unsplash API を使用して画像を検索

**クエリパラメータ**:

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `query` | string | ✓ | - | 検索キーワード（2-100文字） |
| `page` | number | - | 1 | ページ番号（1以上） |
| `perPage` | number | - | 20 | 1ページあたりの件数（10-30） |

**リクエスト例**:

```http
GET /api/search/unsplash?query=cat&page=1&perPage=20
```

**成功レスポンス** (200):

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "unsplash_abc123",
        "url": "https://images.unsplash.com/photo-xxx?w=1080",
        "thumbnailUrl": "https://images.unsplash.com/photo-xxx?w=400",
        "width": 3000,
        "height": 2000,
        "photographer": "John Doe",
        "photographerUrl": "https://unsplash.com/@johndoe",
        "source": "unsplash",
        "sourceUrl": "https://unsplash.com/photos/abc123",
        "alt": "A cute cat",
        "tags": ["cat", "animal", "pet"]
      }
    ],
    "totalResults": 1234,
    "page": 1,
    "perPage": 20,
    "totalPages": 62
  },
  "meta": {
    "timestamp": 1699000000000
  }
}
```

**エラーレスポンス** (400):

```json
{
  "success": false,
  "error": {
    "code": "MISSING_QUERY",
    "message": "検索キーワードを入力してください"
  },
  "meta": {
    "timestamp": 1699000000000
  }
}
```

**エラーレスポンス** (429):

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "検索回数の上限に達しました。しばらく経ってから再度お試しください。"
  },
  "meta": {
    "timestamp": 1699000000000
  }
}
```

**レート制限**:
- 50 リクエスト/時間（Unsplash API の制限）

---

### 4.2 Pexels 画像検索

#### `GET /api/search/pexels`

**説明**: Pexels API を使用して画像を検索

**クエリパラメータ**:

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `query` | string | ✓ | - | 検索キーワード（2-100文字） |
| `page` | number | - | 1 | ページ番号（1以上） |
| `perPage` | number | - | 20 | 1ページあたりの件数（10-30） |

**リクエスト例**:

```http
GET /api/search/pexels?query=mountain&page=1&perPage=20
```

**成功レスポンス** (200):

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "pexels_456789",
        "url": "https://images.pexels.com/photos/456789/pexels-photo-456789.jpeg",
        "thumbnailUrl": "https://images.pexels.com/photos/456789/pexels-photo-456789.jpeg?auto=compress&cs=tinysrgb&w=400",
        "width": 4000,
        "height": 3000,
        "photographer": "Jane Smith",
        "photographerUrl": "https://www.pexels.com/@jane-smith",
        "source": "pexels",
        "sourceUrl": "https://www.pexels.com/photo/456789",
        "alt": "Mountain landscape"
      }
    ],
    "totalResults": 5678,
    "page": 1,
    "perPage": 20,
    "totalPages": 284
  },
  "meta": {
    "timestamp": 1699000000000
  }
}
```

**レート制限**:
- 200 リクエスト/時間（Pexels API の制限）

---

### 4.3 Pixabay 画像検索

#### `GET /api/search/pixabay`

**説明**: Pixabay API を使用して画像を検索（写真 + イラスト）

**クエリパラメータ**:

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `query` | string | ✓ | - | 検索キーワード（2-100文字） |
| `page` | number | - | 1 | ページ番号（1以上） |
| `perPage` | number | - | 20 | 1ページあたりの件数（10-30） |
| `imageType` | string | - | `all` | 画像タイプ: `photo`, `illustration`, `vector`, `all` |

**リクエスト例**:

```http
GET /api/search/pixabay?query=anime&page=1&perPage=20&imageType=illustration
```

**成功レスポンス** (200):

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "pixabay_789012",
        "url": "https://pixabay.com/get/xxx_1280.jpg",
        "thumbnailUrl": "https://pixabay.com/get/xxx_640.jpg",
        "width": 1920,
        "height": 1080,
        "photographer": "artist123",
        "photographerUrl": "https://pixabay.com/users/artist123-123456/",
        "source": "pixabay",
        "sourceUrl": "https://pixabay.com/illustrations/anime-789012/",
        "tags": ["anime", "manga", "character"]
      }
    ],
    "totalResults": 9012,
    "page": 1,
    "perPage": 20,
    "totalPages": 451
  },
  "meta": {
    "timestamp": 1699000000000
  }
}
```

**レート制限**:
- 5,000 リクエスト/時間（Pixabay API の制限）

---

### 4.4 ヘルスチェック

#### `GET /api/health`

**説明**: API の稼働状況を確認

**クエリパラメータ**: なし

**リクエスト例**:

```http
GET /api/health
```

**成功レスポンス** (200):

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": 1699000000000,
    "version": "1.0.0",
    "uptime": 123456
  }
}
```

---

## 5. レート制限

### 5.1 レート制限戦略

各 API のレート制限を監視し、超過時は適切なエラーを返す。

| API | 制限 | 対策 |
|-----|------|------|
| Unsplash | 50/時間 | キャッシュ、リトライ間隔 |
| Pexels | 200/時間 | キャッシュ |
| Pixabay | 5,000/時間 | 問題なし |

### 5.2 レート制限ヘッダー

```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1699003600
```

### 5.3 レート制限超過時の挙動

1. エラーコード `RATE_LIMIT_EXCEEDED` を返す
2. `Retry-After` ヘッダーで待機時間を通知
3. フロントエンドで別の検索ソースを提案

---

## 6. キャッシュ戦略

### 6.1 サーバーサイドキャッシュ

Next.js API Routes では Vercel Edge Network のキャッシュを活用。

```typescript
export const config = {
  runtime: 'edge', // Edge Runtime 使用
};

// レスポンスヘッダーにキャッシュ設定
res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
```

### 6.2 クライアントサイドキャッシュ

- SWR ライブラリで自動キャッシュ
- 5分間のキャッシュ保持
- バックグラウンド再検証

---

## 7. セキュリティ

### 7.1 API キー管理

```typescript
// 環境変数で API キーを管理
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// クライアントに露出しない
if (!UNSPLASH_ACCESS_KEY) {
  throw new Error('UNSPLASH_ACCESS_KEY is not defined');
}
```

### 7.2 CORS 設定

```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### 7.3 入力検証

```typescript
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(2).max(100),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(10).max(30).default(20),
});

// バリデーション実行
const result = searchSchema.safeParse(req.query);
if (!result.success) {
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: result.error.errors[0].message,
    },
  });
}
```

---

## 8. エラーハンドリング

### 8.1 エラーハンドリングフロー

```typescript
try {
  // API リクエスト
  const response = await fetch(apiUrl);

  if (!response.ok) {
    if (response.status === 429) {
      throw new APIError('RATE_LIMIT_EXCEEDED', 'レート制限超過');
    }
    throw new APIError('EXTERNAL_API_ERROR', '外部 API エラー');
  }

  const data = await response.json();
  return data;

} catch (error) {
  if (error instanceof APIError) {
    return res.status(getStatusCode(error.code)).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // 予期しないエラー
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'サーバーエラーが発生しました',
    },
  });
}
```

### 8.2 カスタムエラークラス

```typescript
class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

---

## 9. ロギング

### 9.1 ログレベル

| レベル | 用途 |
|--------|------|
| INFO | 正常なリクエスト |
| WARN | レート制限接近、遅延 |
| ERROR | API エラー、予期しない例外 |

### 9.2 ログ形式

```typescript
interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR';
  timestamp: number;
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number; // ミリ秒
  error?: string;
}

// 例
{
  "level": "INFO",
  "timestamp": 1699000000000,
  "endpoint": "/api/search/unsplash",
  "method": "GET",
  "statusCode": 200,
  "duration": 345
}
```

---

## 10. テスト

### 10.1 ユニットテスト

```typescript
describe('GET /api/search/unsplash', () => {
  it('should return images for valid query', async () => {
    const res = await fetch('/api/search/unsplash?query=cat');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.images).toBeInstanceOf(Array);
  });

  it('should return 400 for missing query', async () => {
    const res = await fetch('/api/search/unsplash');
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('MISSING_QUERY');
  });
});
```

### 10.2 統合テスト

```typescript
describe('Image Search Integration', () => {
  it('should search from multiple sources', async () => {
    const sources = ['unsplash', 'pexels', 'pixabay'];

    for (const source of sources) {
      const res = await fetch(`/api/search/${source}?query=cat`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
    }
  });
});
```

---

## 11. パフォーマンス

### 11.1 レスポンスタイム目標

| エンドポイント | 目標 | 最大 |
|--------------|------|------|
| `/api/search/*` | < 1s | < 3s |
| `/api/health` | < 100ms | < 500ms |

### 11.2 最適化手法

- Edge Runtime の使用
- API レスポンスの圧縮（gzip）
- 不要なデータの除外
- 並列リクエストの活用

---

## 12. OpenAPI 仕様

OpenAPI 3.0 形式の仕様書は別ファイルで管理予定:
- `docs/openapi.yaml`

---

## 13. Phase 2 拡張計画

### 13.1 Google 画像検索 API

```typescript
GET /api/search/google

クエリパラメータ:
- query: string (required)
- page: number (optional)
- perPage: number (optional)
- safeSearch: 'off' | 'moderate' | 'strict' (optional)
```

---

## 改定履歴

| バージョン | 日付 | 変更者 | 変更内容 |
|----------|------|--------|---------|
| 1.0 | 2025-11-08 | Claude | 初版作成 |

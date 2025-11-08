# データ設計書

**バージョン**: 1.0
**作成日**: 2025-11-08
**プロジェクト名**: LGTM Generator v2

---

## 1. データ設計概要

### 1.1 設計方針
- **データベース不使用**: Phase 1 では永続化層を持たない
- **クライアント状態管理**: React Hooks による状態管理
- **ローカルストレージ**: ブラウザのローカルストレージでキャッシュ
- **セッションストレージ**: 検索結果の一時保存

### 1.2 データフロー

```
External APIs (Unsplash/Pexels/Pixabay)
    ↓
Next.js API Routes (プロキシ・整形)
    ↓
Frontend State Management (React Context/Hooks)
    ↓
UI Components
    ↓
LocalStorage/SessionStorage (キャッシュ)
```

---

## 2. データモデル

### 2.1 型定義

#### 2.1.1 Image（画像データ）

```typescript
interface Image {
  // 共通フィールド
  id: string;                    // 一意識別子
  url: string;                   // 画像URL（オリジナルサイズ）
  thumbnailUrl: string;          // サムネイルURL
  width: number;                 // 画像幅（px）
  height: number;                // 画像高さ（px）

  // クレジット情報
  photographer: string;          // 撮影者/作者名
  photographerUrl?: string;      // 撮影者プロフィールURL
  source: ImageSource;           // 画像提供元
  sourceUrl: string;             // 元画像ページURL

  // メタデータ
  alt?: string;                  // 代替テキスト
  tags?: string[];               // タグ配列
}

type ImageSource = 'unsplash' | 'pexels' | 'pixabay';
```

#### 2.1.2 SearchResult（検索結果）

```typescript
interface SearchResult {
  query: string;                 // 検索クエリ
  source: ImageSource;           // 検索ソース
  images: Image[];               // 画像配列
  totalResults: number;          // 総件数
  page: number;                  // 現在のページ
  perPage: number;               // 1ページあたりの件数
  totalPages: number;            // 総ページ数
  timestamp: number;             // 検索実行時刻（Unix timestamp）
}
```

#### 2.1.3 LGTMImage（生成されたLGTM画像）

```typescript
interface LGTMImage {
  id: string;                    // 一意識別子
  originalImage: Image;          // 元画像情報
  dataUrl: string;               // Canvas から生成された Data URL
  text: string;                  // 重ねたテキスト（"LGTM"）
  createdAt: number;             // 生成日時（Unix timestamp）
}
```

#### 2.1.4 SearchHistory（検索履歴）

```typescript
interface SearchHistory {
  id: string;                    // 一意識別子
  query: string;                 // 検索クエリ
  source: ImageSource;           // 検索ソース
  timestamp: number;             // 検索日時（Unix timestamp）
}
```

#### 2.1.5 AppState（アプリケーション状態）

```typescript
interface AppState {
  // 検索状態
  searchQuery: string;           // 現在の検索クエリ
  selectedSource: ImageSource;   // 選択中の検索ソース
  searchResults: SearchResult | null;  // 検索結果
  isSearching: boolean;          // 検索中フラグ

  // ページネーション
  currentPage: number;           // 現在のページ

  // 選択画像
  selectedImage: Image | null;   // 選択された画像

  // LGTM 生成状態
  lgtmImage: LGTMImage | null;   // 生成された LGTM 画像
  isGenerating: boolean;         // 生成中フラグ

  // UI 状態
  isPreviewModalOpen: boolean;   // プレビューモーダル表示フラグ

  // エラー状態
  error: AppError | null;        // エラー情報
}
```

#### 2.1.6 AppError（エラー情報）

```typescript
interface AppError {
  code: ErrorCode;               // エラーコード
  message: string;               // エラーメッセージ
  details?: unknown;             // 詳細情報
  timestamp: number;             // 発生日時（Unix timestamp）
}

type ErrorCode =
  | 'API_RATE_LIMIT'              // API レート制限
  | 'API_ERROR'                   // API エラー
  | 'NETWORK_ERROR'               // ネットワークエラー
  | 'GENERATION_ERROR'            // LGTM 生成エラー
  | 'VALIDATION_ERROR';           // バリデーションエラー
```

---

## 3. API レスポンス型定義

### 3.1 Unsplash API レスポンス

#### 検索エンドポイント: `/api/search/unsplash`

**Request**:
```typescript
interface UnsplashSearchRequest {
  query: string;                 // 検索クエリ
  page?: number;                 // ページ番号（デフォルト: 1）
  perPage?: number;              // 1ページあたりの件数（デフォルト: 20）
}
```

**Response**:
```typescript
interface UnsplashSearchResponse {
  success: boolean;
  data?: {
    images: Image[];
    totalResults: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  error?: {
    code: ErrorCode;
    message: string;
  };
}
```

### 3.2 Pexels API レスポンス

#### 検索エンドポイント: `/api/search/pexels`

**Request**:
```typescript
interface PexelsSearchRequest {
  query: string;
  page?: number;
  perPage?: number;
}
```

**Response**:
```typescript
interface PexelsSearchResponse {
  success: boolean;
  data?: {
    images: Image[];
    totalResults: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  error?: {
    code: ErrorCode;
    message: string;
  };
}
```

### 3.3 Pixabay API レスポンス

#### 検索エンドポイント: `/api/search/pixabay`

**Request**:
```typescript
interface PixabaySearchRequest {
  query: string;
  page?: number;
  perPage?: number;
  imageType?: 'photo' | 'illustration' | 'vector';  // 画像タイプ
}
```

**Response**:
```typescript
interface PixabaySearchResponse {
  success: boolean;
  data?: {
    images: Image[];
    totalResults: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  error?: {
    code: ErrorCode;
    message: string;
  };
}
```

---

## 4. ローカルストレージ設計

### 4.1 保存データ

#### キャッシュキー命名規則
```
lgtm_generator_{データ種別}_{識別子}
```

#### 保存項目

| キー | データ型 | 説明 | 有効期限 |
|------|---------|------|---------|
| `lgtm_generator_search_cache` | `SearchResult[]` | 検索結果キャッシュ | 5分 |
| `lgtm_generator_search_history` | `SearchHistory[]` | 検索履歴 | 30日 |
| `lgtm_generator_favorites` | `Image[]` | お気に入り画像（Phase 2） | 無期限 |
| `lgtm_generator_settings` | `UserSettings` | ユーザー設定 | 無期限 |

### 4.2 UserSettings（ユーザー設定）

```typescript
interface UserSettings {
  defaultSource: ImageSource;    // デフォルト検索ソース
  perPage: number;               // 1ページあたりの表示件数
  theme?: 'light' | 'dark';      // テーマ（Phase 2）
}
```

### 4.3 キャッシュ管理

```typescript
interface CacheEntry<T> {
  data: T;                       // キャッシュデータ
  timestamp: number;             // 保存日時（Unix timestamp）
  ttl: number;                   // 有効期限（秒）
}

// キャッシュヘルパー関数
function setCache<T>(key: string, data: T, ttl: number): void;
function getCache<T>(key: string): T | null;
function clearExpiredCache(): void;
```

---

## 5. セッションストレージ設計

### 5.1 保存データ

| キー | データ型 | 説明 |
|------|---------|------|
| `lgtm_generator_current_search` | `SearchResult` | 現在の検索結果 |
| `lgtm_generator_selected_image` | `Image` | 選択中の画像 |

---

## 6. データ変換層

### 6.1 API レスポンス → 内部モデル変換

各外部 API のレスポンスを統一的な `Image` 型に変換する。

#### Unsplash 変換関数

```typescript
function convertUnsplashToImage(unsplashPhoto: UnsplashPhoto): Image {
  return {
    id: `unsplash_${unsplashPhoto.id}`,
    url: unsplashPhoto.urls.regular,
    thumbnailUrl: unsplashPhoto.urls.small,
    width: unsplashPhoto.width,
    height: unsplashPhoto.height,
    photographer: unsplashPhoto.user.name,
    photographerUrl: unsplashPhoto.user.links.html,
    source: 'unsplash',
    sourceUrl: unsplashPhoto.links.html,
    alt: unsplashPhoto.alt_description || undefined,
    tags: unsplashPhoto.tags?.map(tag => tag.title),
  };
}
```

#### Pexels 変換関数

```typescript
function convertPexelsToImage(pexelsPhoto: PexelsPhoto): Image {
  return {
    id: `pexels_${pexelsPhoto.id}`,
    url: pexelsPhoto.src.large,
    thumbnailUrl: pexelsPhoto.src.medium,
    width: pexelsPhoto.width,
    height: pexelsPhoto.height,
    photographer: pexelsPhoto.photographer,
    photographerUrl: pexelsPhoto.photographer_url,
    source: 'pexels',
    sourceUrl: pexelsPhoto.url,
    alt: pexelsPhoto.alt,
  };
}
```

#### Pixabay 変換関数

```typescript
function convertPixabayToImage(pixabayImage: PixabayImage): Image {
  return {
    id: `pixabay_${pixabayImage.id}`,
    url: pixabayImage.largeImageURL,
    thumbnailUrl: pixabayImage.webformatURL,
    width: pixabayImage.imageWidth,
    height: pixabayImage.imageHeight,
    photographer: pixabayImage.user,
    photographerUrl: `https://pixabay.com/users/${pixabayImage.user}-${pixabayImage.user_id}/`,
    source: 'pixabay',
    sourceUrl: pixabayImage.pageURL,
    tags: pixabayImage.tags.split(',').map(tag => tag.trim()),
  };
}
```

---

## 7. データ検証

### 7.1 バリデーションスキーマ

#### 検索クエリ検証

```typescript
const searchQuerySchema = z.object({
  query: z.string()
    .min(2, '検索キーワードは2文字以上で入力してください')
    .max(100, '検索キーワードは100文字以内で入力してください'),
  source: z.enum(['unsplash', 'pexels', 'pixabay']),
  page: z.number().min(1).optional(),
  perPage: z.number().min(10).max(50).optional(),
});

type SearchQueryInput = z.infer<typeof searchQuerySchema>;
```

#### 画像データ検証

```typescript
const imageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
  photographer: z.string(),
  photographerUrl: z.string().url().optional(),
  source: z.enum(['unsplash', 'pexels', 'pixabay']),
  sourceUrl: z.string().url(),
  alt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ImageInput = z.infer<typeof imageSchema>;
```

---

## 8. データ整合性

### 8.1 一意性制約

- `Image.id`: 必ず一意（`{source}_{original_id}` 形式）
- `SearchHistory.id`: UUID v4 で生成

### 8.2 NULL 許容

- `Image.photographerUrl`: オプショナル（Pixabay で取得できない場合がある）
- `Image.alt`: オプショナル（全APIで提供されるとは限らない）
- `Image.tags`: オプショナル（Pexels では提供されない）

### 8.3 デフォルト値

```typescript
const DEFAULT_PER_PAGE = 20;
const DEFAULT_PAGE = 1;
const DEFAULT_SOURCE: ImageSource = 'unsplash';
const CACHE_TTL = 5 * 60; // 5分（秒）
```

---

## 9. データライフサイクル

### 9.1 検索結果のライフサイクル

```
1. ユーザーが検索実行
   ↓
2. API リクエスト
   ↓
3. レスポンス受信・変換
   ↓
4. AppState に保存
   ↓
5. SessionStorage に保存
   ↓
6. LocalStorage にキャッシュ（5分間）
   ↓
7. ページリロード時、キャッシュから復元（有効期限内）
   ↓
8. 有効期限切れ時、キャッシュ削除
```

### 9.2 LGTM 画像のライフサイクル

```
1. ユーザーが画像選択
   ↓
2. Canvas で LGTM テキスト合成
   ↓
3. Data URL 生成
   ↓
4. LGTMImage オブジェクト作成
   ↓
5. AppState に保存
   ↓
6. ユーザーアクション（コピー or ダウンロード）
   ↓
7. モーダルクローズ時、メモリ解放
```

---

## 10. パフォーマンス考慮事項

### 10.1 画像データの最適化

- サムネイルURL を優先的に使用（ImageGrid）
- フルサイズ画像は必要時のみ読み込み（プレビューモーダル）
- Intersection Observer で遅延読み込み

### 10.2 キャッシュ戦略

- 同じクエリの再検索を防ぐ
- 検索履歴から過去のクエリを再利用
- 期限切れキャッシュの自動削除

### 10.3 メモリ管理

- Data URL は必要時のみ生成
- Canvas 要素は使用後に破棄
- 大きなオブジェクトは適切にクリーンアップ

---

## 11. セキュリティ

### 11.1 XSS 対策

- ユーザー入力は必ずエスケープ
- Data URL は信頼できるソースのみ
- `dangerouslySetInnerHTML` は使用しない

### 11.2 データサニタイゼーション

```typescript
function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '') // HTML タグ除去
    .slice(0, 100); // 最大長制限
}
```

### 11.3 API キー保護

- API キーは環境変数で管理
- クライアントに露出しない（Next.js API Routes 経由）
- レート制限の監視

---

## 12. Phase 2 拡張計画

### 12.1 追加データモデル

```typescript
// お気に入り機能
interface Favorite {
  id: string;
  image: Image;
  addedAt: number;
}

// LGTM 履歴
interface LGTMHistory {
  id: string;
  lgtmImage: LGTMImage;
  createdAt: number;
}

// カスタムテキスト設定
interface TextSettings {
  text: string;
  fontSize: number;
  color: string;
  position: 'center' | 'top' | 'bottom';
}
```

---

## 改定履歴

| バージョン | 日付 | 変更者 | 変更内容 |
|----------|------|--------|---------|
| 1.0 | 2025-11-08 | Claude | 初版作成 |

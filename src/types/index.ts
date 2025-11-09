export type ImageSource = "unsplash" | "pexels" | "pixabay";
export type ImageType = "photo" | "illustration";

export interface Image {
  // 共通フィールド
  id: string; // 一意識別子
  url: string; // 画像URL（オリジナルサイズ）
  thumbnailUrl: string; // サムネイルURL
  width: number; // 画像幅（px）
  height: number; // 画像高さ（px）

  // クレジット情報
  photographer: string; // 撮影者/作者名
  photographerUrl?: string; // 撮影者プロフィールURL
  source: ImageSource; // 画像提供元
  sourceUrl: string; // 元画像ページURL

  // メタデータ
  alt?: string; // 代替テキスト
  tags?: string[]; // タグ配列
}

export interface SearchResult {
  query: string; // 検索クエリ
  source: ImageSource; // 検索ソース
  images: Image[]; // 画像配列
  totalResults: number; // 総件数
  page: number; // 現在のページ
  perPage: number; // 1ページあたりの件数
  totalPages: number; // 総ページ数
  timestamp: number; // 検索実行時刻（Unix timestamp）
}

export interface LGTMImage {
  id: string; // 一意識別子
  originalImage: Image; // 元画像情報
  dataUrl: string; // Canvas から生成された Data URL
  text: string; // 重ねたテキスト（"LGTM"）
  createdAt: number; // 生成日時（Unix timestamp）
}

export type ErrorCode =
  | "API_RATE_LIMIT" // API レート制限
  | "API_ERROR" // API エラー
  | "NETWORK_ERROR" // ネットワークエラー
  | "GENERATION_ERROR" // LGTM 生成エラー
  | "VALIDATION_ERROR"; // バリデーションエラー

export interface AppError {
  code: ErrorCode; // エラーコード
  message: string; // エラーメッセージ
  details?: unknown; // 詳細情報
  timestamp: number; // 発生日時（Unix timestamp）
}

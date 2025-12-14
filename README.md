# lgtm-generator-v2

## Overview

LGTM Generator v2は、複数の画像APIを利用してLGTM（Looks Good To Me）画像を簡単に生成できるWebアプリケーションです。Unsplash、Pexels、Pixabayの3つの画像ソースから画像を検索し、LGTM画像として加工・ダウンロードすることができます。

主な機能：
- 複数の画像API（Unsplash、Pexels、Pixabay）からの画像検索
- LGTM画像のプレビュー表示
- 画像のコピー・ダウンロード機能
- ダークモード対応
- レスポンシブデザイン
- 画像の自動リサイズ（400px、JPEG形式）

## Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Data Fetching**: SWR 2.3.6
- **Validation**: Zod 4.1.12
- **Testing**: Vitest 4.0.8, Playwright 1.56.1, Testing Library
- **Code Quality**: Biome 2.2.0
- **Git Hooks**: Lefthook 2.0.2

## Setup

### 必要な環境

- Node.js 20以上
- 各画像APIのAPIキー（Unsplash、Pexels、Pixabay）

### インストール手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd lgtm-generator-v2
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定

`.env.local`ファイルを作成し、以下の環境変数を設定します：

```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PEXELS_API_KEY=your_pexels_api_key
PIXABAY_API_KEY=your_pixabay_api_key
```

4. 開発サーバーを起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアプリケーションを確認できます。

### その他のコマンド

```bash
# ビルド
npm run build

# 本番環境で起動
npm start

# リント
npm run lint

# フォーマット
npm run format

# テスト実行
npm test

# テストカバレッジ
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

## Usage

1. トップページで画像ソース（Unsplash、Pexels、Pixabay）を選択
2. 検索バーにキーワードを入力して画像を検索
3. 検索結果から気に入った画像をクリック
4. プレビューモーダルで画像を確認
5. LGTM画像をコピーまたはダウンロード

## Directory Structure

```
lgtm-generator-v2/
├── docs/                       # プロジェクトドキュメント
│   ├── 01_requirements.md     # 要件定義
│   ├── 02_uiux-design.md      # UI/UXデザイン
│   ├── 03_data-design.md      # データ設計
│   ├── 04_api-design.md       # API設計
│   ├── 05_architecture.md     # アーキテクチャ設計
│   └── DEPLOYMENT.md          # デプロイメント
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # APIルート
│   │   │   ├── health/       # ヘルスチェック
│   │   │   └── search/       # 画像検索API（各ソース）
│   │   ├── search/           # 検索結果ページ
│   │   ├── globals.css       # グローバルスタイル
│   │   ├── layout.tsx        # ルートレイアウト
│   │   └── page.tsx          # トップページ
│   ├── components/            # Reactコンポーネント
│   │   ├── image/            # 画像関連コンポーネント
│   │   ├── layout/           # レイアウトコンポーネント
│   │   ├── modal/            # モーダルコンポーネント
│   │   ├── search/           # 検索関連コンポーネント
│   │   └── ui/               # 汎用UIコンポーネント
│   ├── hooks/                 # カスタムReact hooks
│   ├── lib/                   # ライブラリとユーティリティ
│   │   └── api/              # API関連ユーティリティ
│   └── types/                 # TypeScript型定義
├── biome.json                 # Biome設定
├── lefthook.yml               # Git hooks設定
├── next.config.ts             # Next.js設定
├── package.json               # プロジェクト依存関係
├── postcss.config.mjs         # PostCSS設定
├── tailwind.config.ts         # Tailwind CSS設定
└── tsconfig.json              # TypeScript設定
```

## License

This repository is for personal/private use only.

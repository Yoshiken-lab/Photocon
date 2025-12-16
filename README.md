# Kids Photo Contest

子供向け写真コンテストのWebアプリケーションです。

## プロジェクト構成

```
photocon/
├── photo-con.html          # ランディングページ（LP）
├── logo.png                # ロゴ画像
├── top.png                 # トップ画像
└── photocon-system/        # 管理システム（Next.js）
    ├── app/
    │   ├── admin/          # 管理画面
    │   ├── gallery/        # ギャラリーページ
    │   ├── ranking/        # ランキングページ
    │   └── submit/         # 投稿ページ
    ├── components/         # Reactコンポーネント
    ├── lib/                # ライブラリ（Supabase, Instagram API）
    └── docs/               # ドキュメント
```

## ローカル環境での起動方法

### 1. ランディングページ（LP）

シンプルなHTMLファイルなので、以下のいずれかの方法で表示できます。

#### 方法A: Pythonサーバー

```bash
cd photocon
python -m http.server 8000
```

アクセス: **http://localhost:8000/photo-con.html**

#### 方法B: ファイルを直接開く

`photo-con.html` をブラウザにドラッグ＆ドロップ、またはダブルクリック

#### 方法C: VSCode Live Server

1. VSCodeで「Live Server」拡張機能をインストール
2. `photo-con.html` を右クリック → 「Open with Live Server」

---

### 2. 管理システム（Next.js）

#### 初回セットアップ

```bash
cd photocon-system
npm install
```

#### 環境変数の設定

`.env.local` ファイルを作成し、以下を設定:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
```

#### 開発サーバーの起動

```bash
npm run dev
```

#### アクセスURL

| ページ | URL |
|--------|-----|
| トップページ | http://localhost:3000 |
| ギャラリー | http://localhost:3000/gallery |
| ランキング | http://localhost:3000/ranking |
| 投稿ページ | http://localhost:3000/submit |
| **管理ダッシュボード** | http://localhost:3000/admin |
| 応募一覧 | http://localhost:3000/admin/entries |
| コンテスト管理 | http://localhost:3000/admin/contests |
| 設定 | http://localhost:3000/admin/settings |

---

## 技術スタック

### ランディングページ
- HTML5
- Tailwind CSS (CDN)
- Lucide Icons
- Google Fonts (Kiwi Maru, Noto Sans JP)

### 管理システム
- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- Supabase (データベース・認証)
- Instagram API連携

---

## 主な機能

### ランディングページ
- コンテスト紹介
- 参加方法の説明（3ステップ）
- ギャラリープレビュー
- 応募CTA

### 管理システム
- **ダッシュボード**: 統計情報（総応募数、審査待ち、承認済み、投票数）
- **応募管理**: ステータス変更（承認/却下/再審査）
- **コンテスト管理**: コンテスト・部門の作成・編集
- **設定**: Instagram連携、自動収集設定
- **ギャラリー**: 投稿作品の閲覧・投票
- **ランキング**: 人気作品ランキング

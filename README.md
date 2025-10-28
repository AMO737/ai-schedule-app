# AIスケジュール調整アプリ

授業・バイト・サークルなどの固定予定を登録して、「週○時間勉強したい」をAIに伝えるだけで、自動で空き時間に勉強ブロックを作ってリマインドしてくれるアプリです。

## 🎯 主な機能

### MVP機能（実装済み）
- ✅ **固定予定登録**: 授業・バイト・サークルなどの繰り返し予定を登録
- ✅ **学習目標設定**: 週の学習時間と科目配分を設定
- ✅ **自動ブロック生成**: AIが空き時間に学習ブロックを自動配置
- ✅ **今日のプラン表示**: 現在の学習ブロックと今後の予定を表示
- ✅ **進捗追跡**: 週間の学習進捗と達成率を表示
- ✅ **Google OAuth認証**: セキュアな認証システム

### 将来の拡張機能
- 🔄 **リマインド通知システム**: 開始5分前と未実施時の通知
- 📅 **カレンダー表示**: 自動配置された勉強ブロックの可視化
- 📊 **詳細レポート**: 科目別学習時間グラフと未達タスク一覧
- 🎯 **試験逆算モード**: 配点・難度で自動スケジュール
- 🤖 **AI勉強提案**: 最適な学習順序の自動提示
- 👥 **友達と同期**: 学習達成率の共有機能

## 🚀 セットアップ手順

### 1. 前提条件
- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- Google Cloud Consoleアカウント（OAuth認証用）

### 2. プロジェクトのクローンとインストール
```bash
git clone <repository-url>
cd ai-schedule-app
npm install
```

### 3. 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Google OAuth Configuration
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
```

**⚠️ 重要**: 
- Supabase URLは`https://`で始まり、末尾のスラッシュなしで指定してください
- プレースホルダー値（`placeholder.supabase.co`、`your-project`など）は使用できません。ビルド時にエラーになります
- Vercelでデプロイする場合、本番環境とプレビュー環境の両方で環境変数を設定してください

#### Vercel環境変数の設定方法
1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. 以下の変数を Production と Preview の両方に追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. 環境変数を変更したら **必ず再デプロイ**してください（Next.jsはビルド時に環境変数を焼き込みます）

### 4. Supabaseのセットアップ

#### 4.1 新しいSupabaseプロジェクトを作成
1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

#### 4.2 データベースの初期化
```bash
# Supabase CLIをインストール（まだの場合）
npm install -g supabase

# プロジェクトにログイン
supabase login

# マイグレーションを実行
supabase db push
```

または、SupabaseダッシュボードでSQLエディタを使用して、`supabase/migrations/001_initial_schema.sql`の内容を実行してください。

### 5. Google OAuthのセットアップ

#### 5.1 Google Cloud Consoleでプロジェクトを作成
1. [Google Cloud Console](https://console.cloud.google.com)にアクセス
2. 新しいプロジェクトを作成
3. Google+ APIを有効化

#### 5.2 OAuth 2.0認証情報を作成
1. 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアント ID」
2. アプリケーションの種類: 「ウェブアプリケーション」
3. 承認済みのリダイレクト URI: `http://localhost:3000/auth/callback`

### 6. アプリケーションの起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認してください。

## 🏗️ アーキテクチャ

### 技術スタック
- **フロントエンド**: Next.js 16, TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Edge Functions)
- **認証**: Supabase Auth + Google OAuth
- **UIコンポーネント**: Radix UI, Lucide React
- **状態管理**: React Hooks + Context API

### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
│   ├── auth/              # 認証関連コンポーネント
│   ├── dashboard/         # ダッシュボードコンポーネント
│   ├── fixed-events/      # 固定予定管理コンポーネント
│   ├── learning-goals/    # 学習目標管理コンポーネント
│   └── ui/                # 再利用可能なUIコンポーネント
├── lib/                   # ユーティリティとサービス
│   ├── auth.ts           # 認証サービス
│   ├── fixed-events.ts   # 固定予定サービス
│   ├── learning-goals.ts # 学習目標サービス
│   ├── study-blocks.ts   # 学習ブロックサービス
│   ├── schedule-algorithm.ts # スケジュール生成アルゴリズム
│   ├── supabase.ts       # Supabaseクライアント
│   └── utils.ts          # ユーティリティ関数
└── types/                 # TypeScript型定義
```

## 🔧 開発ガイド

### 新しい機能の追加
1. `src/types/index.ts`で型定義を追加
2. `src/lib/`でサービス層を実装
3. `src/components/`でUIコンポーネントを作成
4. `src/app/`でページルートを追加

### データベースの変更
1. `supabase/migrations/`に新しいマイグレーションファイルを作成
2. `supabase db push`でマイグレーションを実行
3. 必要に応じて`src/types/index.ts`の型定義を更新

## 📱 使用方法

詳細な使い方は[USER_GUIDE.md](./USER_GUIDE.md)をご覧ください。

### 1. 初回セットアップ
1. Googleアカウントでログイン
2. 固定予定（授業・バイト・サークル）を登録
3. 学習目標（週時間・科目配分）を設定

### 2. 日常の使用
1. ホーム画面で今日の学習プランを確認
2. 学習ブロックを完了またはスキップ
3. 週間進捗で学習状況を確認
4. 必要に応じてスケジュールを再生成

## 🚀 デプロイ

このアプリを本番環境にデプロイする手順は[DEPLOYMENT.md](./DEPLOYMENT.md)をご覧ください。

### 簡単デプロイ（Vercel）

1. このリポジトリをGitHubにプッシュ
2. [Vercel](https://vercel.com)にアクセス
3. GitHubリポジトリをインポート
4. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. デプロイ完了！

### デプロイ後の確認手順

1. **セーフモードで確認**
   - `https://your-app.vercel.app/?safe=1` にアクセス
   - 正常に起動することを確認

2. **通常モードで確認**
   - `https://your-app.vercel.app` にアクセス
   - ログイン・データ保存などの基本機能を確認

3. **エラーチェック**
   - ブラウザのコンソールでエラーが出ていないか確認
   - `/api/log-client-error` にエラーが送信されていないか確認（Vercelログで確認）

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合や質問がある場合は、GitHubのIssuesページでお知らせください。

---

**注意**: このアプリは開発中のMVPです。本格的な運用前に、セキュリティ設定やエラーハンドリングの確認をお勧めします。
### 3. 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Google OAuth Configuration
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
```

**⚠️ 重要**: 
- Supabase URLは`https://`で始まり、末尾のスラッシュなしで指定してください
- プレースホルダー値（`placeholder.supabase.co`、`your-project`など）は使用できません。ビルド時にエラーになります
- Vercelでデプロイする場合、本番環境とプレビュー環境の両方で環境変数を設定してください

#### Vercel環境変数の設定方法
1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. 以下の変数を Production と Preview の両方に追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. 環境変数を変更したら **必ず再デプロイ**してください（Next.jsはビルド時に環境変数を焼き込みます）

### 4. Supabaseのセットアップ

#### 4.1 新しいSupabaseプロジェクトを作成
1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

#### 4.2 データベースの初期化
```bash
# Supabase CLIをインストール（まだの場合）
npm install -g supabase

# プロジェクトにログイン
supabase login

# マイグレーションを実行
supabase db push
```

または、SupabaseダッシュボードでSQLエディタを使用して、`supabase/migrations/001_initial_schema.sql`の内容を実行してください。

### 5. Google OAuthのセットアップ

#### 5.1 Google Cloud Consoleでプロジェクトを作成
1. [Google Cloud Console](https://console.cloud.google.com)にアクセス
2. 新しいプロジェクトを作成
3. Google+ APIを有効化

#### 5.2 OAuth 2.0認証情報を作成
1. 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアント ID」
2. アプリケーションの種類: 「ウェブアプリケーション」
3. 承認済みのリダイレクト URI: `http://localhost:3000/auth/callback`

### 6. アプリケーションの起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認してください。

## 🏗️ アーキテクチャ

### 技術スタック
- **フロントエンド**: Next.js 16, TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Edge Functions)
- **認証**: Supabase Auth + Google OAuth
- **UIコンポーネント**: Radix UI, Lucide React
- **状態管理**: React Hooks + Context API

### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
│   ├── auth/              # 認証関連コンポーネント
│   ├── dashboard/         # ダッシュボードコンポーネント
│   ├── fixed-events/      # 固定予定管理コンポーネント
│   ├── learning-goals/    # 学習目標管理コンポーネント
│   └── ui/                # 再利用可能なUIコンポーネント
├── lib/                   # ユーティリティとサービス
│   ├── auth.ts           # 認証サービス
│   ├── fixed-events.ts   # 固定予定サービス
│   ├── learning-goals.ts # 学習目標サービス
│   ├── study-blocks.ts   # 学習ブロックサービス
│   ├── schedule-algorithm.ts # スケジュール生成アルゴリズム
│   ├── supabase.ts       # Supabaseクライアント
│   └── utils.ts          # ユーティリティ関数
└── types/                 # TypeScript型定義
```

## 🔧 開発ガイド

### 新しい機能の追加
1. `src/types/index.ts`で型定義を追加
2. `src/lib/`でサービス層を実装
3. `src/components/`でUIコンポーネントを作成
4. `src/app/`でページルートを追加

### データベースの変更
1. `supabase/migrations/`に新しいマイグレーションファイルを作成
2. `supabase db push`でマイグレーションを実行
3. 必要に応じて`src/types/index.ts`の型定義を更新

## 📱 使用方法

詳細な使い方は[USER_GUIDE.md](./USER_GUIDE.md)をご覧ください。

### 1. 初回セットアップ
1. Googleアカウントでログイン
2. 固定予定（授業・バイト・サークル）を登録
3. 学習目標（週時間・科目配分）を設定

### 2. 日常の使用
1. ホーム画面で今日の学習プランを確認
2. 学習ブロックを完了またはスキップ
3. 週間進捗で学習状況を確認
4. 必要に応じてスケジュールを再生成

## 🚀 デプロイ

このアプリを本番環境にデプロイする手順は[DEPLOYMENT.md](./DEPLOYMENT.md)をご覧ください。

### 簡単デプロイ（Vercel）

1. このリポジトリをGitHubにプッシュ
2. [Vercel](https://vercel.com)にアクセス
3. GitHubリポジトリをインポート
4. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. デプロイ完了！

### デプロイ後の確認手順

1. **セーフモードで確認**
   - `https://your-app.vercel.app/?safe=1` にアクセス
   - 正常に起動することを確認

2. **通常モードで確認**
   - `https://your-app.vercel.app` にアクセス
   - ログイン・データ保存などの基本機能を確認

3. **エラーチェック**
   - ブラウザのコンソールでエラーが出ていないか確認
   - `/api/log-client-error` にエラーが送信されていないか確認（Vercelログで確認）

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合や質問がある場合は、GitHubのIssuesページでお知らせください。

---

**注意**: このアプリは開発中のMVPです。本格的な運用前に、セキュリティ設定やエラーハンドリングの確認をお勧めします。
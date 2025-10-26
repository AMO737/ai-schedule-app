# Google OAuth 設定ガイド

## 🔴 エラー: "Unsupported provider: provider is not enabled"

このエラーは、SupabaseでGoogle OAuthプロバイダーが有効になっていない場合に発生します。

## 📋 設定手順

### 1. Supabaseダッシュボードで設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択（例: `tekzuupjdohbpveearfb`）
3. 左サイドバーから **Authentication** → **Providers** を選択
4. **Google** を探して **Enable Google** をクリック

### 2. Google Cloud Consoleで設定

#### 2.1 Google Cloud プロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. プロジェクトを作成（または既存プロジェクトを選択）

#### 2.2 OAuth同意画面を設定

1. 左サイドバー: **APIとサービス** → **OAuth同意画面**
2. **外部** を選択して次へ
3. 必須項目を入力:
   - **アプリ名**: AIスケジュール管理（任意）
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **デベロッパーの連絡先情報**: あなたのメールアドレス
4. **保存して次へ**

#### 2.3 OAuth 2.0 クライアント IDを作成

1. 左サイドバー: **認証情報** → **認証情報を作成** → **OAuth 2.0 クライアント ID**
2. アプリケーションの種類: **ウェブアプリケーション**
3. 名前: `AIスケジュール管理`（任意）
4. **承認済みの JavaScript 生成元**:
   - `http://localhost:3000`
   - `http://localhost:3001`
5. **承認済みのリダイレクト URI**:
   - `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback`
   - 本番環境のURL（例: `https://your-domain.vercel.app/auth/callback`）
6. **作成** をクリック
7. 表示された **クライアント ID** と **クライアント シークレット** をコピー

#### 2.4 Google+ API を有効化

1. 左サイドバー: **APIとサービス** → **ライブラリ**
2. **Google+ API** を検索して有効化

### 3. Supabaseに認証情報を登録

Supabaseダッシュボードに戻って:

1. **Authentication** → **Providers** → **Google**
2. 以下の情報を入力:
   - **Client ID**: Google Cloud Consoleからコピーしたクライアント ID
   - **Client Secret**: Google Cloud Consoleからコピーしたクライアント シークレット
3. **Save** をクリック

### 4. リダイレクトURLの確認

Supabaseダッシュボードで：

1. **Authentication** → **URL Configuration**
2. **Redirect URLs** に以下が設定されていることを確認:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`
   - （本番URLも追加）

### 5. 環境変数の設定（オプション）

ローカル開発環境の場合、`.env.local` に以下を追加:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tekzuupjdohbpveearfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ 動作確認

1. 開発サーバーを起動:
```bash
npm run dev
```

2. ブラウザで `http://localhost:3000` にアクセス
3. 「Googleでログイン」ボタンをクリック
4. Googleアカウントでログイン
5. リダイレクト後に認証が完了していることを確認

## 🐛 トラブルシューティング

### エラー: "redirect_uri_mismatch"

- Google Cloud Consoleの承認済みリダイレクト URI を確認
- Supabase URL Configuration を確認

### エラー: "access_denied"

- Google Cloud ConsoleのOAuth同意画面を確認
- テストユーザーを追加（外部ユーザーがログインする場合）

### エラー: "invalid_client"

- Client ID / Client Secret が正しいか確認
- Supabaseで入力した認証情報を再確認

## 📝 次のステップ

認証が成功したら、ユーザーのデータをSupabaseデータベースに保存する実装を追加します。

## 🔴 エラー: "Unsupported provider: provider is not enabled"

このエラーは、SupabaseでGoogle OAuthプロバイダーが有効になっていない場合に発生します。

## 📋 設定手順

### 1. Supabaseダッシュボードで設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択（例: `tekzuupjdohbpveearfb`）
3. 左サイドバーから **Authentication** → **Providers** を選択
4. **Google** を探して **Enable Google** をクリック

### 2. Google Cloud Consoleで設定

#### 2.1 Google Cloud プロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. プロジェクトを作成（または既存プロジェクトを選択）

#### 2.2 OAuth同意画面を設定

1. 左サイドバー: **APIとサービス** → **OAuth同意画面**
2. **外部** を選択して次へ
3. 必須項目を入力:
   - **アプリ名**: AIスケジュール管理（任意）
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **デベロッパーの連絡先情報**: あなたのメールアドレス
4. **保存して次へ**

#### 2.3 OAuth 2.0 クライアント IDを作成

1. 左サイドバー: **認証情報** → **認証情報を作成** → **OAuth 2.0 クライアント ID**
2. アプリケーションの種類: **ウェブアプリケーション**
3. 名前: `AIスケジュール管理`（任意）
4. **承認済みの JavaScript 生成元**:
   - `http://localhost:3000`
   - `http://localhost:3001`
5. **承認済みのリダイレクト URI**:
   - `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback`
   - 本番環境のURL（例: `https://your-domain.vercel.app/auth/callback`）
6. **作成** をクリック
7. 表示された **クライアント ID** と **クライアント シークレット** をコピー

#### 2.4 Google+ API を有効化

1. 左サイドバー: **APIとサービス** → **ライブラリ**
2. **Google+ API** を検索して有効化

### 3. Supabaseに認証情報を登録

Supabaseダッシュボードに戻って:

1. **Authentication** → **Providers** → **Google**
2. 以下の情報を入力:
   - **Client ID**: Google Cloud Consoleからコピーしたクライアント ID
   - **Client Secret**: Google Cloud Consoleからコピーしたクライアント シークレット
3. **Save** をクリック

### 4. リダイレクトURLの確認

Supabaseダッシュボードで：

1. **Authentication** → **URL Configuration**
2. **Redirect URLs** に以下が設定されていることを確認:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`
   - （本番URLも追加）

### 5. 環境変数の設定（オプション）

ローカル開発環境の場合、`.env.local` に以下を追加:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tekzuupjdohbpveearfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ 動作確認

1. 開発サーバーを起動:
```bash
npm run dev
```

2. ブラウザで `http://localhost:3000` にアクセス
3. 「Googleでログイン」ボタンをクリック
4. Googleアカウントでログイン
5. リダイレクト後に認証が完了していることを確認

## 🐛 トラブルシューティング

### エラー: "redirect_uri_mismatch"

- Google Cloud Consoleの承認済みリダイレクト URI を確認
- Supabase URL Configuration を確認

### エラー: "access_denied"

- Google Cloud ConsoleのOAuth同意画面を確認
- テストユーザーを追加（外部ユーザーがログインする場合）

### エラー: "invalid_client"

- Client ID / Client Secret が正しいか確認
- Supabaseで入力した認証情報を再確認

## 📝 次のステップ

認証が成功したら、ユーザーのデータをSupabaseデータベースに保存する実装を追加します。

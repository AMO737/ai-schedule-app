# 環境変数の具体的な設定例

## .env.local ファイルの内容

実際に `.env.local` ファイルに入力する内容は、こんな感じになります：

### コピペ用（実際の値に置き換えてください）

```env
NEXT_PUBLIC_SUPABASE_URL=https://tekzuupjdohbpveearfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3p1dXBqZG9oYnB2ZWVhcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDk1OTAsImV4cCI6MjA3Njg4NTU5MH0.9XiUxWizidhkK5BlkgqRyqkk5BWKydN8axjYKvsOOz4

# ↓↓↓ ここを実際の値に変更 ↓↓↓
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
# ↑↑↑ ここまで実際の値に変更 ↑↑↑

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string-for-local-development
```

## Google Cloud Console での取得方法

### ステップ1: 認証情報を開く

1. https://console.cloud.google.com にアクセス
2. 左メニューから「APIとサービス」→「認証情報」
3. 作成した「OAuth 2.0 クライアント ID」をクリック

### ステップ2: Client ID をコピー

表示される画面で：

```
クライアント ID
123456789-abc123def456.apps.googleusercontent.com
[コピー] ← このボタンをクリック
```

これを `.env.local` の `GOOGLE_CLIENT_ID=` の後に貼り付け

### ステップ3: Client Secret をコピー

```
クライアント シークレット
GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
[表示] ← このボタンをクリックして表示
[コピー] ← 表示されたらコピー
```

⚠️ **重要**: Client Secret は表示されるのは最初の1回だけです。必ずコピーしてください！

これを `.env.local` の `GOOGLE_CLIENT_SECRET=` の後に貼り付け

## 具体的な手順

### 1. .env.local を開く

テキストエディタで以下のファイルを開く：

```
/Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app/.env.local
```

### 2. 現在の内容を確認

開くと、こんな感じになっているはずです：

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. 実際の値に置き換え

Google Cloud Console からコピーした値に置き換えます：

**置き換え前:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**置き換え後（例）:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
```

### 4. 保存して再起動

1. ファイルを保存（Cmd+S）
2. 開発サーバーを再起動：
   ```bash
   # Ctrl+C で停止
   npm run dev
   ```

## 実際の画面例

### Google Cloud Console の画面

```
┌─────────────────────────────────────────┐
│ OAuth クライアントを作成しました          │
├─────────────────────────────────────────┤
│ クライアント ID                           │
│ 123456789-abc123.apps.googleusercontent │
│ [📋 コピー]                            │
├─────────────────────────────────────────┤
│ クライアント シークレット                 │
│ [表示] ← クリックすると表示              │
│ GOCSPX-123456789...                    │
│ [📋 コピー]                            │
└─────────────────────────────────────────┘
```

### コピーした値を .env.local に貼り付け

```env
# Google Cloud Console からコピーした Client ID
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com

# Google Cloud Console からコピーした Client Secret
GOOGLE_CLIENT_SECRET=GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
```

## 注意点

1. **引用符は不要**: `GOOGLE_CLIENT_ID="値"` ではなく `GOOGLE_CLIENT_ID=値` でOK
2. **スペースは不可**: 値の前後にスペースを入れない
3. **改行は不可**: 1行に1つの環境変数を記述
4. **大文字小文字は区別される**: `GOOGLE_CLIENT_ID` と `google_client_id` は別物

## 確認方法

サーバーを起動して、エラーが出ていなければOK：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして、ログインページが表示されれば成功です！

## .env.local ファイルの内容

実際に `.env.local` ファイルに入力する内容は、こんな感じになります：

### コピペ用（実際の値に置き換えてください）

```env
NEXT_PUBLIC_SUPABASE_URL=https://tekzuupjdohbpveearfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3p1dXBqZG9oYnB2ZWVhcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDk1OTAsImV4cCI6MjA3Njg4NTU5MH0.9XiUxWizidhkK5BlkgqRyqkk5BWKydN8axjYKvsOOz4

# ↓↓↓ ここを実際の値に変更 ↓↓↓
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
# ↑↑↑ ここまで実際の値に変更 ↑↑↑

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string-for-local-development
```

## Google Cloud Console での取得方法

### ステップ1: 認証情報を開く

1. https://console.cloud.google.com にアクセス
2. 左メニューから「APIとサービス」→「認証情報」
3. 作成した「OAuth 2.0 クライアント ID」をクリック

### ステップ2: Client ID をコピー

表示される画面で：

```
クライアント ID
123456789-abc123def456.apps.googleusercontent.com
[コピー] ← このボタンをクリック
```

これを `.env.local` の `GOOGLE_CLIENT_ID=` の後に貼り付け

### ステップ3: Client Secret をコピー

```
クライアント シークレット
GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
[表示] ← このボタンをクリックして表示
[コピー] ← 表示されたらコピー
```

⚠️ **重要**: Client Secret は表示されるのは最初の1回だけです。必ずコピーしてください！

これを `.env.local` の `GOOGLE_CLIENT_SECRET=` の後に貼り付け

## 具体的な手順

### 1. .env.local を開く

テキストエディタで以下のファイルを開く：

```
/Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app/.env.local
```

### 2. 現在の内容を確認

開くと、こんな感じになっているはずです：

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. 実際の値に置き換え

Google Cloud Console からコピーした値に置き換えます：

**置き換え前:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**置き換え後（例）:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
```

### 4. 保存して再起動

1. ファイルを保存（Cmd+S）
2. 開発サーバーを再起動：
   ```bash
   # Ctrl+C で停止
   npm run dev
   ```

## 実際の画面例

### Google Cloud Console の画面

```
┌─────────────────────────────────────────┐
│ OAuth クライアントを作成しました          │
├─────────────────────────────────────────┤
│ クライアント ID                           │
│ 123456789-abc123.apps.googleusercontent │
│ [📋 コピー]                            │
├─────────────────────────────────────────┤
│ クライアント シークレット                 │
│ [表示] ← クリックすると表示              │
│ GOCSPX-123456789...                    │
│ [📋 コピー]                            │
└─────────────────────────────────────────┘
```

### コピーした値を .env.local に貼り付け

```env
# Google Cloud Console からコピーした Client ID
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com

# Google Cloud Console からコピーした Client Secret
GOOGLE_CLIENT_SECRET=GOCSPX-123456789abcdefghijklmnopqrstuvwxyz
```

## 注意点

1. **引用符は不要**: `GOOGLE_CLIENT_ID="値"` ではなく `GOOGLE_CLIENT_ID=値` でOK
2. **スペースは不可**: 値の前後にスペースを入れない
3. **改行は不可**: 1行に1つの環境変数を記述
4. **大文字小文字は区別される**: `GOOGLE_CLIENT_ID` と `google_client_id` は別物

## 確認方法

サーバーを起動して、エラーが出ていなければOK：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして、ログインページが表示されれば成功です！

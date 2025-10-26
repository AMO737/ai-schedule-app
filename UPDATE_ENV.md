# 環境変数の更新方法

## エラー: placeholder.supabase.co が見つからない

`.env.local` ファイルを実際の値に更新してください。

## 手順

### 1. .env.local ファイルを開く

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
open -e .env.local
```

または、テキストエディタで開いてください。

### 2. Google OAuth の値を設定

以下の2行を実際の値に変更してください：

```
GOOGLE_CLIENT_ID=ここにGoogle Cloud Consoleで取得したClient ID
GOOGLE_CLIENT_SECRET=ここにGoogle Cloud Consoleで取得したClient Secret
```

### 3. Google Cloud Console で取得

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを選択
3. **APIとサービス** → **認証情報**
4. OAuth 2.0 クライアント ID をクリック
5. **Client ID** と **Client Secret** をコピー

### 4. .env.local の例

```env
NEXT_PUBLIC_SUPABASE_URL=https://tekzuupjdohbpveearfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3p1dXBqZG9oYnB2ZWVhcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDk1OTAsImV4cCI6MjA3Njg4NTU5MH0.9XiUxWizidhkK5BlkgqRyqkk5BWKydN8axjYKvsOOz4

# 実際のGoogle OAuthクレデンシャル
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

### 5. サーバーを再起動

変更後、開発サーバーを再起動してください：

```bash
# Ctrl+C で停止してから
npm run dev
```

## トラブルシューティング

### エラーが続く場合

1. `.env.local` の値が正しいか確認
2. サーバーを完全に再起動（プロセスをkillしてから）
3. ブラウザのキャッシュをクリア（Cmd+Shift+R）

### 確認方法

開発サーバーを起動したときに、エラーが出ていないか確認：

```bash
npm run dev
```

以下のようなログが出ていればOK：
```
✓ Starting...
✓ Ready on http://localhost:3000
```

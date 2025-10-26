# トラブルシューティング: Supabase URL でループする

## 🔴 問題

本番環境でログインを試みると、以下のURLで止まってしまう：

```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

## 🔍 原因

これは通常、以下のいずれかが原因です：

1. **Supabase の Redirect URL が正しく設定されていない**
2. **Vercel の環境変数が設定されていない**
3. **認証フローが完了しない**

## ✅ 解決方法

### 1. Supabase の設定を確認

#### 手順

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. **Authentication** → **URL Configuration**
4. **Redirect URLs** を確認

#### 正しい設定

以下のURLが含まれている必要があります：

```
https://schedule-app-gold-tau.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

⚠️ **重要**: `https://` から始まる本番URLが含まれているか確認

### 2. Vercel の環境変数を確認

#### Vercel ダッシュボードで確認

1. [Vercel Dashboard](https://vercel.com) にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 以下の変数が設定されているか確認

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

⚠️ **重要**: 環境変数が設定されていないと、アプリが正しくSupabaseに接続できません

#### 環境変数の設定方法

もし設定されていない場合：

1. Vercel ダッシュボードで **Settings** → **Environment Variables**
2. 以下の変数を追加：

```
NEXT_PUBLIC_SUPABASE_URL = https://tekzuupjdohbpveearfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3p1dXBqZG9oYnB2ZWVhcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDk1OTAsImV4cCI6MjA3Njg4NTU5MH0.9XiUxWizidhkK5BlkgqRyqkk5BWKydN8axjYKvsOOz4
```

3. **Redeploy** をクリックして再デプロイ

### 3. ブラウザのコンソールを確認

#### 手順

1. 本番環境（https://schedule-app-gold-tau.vercel.app）にアクセス
2. 開発者ツール（F12）を開く
3. **Console** タブを確認
4. エラーメッセージを確認

#### よくあるエラー

```
- redirect_uri_mismatch
- invalid_client
- Access denied
```

## 🔧 詳細な確認手順

### ステップ1: Supabase の設定

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Redirect URLs** を確認
3. 本番URLが含まれているか確認

### ステップ2: Vercel の環境変数

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. 必要な環境変数が設定されているか確認
3. 設定されていない場合は追加して再デプロイ

### ステップ3: ブラウザで確認

1. 本番環境にアクセス
2. 開発者ツール（F12）を開く
3. **Network** タブでリクエストを確認
4. `/auth/callback` のリクエストを確認

## 🎯 確認チェックリスト

- [ ] Supabase の Redirect URL に本番URLが含まれている
- [ ] Vercel の環境変数が設定されている
- [ ] 環境変数を設定後、再デプロイしている
- [ ] ブラウザのコンソールでエラーが出ていない

## 💡 よくある問題

### Q: URLで止まる

A: Supabase の Redirect URL に本番URLが含まれていない可能性が高いです。

### Q: 環境変数を設定したけど動かない

A: 環境変数を追加した後、**必ず再デプロイ**が必要です。

### Q: ローカルでは動く

A: ローカル環境（localhost）と本番環境（Vercel）は別の設定が必要です。

## 📝 まとめ

この問題を解決するには：

1. ✅ Supabase の Redirect URL を確認
2. ✅ Vercel の環境変数を確認
3. ✅ 必要に応じて再デプロイ

一つずつ確認していけば、必ず解決できます！

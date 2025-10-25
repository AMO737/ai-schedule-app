# デプロイ手順

このアプリケーションを本番環境にデプロイする手順です。

## 🚀 デプロイ方法

### 方法1: Vercel（推奨）

VercelはNext.jsに最適化されたホスティングサービスです。

#### 1. GitHubにコードをプッシュ
```bash
# 既存のGitリポジトリを確認
git remote -v

# もしリモートがない場合、GitHubでリポジトリを作成してから
git remote add origin https://github.com/YOUR_USERNAME/ai-schedule-app.git
git branch -M main
git push -u origin main
```

#### 2. Vercelに接続
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインアップ/ログイン
3. 「New Project」をクリック
4. GitHubリポジトリを選択
5. プロジェクト設定:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 3. 環境変数の設定
Vercelのダッシュボードで以下の環境変数を設定：

**必須の環境変数:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**オプション（認証を使用する場合）:**
```env
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### 4. デプロイ
1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（通常2-3分）
3. デプロイ完了後、URLが表示されます

### 方法2: 他のプラットフォーム

#### Netlify
```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# デプロイ
npm run build
netlify deploy --prod
```

#### Railway
1. [Railway](https://railway.app)にサインアップ
2. 新しいプロジェクトを作成
3. GitHubリポジトリを接続
4. 環境変数を設定
5. デプロイ

#### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

## 📋 デプロイ前チェックリスト

- [ ] 環境変数が全て設定されている
- [ ] Supabaseプロジェクトが作成されている
- [ ] データベースマイグレーションが実行されている
- [ ] Google OAuth設定が完了している（認証を使用する場合）
- [ ] ビルドが成功することを確認（`npm run build`）
- [ ] 本番環境用のSupabase URLに切り替え
- [ ] セキュリティ設定を確認
- [ ] カスタムドメインを設定（オプション）

## 🔧 本番環境での設定

### Supabaseの設定

1. **RLS（Row Level Security）の確認**
   - データベースダッシュボードでRLSが有効になっているか確認
   - 各テーブルに適切なポリシーが設定されているか確認

2. **API Settings**
   - Supabaseダッシュボード > Settings > API
   - Project URLとanon keyをコピー
   - Vercelの環境変数に設定

3. **認証設定**
   - Authentication > Providers > Google
   - Redirect URL: `https://your-domain.vercel.app/auth/callback`

### Google OAuthの設定

1. **Google Cloud Console**
   - [Google Cloud Console](https://console.cloud.google.com)にアクセス
   - 既存のプロジェクトを選択または新規作成

2. **認証情報の更新**
   - 認証情報 > OAuth 2.0 クライアント ID > 編集
   - 承認済みのリダイレクト URIに本番URLを追加:
     - `https://your-domain.vercel.app/auth/callback`

3. **本番環境のクライアントID/シークレットを使用**
   - Vercelの環境変数に本番用の値を設定

## 🌐 カスタムドメインの設定

### Vercelでカスタムドメインを追加

1. Vercelダッシュボードでプロジェクトを選択
2. Settings > Domains
3. ドメインを追加
4. DNS設定を確認:
   - Aレコード: `76.76.21.21`
   - CNAMEレコード: `cname.vercel-dns.com`

## 📊 モニタリングとアナリティクス

### 推奨ツール

1. **Vercel Analytics**
   - Vercelダッシュボードで有効化
   - パフォーマンス監視

2. **Sentry**
   - エラートラッキング
   - インストール: `npm install @sentry/nextjs`

3. **Supabase Logs**
   - Supabaseダッシュボード > Logs
   - APIリクエストとエラーの監視

## 🔐 セキュリティチェックリスト

- [ ] 環境変数がGitにコミットされていない
- [ ] SupabaseのRLSが適切に設定されている
- [ ] API keysがservice role keyとして公開されていない
- [ ] HTTPSが有効になっている
- [ ] 認証トークンが安全に保存されている
- [ ] CORS設定が適切
- [ ] レート制限が設定されている

## 🆘 トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build

# エラーログを確認
npm run build 2>&1 | tee build.log
```

### 環境変数の問題

```bash
# Vercel CLIで環境変数を確認
vercel env ls

# 環境変数を追加
vercel env add VARIABLE_NAME
```

### データベース接続エラー

1. Supabaseダッシュボードでプロジェクトがアクティブか確認
2. API keysが正しいか確認
3. RLSポリシーが適切か確認

## 📞 サポート

問題が発生した場合:
1. [GitHub Issues](https://github.com/YOUR_USERNAME/ai-schedule-app/issues)で報告
2. Vercelのログを確認
3. Supabaseのログを確認

---

デプロイお疲れ様でした！🎉

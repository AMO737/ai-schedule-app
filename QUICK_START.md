# 🚀 クイックスタートガイド

## 5分でデプロイ

### 1. GitHubにプッシュ（2分）

```bash
# リポジトリを初期化（まだの場合）
git init
git add .
git commit -m "Initial commit"

# GitHubでリポジトリを作成してから
git remote add origin https://github.com/YOUR_USERNAME/ai-schedule-app.git
git branch -M main
git push -u origin main
```

### 2. Vercelにデプロイ（2分）

1. https://vercel.com にアクセス
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択
4. 「Deploy」をクリック

### 3. 環境変数を設定（1分）

Vercelダッシュボードで以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 完了！

アプリが公開されました 🎉

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) をご覧ください。

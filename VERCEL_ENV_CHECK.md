# Vercel 環境変数の確認

## ✅ 確認結果

環境変数は正しく設定されています：

```
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXT_PUBLIC_SUPABASE_URL
```

両方とも「Production, Preview, and Development」のすべての環境で設定されています。

## 🔍 別の原因を確認

環境変数は問題ないので、別の原因を確認します。

### 1. Supabase の Redirect URL を再確認

**[Supabase Dashboard](https://supabase.com/dashboard)** で確認：

1. **Authentication** → **URL Configuration**
2. **Redirect URLs** に以下が含まれているか確認：

```
https://schedule-app-gold-tau.vercel.app/auth/callback
```

⚠️ このURLは**必ず含まれている必要**があります。

### 2. 再デプロイを試す

環境変数は設定されていますが、念のため再デプロイしてみてください：

1. Vercel Dashboard でプロジェクトを開く
2. **Deployments** タブ
3. 最新のデプロイの **⋮** メニュー
4. **Redeploy** をクリック

### 3. ブラウザのコンソールを確認

本番環境で：

1. `https://schedule-app-gold-tau.vercel.app` にアクセス
2. 開発者ツール（F12）を開く
3. **Console** タブでエラーを確認

### 4. ネットワークタブを確認

1. 開発者ツールの **Network** タブを開く
2. 「Googleでログイン」をクリック
3. `/auth/callback` へのリクエストを確認
4. レスポンスを見る

## 🔧 よくある問題

### 「Sensitive」オプション

「Sensitive」にチェックが入っている場合：

- 作成後は値を見ることができません
- でも動作には**影響しません**
- そのままで問題ありません

### 値の変更

値を変更したい場合：

1. 既存の環境変数を**削除**
2. 新しい値を入れて**追加**
3. **Redeploy**

## 📝 次のステップ

1. ✅ 環境変数は設定済み
2. 🔍 Supabase の Redirect URL を確認
3. 🔄 必要に応じて再デプロイ
4. 🧪 再度テスト

詳細は `TROUBLESHOOTING_LOOP.md` を参照してください。

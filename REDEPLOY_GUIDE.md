# Vercel の再デプロイ手順

## 📋 手順

### 1. Vercel Dashboard にアクセス

1. ブラウザで [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. ログイン

### 2. プロジェクトを開く

1. ダッシュボードで「**schedule-app-gold-tau**」または関連プロジェクトをクリック
2. プロジェクトページを開く

### 3. Deployments タブを開く

1. 上部のタブから「**Deployments**」をクリック
2. デプロイメント一覧が表示される

### 4. 再デプロイを実行

1. 最新のデプロイの右側にある「**⋮**」（3つの点）をクリック
2. メニューから「**Redeploy**」をクリック
3. 確認ダイアログで「**Redeploy**」をクリック

## ⏱️ 再デプロイの待機時間

- 通常1-3分ほどかかります
- デプロイ完了までそのままお待ちください

## ✅ 確認方法

### デプロイが完了したら

1. デプロイのステータスが「**Ready**」（緑色のチェック）になる
2. 右上に「**View**」ボタンが表示される
3. 「**View**」をクリックして本番サイトにアクセス

### 動作確認

1. 本番環境にアクセス：`https://schedule-app-gold-tau.vercel.app`
2. 「Googleでログイン」をクリック
3. 正常に動作するか確認

## 🔄 別の方法：GitHub からプッシュ

環境変数を変更した場合、GitHub経由で再デプロイすることもできます：

```bash
# 何か変更を加える（空白のファイルでもOK）
echo "" >> redeploy.txt

# コミットしてプッシュ
git add .
git commit -m "Trigger redeploy"
git push
```

Vercelが自動的に再デプロイします。

## 📝 まとめ

1. Vercel Dashboard → プロジェクト
2. Deployments タブ
3. 最新デプロイの ⋮ → Redeploy
4. 完了を待つ
5. テスト

これで再デプロイ完了です！

## 📋 手順

### 1. Vercel Dashboard にアクセス

1. ブラウザで [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. ログイン

### 2. プロジェクトを開く

1. ダッシュボードで「**schedule-app-gold-tau**」または関連プロジェクトをクリック
2. プロジェクトページを開く

### 3. Deployments タブを開く

1. 上部のタブから「**Deployments**」をクリック
2. デプロイメント一覧が表示される

### 4. 再デプロイを実行

1. 最新のデプロイの右側にある「**⋮**」（3つの点）をクリック
2. メニューから「**Redeploy**」をクリック
3. 確認ダイアログで「**Redeploy**」をクリック

## ⏱️ 再デプロイの待機時間

- 通常1-3分ほどかかります
- デプロイ完了までそのままお待ちください

## ✅ 確認方法

### デプロイが完了したら

1. デプロイのステータスが「**Ready**」（緑色のチェック）になる
2. 右上に「**View**」ボタンが表示される
3. 「**View**」をクリックして本番サイトにアクセス

### 動作確認

1. 本番環境にアクセス：`https://schedule-app-gold-tau.vercel.app`
2. 「Googleでログイン」をクリック
3. 正常に動作するか確認

## 🔄 別の方法：GitHub からプッシュ

環境変数を変更した場合、GitHub経由で再デプロイすることもできます：

```bash
# 何か変更を加える（空白のファイルでもOK）
echo "" >> redeploy.txt

# コミットしてプッシュ
git add .
git commit -m "Trigger redeploy"
git push
```

Vercelが自動的に再デプロイします。

## 📝 まとめ

1. Vercel Dashboard → プロジェクト
2. Deployments タブ
3. 最新デプロイの ⋮ → Redeploy
4. 完了を待つ
5. テスト

これで再デプロイ完了です！

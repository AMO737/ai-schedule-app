# 手動で再デプロイする方法

## 📋 手順

### 1. Vercel Dashboard にアクセス

1. ブラウザで [https://vercel.com/dashboard](https://vercel.com/dashboard) にアクセス
2. ログイン

### 2. プロジェクトを開く

1. 「**schedule-app-gold-tau**」または該当プロジェクトをクリック
2. プロジェクトページを開く

### 3. Deployments タブを開く

1. 上部のタブから「**Deployments**」をクリック
2. デプロイメント一覧が表示される

### 4. 再デプロイを実行

1. 最新のデプロイの右側にある「**⋮**」（3つの点）をクリック
2. メニューから「**Redeploy**」を選択
3. 確認ダイアログで「**Redeploy**」をクリック

## ⏱️ 待機時間

通常 1-3 分ほどかかります。デプロイ完了までそのままお待ちください。

## ✅ 確認方法

### デプロイが完了したら

1. デプロイのステータスが「**Ready**」（緑色のチェック）に変わる
2. 右上に「**View**」ボタンが表示される
3. 完了したらテスト

### 動作確認

1. 本番環境にアクセス: `https://schedule-app-gold-tau.vercel.app`
2. ハードリフレッシュ（Mac: `Cmd + Shift + R`）
3. 「Googleでログイン」で動作確認

## 🔄 自動デプロイが有効になっているか確認

### Settings で確認

1. Vercel Dashboard → プロジェクト
2. **Settings** タブ
3. **Git** セクションを開く
4. 「**Production Branch**」が `main` になっているか確認
5. 「**Automatic deployments**」が ON になっているか確認

## 💡 トラブルシューティング

### 自動デプロイが動いていない

以下の可能性があります：

1. **Git連携が切れている**
   - Settings → Git で接続を確認

2. **ブランチが間違っている**
   - Production Branch が `main` になっているか確認

3. **自動デプロイがOFF**
   - Automatic deployments を ON に設定

### 手動デプロイでも動かない

1. エラーログを確認
2. **Logs** タブでエラー内容を確認
3. エラーに応じて対応

## 📝 まとめ

1. Vercel Dashboard → プロジェクト
2. Deployments タブ
3. ⋮ → Redeploy
4. Ready になるまで待つ
5. テスト

これで確実に再デプロイできます！

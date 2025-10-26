# Supabase での設定手順

Google Cloud Console で Client ID と Client secret を取得したら、Supabase に設定します。

## ステップ

### 1. Supabase ダッシュボードにアクセス

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択（例: `tekzuupjdohbpveearfb`）

### 2. Google プロバイダーを有効化

1. 左サイドバーから **Authentication** をクリック
2. **Providers** タブをクリック
3. 一覧から **Google** を探してクリック

### 3. Google の設定を入力

1. **Enable Google** のスイッチを ON に
2. **Client ID (for OAuth)**: 
   - Google Cloud Console からコピーした Client ID を貼り付け
3. **Client Secret (for OAuth)**:
   - Google Cloud Console からコピーした Client Secret を貼り付け
4. **Save** ボタンをクリック

### 4. 完了！

これで Google OAuth の設定が完了です。

## 動作確認

1. ブラウザで `http://localhost:3000` にアクセス
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントを選択
4. 認証が成功してアプリに戻ればOK！

## トラブルシューティング

### エラー: "Unsupported provider"
- Supabase で "Enable Google" が ON になっているか確認

### エラー: "invalid_client"
- Client ID と Client Secret が正しくコピーされているか確認
- スペースや改行が含まれていないか確認

### エラー: "redirect_uri_mismatch"
- Google Cloud Console の「承認済みのリダイレクト URI」に以下を追加：
  - `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback`

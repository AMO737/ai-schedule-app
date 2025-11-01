# Vercel 環境変数の設定方法

## 🔴 現在の状況

**エラー**: `{ok: false, error: 'no api key'}`

これは、Vercelの本番環境に `RESEND_API_KEY` が設定されていないことを意味します。

## ✅ 解決方法

### 手順1: Resend API キーの取得

1. **Resendにサインアップ/ログイン**
   - https://resend.com/
   - Dashboardにログイン

2. **APIキーを生成**
   - 左メニュー「API Keys」
   - 「Create API Key」をクリック
   - 名前を入力（例: "production"）
   - 必要な権限を選択（`full_access` 推奨）
   - 「Add」をクリック
   - **重要**: 生成されたキーをコピー（`re_` で始まる文字列）

### 手順2: Vercelに環境変数を設定

1. **Vercelダッシュボードを開く**
   - https://vercel.com/dashboard
   - ログイン

2. **プロジェクトを選択**
   - 「schedule-app-gold-tau」または該当するプロジェクトをクリック

3. **Settings を開く**
   - プロジェクトページの上部メニュー「Settings」をクリック

4. **Environment Variables を開く**
   - 左メニューの「Environment Variables」をクリック

5. **RESEND_API_KEY を追加**
   - 「Add New」をクリック
   - **Key**: `RESEND_API_KEY`
   - **Value**: ResendからコピーしたAPIキー（例: `re_xxxxxxxxxxxxxxxx`）
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック
   - 「Save」をクリック

6. **EMAIL_FROM を追加（オプション）**
   - 「Add New」をクリック
   - **Key**: `EMAIL_FROM`
   - **Value**: `Study App <noreply@yourdomain.com>`
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック
   - 「Save」をクリック

### 手順3: 再デプロイ

環境変数を追加した後、**必ず再デプロイ**が必要です：

1. **手動でRedeployする方法**
   - プロジェクトページの「Deployments」タブを開く
   - 最新のデプロイを選択
   - 右上の「︙」メニューをクリック
   - 「Redeploy」を選択
   - **重要**: 「Use existing Build Cache」のチェックを**外す**
   - 「Redeploy」をクリック

2. **または、空のコミットで再デプロイ**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

### 手順4: 動作確認

デプロイ完了後（1-2分）、ブラウザコンソールで再テスト：

```javascript
await fetch("/api/notify-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "あなたのメールアドレス",
    subject: "テスト通知",
    html: "<p>これはテストです</p>",
  }),
}).then(r => r.json()).then(console.log)
```

**期待される結果**:
```json
{
  "ok": true,
  "result": {
    "id": "re_xxxxxxxxxx",
    "from": "Study App <noreply@yourapp.com>",
    "to": "あなたのメールアドレス",
    "created_at": "2025-01-27T..."
  }
}
```

## ⚠️ 注意事項

### 1. Resendのドメイン検証
- 初回利用時、Resendでドメイン検証が必要な場合があります
- テストドメイン（`onboarding.resend.dev`）は3通まで送信可能
- 本番運用には独自ドメインの検証が推奨

### 2. 環境変数の反映
- **重要**: 環境変数を追加/変更した後は**必ず再デプロイ**
- 既存のデプロイメントには反映されません
- 新しいデプロイで反映されます

### 3. 環境変数の確認方法
```bash
# ローカルでVercel CLIを使用して確認
vercel env ls

# または、ダッシュボードで確認
# Settings → Environment Variables
```

## 🐛 トラブルシューティング

### 問題1: 環境変数を設定したのにエラーが出る

**原因**: 再デプロイしていない

**解決**: 上記の手順3で再デプロイを実行

### 問題2: APIキーが無効と表示される

**原因**: APIキーが期限切れまたは削除された

**解決**:
1. Resend Dashboard → API Keys
2. 新しいキーを生成
3. Vercelの環境変数を更新
4. 再デプロイ

### 問題3: メールが送信されない

**確認事項**:
1. APIキーが正しく設定されているか
2. メールアドレスが有効か
3. Resend Dashboard → Logs で送信状態を確認
4. 無料プランの制限（月100通）に達していないか

## 📞 サポート

- **Vercel**: https://vercel.com/support
- **Resend**: https://resend.com/docs


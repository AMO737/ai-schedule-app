# エラー診断レポート

## エラー内容
```
POST https://schedule-app-gold-tau.vercel.app/api/notify-email 500 (Internal Server Error)
```

## 診断結果

### 直接API呼び出しテスト
```bash
curl -X POST https://schedule-app-gold-tau.vercel.app/api/notify-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

**レスポンス**:
```json
{"ok":false,"error":"no api key"}
```

### ✅ 原因特定

**Vercelの環境変数が設定されていません**

本番環境に以下の環境変数が設定されていません：
- `RESEND_API_KEY`
- `EMAIL_FROM`

### 🔧 修正方法

#### Vercelでの環境変数設定

1. **Vercelダッシュボードを開く**
   - https://vercel.com/dashboard
   - プロジェクト「schedule-app-gold-tau」を選択

2. **Settings → Environment Variables を開く**

3. **以下の環境変数を追加**

   **RESEND_API_KEY**
   ```
   Key: RESEND_API_KEY
   Value: あなたのResend APIキー（例: re_xxxxxxxxxxxxxxxx）
   環境: Production, Preview, Development すべてにチェック
   ```

   **EMAIL_FROM**（オプション）
   ```
   Key: EMAIL_FROM
   Value: Study App <noreply@yourdomain.com>
   環境: Production, Preview, Development すべてにチェック
   ```

4. **保存後、再デプロイ**
   - 右上の Deployments から手動で Redeploy
   - または、新しいコミットをpushすると自動デプロイ

### 📝 Resend APIキーの取得方法

1. **Resendにサインアップ**
   - https://resend.com/signup

2. **API Key を生成**
   - Dashboard → API Keys
   - 「Create API Key」をクリック
   - キー名を入力（例: "production-key"）
   - 生成されたキーをコピー（一度しか表示されません）

3. **Vercelに追加**
   - コピーしたキーを `RESEND_API_KEY` として追加

### 🧪 テスト方法

環境変数設定後、以下でテスト：

#### 1. ブラウザコンソールでのテスト
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

#### 2. アプリ内でのテスト
1. 通知ベルアイコン → メール設定
2. メール通知を有効化してアドレスを入力
3. 保存
4. 「テストメール送信」ボタンをクリック
5. メールが届くことを確認

### ⚠️ 注意事項

1. **Resendの制限**
   - 無料プラン: 月100通まで
   - ドメイン検証が必要（初回のみ）
   - テストドメイン（`onboarding.resend.dev`）は3通まで

2. **EMAIL_FROMの形式**
   ```
   "表示名 <email@domain.com>"
   ```
   
   例：
   ```
   Study App <noreply@yourdomain.com>
   ```

3. **環境変数の反映**
   - 設定後は**必ず再デプロイ**が必要
   - 環境変数の変更は既存のデプロイメントには反映されない
   - 新規デプロイで反映される

### 🔍 ログの確認方法

Vercelのログから詳細なエラーを確認：

1. Vercel Dashboard → プロジェクト
2. Deployments タブ
3. 最新のデプロイを選択
4. 「Functions」タブ → `/api/notify-email` を選択
5. ログを確認

期待されるログ：
- 成功時: `[notify-email] Email sent successfully: re_xxxxxxxxxx`
- 失敗時: `[notify-email] RESEND_API_KEY not found` または `[notify-email] Resend API error: ...`

## 結論

**問題**: Vercelの環境変数に `RESEND_API_KEY` が設定されていない

**解決方法**: VercelのEnvironment Variablesに以下を追加して再デプロイ
- `RESEND_API_KEY=re_xxxxxxxxxxxxxxxx`
- `EMAIL_FROM=Study App <noreply@yourdomain.com>`（オプション）

**次回の確認**: curlやブラウザコンソールで `{ ok: true }` が返れば成功


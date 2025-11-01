# 🔴 必須セットアップ: Vercel環境変数

## 現在のエラー
```
{ok: false, error: 'no api key'}
```

**原因**: Vercelに `RESEND_API_KEY` が設定されていません

## ✅ 解決手順

### ステップ1: ResendでAPIキーを取得

1. **Resendにアクセス**: https://resend.com/
2. **サインアップ/ログイン**
3. **API Keys** をクリック
4. **"Create API Key"** をクリック
5. 名前を入力（例: "production-key"）
6. 生成されたキーをコピー（`re_` で始まる文字列）

### ステップ2: Vercelに環境変数を設定

1. **Vercelダッシュボード**: https://vercel.com/dashboard
2. **プロジェクトを選択**: "schedule-app-gold-tau"
3. **Settings** → **Environment Variables**
4. **"Add New"** をクリック
5. 以下を入力:

```
Key: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxx（Resendからコピーしたキー）
Environment: Production, Preview, Development すべてにチェック✅
```

6. **"Save"** をクリック

7. **EMAIL_FROM も追加（推奨）**:

```
Key: EMAIL_FROM
Value: Study App <noreply@yourdomain.com>
Environment: Production, Preview, Development すべてにチェック✅
```

8. **"Save"** をクリック

### ステップ3: 再デプロイ

**重要**: 環境変数を追加した後、必ず再デプロイ！

1. **Deployments** タブ
2. 最新のデプロイを選択
3. **︙** メニュー → **"Redeploy"**
4. **⚠️ "Use existing Build Cache" のチェックを外す**
5. **"Redeploy"** をクリック

### ステップ4: 動作確認

デプロイ完了後（1-2分）、ブラウザコンソールで：

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

✅ **成功**: `{ok: true, result: {...}}`  
❌ **失敗**: `{ok: false, error: "no api key"}` → 環境変数設定を再確認

## 📸 スクリーンショット案内

### Vercel環境変数設定画面の場所
```
Vercel Dashboard
  → プロジェクト選択
    → Settings (上部メニュー)
      → Environment Variables (左メニュー)
        → Add New ボタン
```

### 入力例
```
┌─────────────────────────────────┐
│ Key: RESEND_API_KEY             │
│ Value: re_1234567890abcdefgh... │
│ ☑️ Production                   │
│ ☑️ Preview                      │
│ ☑️ Development                  │
│                                  │
│         [Save]                   │
└─────────────────────────────────┘
```

## ❓ よくある質問

### Q: 環境変数を設定したのにエラーが出る
**A**: 再デプロイが必要です。ステップ3を実行してください。

### Q: Resendの無料プランの制限は？
**A**: 月100通まで。テストドメインは3通まで。

### Q: 環境変数はどこで確認できる？
**A**: Vercel Dashboard → Settings → Environment Variables

### Q: ローカル環境でも動作させたい
**A**: `.env.local` ファイルを作成：
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=Study App <noreply@yourdomain.com>
```

## 🎯 次のステップ

環境変数設定と再デプロイが完了したら：
1. テストメール送信で確認
2. アプリ内で通知設定を有効化
3. アラーム付き学習ブロックを作成して自動通知をテスト

## 📞 サポート

問題が解決しない場合：
- Vercel: https://vercel.com/support
- Resend: https://resend.com/docs


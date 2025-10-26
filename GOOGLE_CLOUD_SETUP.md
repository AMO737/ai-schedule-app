# Google Cloud Console のリダイレクト URI 設定

本番環境でも動作するように、Google Cloud Console の承認済みリダイレクト URI に Supabase の URL を追加します。

## 📋 手順

### 1. Google Cloud Console にアクセス

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. 作成したプロジェクトを選択

### 2. OAuth 2.0 クライアント ID を開く

1. 左サイドバー: **APIとサービス** → **認証情報**
2. 作成した OAuth 2.0 クライアント ID をクリック
   （名前は「AIスケジュール管理」など）

### 3. リダイレクト URI を追加

**承認済みのリダイレクト URI** セクションに、以下を追加：

```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

**重要**: これは **Supabase の URL** です。アプリの URL ではありません。

### 4. 既存の URI を確認

すでに以下のような URI が設定されているはずです：

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

これらの**上または下に**、新しいURIを追加してください。

### 5. 保存

1. **保存** ボタンをクリック
2. 変更が適用されるまで数秒待つ

## ✅ 確認

設定後、以下を確認：

### リダイレクト URI の一覧

```
✓ http://localhost:3000/auth/callback
✓ http://localhost:3001/auth/callback
✓ https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback  ← これを追加
```

### すべての URI の要点

1. **localhost の URI**: ローカル開発用
2. **Supabase の URI**: 本番環境用（認証フローで使用）

## 🎯 設定が完了したら

1. **Supabase** の設定も完了していることを確認
2. 本番環境（https://schedule-app-gold-tau.vercel.app）でテスト
3. 「Googleでログイン」をクリックして動作確認

## 🐛 トラブルシューティング

### エラー: "redirect_uri_mismatch"

**原因**: リダイレクト URI が正しく設定されていない

**解決方法**:
- Google Cloud Console で設定した URI を確認
- `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback` が含まれているか確認
- 末尾に `/` がないか確認

### 変更が反映されない

**原因**: 変更が保存されていない、または時間がかかっている

**解決方法**:
- 「保存」ボタンをクリックしたか確認
- 数分待ってから再度テスト
- ブラウザのキャッシュをクリア

## 📝 まとめ

Google Cloud Console に追加するのは：

```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

このURLは：
- ✅ Supabase の認証エンドポイント
- ✅ 本番環境とローカル環境の両方で使用される
- ✅ Google OAuth 認証のコールバック先


本番環境でも動作するように、Google Cloud Console の承認済みリダイレクト URI に Supabase の URL を追加します。

## 📋 手順

### 1. Google Cloud Console にアクセス

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. 作成したプロジェクトを選択

### 2. OAuth 2.0 クライアント ID を開く

1. 左サイドバー: **APIとサービス** → **認証情報**
2. 作成した OAuth 2.0 クライアント ID をクリック
   （名前は「AIスケジュール管理」など）

### 3. リダイレクト URI を追加

**承認済みのリダイレクト URI** セクションに、以下を追加：

```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

**重要**: これは **Supabase の URL** です。アプリの URL ではありません。

### 4. 既存の URI を確認

すでに以下のような URI が設定されているはずです：

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

これらの**上または下に**、新しいURIを追加してください。

### 5. 保存

1. **保存** ボタンをクリック
2. 変更が適用されるまで数秒待つ

## ✅ 確認

設定後、以下を確認：

### リダイレクト URI の一覧

```
✓ http://localhost:3000/auth/callback
✓ http://localhost:3001/auth/callback
✓ https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback  ← これを追加
```

### すべての URI の要点

1. **localhost の URI**: ローカル開発用
2. **Supabase の URI**: 本番環境用（認証フローで使用）

## 🎯 設定が完了したら

1. **Supabase** の設定も完了していることを確認
2. 本番環境（https://schedule-app-gold-tau.vercel.app）でテスト
3. 「Googleでログイン」をクリックして動作確認

## 🐛 トラブルシューティング

### エラー: "redirect_uri_mismatch"

**原因**: リダイレクト URI が正しく設定されていない

**解決方法**:
- Google Cloud Console で設定した URI を確認
- `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback` が含まれているか確認
- 末尾に `/` がないか確認

### 変更が反映されない

**原因**: 変更が保存されていない、または時間がかかっている

**解決方法**:
- 「保存」ボタンをクリックしたか確認
- 数分待ってから再度テスト
- ブラウザのキャッシュをクリア

## 📝 まとめ

Google Cloud Console に追加するのは：

```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

このURLは：
- ✅ Supabase の認証エンドポイント
- ✅ 本番環境とローカル環境の両方で使用される
- ✅ Google OAuth 認証のコールバック先


# Vercel 本番環境の設定

Vercel にデプロイした後、本番環境でも Google OAuth が動作するように設定します。

## 🔴 現在のエラー

本番環境（https://schedule-app-gold-tau.vercel.app）で以下のエラーが発生：
```
ERR_NAME_NOT_RESOLVED
placeholder.supabase.co のサーバーの IP アドレスが見つかりませんでした
```

## ✅ 解決方法（2つの設定が必要）

### 設定1: Supabase の設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左サイドバー: **Authentication** → **URL Configuration**
4. **Redirect URLs** に以下を追加：
   ```
   https://schedule-app-gold-tau.vercel.app/auth/callback
   ```
5. **Save** をクリック

### 設定2: Google Cloud Console の設定

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. プロジェクトを選択
3. 左サイドバー: **認証情報**
4. 作成した OAuth 2.0 クライアント ID をクリック
5. **承認済みのリダイレクト URI** に以下を追加：
   ```
   https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
   ```
6. **保存** をクリック

## 🔑 重要なポイント

### Supabase の Redirect URL

```
https://schedule-app-gold-tau.vercel.app/auth/callback
```

これは、**アプリの URL + /auth/callback** です。

### Google Cloud Console の Redirect URI

```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

これは、**Supabase の Auth URL** です。
（アプリのURLではありません！）

## 📝 設定の流れ

```
1. ユーザーがアプリにアクセス
   ↓
2. 「Googleでログイン」をクリック
   ↓
3. Google Cloud Console にリダイレクト（認証）
   ↓
4. Supabase の URL にリダイレクト
   https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
   ↓
5. アプリの URL にリダイレクト
   https://schedule-app-gold-tau.vercel.app/auth/callback
```

## ✅ 確認方法

設定後、以下の手順で確認：

1. ブラウザで https://schedule-app-gold-tau.vercel.app にアクセス
2. 「Googleでログイン」をクリック
3. Googleアカウントでログイン
4. エラーが出ずにアプリに戻ればOK！

## 🎯 設定完了後の動作

- ✅ ローカル環境（localhost:3000）でも動作
- ✅ 本番環境（schedule-app-gold-tau.vercel.app）でも動作
- ✅ どちらの環境からでも同じSupabaseデータにアクセス

## 🐛 トラブルシューティング

### エラー: "redirect_uri_mismatch"

**原因**: Google Cloud Console の Redirect URI が正しくない

**解決方法**: 
- Google Cloud Console で設定した Redirect URI を確認
- `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback` が含まれているか確認

### エラー: "Access denied"

**原因**: Supabase の Redirect URL が設定されていない

**解決方法**:
- Supabase ダッシュボードで Redirect URLs を確認
- `https://schedule-app-gold-tau.vercel.app/auth/callback` が追加されているか確認

## 📝 まとめ

本番環境で動かすには、**2つの設定場所** があります：

1. **Supabase**: アプリの URL を Redirect URL に追加
2. **Google Cloud Console**: Supabase の URL を Redirect URI に追加

どちらも必須です！

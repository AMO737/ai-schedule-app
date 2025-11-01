# OAuth 設定ガイド（本番対応版）

## ステップ1: Google Cloud Console で設定

### 1-1. プロジェクトを作成
1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. プロジェクト選択画面で「新しいプロジェクト」をクリック
3. プロジェクト名: `ai-schedule-app`（任意）
4. 「作成」をクリック

### 1-2. OAuth同意画面を設定
1. 左サイドバー: **APIとサービス** → **OAuth同意画面**
2. **重要**: 「外部」を選択 → 「作成」をクリック（「内部」ではない）
3. **アプリ情報**:
   - アプリ名: `AIスケジュール管理`
   - ユーザーサポートメール: **あなたのメールアドレスを入力**（必須）
   - デベロッパーの連絡先情報: **同じメールアドレスを入力**（必須）
4. 「保存して次へ」をクリック
5. 「スコープを追加または削除」はそのまま「保存して次へ」
6. 「テストユーザーを追加」はスキップ → 「保存して次へ」
7. 「概要」画面で「ダッシュボードに戻る」
8. **公開ステータス**: 「公開」を選択（外部ユーザーがログインできるように）

### 1-3. 認証情報を作成
1. 左サイドバー: **認証情報**
2. 「認証情報を作成」 → 「OAuth 2.0 クライアント ID」
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前: `AIスケジュール管理`
5. **承認済みの JavaScript 生成元**:
   ```
   http://localhost:3000
   https://schedule-app-gold-tau.vercel.app
   ```
6. **承認済みのリダイレクト URI**（これが重要！）:
   ```
   https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
   ```
   **注意**: SupabaseのURL（これが正しい）
7. 「作成」をクリック
8. **Client ID** と **Client secret** をコピー（表示されるポップアップ）

## ステップ2: Supabase で設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 左サイドバー: **Authentication** → **Providers**
4. 「Google」を探してクリック
5. **Enable Google** をクリック
6. **Client ID**: 先ほどコピーした Client ID を貼り付け
7. **Client secret**: 先ほどコピーした Client secret を貼り付け
8. 「保存」をクリック

**SupabaseのRedirect URL設定を確認**:
- Supabase Dashboard → **Authentication** → **URL Configuration**
- **Site URL**: `https://schedule-app-gold-tau.vercel.app`
- **Redirect URLs**: 以下を追加（各行を個別に追加）
  ```
  https://schedule-app-gold-tau.vercel.app/auth/callback
  http://localhost:3000/auth/callback
  http://localhost:3001/auth/callback
  capacitor://localhost/auth/callback
  ```

## ステップ3: 動作確認

1. ブラウザで `https://schedule-app-gold-tau.vercel.app` にアクセス
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントを選択
4. 認証が成功してアプリに戻ればOK！

## トラブルシューティング

### エラー: "redirect_uri_mismatch"
- Google Cloud Console の「承認済みのリダイレクト URI」に以下を追加:
  - `https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback`
  
### エラー: "invalid_client"
- Supabase に入力した Client ID / Client secret が正しいか確認
- Google Cloud Console で確認して再コピー

### エラー: "access_denied"
- Google Cloud Console の「OAuth同意画面」で「公開ステータス」を「公開」に変更
- 再度「公開」を選択して保存

### ローカルではログインできるが本番ではできない
- Supabase → **Authentication** → **URL Configuration** で
  - **Redirect URLs** に本番URLを追加
- Google Cloud Console の「承認済みのリダイレクト URI」は以下**のみ**（SupabaseのURL）:
  ```
  https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
  ```

## 重要なポイント

1. **Google Cloud Console**: SupabaseのURL **のみ**を設定
2. **Supabase**: アプリのURL（本番・ローカル両方）を設定
3. **OAuth同意画面**: 「公開」ステータスにする

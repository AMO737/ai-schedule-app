# 次のステップ：OAuth 2.0 クライアントIDの作成

OAuth同意画面の作成が完了したら、次は「認証情報」を作成します。

## 現在のステップ

### 2. 認証情報を作成

1. 左サイドバー: **認証情報** をクリック
2. 上部の **認証情報を作成** をクリック
3. ドロップダウンから **OAuth 2.0 クライアント ID** を選択

### 3. 詳細を入力

以下の内容を入力してください：

**アプリケーションの種類**: 
- **ウェブアプリケーション** を選択

**名前**: 
- `AIスケジュール管理`（任意の名前でOK）

**承認済みの JavaScript 生成元**:
```
http://localhost:3000
http://localhost:3001
```

**承認済みのリダイレクト URI**:
```
https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
```

### 4. 作成を完了

1. **作成** ボタンをクリック
2. ポップアップが表示されるので、**Client ID** と **Client secret** をコピー
3. テキストファイルなどに一時保存してください

## 次のステップ

Client ID と Client secret を取得したら、Supabase に設定します。

詳しくは `OAUTH_QUICK_SETUP.md` の「ステップ2: Supabase で設定」を参照してください。

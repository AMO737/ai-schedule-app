# Client Secret の確認方法

## 方法1: Google Cloud Consoleで確認

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. 左サイドバーから **認証情報** をクリック
3. OAuth 2.0 クライアント ID の一覧が表示されます
4. 作成したクライアント（`AIスケジュール管理`）を探してクリック
5. 「クライアント シークレット」の欄に表示されます（「表示」ボタンをクリックして確認）

## 方法2: 再作成が必要な場合

Client Secret を紛失した場合は、新しいものを作成します：

1. Google Cloud Console の **認証情報** ページ
2. 該当する OAuth 2.0 クライアント ID の右側の **編集** アイコン（鉛筆マーク）をクリック
3. または、直接 **削除** して新しいものを作成

### 新しいクライアントを作成

1. **認証情報を作成** → **OAuth 2.0 クライアント ID**
2. アプリケーションの種類: **ウェブアプリケーション**
3. 名前: `AIスケジュール管理`
4. **承認済みの JavaScript 生成元**:
   ```
   http://localhost:3000
   http://localhost:3001
   ```
5. **承認済みのリダイレクト URI**:
   ```
   https://tekzuupjdohbpveearfb.supabase.co/auth/v1/callback
   ```
6. **作成** をクリック
7. **Client ID** と **Client secret** の両方が表示されます（このとき必ずコピー！）
8. 閉じると Client Secret は二度と表示されません

## 注意

- Client Secret は一度表示されたら二度と表示されません
- 紛失した場合は、新しいクライアントを作成する必要があります
- 表示されたらすぐにコピーしてテキストファイルに保存してください

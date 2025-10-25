# 📖 初心者向け完全手順書

IT知識がなくても大丈夫です。この手順書通りに進めれば、アプリを公開できます。

## 📋 事前準備

### 必要なもの
1. Googleアカウント（既に持っている）
2. GitHubアカウント（無料で作れます）
3. Vercelアカウント（無料で作れます）
4. Supabaseアカウント（無料で作れます）

---

## 🚀 ステップ1: GitHubアカウントを作成（5分）

### 1-1. GitHubにアクセス
1. ブラウザで https://github.com を開く
2. 「Sign up」をクリック

### 1-2. アカウント作成
1. ユーザー名を入力
2. メールアドレスを入力
3. パスワードを設定
4. 「Create account」をクリック
5. メール認証を完了

**完了！GitHubアカウントが作成されました**

---

## 🔧 ステップ2: リポジトリを作成（3分）

### 2-1. 新しいリポジトリを作成
1. GitHubの右上の「+」ボタンをクリック
2. 「New repository」を選択

### 2-2. リポジトリの設定
1. **Repository name**: `ai-schedule-app` と入力
2. **Description**: 「AI学習スケジュール調整アプリ」（任意）
3. **Public** を選択（無料）
4. 「Add a README file」は**チェックしない**
5. 「Create repository」をクリック

### 2-3. リポジトリのURLをコピー
作成されたページで **「Quick setup」** の下にあるURLをコピー
例: `https://github.com/あなたのユーザー名/ai-schedule-app.git`

**控えておいてください！後で使います**

---

## 💻 ステップ3: ターミナルでコマンドを実行（5分）

### 3-1. ターミナルを開く
1. **Mac**: 「アプリケーション」→「ユーティリティ」→「ターミナル」
2. または Spotlight（⌘Space）で「ターミナル」と検索

### 3-2. アプリのフォルダに移動
ターミナルに以下をコピー＆ペーストして Enter:
```bash
cd "/Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app"
```

### 3-3. Gitを初期化
以下をコピー＆ペーストして Enter:
```bash
git init
```

### 3-4. ファイルを追加
以下をコピー＆ペーストして Enter:
```bash
git add .
```

### 3-5. 最初のコミット
以下をコピー＆ペーストして Enter:
```bash
git commit -m "Initial commit"
```

### 3-6. ブランチをmainに変更
以下をコピー＆ペーストして Enter:
```bash
git branch -M main
```

### 3-7. GitHubにプッシュ
**ステップ2で控えたURLを使います**
```bash
git remote add origin https://github.com/あなたのユーザー名/ai-schedule-app.git
git push -u origin main
```

**ユーザー名とパスワードを聞かれたら、GitHubのログイン情報を入力**

**完了！GitHubにアップロードされました**

---

## 🌐 ステップ4: Vercelにデプロイ（5分）

### 4-1. Vercelにアクセス
1. ブラウザで https://vercel.com を開く
2. 「Sign Up」をクリック

### 4-2. GitHubでログイン
1. 「Continue with GitHub」をクリック
2. GitHubの認証を許可

### 4-3. プロジェクトをインポート
1. 「Add New...」→「Project」をクリック
2. `ai-schedule-app` を探して選択
3. 「Import」をクリック

### 4-4. 環境変数を設定（後で設定可能）
この段階では設定しなくてOK。後で設定できます。

### 4-5. デプロイ
1. 「Deploy」ボタンをクリック
2. 2-3分待つ

### 4-6. URLを取得
デプロイが完了すると、URLが表示されます
例: `https://ai-schedule-app.vercel.app`

**控えておいてください！**

---

## 🗄️ ステップ5: Supabaseを設定（10分）

### 5-1. Supabaseにアクセス
1. ブラウザで https://supabase.com を開く
2. 「Start your project」をクリック
3. 「Sign in with GitHub」をクリック

### 5-2. 新しいプロジェクトを作成
1. 「New Project」をクリック
2. **組織名**: 好きな名前（例: 自分の名前）
3. **プロジェクト名**: `ai-schedule-app`
4. **データベースのパスワード**: メモしておく
5. **リージョン**: `Northeast Asia (Tokyo)` を選択
6. 「Create new project」をクリック
7. 2-3分待つ

### 5-3. APIキーを取得
1. 左側のメニューから「Settings」をクリック
2. 「API」を選択
3. 以下の値をコピーしてメモ:
   - **Project URL**（URL）
   - **anon public**（キー）

### 5-4. データベースを設定
1. 左側のメニューから「SQL Editor」をクリック
2. 「New query」をクリック
3. 以下のファイルの内容をコピーして貼り付け:
   - ファイル: `supabase/migrations/001_initial_schema.sql`
4. 「Run」ボタンをクリック

### 5-5. Vercelに環境変数を設定
1. Vercelのダッシュボードに戻る
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」をクリック
4. 以下を追加:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: ステップ5-3でコピーしたURL
   - 「Save」をクリック
   
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: ステップ5-3でコピーしたキー
   - 「Save」をクリック

### 5-6. 再デプロイ
1. Vercelのダッシュボードで「Deployments」タブをクリック
2. 最新のデプロイの「...」をクリック
3. 「Redeploy」を選択

**完了！データベースが接続されました**

---

## 🎉 完了！

アプリが公開されました！

### アクセス方法
Vercelのダッシュボードに表示されているURLにアクセス

例: `https://ai-schedule-app.vercel.app`

### 使い方
1. アプリにアクセス
2. 固定予定を登録
3. 学習目標を設定
4. スケジュールを確認

---

## ❓ エラーが出た場合

### よくあるエラー

**1. Gitのエラー**
```bash
git: command not found
```
→ Gitをインストールする必要があります
- ダウンロード: https://git-scm.com/downloads

**2. パスワードが聞かれる**
→ GitHubのPersonal Access Tokenを使う必要があります
- 設定方法: https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

**3. ビルドエラー**
→ Vercelのログを確認
- Vercelダッシュボード → Deployments → エラーをクリック

---

## 📞 サポート

分からないことがあったら:
1. ここで質問してください
2. GitHubのIssuesに報告してください
3. ドキュメントを確認してください

頑張ってください！🎉

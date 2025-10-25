# 最後のステップ - 環境変数の設定

## 🔧 Vercelで環境変数を設定する

### ステップ1: Vercelのダッシュボードにアクセス
1. https://vercel.com/dashboard を開く
2. ブラウザでログイン

### ステップ2: プロジェクトを選択
1. 「ai-schedule」というプロジェクトを探す
2. クリックしてプロジェクトを開く

### ステップ3: Settingsを開く
1. 画面上部のタブから「Settings」をクリック
2. 左側のメニューから「Environment Variables」をクリック

### ステップ4: 環境変数を追加

#### 1つ目の環境変数
1. 「Name」の欄に以下を入力:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```

2. 「Value」の欄に以下をコピー＆ペースト:
   ```
   https://tekzuupjdohbpveearfb.supabase.co
   ```

3. 「Save」ボタンをクリック

#### 2つ目の環境変数
1. 「Add Another」または「Add New」をクリック
2. 「Name」の欄に以下を入力:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. 「Value」の欄に以下をコピー＆ペースト:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3p1dXBqZG9oYnB2ZWVhcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDk1OTAsImV4cCI6MjA3Njg4NTU5MH0.9XiUxWizidhkK5BlkgqRyqkk5BWKydN8axjYKvsOOz4
   ```

4. 「Save」ボタンをクリック

### ステップ5: 再デプロイ
1. 上部のタブから「Deployments」をクリック
2. 一番上のデプロイの右側にある「...」（3つの点）をクリック
3. 「Redeploy」を選択
4. 「Redeploy」をクリックして確認

### 完了！
2-3分待つと、アプリが更新されます。

---

## 🎉 これで完了です！

アプリにアクセスして、実際に動作することを確認してください。

注意: 現在はまだデモモードですが、すぐに本番モードに切り替えます。

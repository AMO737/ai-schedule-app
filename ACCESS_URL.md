# 正しいアクセスURL

## ✅ 正しいURL

アプリにアクセスするときは、以下のURLを使ってください：

```
http://localhost:3000
```

または

```
http://localhost:3001
```

## ❌ 間違ったURL

**このURLは使わないでください：**
- ❌ `https://tekzuupjdohbpveearfb.supabase.co`
- ❌ `placeholder.supabase.co`
- ❌ `https://www.google.com`

これらは Supabase のバックエンド用のURLで、直接アクセスできません。

## アクセス方法

### 1. ターミナルで開発サーバーを起動

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
npm run dev
```

### 2. ブラウザで localhost にアクセス

ターミナルに表示されるURLをブラウザで開いてください：

```
http://localhost:3000
```

または

```
http://localhost:3001
```

### 3. ログインページが表示される

以下のような画面が表示されればOKです：

```
学習スケジュール管理

Googleアカウントでログインして
効率的に学習を進めましょう

[Googleでログイン] ボタン
```

## よくある間違い

### ❌ 間違い1: 検索エンジンで検索

```
Google検索: "ai-schedule-app"
→ これは間違い！公開されていません
```

### ❌ 間違い2: Supabase URL にアクセス

```
ブラウザに直接入力: https://tekzuupjdohbpveearfb.supabase.co
→ これは間違い！バックエンド用です
```

### ✅ 正しい方法

```
ターミナルで npm run dev を実行
→ ブラウザで http://localhost:3000 を開く
→ 正解！
```

## 確認方法

ターミナルを確認してください：

```bash
$ npm run dev
   ▲ Next.js 16.0.0 (Turbopack)
   - Local:        http://localhost:3000    ← これを使って！
   - Network:      http://192.168.11.7:3000
```

この `http://localhost:3000` のURLをコピーしてブラウザに貼り付けてください。

## トラブルシューティング

### エラー: "このサイトにアクセスできません"

**原因**: 間違ったURLにアクセスしている

**解決方法**:
1. ターミナルで `npm run dev` が実行されているか確認
2. ターミナルに表示されているURL（`http://localhost:3000` など）を使う
3. ブラウザのアドレスバーに `http://localhost:3000` と入力

### エラー: "接続が拒否されました"

**原因**: 開発サーバーが起動していない

**解決方法**:
```bash
# ターミナルで
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
npm run dev
```

## まとめ

- ✅ 使うURL: `http://localhost:3000`
- ❌ 使わないURL: Supabase URL、Google URL など
- 🔑 ポイント: ローカルで実行中のアプリにアクセスする

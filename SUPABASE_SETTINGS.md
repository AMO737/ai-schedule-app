# Supabase の設定オプション

Google OAuth を設定する際、以下のオプションが出てきます：

## 設定オプションの説明

### Skip nonce checks（推奨: OFF）

- **意味**: ID トークンに nonce チェックをスキップさせる
- **セキュリティ**: 低くなる（一般的な Web アプリでは非推奨）
- **用途**: iOS アプリなど、nonce にアクセスできない特別な場合のみ
- **推奨設定**: **OFF のまま**

### Allow users without an email（推奨: OFF）

- **意味**: メールアドレスが返されなくても認証を許可する
- **通常**: Google は必ずメールアドレスを返す
- **用途**: メールアドレスが返されない特殊なプロバイダー用
- **推奨設定**: **OFF のまま**

## 推奨設定

```
✅ Skip nonce checks: OFF（チェックしない）
✅ Allow users without an email: OFF（チェックしない）
```

この2つは **ON にしない** でください。セキュリティが弱くなります。

## 入力項目

入力が必要なのは：

1. **Enable Google**: ON（スイッチを有効化）
2. **Client ID (for OAuth)**: Google Cloud Console からコピー
3. **Client Secret (for OAuth)**: Google Cloud Console からコピー

この3つだけです。

Google OAuth を設定する際、以下のオプションが出てきます：

## 設定オプションの説明

### Skip nonce checks（推奨: OFF）

- **意味**: ID トークンに nonce チェックをスキップさせる
- **セキュリティ**: 低くなる（一般的な Web アプリでは非推奨）
- **用途**: iOS アプリなど、nonce にアクセスできない特別な場合のみ
- **推奨設定**: **OFF のまま**

### Allow users without an email（推奨: OFF）

- **意味**: メールアドレスが返されなくても認証を許可する
- **通常**: Google は必ずメールアドレスを返す
- **用途**: メールアドレスが返されない特殊なプロバイダー用
- **推奨設定**: **OFF のまま**

## 推奨設定

```
✅ Skip nonce checks: OFF（チェックしない）
✅ Allow users without an email: OFF（チェックしない）
```

この2つは **ON にしない** でください。セキュリティが弱くなります。

## 入力項目

入力が必要なのは：

1. **Enable Google**: ON（スイッチを有効化）
2. **Client ID (for OAuth)**: Google Cloud Console からコピー
3. **Client Secret (for OAuth)**: Google Cloud Console からコピー

この3つだけです。

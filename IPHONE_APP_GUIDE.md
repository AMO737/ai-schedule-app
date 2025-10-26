# iPhoneアプリ化ガイド

## 完了した作業

✅ Capacitorのインストール完了
✅ Next.jsの静的エクスポート設定完了
✅ iOS プロジェクトの生成完了

## Xcodeでアプリを開く方法

### 1. CocoaPodsのインストール（初回のみ）

ターミナルで以下を実行：

```bash
sudo gem install cocoapods
```

### 2. iOSプロジェクトをXcodeで開く

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
open ios/App/App.xcworkspace
```

または、Finder で以下をダブルクリック：
- `ai-schedule-app/ios/App/App.xcworkspace`

### 3. CocoaPodsの依存関係をインストール

ターミナルで以下を実行：

```bash
cd ios/App
pod install
```

### 4. Xcodeで実行

1. Xcodeが開いたら、上部のデバイス選択で「iPhone」を選択
2. ⏵️（再生）ボタンをクリックして実行

## 実機でテストする方法

### 必要なもの
- Mac
- iPhone
- USBケーブル
- Apple Developerアカウント（無料）

### 手順

1. **Apple Developerアカウントの確認**
   - https://developer.apple.com/ でアカウントを作成

2. **iPhoneの接続**
   - iPhoneをMacにUSBケーブルで接続
   - iPhoneで「このコンピュータを信頼する」をタップ

3. **Xcodeで実機を選択**
   - デバイス選択で自分のiPhoneを選択

4. **署名と機能の設定**
   - Xcode左側の「App」を選択
   - 「Signing & Capabilities」タブを選択
   - 「Team」で自分のApple IDを選択
   - 「Automatically manage signing」にチェック

5. **実行**
   - ⏵️ボタンをクリック
   - 初回のみiPhoneで「信頼されていない開発者」を許可

## App Storeに公開する方法

### 必要なもの
- Apple Developer Program（年額$99、約15,000円）

### 手順

1. **Apple Developer Programに登録**
   - https://developer.apple.com/programs/
   - 年額$99を支払い

2. **Xcodeでアーカイブ**
   - 「Product」→「Archive」
   - 「Distribute App」を選択
   - 「App Store Connect」を選択
   - 指示に従ってアップロード

3. **App Store Connectで申請**
   - https://appstoreconnect.apple.com/
   - アプリ情報を入力
   - 審査に提出

## 今後の改善案

### 通知機能の実装
現在、通知機能はシミュレーションのみです。ネイティブ通知を使用するには：

```bash
npm install @capacitor/local-notifications
npx cap sync
```

### プッシュ通知
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNs)

## トラブルシューティング

### CocoaPodsエラー
```bash
sudo gem install cocoapods
pod repo update
cd ios/App
pod install
```

### ビルドエラー
```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
npm run build
npx cap sync
```

### Xcodeでプロジェクトが開けない
```bash
open ios/App/App.xcworkspace
```

⚠️ 注意：`.xcodeproj`ではなく`.xcworkspace`を開いてください

## 参考リンク

- [Capacitor公式ドキュメント](https://capacitorjs.com/docs)
- [App Store審査ガイドライン](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Developer](https://developer.apple.com/)

## 完了した作業

✅ Capacitorのインストール完了
✅ Next.jsの静的エクスポート設定完了
✅ iOS プロジェクトの生成完了

## Xcodeでアプリを開く方法

### 1. CocoaPodsのインストール（初回のみ）

ターミナルで以下を実行：

```bash
sudo gem install cocoapods
```

### 2. iOSプロジェクトをXcodeで開く

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
open ios/App/App.xcworkspace
```

または、Finder で以下をダブルクリック：
- `ai-schedule-app/ios/App/App.xcworkspace`

### 3. CocoaPodsの依存関係をインストール

ターミナルで以下を実行：

```bash
cd ios/App
pod install
```

### 4. Xcodeで実行

1. Xcodeが開いたら、上部のデバイス選択で「iPhone」を選択
2. ⏵️（再生）ボタンをクリックして実行

## 実機でテストする方法

### 必要なもの
- Mac
- iPhone
- USBケーブル
- Apple Developerアカウント（無料）

### 手順

1. **Apple Developerアカウントの確認**
   - https://developer.apple.com/ でアカウントを作成

2. **iPhoneの接続**
   - iPhoneをMacにUSBケーブルで接続
   - iPhoneで「このコンピュータを信頼する」をタップ

3. **Xcodeで実機を選択**
   - デバイス選択で自分のiPhoneを選択

4. **署名と機能の設定**
   - Xcode左側の「App」を選択
   - 「Signing & Capabilities」タブを選択
   - 「Team」で自分のApple IDを選択
   - 「Automatically manage signing」にチェック

5. **実行**
   - ⏵️ボタンをクリック
   - 初回のみiPhoneで「信頼されていない開発者」を許可

## App Storeに公開する方法

### 必要なもの
- Apple Developer Program（年額$99、約15,000円）

### 手順

1. **Apple Developer Programに登録**
   - https://developer.apple.com/programs/
   - 年額$99を支払い

2. **Xcodeでアーカイブ**
   - 「Product」→「Archive」
   - 「Distribute App」を選択
   - 「App Store Connect」を選択
   - 指示に従ってアップロード

3. **App Store Connectで申請**
   - https://appstoreconnect.apple.com/
   - アプリ情報を入力
   - 審査に提出

## 今後の改善案

### 通知機能の実装
現在、通知機能はシミュレーションのみです。ネイティブ通知を使用するには：

```bash
npm install @capacitor/local-notifications
npx cap sync
```

### プッシュ通知
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNs)

## トラブルシューティング

### CocoaPodsエラー
```bash
sudo gem install cocoapods
pod repo update
cd ios/App
pod install
```

### ビルドエラー
```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
npm run build
npx cap sync
```

### Xcodeでプロジェクトが開けない
```bash
open ios/App/App.xcworkspace
```

⚠️ 注意：`.xcodeproj`ではなく`.xcworkspace`を開いてください

## 参考リンク

- [Capacitor公式ドキュメント](https://capacitorjs.com/docs)
- [App Store審査ガイドライン](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Developer](https://developer.apple.com/)

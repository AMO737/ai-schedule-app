# iOSアプリ クイックスタート

## すでに完了していること
✅ Xcodeでプロジェクトを開きました
✅ iOSプロジェクトの作成完了

## 次にやること

### 1. CocoaPodsをインストール（初回のみ）

ターミナルで以下を実行してください：

```bash
sudo gem install cocoapods
```

パスワードを求められたら、Macのログインパスワードを入力してください。

### 2. 依存関係をインストール

ターミナルで以下を実行してください：

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app/ios/App
pod install
```

### 3. Xcodeで実行

1. Xcodeが開いていることを確認
2. 上部のデバイス選択で「iPhone 15」または「iPhone 15 Pro」を選択
3. ⏵️（再生）ボタンをクリック

## エラーが出た場合

### CocoaPodsが見つからない
```bash
which pod
```

もし見つからなかったら：
```bash
sudo gem install cocoapods
```

### pod installでエラー
```bash
cd ios/App
pod install --repo-update
```

### Xcodeが開かない
Finderで以下を開いてください：
```
ai-schedule-app/ios/App/App.xcworkspace
```

⚠️ 注意：`.xcodeproj`ではなく`.xcworkspace`を開いてください

## 完了後

シミュレーターが起動して、アプリが表示されます！

実機でテストしたい場合は、`IPHONE_APP_GUIDE.md`を参照してください。

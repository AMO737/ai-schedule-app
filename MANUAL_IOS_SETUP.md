# iOSアプリ 手動セットアップ手順

## 今の状況
✅ iOSプロジェクトは作成済み
❌ CocoaPodsのインストールが必要

## 手動でやること

### 方法1: Finderから直接開く（一番簡単）

1. **Finderを開く**
2. 以下の場所に移動：
   ```
   名称未設定フォルダ → ai-schedule-app → ios → App
   ```
3. **`App.xcworkspace`** をダブルクリック
4. Xcodeが開きます

### 方法2: CocoaPodsを使わずに試す

CocoaPodsがなくても、一度試してみることができます：

1. Finderで `ai-schedule-app/ios/App/App.xcworkspace` を開く
2. Xcodeが開く
3. 上部のデバイスで「iPhone」を選択
4. ⏵️ ボタンをクリック

エラーが出たら、CocoaPodsが必要です。

### CocoaPodsをインストールする方法

ターミナルで以下を実行：

```bash
sudo gem install cocoapods
```

**パスワード入力時に注意：**
- 画面に何も表示されませんが、打っているパスワードは正しく入力されています
- 打ち終わったら Enter キーを押してください

インストールに数分かかります。

### インストール後

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app/ios/App
pod install
```

これで完了です！

## トラブルシューティング

### Xcodeが開かない
- `.xcodeproj` ではなく `.xcworkspace` を開いてください

### ビルドエラーが出る
```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
npm run build
```

その後、もう一度Xcodeで試してください。

### それでも動かない
私に知らせてください。一緒に解決しましょう！

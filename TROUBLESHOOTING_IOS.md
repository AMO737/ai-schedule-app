# iOS トラブルシューティング

## よくあるエラーと解決方法

### 1. "Pod install" エラー

**症状：**
- Xcodeでビルドできない
- プラグインが見つからない

**解決方法：**

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app/ios/App
pod install --repo-update
```

### 2. Xcodeでビルドエラー

**症状：**
- コンパイルエラー
- ファイルが見つからない

**解決方法：**

1. Xcodeで **Product → Clean Build Folder** (Shift + Command + K)
2. 再度ビルド

### 3. CocoaPodsがインストールできない

**症状：**
- `command not found: pod`

**解決方法A（推奨）：**

```bash
sudo gem install cocoapods
```

パスワードを入力（画面に表示されないが正しく入力されています）

**解決方法B：**

Homebrewがインストールされている場合：

```bash
brew install cocoapods
```

### 4. シミュレーターが起動しない

**症状：**
- ビルドは成功したが、シミュレーターが開かない

**解決方法：**

1. Xcodeのメニューから **Window → Devices and Simulators**
2. シミュレーターをリセット
3. もう一度再生ボタンをクリック

### 5. "Signing" エラー

**症状：**
- 署名エラーが出る
- 実機で実行できない

**解決方法：**

1. Xcode左側で「App」を選択
2. 「Signing & Capabilities」タブ
3. 「Automatically manage signing」にチェック
4. 「Team」で自分のApple IDを選択

### 6. 最新のWebアプリが反映されない

**症状：**
- アプリを起動しても古いバージョンが表示される

**解決方法：**

```bash
cd /Users/nonakaakirashin/名称未設定フォルダ/ai-schedule-app
npm run build
npx cap sync
```

その後、Xcodeで再ビルド

### 7. メモリ不足エラー

**症状：**
- ビルド中にメモリエラー

**解決方法：**

1. Xcodeを閉じる
2. 他のアプリを閉じる
3. もう一度Xcodeでビルド

### 8. その他の問題

エラーメッセージをコピーして、私に共有してください。

## 基本的なデバッグ手順

1. **クリーンビルド**
   - Product → Clean Build Folder

2. **Derived Dataを削除**
   - Xcode → Preferences → Locations
   - Derived Data のパスを開く
   - フォルダを削除

3. **CocoaPodsを再インストール**
   ```bash
   cd ios/App
   rm -rf Pods Podfile.lock
   pod install
   ```

4. **Capacitorを再同期**
   ```bash
   npx cap sync
   ```

## それでも解決しない場合

1. Xcodeのバージョンを確認
2. Node.js のバージョンを確認 (`node -v`)
3. エラーメッセージの全文を保存
4. 私に連絡してください

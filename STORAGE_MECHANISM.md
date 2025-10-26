# データ保存の仕組み - 完全版

## 🎯 現在の実装状況

### 保存レイヤー（3層バックアップ）

1. **IndexedDB（メイン）**
   - ストレージ: IndexedDB（`idb-keyval` 使用）
   - 特徴: 容量大、プライベートブラウズでも残りやすい
   - キー: `ai-schedule-app:v1`

2. **Cookie（バックアップ）**
   - ストレージ: HTTPOnly Cookie
   - 特徴: ブラウザでデータ削除されても残る可能性が高い
   - キー: `state_v1_0`, `state_v1_1`, ...（分割保存）
   - API: `/api/state` (GET/POST)

3. **Zustand Persist**
   - 自動保存: データ変更時に自動保存
   - ハイドレーション: 起動時にデータ復元

## 📦 保存されるデータ

- `fixedEvents`: 固定予定の配列
- `studyBlocks`: 学習ブロックの配列
- `learningGoal`: 学習目標（オブジェクト or null）
- `countdownTargets`: カウントダウン目標の配列
- `fixedEventExceptions`: 固定予定の例外削除データ

## 🔄 データフロー

### 保存時
```
ユーザーがデータ変更
  ↓
Zustand ストアが更新
  ↓
IndexedDB に自動保存（persist middleware）
  ↓
ハイドレーション完了時に Cookie にも保存
```

### 読み込み時
```
アプリ起動
  ↓
Zustand persist が IndexedDB から読み込み
  ↓
Cookie にもバックアップ保存
  ↓
アプリにデータ表示
```

## ✅ 動作確認方法

### 1. IndexedDB の確認
```javascript
// ブラウザのコンソール（F12）で実行
const db = await window.indexedDB.open('keyval-store', 1)
db.onsuccess = () => {
  const store = db.result.transaction('keyval').objectStore('keyval')
  store.getAll().onsuccess = (e) => {
    console.log('IndexedDB データ:', e.target.result)
  }
}
```

### 2. Cookie の確認
- 開発者ツール → Application → Cookies
- `state_v1_0`, `state_v1_1` などが存在することを確認

### 3. コンソールログの確認
```
💾 IndexedDB にデータを保存しました: ai-schedule-app:v1
✅ Zustandストアのデータ読み込み完了
📊 読み込んだデータ: { fixedEvents: 2, studyBlocks: 3, ... }
```

## 🔧 トラブルシューティング

### データが保存されない場合

1. **ブラウザの設定を確認**
   - Cookie を許可しているか
   - プライベートブラウズモードを外す

2. **ストレージの確認**
   - Application → Storage → IndexedDB にデータがあるか
   - Application → Cookies に `state_v1_*` があるか

3. **コンソールエラーの確認**
   - エラーが出ていないか確認
   - `/api/state` へのPOSTが成功しているか確認

### データが読めない場合

1. **Zustand のハイドレーション確認**
   - `useHydrated` が `true` になっているか
   - 「読み込み中...」画面が表示され続けていないか

2. **IndexedDB の確認**
   - データが存在するか
   - 古いバージョンのデータが残っていないか

## 📝 現在のファイル構成

- `src/store/schedule.ts`: Zustand ストア定義
- `src/lib/idbStorage.ts`: IndexedDB ラッパー
- `src/app/api/state/route.ts`: Cookie 保存 API
- `src/lib/cookieSync.ts`: Cookie 同期フック（未使用）

## 🎉 次のステップ

データが保存されない場合は、以下の順で確認してください：

1. ブラウザのコンソールでエラーを確認
2. Application → Storage で IndexedDB を確認
3. Application → Cookies で Cookie を確認
4. Network タブで `/api/state` のリクエストを確認

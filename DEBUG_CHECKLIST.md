# データ保存のデバッグチェックリスト

## 🔍 確認方法

### 1. ブラウザのコンソールで確認

アプリを開いて開発者ツール（F12）のConsoleタブで以下を確認：

```javascript
// 以下のログが順番に表示されることを確認
🔄 明示的に persist.rehydrate() を呼び出します
✅ persist.rehydrate() 完了 (XXXms)
✅ Zustandストアのデータ読み込み完了
📊 読み込んだデータ: { fixedEvents: X, studyBlocks: Y, ... }
📤 POST /api/state: Cookieに状態を保存中...
✅ POST /api/state: 保存完了
```

### 2. IndexedDB の確認

Applicationタブ → IndexedDB → keyval-store → keyval を確認：

- キー: `ai-schedule-app:v1`
- 値: JSON文字列（デコードするとオブジェクト）

### 3. Cookie の確認

Applicationタブ → Cookies を確認：

- `state_v1_0`, `state_v1_1`, ... などのCookieがあること
- 各Cookieの値がbase64エンコードされたデータ

### 4. リロード後の確認

1. ブラウザをリロード（F5）
2. Consoleで以下のログを確認：
   - `🔄 明示的に persist.rehydrate() を呼び出します`
   - `✅ Zustandストアのデータ読み込み完了`
   - `📊 読み込んだデータ: { fixedEvents: X, ... }` ← X が 0 でなければOK

## 🐛 問題が発生した場合

### データが復元されない

**症状**: リロード後、データが消えている

**確認**:
1. IndexedDBにデータがあるか確認
2. Cookieにデータがあるか確認
3. Consoleのログを確認

**よくある原因**:
- **オリジンが変わった**（http vs https、localhost:3000 vs localhost:3001）
- **スキーマ変更**（versionが変わった）
- **初期化ロジックが上書き**（useEffectで空配列をセットしている）

### Cookieが保存されない

**症状**: POST /api/state は成功するがCookieがない

**確認**:
- Application → Cookies を確認
- 開発環境では `secure: false` であることを確認
- `HttpOnly` が true でも通常は表示される

### IndexedDBにデータがない

**症状**: IDBのキーが存在しない

**確認**:
1. プライベートブラウジングモードでないか
2. ブラウザがIndexedDBをサポートしているか
3. Consoleにエラーが出ていないか

## 🔧 デバッグ用コンソールコマンド

### IndexedDBを直接確認

```javascript
const DB='keyval-store', OS='keyval', KEY='ai-schedule-app:v1';
const req = indexedDB.open(DB);
req.onsuccess = () => {
  const db = req.result;
  const tx = db.transaction(OS,'readonly');
  const store = tx.objectStore(OS);
  const getReq = store.get(KEY);
  getReq.onsuccess = () => console.log('IDB value:', getReq.result);
};
```

### Cookieを確認

```javascript
document.cookie.split(';').filter(c => c.includes('state_v1')).forEach(c => console.log(c));
```

### Zustandストアの現在の状態を確認

```javascript
// ブラウザのコンソールで
console.log(useScheduleStore.getState());
```

## ✅ 完成した実装

- [x] skipHydration: true
- [x] hasHydrated フラグ
- [x] onRehydrateStorage で完了通知
- [x] 明示的な rehydrate()
- [x] IndexedDBの文字列保存
- [x] Cookie バックアップ（サーバ注入）
- [x] Cookie からの復元（IndexedDBがない場合）
- [x] デバッグログ追加
- [x] API の dynamic/force-dynamic 設定

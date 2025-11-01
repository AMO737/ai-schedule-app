# 通知機能の追加実装 TODO

## ✅ 完了している機能

1. **メール通知の基本機能**
   - Resend API 統合
   - メール送信 API
   - 通知設定管理
   - メールアドレス保存

2. **通知生成**
   - 固定予定の例外削除通知
   - アラーム付き学習ブロックの通知（30分前）

3. **UI**
   - 通知ベルアイコン
   - 通知ドロップダウン
   - 未読通知バッジ
   - 既読/削除ボタン

## ❌ 不足している機能

### 1. ブラウザ通知（Browser Notifications） 🚨 **重要**

**現状**: メール通知のみ実装。ブラウザ通知がない。

**必要な実装**:
- `Notification API` の使用許可リクエスト
- ブラウザ通知の表示
- Service Worker の実装
- バックグラウンド通知

**実装例**:
```typescript
// 通知許可をリクエスト
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}

// ブラウザ通知を表示
const showBrowserNotification = (notification: NotificationItem) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/icon.png'
    })
  }
}
```

### 2. 通知タイミングのカスタマイズ 🚨 **重要**

**現状**: 固定で30分前に通知。変更不可。

**必要な実装**:
- 通知タイミング設定（5分前、15分前、30分前、1時間前など）
- 設定保存
- UI での設定変更

**実装例**:
```typescript
interface NotificationSettings {
  enabled: boolean
  email: string
  timing_minutes: number  // 新規追加
}

// 使用例
const timeDiff = startTime.getTime() - now.getTime()
if (timeDiff > 0 && timeDiff <= timing_minutes * 60 * 1000) {
  // 通知生成
}
```

### 3. 通知の永続化 🚨 **重要**

**現状**: リロードで通知が消える。ブラウザメモリのみ。

**必要な実装**:
- LocalStorage または Supabase に通知履歴を保存
- ページ再読み込み後の復元
- 古い通知の自動削除

**実装例**:
```typescript
// 通知を保存
const saveNotifications = (notifications: NotificationItem[]) => {
  localStorage.setItem('notifications', JSON.stringify(notifications))
}

// 通知を読み込み
const loadNotifications = () => {
  const saved = localStorage.getItem('notifications')
  if (saved) {
    const parsed = JSON.parse(saved)
    // 24時間以上古い通知を削除
    const now = new Date()
    const filtered = parsed.filter((n: NotificationItem) => {
      const createdAt = new Date(n.createdAt)
      return now.getTime() - createdAt.getTime() < 24 * 60 * 60 * 1000
    })
    return filtered
  }
  return []
}
```

### 4. 通知の重複チェック改善 📝 **中程度**

**現状**: 基本的な重複チェックのみ。完了済み/スキップ済みのブロックへの通知を送っている可能性。

**必要な実装**:
- 完了済みブロックへの通知を除外
- スキップ済みブロックへの通知を除外
- 送信済み通知の記録とチェック

**実装例**:
```typescript
// 完了済み・スキップ済みを除外
const validBlocks = studyBlocks.filter(block => 
  block.hasAlarm && 
  !block.is_completed && 
  !block.is_skipped
)
```

### 5. 通知の配信状況の追跡 📝 **中程度**

**現状**: 送信したかどうかのログのみ。エラー時の再送なし。

**必要な実装**:
- 送信成功/失敗の記録
- 失敗時の再送機能
- エラーログの記録

### 6. プッシュ通知（Push Notifications） 🔮 **将来**

**現状**: 未実装。

**必要な実装**:
- Service Worker の実装
- Push API の統合
- バックグラウンドでの通知受信

## 🎯 優先順位

### 今すぐ実装すべき（高）
1. ✅ ブラウザ通知
2. ✅ 通知タイミングのカスタマイズ
3. ✅ 通知の永続化

### 今後実装するもの（中）
4. 通知の重複チェック改善
5. 通知の配信状況の追跡

### 将来の拡張（低）
6. プッシュ通知
7. 音声通知
8. 通知のグループ化
9. 通知の優先度

## 📝 実装スケジュール案

### Phase 1: 基本機能の完成（今）
1. ブラウザ通知の実装
2. 通知タイミング設定の追加
3. 通知の永続化

### Phase 2: 品質向上（次）
4. 通知の重複チェック改善
5. 配信状況の追跡

### Phase 3: 高度な機能（将来）
6. プッシュ通知
7. その他の拡張機能


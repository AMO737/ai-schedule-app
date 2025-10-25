# Zustand への移行ガイド

## 完了した作業

✅ Zustandのインストール
✅ ストアの作成 (`src/store/schedule.ts`)

## 次のステップ

### 1. page.tsxの更新

SimpleStorageをZustandストアに置き換える：

```typescript
// 既存のimport
import { SimpleStorage } from '@/lib/simple-storage'

// ↓ これを追加
import { useScheduleStore } from '@/store/schedule'
import { useHydrated } from '@/store/schedule'

// 既存のstate
const [demoFixedEvents, setDemoFixedEvents] = useState<any[]>([])

// ↓ これを追加
const fixedEvents = useScheduleStore(state => state.fixedEvents)
const addFixedEvent = useScheduleStore(state => state.addFixedEvent)
const updateFixedEvent = useScheduleStore(state => state.updateFixedEvent)
const removeFixedEvent = useScheduleStore(state => state.removeFixedEvent)
const setFixedEvents = useScheduleStore(state => state.setFixedEvents)
```

### 2. 変更が必要な箇所

1. **useStateの削除**
   - `demoFixedEvents` → `fixedEvents` (ストアから取得)
   - `demoStudyBlocks` → `studyBlocks` (ストアから取得)
   - `countdownTargets` → `countdownTargets` (ストアから取得)
   - `learningGoal` → `learningGoal` (ストアから取得)

2. **useEffectの削除**
   - `loadFromStorage()` 関数の削除
   - `isInitialLoad` 関連の削除
   - SimpleStorageへの保存のuseEffect削除

3. **設定関数の置き換え**
   - `setDemoFixedEvents([...events])` → `setFixedEvents([...events])`
   - `setDemoStudyBlocks([...blocks])` → `setStudyBlocks([...blocks])`
   - 同様に他のstateも置き換え

### 3. ハイドレーション対応

```typescript
const hydrated = useHydrated()

if (!hydrated) {
  return <div>読み込み中...</div>
}
```

### 4. データの移行

既存のLocalStorageデータをZustandに移行する場合：

```typescript
// 初回のみ実行（既存データの移行）
useEffect(() => {
  const oldData = {
    fixedEvents: localStorage.getItem('schedule_app_fixedEvents'),
    studyBlocks: localStorage.getItem('schedule_app_studyBlocks'),
    // ...
  }
  
  if (oldData.fixedEvents) {
    // Zustandストアに設定
    useScheduleStore.getState().setFixedEvents(JSON.parse(oldData.fixedEvents))
  }
  // 旧データを削除
  localStorage.removeItem('schedule_app_fixedEvents')
}, [])
```

## メリット

1. **コードの簡潔化**: useStateの削減、useEffectの削減
2. **型安全性**: TypeScriptで完全な型サポート
3. **パフォーマンス**: 不要な再レンダリングの削減
4. **デバッグ**: Redux DevTools対応
5. **将来性**: IndexedDBやSupabaseへの移行が容易

## ロールバック

問題が発生した場合：

```bash
git checkout HEAD -- src/app/page.tsx
git checkout HEAD -- src/components/
```

## 参考

- [Zustand公式ドキュメント](https://docs.pmnd.rs/zustand)
- [persist middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)

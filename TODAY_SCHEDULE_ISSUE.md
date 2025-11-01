# 今日の学習スケジュール非表示問題の調査レポート

## 問題の状況

**症状**: カレンダーから今日の学習ブロックを追加しても、ダッシュボードの「今日の学習スケジュール」に表示されない

**現在の状態**:
- Debug: Total blocks: 6, Today blocks: 0
- Today's date: 2025-11-01
- Block dates: 2025-10-31, 2025-10-31, 2025-10-31

## 実装状況

### 1. TodaySchedule.tsx
- ✅ `useMemo`で今日のブロックをフィルタリング
- ✅ 日付比較: `block.date.substring(0, 10) === today`
- ✅ Zustandから`studyBlocks`を受け取る
- ✅ `onUpdateBlock`コールバックで完了・スキップ処理

**フィルタリングロジック** (28-45行目):
```typescript
const filtered = externalStudyBlocks.filter(block => {
  const blockDateStr = block.date
  if (!blockDateStr) return false
  const blockDateOnly = blockDateStr.substring(0, 10)
  const matches = blockDateOnly === today
  return matches
}).sort((a, b) => a.start_time.localeCompare(b.start_time))
```

### 2. StudyBlockForm.tsx
- ✅ 学習目標の科目のみ選択可能
- ✅ `formData.scheduled_date`を`date`として送信
- ✅ デバッグログ追加済み

**送信データ** (94-106行目):
```typescript
const submitData = {
  subject: formData.subject.trim(),
  date: formData.scheduled_date,  // YYYY-MM-DD
  start_time: formData.start_time,
  end_time: formData.end_time,
  duration: calculateDuration(),
  // ...
}
```

### 3. page.tsx
- ✅ `studyBlocks`をZustandから取得
- ✅ `TodaySchedule`に`studyBlocks`を渡す
- ✅ `onUpdateBlock`でZustandを更新
- ✅ デバッグログ追加済み

**TodaySchedule使用箇所** (397-408行目):
```typescript
<TodaySchedule 
  userId={currentUser.id} 
  studyBlocks={studyBlocks}  // Zustandから
  key={`today-${studyBlocks.length}`}
  onUpdateBlock={(blockId, updates) => {
    setStudyBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, ...updates, updated_at: new Date().toISOString() }
        : block
    ))
  }}
/>
```

### 4. Zustand Store
- ✅ `studyBlocks`を配列で管理
- ✅ `setStudyBlocks`で更新
- ✅ IndexedDBに永続化

## データフロー

1. **学習ブロック追加**:
   - `StudyBlockForm` → `page.tsx`の`onSubmit`
   - `setStudyBlocks(prev => [...prev, newBlock])`
   - Zustand → IndexedDB → 自動保存

2. **今日のブロック表示**:
   - `page.tsx` → Zustandから`studyBlocks`取得
   - `TodaySchedule`に`studyBlocks`を渡す
   - `useMemo`でフィルタリング → `blocks`に設定
   - 表示

## デバッグログ

現在追加済みのログ:
- `[TodaySchedule] Today:` - 今日の日付
- `[TodaySchedule] All block dates:` - 全ブロックの日付
- `[TodaySchedule] Date mismatch:` - 日付不一致の理由
- `[TodaySchedule] Filtered blocks:` - フィルタ済みブロック
- `[StudyBlockForm] Submitting with formData:` - フォーム送信時
- `[StudyBlockForm] Submit data:` - 送信データ
- `新規作成モード: ブロックを追加します` - 追加モード
- `newBlock:` - 作成されたブロック
- `studyBlocks after update:` - 更新後の全ブロック

## 観察された現象

- Total blocks: 6 → Zustandに6個のブロックがある
- Today blocks: 0 → 今日のブロックが0個
- Block dates: 2025-10-31 → すべて昨日の日付
- Today's date: 2025-11-01 → 今日の日付

**結論**: 日付フィルタリングは正常に動作しているが、今日のブロックが追加されていない

## 可能性のある原因

### A. 日付設定の問題
- `formData.scheduled_date`が空または誤った値
- `selectedDate`が正しく渡されていない

### B. Zustand更新の問題
- `setStudyBlocks`が呼ばれていない
- 状態更新が反映されていない
- `key` propの影響で再レンダリングされない

### C. タイミングの問題
- `useMemo`の依存配列の問題
- `externalStudyBlocks`の参照変更が検知されない

## 次のステップ

1. **本番で今日のブロックを追加**して、以下を確認:
   - `[StudyBlockForm] Submit data:` の`date`フィールド
   - `newBlock:` の`date`フィールド
   - `studyBlocks after update:` の最新ブロックの`date`

2. **コンソールで確認すべきポイント**:
   - `[TodaySchedule] Date mismatch:` が出力されるか
   - `[TodaySchedule] Filtered blocks:` の結果
   - `[TodaySchedule] Today:` とブロックの`date`が一致するか

3. **追加調査が必要な場合**:
   - Zustandの`onRehydrateStorage`を確認
   - IndexedDBへの保存を確認
   - `useScheduleStore.persist.rehydrate()`の動作を確認

## 関連ファイル

- `src/components/dashboard/TodaySchedule.tsx` - 今日のブロック表示
- `src/components/study-blocks/StudyBlockForm.tsx` - ブロック追加フォーム
- `src/app/page.tsx` - メインページ（データフロー）
- `src/store/schedule.ts` - Zustandストア
- `src/lib/idbStorage.ts` - IndexedDB永続化

## 技術スタック

- Next.js 15 (App Router)
- Zustand (状態管理)
- IndexedDB (永続化)
- TypeScript

## デプロイ状況

- 最新コミット: `121d2ae` - Add today's date to TodaySchedule debug display
- Vercel自動デプロイ: 完了
- 本番URL: https://schedule-app-gold-tau.vercel.app


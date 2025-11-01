# 今日の学習スケジュール問題 調査まとめ

## 原因特定完了 🎯

**根本原因**: UTC vs ローカル日付の不一致

### 問題の詳細
- `TodaySchedule.tsx`が `new Date().toISOString().split('T')[0]` で**UTC日付**を作成
- Zustandストアに保存された`studyBlocks`は**ローカル日付** (YYYY-MM-DD)
- 日本時間だと同じ日でも、UTCでは前日判定になることがある

### 修正内容 (2025-11-01)

#### 1. TodaySchedule.tsx
```typescript
// Before: UTC日付
const today = new Date().toISOString().split('T')[0]

// After: ローカル日付
const now = new Date()
const yyyy = now.getFullYear()
const mm = String(now.getMonth() + 1).padStart(2, '0')
const dd = String(now.getDate()).padStart(2, '0')
const today = `${yyyy}-${mm}-${dd}` // ← JSTベースの今日
```

#### 2. StudyBlockForm.tsx
- 初期化時に日付をローカルに変換する`formatDateToLocal()`を追加
- `selectedDate.toISOString().split('T')[0]`を廃止し、ローカル形式へ統一
- サブミット時の日付もローカル形式を維持

#### 3. Debug情報の改善
- UIに表示される「Today's date」もローカル日付に統一
- コンソールログに`today(local)=`と`incoming blocks=`を追加

### 期待される動作
- 本番URL: https://schedule-app-gold-tau.vercel.app
- カレンダーで「今日」のブロックを追加
- ダッシュボードの「今日の学習スケジュール」に即座に表示
- 日付の一致を確認

### 確認済み
- ✅ ビルド成功
- ✅ Lintエラーなし
- ✅ TypeScriptエラーなし
- ✅ ローカル日付による統一完了

## 今後の移行準備

### Supabase統合
将来的なSupabase統合のために以下を実装済み:
- ✅ `schedules`テーブルのマイグレーション
- ✅ `loadTodaySchedules()` API (JST timezone対応)
- ✅ `insertSchedule()` API
- ✅ `updateScheduleDone()` API
- ✅ Schedule型定義

移行方法: `SCHEDULE_INTEGRATION_PLAN.md`参照

## 履歴
- 2025-11-01: UTC日付問題を修正、ローカル日付で統一
- 2025-10-31: 初期調査、デバッグログ追加

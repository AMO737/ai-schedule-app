# スケジュール統合実装計画

## 問題の整理

現状の状況:
- カレンダーで学習タスクを追加しても、ダッシュボードの「今日の学習スケジュール」に表示されない
- システムは現在Supabaseを使用せず、Zustand + IndexedDBでクライアント側のみ管理
- `study_blocks`テーブルは存在するが使用されていない
- カレンダーとダッシュボードが別々のデータソースを参照している可能性

## 実装アプローチ

### オプション1: Supabaseに完全移行 (推奨)
- Pros: データの一貫性、リアルタイム同期、複数デバイス対応
- Cons: 既存のローカルデータ移行が必要、Supabase設定が必要

### オプション2: Zustandで統一する(現在の修正)
- Pros: 既存インフラを活用、即時対応可能
- Cons: デバイス間同期なし、ブラウザクリーン時にデータ消失

## 推奨: オプション1の段階的移行

### フェーズ1: インフラ準備
- [x] `schedules`テーブルの作成
- [x] `loadTodaySchedules()`の実装
- [x] `insertSchedule()`の実装
- [x] `updateScheduleDone()`の実装

### フェーズ2: TodayScheduleの移行
- TodayScheduleコンポーネントを新APIに接続
- 既存の`externalStudyBlocks`と並行運用
- データ取得をSupabase経由に変更

### フェーズ3: カレンダーの移行
- StudyBlockFormの送信先をSupabaseに変更
- QuickEventAddModalの送信先をSupabaseに変更
- DailyTimeScheduleのイベント追加をSupabaseに変更

### フェーズ4: データ移行とクリーンアップ
- 既存のZustandデータをSupabaseに移行
- 旧APIの削除
- 動作確認とテスト

## 実装済み

1. ✅ `src/lib/schedules.ts` - Schedule API関数
2. ✅ `src/types/index.ts` - Schedule interface
3. ✅ `supabase/migrations/002_create_schedules_table.sql` - テーブル定義

## 次のステップ

1. TodayScheduleコンポーネントの更新
2. カレンダー画面の更新
3. 統合テスト


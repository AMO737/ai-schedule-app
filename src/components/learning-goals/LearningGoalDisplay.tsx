'use client'

import { useState, useEffect } from 'react'
import { LearningGoal } from '@/types'
import { Button } from '@/components/ui/button'
import { LearningGoalService } from '@/lib/learning-goals'

interface LearningGoalDisplayProps {
  userId: string
  learningGoal?: LearningGoal | null
  onEdit?: (goal: LearningGoal | null) => void
}

export function LearningGoalDisplay({ userId, learningGoal, onEdit }: LearningGoalDisplayProps) {
  const [goal, setGoal] = useState<LearningGoal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (learningGoal) {
      // 外部から渡された学習目標を使用
      setGoal(learningGoal)
      setLoading(false)
    } else {
      // デモデータなし
      setGoal(null)
      setLoading(false)
    }
  }, [userId, learningGoal])

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-700">読み込み中...</p>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-700">学習目標が設定されていません</p>
      </div>
    )
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM format
  }

  const handleEdit = () => {
    if (goal && onEdit) {
      onEdit(goal)
    } else {
      console.log('学習目標を編集します')
    }
  }

  const onDelete = () => {
    if (confirm('学習目標を削除しますか？')) {
      console.log('学習目標を削除します')
      // デモモードでは削除後もデータを保持
      // setGoal(null) // コメントアウト
      // 削除後にフォームを表示するために親コンポーネントに通知
      if (onEdit) {
        onEdit(null as any) // 削除を通知
      }
    }
  }

  const totalWeeklyMinutes = goal.weekly_hours * 60
  const blockCount = Math.floor(totalWeeklyMinutes / goal.block_duration)

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">学習目標</h2>
        <div className="flex space-x-2">
          <Button onClick={handleEdit} variant="outline" size="sm">
            編集
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm">
            削除
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">基本設定</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-800">週の学習時間:</span>
              <span className="font-medium">{goal.weekly_hours}時間</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">ブロック長:</span>
              <span className="font-medium">{goal.block_duration}分</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">予想ブロック数:</span>
              <span className="font-medium">{blockCount}個</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">起床時刻:</span>
              <span className="font-medium">{formatTime(goal.wake_up_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">就寝時刻:</span>
              <span className="font-medium">{formatTime(goal.sleep_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">休憩時間:</span>
              <span className="font-medium">{goal.break_duration}分</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">科目配分</h3>
          <div className="space-y-2">
            {goal.subject_distribution.map((subject, index) => {
              const minutes = Math.floor(totalWeeklyMinutes * subject.percentage / 100)
              const blocks = Math.floor(minutes / goal.block_duration)
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{subject.subject}</span>
                    <span className="text-sm text-gray-700">({subject.percentage}%)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{minutes}分</div>
                    <div className="text-xs text-gray-700">{blocks}ブロック</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">ステータス:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            goal.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {goal.is_active ? '有効' : '無効'}
          </span>
        </div>
      </div>
    </div>
  )
}

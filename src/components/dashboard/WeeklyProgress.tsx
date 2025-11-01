'use client'

import { useMemo } from 'react'
import { StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'

interface WeeklyProgressProps {
  userId: string
  studyBlocks?: StudyBlock[]
  onUpdateBlock?: (blockId: string, updates: Partial<StudyBlock>) => void
}

export function WeeklyProgress({ userId, studyBlocks: externalStudyBlocks, onUpdateBlock }: WeeklyProgressProps) {
  // 未完了の過去ブロックを取得
  const incompleteBlocks = useMemo(() => {
    if (!externalStudyBlocks || externalStudyBlocks.length === 0) return []
    
    // 今日の日付を取得（ローカル）
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const today = `${yyyy}-${mm}-${dd}`
    
    // 過去で未完了のブロックを取得
    const pastIncomplete = externalStudyBlocks.filter(block => {
      if (!block.date) return false
      const blockDate = block.date.slice(0, 10)
      return blockDate < today && !block.is_completed && !block.is_skipped
    })
    
    // 日付でソート（古い順）
    return pastIncomplete.sort((a, b) => {
      const dateA = a.date?.slice(0, 10) || ''
      const dateB = b.date?.slice(0, 10) || ''
      return dateA.localeCompare(dateB)
    })
  }, [externalStudyBlocks])

  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM format
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = dateStr.slice(0, 10)
    const date = new Date(d + 'T12:00:00') // タイムゾーンの問題を回避
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const handleComplete = (blockId: string) => {
    if (onUpdateBlock) {
      onUpdateBlock(blockId, { is_completed: true, completed_at: new Date().toISOString() })
    }
  }

  const handleSkip = (blockId: string) => {
    if (onUpdateBlock) {
      onUpdateBlock(blockId, { is_skipped: true })
    }
  }

  if (incompleteBlocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">週間進捗</h2>
        <p className="text-gray-700">未完了の学習ブロックはありません。順調です！</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">未完了の学習ブロック</h2>
      <p className="text-sm text-gray-500 mb-4">
        {incompleteBlocks.length}件の未完了タスクがあります
      </p>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {incompleteBlocks.map((block) => (
          <div
            key={block.id}
            className="border rounded-lg p-4 bg-orange-50 border-orange-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-lg">{block.subject}</h3>
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    {formatDate(block.date)}
                  </span>
                </div>
                <p className="text-gray-800 mt-1">
                  {formatTime(block.start_time)} - {formatTime(block.end_time)} ({block.duration}分)
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  設定日: {block.date?.slice(0, 10)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleComplete(block.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  完了
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSkip(block.id)}
                >
                  スキップ
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



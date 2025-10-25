'use client'

import { useState, useEffect } from 'react'
import { StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'

interface TodayScheduleProps {
  userId: string
}

export function TodaySchedule({ userId }: TodayScheduleProps) {
  const [blocks, setBlocks] = useState<StudyBlock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // デモデータなし
    setBlocks([])
    setLoading(false)
  }, [userId])

  const handleComplete = async (blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, is_completed: true, completed_at: new Date().toISOString() }
        : block
    ))
  }

  const handleSkip = async (blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, is_skipped: true }
        : block
    ))
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM format
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">今日の学習スケジュール</h2>
        <p className="text-gray-700">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">今日の学習スケジュール</h2>
      
      {blocks.length === 0 ? (
        <p className="text-gray-700">今日の学習ブロックがありません。</p>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`border rounded-lg p-4 ${
                block.is_completed 
                  ? 'bg-green-50 border-green-200' 
                  : block.is_skipped 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{block.subject}</h3>
                  <p className="text-gray-800">
                    {formatTime(block.start_time)} - {formatTime(block.end_time)} ({block.duration}分)
                  </p>
                  {block.is_completed && (
                    <p className="text-sm text-green-600">完了済み</p>
                  )}
                  {block.is_skipped && (
                    <p className="text-sm text-gray-700">スキップ済み</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!block.is_completed && !block.is_skipped && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
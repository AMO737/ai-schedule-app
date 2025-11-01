'use client'

import { useState, useEffect, useMemo } from 'react'
import { StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'
import { StudyBlockService } from '@/lib/study-blocks'

interface TodayScheduleProps {
  userId: string
  studyBlocks?: StudyBlock[]
  onUpdateBlock?: (blockId: string, updates: Partial<StudyBlock>) => void
}

export function TodaySchedule({ userId, studyBlocks: externalStudyBlocks, onUpdateBlock }: TodayScheduleProps) {
  const [blocks, setBlocks] = useState<StudyBlock[]>([])
  const [loading, setLoading] = useState(true)

  // 今日のブロックを計算
  const todayBlocks = useMemo(() => {
    console.log('[TodaySchedule] useMemo called, externalStudyBlocks:', externalStudyBlocks)
    if (!externalStudyBlocks || externalStudyBlocks.length === 0) {
      console.log('[TodaySchedule] No external study blocks')
      return []
    }
    // JSTベースの今日を計算
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const today = `${yyyy}-${mm}-${dd}` // ← JSTベースの今日
    
    console.log('[TodaySchedule] today(local)=', today)
    console.log('[TodaySchedule] incoming blocks=', externalStudyBlocks)
    console.log('[TodaySchedule] Filtering blocks, total:', externalStudyBlocks.length)
    console.log('[TodaySchedule] All block dates:', externalStudyBlocks.map(b => ({ id: b.id, date: b.date, subject: b.subject })))
    const filtered = externalStudyBlocks.filter(block => {
      // dateフィールドを確認
      if (!block?.date) {
        console.log('[TodaySchedule] Block has no date:', block.id)
        return false
      }
      
      // "YYYY-MM-DD" だけを見る（ISO文字列の場合も対応）
      const raw = block.date
      const d = raw.includes('T') ? raw.split('T')[0] : raw.slice(0, 10)
      
      // 明日以降は絶対に表示しない
      if (d > today) {
        console.log('[TodaySchedule] Future date excluded:', d, '>', today)
        return false
      }
      
      // 過去は表示しない（今日は表示）
      if (d < today) {
        console.log('[TodaySchedule] Past date excluded:', d, '<', today)
        return false
      }
      
      // ここまで来たら今日
      console.log('[TodaySchedule] Today\'s block:', d, '==', today)
      return true
    }).sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
    console.log('[TodaySchedule] Filtered blocks:', filtered)
    return filtered
  }, [externalStudyBlocks])

  useEffect(() => {
    if (externalStudyBlocks) {
      // 外部から渡されたstudyBlocksを使用
      setBlocks(todayBlocks)
      setLoading(false)
    } else {
      // 旧実装：サービスから取得（デモデータなし）
      const fetchTodayBlocks = async () => {
        try {
          const today = new Date()
          const data = await StudyBlockService.getStudyBlocks(userId, today)
          setBlocks(data)
        } catch (error) {
          console.error('Failed to fetch today blocks:', error)
        } finally {
          setLoading(false)
        }
      }

      if (userId) {
        fetchTodayBlocks()
      }
    }
  }, [userId, externalStudyBlocks, todayBlocks])

  const handleComplete = async (blockId: string) => {
    if (onUpdateBlock) {
      onUpdateBlock(blockId, { is_completed: true, completed_at: new Date().toISOString() })
    } else {
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, is_completed: true, completed_at: new Date().toISOString() }
          : block
      ))
    }
  }

  const handleSkip = async (blockId: string) => {
    if (onUpdateBlock) {
      onUpdateBlock(blockId, { is_skipped: true })
    } else {
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, is_skipped: true }
          : block
      ))
    }
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
        <div>
          <p className="text-gray-700">今日の学習ブロックがありません。</p>
          <p className="text-xs text-gray-500 mt-2">
            Debug: Total blocks: {externalStudyBlocks?.length || 0}, Today blocks: {todayBlocks.length}
            <span className="block mt-1">
              Today's date (local): {(() => {
                const now = new Date()
                const yyyy = now.getFullYear()
                const mm = String(now.getMonth() + 1).padStart(2, '0')
                const dd = String(now.getDate()).padStart(2, '0')
                return `${yyyy}-${mm}-${dd}`
              })()}
            </span>
            {externalStudyBlocks && externalStudyBlocks.length > 0 && (
              <span className="block mt-1">Block dates: {externalStudyBlocks.slice(0, 3).map(b => b.date).join(', ')}</span>
            )}
          </p>
        </div>
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
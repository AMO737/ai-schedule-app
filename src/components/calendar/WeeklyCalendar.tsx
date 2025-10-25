'use client'

import { useState, useEffect } from 'react'
import { FixedEvent, StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'

interface WeeklyCalendarProps {
  userId: string
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  onDateClick: (date: Date) => void
  fixedEventExceptions?: { [key: string]: string[] | undefined }
}

export function WeeklyCalendar({ userId, fixedEvents, studyBlocks, onDateClick, fixedEventExceptions = {} }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const today = new Date()

  // 週の開始日（月曜日）を取得
  const getWeekStart = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // 月曜日を週の開始とする
    return new Date(date.setDate(diff))
  }

  // 週の日付配列を生成
  const getWeekDays = (weekStart: Date) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      days.push(date)
    }
    return days
  }

  const weekDays = getWeekDays(getWeekStart(new Date(currentWeek)))

  // 指定日の固定予定を取得
  const getFixedEventsForDate = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dateStr = date.toISOString().split('T')[0]
    const exceptionsForDate = fixedEventExceptions[dateStr] || []
    
    return fixedEvents.filter(event => 
      event.is_active && 
      event.day_of_week === dayOfWeek &&
      !exceptionsForDate.includes(event.id)
    )
  }

  // 指定日の学習ブロックを取得
  const getStudyBlocksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return studyBlocks.filter(block => 
      block.date && block.date.startsWith(dateStr)
    )
  }

  // 日付が今日かどうか
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  // 日付が選択されているかどうか
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  // 日付クリック処理
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick(date)
  }

  // 前週に移動
  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  // 次週に移動
  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  // 今週に戻る
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date())
    setSelectedDate(null)
  }

  const dayNames = ['月', '火', '水', '木', '金', '土', '日']

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {currentWeek.getFullYear()}年{currentWeek.getMonth() + 1}月 第{Math.ceil(weekDays[0].getDate() / 7)}週
        </h2>
        <div className="flex space-x-2">
          <Button onClick={goToPreviousWeek} variant="outline" size="sm">
            ←
          </Button>
          <Button onClick={goToCurrentWeek} variant="outline" size="sm">
            今週
          </Button>
          <Button onClick={goToNextWeek} variant="outline" size="sm">
            →
          </Button>
        </div>
      </div>

      {/* 週間グリッド */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const fixedEventsForDate = getFixedEventsForDate(date)
          const studyBlocksForDate = getStudyBlocksForDate(date)
          const completedBlocks = studyBlocksForDate.filter(block => block.is_completed).length
          const totalBlocks = studyBlocksForDate.length

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                min-h-[120px] p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors
                ${isToday(date) ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'}
                ${isSelected(date) ? 'bg-blue-100' : ''}
              `}
            >
              <div className="text-center mb-3">
                <div className="text-sm text-gray-700">{dayNames[index]}</div>
                <div className="text-lg font-semibold">{date.getDate()}</div>
              </div>
              
              {/* 固定予定の表示 */}
              <div className="space-y-1 mb-3">
                {fixedEventsForDate.map((event, idx) => (
                  <div
                    key={idx}
                    className="text-xs px-2 py-1 rounded text-center text-white font-medium"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                    <div className="text-xs text-white opacity-90">
                      {event.start_time}-{event.end_time}
                    </div>
                  </div>
                ))}
              </div>

              {/* 学習ブロックの進捗表示 */}
              {totalBlocks > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-800 text-center mb-1">
                    {completedBlocks}/{totalBlocks}ブロック
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(completedBlocks / totalBlocks) * 100}%`,
                        backgroundColor: studyBlocksForDate.length > 0 ? studyBlocksForDate[0].color : '#10B981'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 学習ブロックがない場合の表示 */}
              {totalBlocks === 0 && (
                <div className="text-xs text-gray-600 text-center">
                  学習予定なし
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 週間サマリー */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">今週のサマリー</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {weekDays.reduce((sum, date) => sum + getFixedEventsForDate(date).length, 0)}
            </div>
            <div className="text-gray-600">固定予定</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {weekDays.reduce((sum, date) => sum + getStudyBlocksForDate(date).filter(block => block.is_completed).length, 0)}
            </div>
            <div className="text-gray-600">完了ブロック</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {weekDays.reduce((sum, date) => sum + getStudyBlocksForDate(date).length, 0)}
            </div>
            <div className="text-gray-600">総ブロック</div>
          </div>
        </div>
      </div>
    </div>
  )
}

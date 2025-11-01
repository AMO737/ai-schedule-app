'use client'

import { useState, useEffect } from 'react'
import { FixedEvent, StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'

interface MonthlyCalendarProps {
  userId: string
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  onDateClick: (date: Date) => void
  selectedDate?: Date | null
  fixedEventExceptions?: { [key: string]: string[] | undefined }
}

export function MonthlyCalendar({ userId, fixedEvents, studyBlocks, onDateClick, selectedDate: externalSelectedDate, fixedEventExceptions = {} }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(null)
  
  // 外部からselectedDateが渡された場合はそれを使用
  const selectedDate = externalSelectedDate || internalSelectedDate

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  // カレンダーの日付配列を生成
  const calendarDays = []
  
  // 前月の日付（空白部分）
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    calendarDays.push({ date, isCurrentMonth: false })
  }
  
  // 当月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    calendarDays.push({ date, isCurrentMonth: true })
  }
  
  // 次月の日付（空白部分）
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    calendarDays.push({ date, isCurrentMonth: false })
  }

  // Dateをローカル日付文字列(YYYY-MM-DD)に変換する関数
  const dateToLocalString = (date: Date): string => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // 指定日の固定予定を取得
  const getFixedEventsForDate = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dateStr = dateToLocalString(date)
    const exceptionsForDate = fixedEventExceptions[dateStr] || []
    
    return fixedEvents.filter(event => 
      event.is_active && 
      event.day_of_week === dayOfWeek &&
      !exceptionsForDate.includes(event.id)
    )
  }

  // 指定日の学習ブロックを取得
  const getStudyBlocksForDate = (date: Date) => {
    const dateStr = dateToLocalString(date)
    return studyBlocks.filter(block => {
      if (!block.date) return false
      const blockDateStr = block.date.slice(0, 10)
      return blockDateStr === dateStr
    })
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
    console.log('MonthlyCalendar - 日付クリック:', date)
    setInternalSelectedDate(date)
    onDateClick(date)
  }

  // 前月に移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // 次月に移動
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // 今日に戻る
  const goToToday = () => {
    setCurrentDate(new Date())
    setInternalSelectedDate(null)
  }

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {year}年{monthNames[month]}
        </h2>
        <div className="flex space-x-2">
          <Button onClick={goToPreviousMonth} variant="outline" size="sm">
            ←
          </Button>
          <Button onClick={goToToday} variant="outline" size="sm">
            今日
          </Button>
          <Button onClick={goToNextMonth} variant="outline" size="sm">
            →
          </Button>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const fixedEventsForDate = getFixedEventsForDate(date)
          const studyBlocksForDate = getStudyBlocksForDate(date)
          const completedBlocks = studyBlocksForDate.filter(block => block.is_completed).length
          const totalBlocks = studyBlocksForDate.length

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                min-h-[80px] p-2 border border-gray-200 rounded cursor-pointer transition-colors
                ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                ${isSelected(date) ? 'bg-blue-100' : ''}
              `}
            >
              <div className="text-sm font-medium mb-1">
                {date.getDate()}
              </div>
              
              {/* 固定予定の表示（全件表示・セル内スクロール） */}
              {fixedEventsForDate.length > 0 && (
                <div className="space-y-1 max-h-16 overflow-y-auto pr-1">
                  {fixedEventsForDate.map((event, idx) => (
                    <div
                      key={idx}
                      className="text-xs px-1 py-0.5 rounded text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ backgroundColor: event.color }}
                      title={`${event.title} ${event.start_time}-${event.end_time}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )}

              {/* 学習ブロックの進捗表示 */}
              {totalBlocks > 0 && (
                <div className="mt-1">
                  <div className="text-xs text-gray-800">
                    {completedBlocks}/{totalBlocks}ブロック
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{ 
                        width: `${(completedBlocks / totalBlocks) * 100}%`,
                        backgroundColor: studyBlocksForDate.length > 0 ? studyBlocksForDate[0].color : '#10B981'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>固定予定</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>学習進捗</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
          <span>今日</span>
        </div>
      </div>
    </div>
  )
}

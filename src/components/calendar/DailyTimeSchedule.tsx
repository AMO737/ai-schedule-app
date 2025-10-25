'use client'

import { useState } from 'react'
import { FixedEvent, StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'
import { QuickEventAddModal } from './QuickEventAddModal'

interface DailyTimeScheduleProps {
  selectedDate: Date
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  onAddEvent: (date: Date) => void
  onAddStudyBlock: (date: Date) => void
  onEditStudyBlock?: (block: StudyBlock) => void
  onDeleteStudyBlock?: (blockId: string) => void
  onEditFixedEvent?: (event: FixedEvent) => void
  onDeleteFixedEvent?: (eventId: string) => void
  fixedEventExceptions?: { [key: string]: string[] | undefined }
  onToggleFixedEventException?: (eventId: string, date: string) => void
  onAddStudyBlockFromTimeSchedule?: (studyBlock: StudyBlock) => void
}

interface TimeSlot {
  time: string
  hour: number
  minute: number
  type: 'fixed-event' | 'study-block' | 'available' | 'rest'
  event?: FixedEvent | StudyBlock
  color?: string
  title?: string
  duration?: number
}

export function DailyTimeSchedule({
  selectedDate,
  fixedEvents,
  studyBlocks,
  onAddEvent,
  onAddStudyBlock,
  onEditStudyBlock,
  onDeleteStudyBlock,
  onEditFixedEvent,
  onDeleteFixedEvent,
  fixedEventExceptions = {},
  onToggleFixedEventException,
  onAddStudyBlockFromTimeSchedule
}: DailyTimeScheduleProps) {
  const [showQuickAddModal, setShowQuickAddModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')
  
  // 30分おきのタイムスロットを生成
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const dateStr = selectedDate.toISOString().split('T')[0]
    const dayOfWeek = selectedDate.getDay()
    
    // 00:00から23:30まで30分おきに生成
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time,
          hour,
          minute,
          type: 'available'
        })
      }
    }
    
    return slots
  }

  // 各タイムスロットに予定や学習ブロックを配置
  const populateTimeSlots = (slots: TimeSlot[]): TimeSlot[] => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    const dayOfWeek = selectedDate.getDay()
    
    // 固定予定を配置
    const dayFixedEvents = fixedEvents.filter(event => 
      event.is_active && event.day_of_week === dayOfWeek
    )
    
    const exceptionsForDate = fixedEventExceptions[dateStr] || []
    const activeFixedEvents = dayFixedEvents.filter(event => 
      !exceptionsForDate.includes(event.id)
    )
    
    activeFixedEvents.forEach(event => {
      const startTime = event.start_time
      const endTime = event.end_time
      const startSlot = findTimeSlot(slots, startTime)
      const endSlot = findTimeSlot(slots, endTime)
      
      if (startSlot !== -1 && endSlot !== -1) {
        for (let i = startSlot; i < endSlot; i++) {
          slots[i] = {
            ...slots[i],
            type: 'fixed-event',
            event: event,
            color: event.color,
            title: event.title,
            duration: calculateDuration(event.start_time, event.end_time)
          }
        }
      }
    })
    
    // 学習ブロックを配置
    const dayStudyBlocks = studyBlocks.filter(block => 
      block.date.startsWith(dateStr)
    )
    
    dayStudyBlocks.forEach(block => {
      const startTime = block.start_time
      const endTime = block.end_time
      const startSlot = findTimeSlot(slots, startTime)
      const endSlot = findTimeSlot(slots, endTime)
      
      if (startSlot !== -1 && endSlot !== -1) {
        for (let i = startSlot; i < endSlot; i++) {
          // 固定予定と重複しない場合のみ配置
          if (slots[i].type !== 'fixed-event') {
            slots[i] = {
              ...slots[i],
              type: 'study-block',
              event: block,
              color: block.color,
              title: block.subject,
              duration: block.duration
            }
          }
        }
      }
    })
    
    return slots
  }

  // 時間文字列からスロットインデックスを取得
  const findTimeSlot = (slots: TimeSlot[], time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return slots.findIndex(slot => slot.hour === hours && slot.minute === minutes)
  }

  // 時間差を計算（分単位）
  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    return (end.getTime() - start.getTime()) / (1000 * 60)
  }

  // 時間フォーマット（12時間制）
  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  // 時間帯の背景色を決定
  const getTimeSlotBackgroundColor = (slot: TimeSlot): string => {
    switch (slot.type) {
      case 'fixed-event':
        return 'bg-blue-100 border-blue-200'
      case 'study-block':
        return 'bg-green-100 border-green-200'
      case 'available':
        return 'bg-gray-50 border-gray-200'
      case 'rest':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  // 時間帯のテキスト色を決定
  const getTimeSlotTextColor = (slot: TimeSlot): string => {
    switch (slot.type) {
      case 'fixed-event':
        return 'text-blue-800'
      case 'study-block':
        return 'text-green-800'
      case 'available':
        return 'text-gray-600'
      case 'rest':
        return 'text-yellow-800'
      default:
        return 'text-gray-600'
    }
  }

  const timeSlots = populateTimeSlots(generateTimeSlots())
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  const handleQuickAddEvent = async (eventData: {
    title: string
    startTime: string
    endTime: string
    color: string
    type: 'fixed-event' | 'study-block'
    subject?: string
    hasAlarm?: boolean
  }) => {
    try {
      // 学習ブロックとして追加
      const newStudyBlock: StudyBlock = {
        id: Date.now().toString(),
        user_id: 'demo-user',
        subject: eventData.subject || '英語',
        date: selectedDate.toISOString().split('T')[0],
        start_time: eventData.startTime,
        end_time: eventData.endTime,
        duration: calculateDuration(eventData.startTime, eventData.endTime),
        color: eventData.color,
        is_completed: false,
        is_skipped: false,
        hasAlarm: eventData.hasAlarm || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // 親コンポーネントの学習ブロックリストに追加する処理
      if (onAddStudyBlockFromTimeSchedule) {
        onAddStudyBlockFromTimeSchedule(newStudyBlock)
      }
      
      console.log('学習ブロックを追加:', newStudyBlock)
    } catch (error) {
      console.error('Failed to add event:', error)
      throw error
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedDate.toLocaleDateString('ja-JP', { 
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </h2>
          <p className="text-sm text-gray-700">
            {selectedDate.toLocaleDateString('ja-JP', { 
              month: 'numeric',
              day: 'numeric'
            })} ({dayNames[selectedDate.getDay()]})
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => onAddEvent(selectedDate)} variant="outline" size="sm">
            📅 予定追加
          </Button>
          <Button onClick={() => onAddStudyBlock(selectedDate)} variant="outline" size="sm">
            📚 学習追加
          </Button>
        </div>
      </div>

      {/* タイムスケジュール表示 - スマホ向け縦表示 */}
      <div className="border rounded-lg overflow-hidden">
        <div className="space-y-1">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 min-h-[60px] border-b border-gray-200
                ${getTimeSlotBackgroundColor(slot)}
                ${slot.type === 'available' ? 'cursor-pointer hover:bg-opacity-80' : ''}
                transition-colors
              `}
              onClick={() => {
                if (slot.type === 'available') {
                  // 空いている時間帯をクリックした場合の処理
                  console.log('空いている時間帯をクリック:', slot.time)
                  setSelectedTimeSlot(slot.time)
                  setShowQuickAddModal(true)
                }
              }}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-16 text-sm font-medium text-gray-700">
                  {formatTime(slot.hour, slot.minute)}
                </div>
                {slot.title ? (
                  <div className="flex-1">
                    <div className={`font-medium ${getTimeSlotTextColor(slot)}`}>
                      {slot.title}
                    </div>
                    {slot.duration && (
                      <div className={`text-xs ${getTimeSlotTextColor(slot)}`}>
                        {slot.duration}分
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`flex-1 text-sm ${getTimeSlotTextColor(slot)}`}>
                    空き時間
                  </div>
                )}
              </div>
              {slot.type !== 'available' && (
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slot.color }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
          <span className="text-blue-800">固定予定</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-green-800">学習ブロック</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-gray-600">空き時間</span>
        </div>
      </div>

      {/* 予定詳細 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 固定予定 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">固定予定</h3>
          {timeSlots
            .filter(slot => slot.type === 'fixed-event')
            .reduce((unique, slot) => {
              const event = slot.event as FixedEvent
              if (!unique.find(e => e.id === event.id)) {
                unique.push(event)
              }
              return unique
            }, [] as FixedEvent[])
            .map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div>
                    <div className="font-medium text-blue-800">{event.title}</div>
                    <div className="text-sm text-blue-600">
                      {event.start_time} - {event.end_time}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {onEditFixedEvent && (
                    <Button
                      onClick={() => onEditFixedEvent(event)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      編集
                    </Button>
                  )}
                  {onToggleFixedEventException && (
                    <Button
                      onClick={() => {
                        const dateStr = selectedDate.toISOString().split('T')[0]
                        const isException = fixedEventExceptions[dateStr]?.includes(event.id)
                        if (confirm(isException ? 'この日の例外削除を解除しますか？' : 'この日のみ固定予定を削除しますか？')) {
                          onToggleFixedEventException(event.id, dateStr)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      {fixedEventExceptions[selectedDate.toISOString().split('T')[0]]?.includes(event.id) ? '復元' : '例外削除'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* 学習ブロック */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">学習ブロック</h3>
          {timeSlots
            .filter(slot => slot.type === 'study-block')
            .reduce((unique, slot) => {
              const block = slot.event as StudyBlock
              if (!unique.find(b => b.id === block.id)) {
                unique.push(block)
              }
              return unique
            }, [] as StudyBlock[])
            .map((block, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: block.color }}
                  />
                  <div>
                    <div className="font-medium text-green-800">{block.subject}</div>
                    <div className="text-sm text-green-600">
                      {block.start_time} - {block.end_time} ({block.duration}分)
                    </div>
                    {block.is_completed && (
                      <div className="text-xs text-green-700">✓ 完了</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {onEditStudyBlock && (
                    <Button
                      onClick={() => onEditStudyBlock(block)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      編集
                    </Button>
                  )}
                  {onDeleteStudyBlock && (
                    <Button
                      onClick={() => {
                        if (confirm('この学習ブロックを削除しますか？')) {
                          onDeleteStudyBlock(block.id)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      削除
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 空き時間の統計 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">時間統計</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">固定予定</div>
            <div className="font-medium text-blue-800">
              {timeSlots.filter(slot => slot.type === 'fixed-event').length * 0.5}時間
            </div>
          </div>
          <div>
            <div className="text-gray-600">学習時間</div>
            <div className="font-medium text-green-800">
              {timeSlots.filter(slot => slot.type === 'study-block').length * 0.5}時間
            </div>
          </div>
          <div>
            <div className="text-gray-600">空き時間</div>
            <div className="font-medium text-gray-800">
              {timeSlots.filter(slot => slot.type === 'available').length * 0.5}時間
            </div>
          </div>
          <div>
            <div className="text-gray-600">合計</div>
            <div className="font-medium text-gray-900">24時間</div>
          </div>
        </div>
      </div>

      {/* クイック予定追加モーダル */}
      <QuickEventAddModal
        isOpen={showQuickAddModal}
        onClose={() => setShowQuickAddModal(false)}
        selectedDate={selectedDate}
        selectedTime={selectedTimeSlot}
        onAddEvent={handleQuickAddEvent}
      />
    </div>
  )
}

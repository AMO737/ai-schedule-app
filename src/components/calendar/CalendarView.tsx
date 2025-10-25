'use client'

import { useState } from 'react'
import { FixedEvent, StudyBlock } from '@/types'
import { MonthlyCalendar } from './MonthlyCalendar'
import { WeeklyCalendar } from './WeeklyCalendar'
import { Button } from '@/components/ui/button'

interface CalendarViewProps {
  userId: string
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  onDateClick: (date: Date) => void
  selectedDate?: Date | null
  fixedEventExceptions?: { [key: string]: string[] | undefined }
}

type ViewType = 'monthly' | 'weekly'

export function CalendarView({ userId, fixedEvents, studyBlocks, onDateClick, selectedDate, fixedEventExceptions }: CalendarViewProps) {
  const [viewType, setViewType] = useState<ViewType>('monthly')

  return (
    <div className="space-y-4">
      {/* ビュー切り替えボタン */}
      <div className="flex space-x-2">
        <Button
          onClick={() => setViewType('monthly')}
          variant={viewType === 'monthly' ? 'default' : 'outline'}
          size="sm"
        >
          月表示
        </Button>
        <Button
          onClick={() => setViewType('weekly')}
          variant={viewType === 'weekly' ? 'default' : 'outline'}
          size="sm"
        >
          週表示
        </Button>
      </div>

      {/* カレンダー表示 */}
      {viewType === 'monthly' ? (
        <MonthlyCalendar
          userId={userId}
          fixedEvents={fixedEvents}
          studyBlocks={studyBlocks}
          onDateClick={onDateClick}
          selectedDate={selectedDate}
          fixedEventExceptions={fixedEventExceptions}
        />
      ) : (
        <WeeklyCalendar
          userId={userId}
          fixedEvents={fixedEvents}
          studyBlocks={studyBlocks}
          onDateClick={onDateClick}
          fixedEventExceptions={fixedEventExceptions}
        />
      )}
    </div>
  )
}

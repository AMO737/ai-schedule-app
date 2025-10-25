'use client'

import { FixedEvent, StudyBlock } from '@/types'
import { Button } from '@/components/ui/button'

interface DateDetailProps {
  selectedDate: Date | null
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  onAddEvent: (date: Date) => void
  onAddStudyBlock: (date: Date) => void
  onDeleteStudyBlock?: (blockId: string) => void
  onEditStudyBlock?: (block: StudyBlock) => void
  fixedEventExceptions?: { [key: string]: string[] | undefined }
  onToggleFixedEventException?: (eventId: string, date: string) => void
}

export function DateDetail({ 
  selectedDate, 
  fixedEvents, 
  studyBlocks, 
  onAddEvent, 
  onAddStudyBlock,
  onDeleteStudyBlock,
  onEditStudyBlock,
  fixedEventExceptions = {},
  onToggleFixedEventException
}: DateDetailProps) {
  console.log('DateDetail - selectedDate:', selectedDate)
  
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">日付を選択してください</h3>
        <p className="text-gray-500">カレンダーから日付をクリックすると、その日の詳細が表示されます。</p>
      </div>
    )
  }

  const dayOfWeek = selectedDate.getDay()
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']
  
  // 選択日の固定予定を取得
  const fixedEventsForDate = fixedEvents.filter(event => 
    event.is_active && event.day_of_week === dayOfWeek
  )

  // 選択日の学習ブロックを取得
  const dateStr = selectedDate.toISOString().split('T')[0]
  const studyBlocksForDate = studyBlocks.filter(block => 
    block.date && block.date.startsWith(dateStr)
  )

  const completedBlocks = studyBlocksForDate.filter(block => block.is_completed).length
  const totalBlocks = studyBlocksForDate.length
  const completionRate = totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0

  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM format
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${dayNames[dayOfWeek]}）`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{formatDate(selectedDate)}</h3>
        <div className="flex space-x-2">
          <Button onClick={() => {
            console.log('予定追加ボタンクリック - selectedDate:', selectedDate)
            onAddEvent(selectedDate)
          }} variant="outline" size="sm">
            予定追加
          </Button>
          <Button onClick={() => onAddStudyBlock(selectedDate)} variant="outline" size="sm">
            学習追加
          </Button>
        </div>
      </div>

      {/* 固定予定セクション */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">固定予定</h4>
        {fixedEventsForDate.length > 0 ? (
          <div className="space-y-2">
            {fixedEventsForDate.map((event, index) => {
              const dateStr = selectedDate.toISOString().split('T')[0]
              const isException = fixedEventExceptions[dateStr]?.includes(event.id) || false
              
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  isException ? 'bg-gray-100 opacity-50' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: event.color }}
                    />
                    <div>
                      <div className={`font-medium ${isException ? 'text-gray-500 line-through' : 'text-blue-800'}`}>
                        {event.title}
                      </div>
                      <div className={`text-sm ${isException ? 'text-gray-600' : 'text-blue-600'}`}>
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </div>
                      {isException && (
                        <div className="text-xs text-red-500 mt-1">
                          ※ この日は例外で削除されています
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`text-xs ${isException ? 'text-gray-600' : 'text-blue-500'}`}>
                      {dayNames[event.day_of_week]}曜日
                    </div>
                    {onToggleFixedEventException && (
                      <Button
                        onClick={() => onToggleFixedEventException(event.id, dateStr)}
                        variant="outline"
                        size="sm"
                        className={`text-xs px-2 py-1 ${
                          isException 
                            ? 'text-green-600 hover:text-green-800 border-green-300' 
                            : 'text-red-600 hover:text-red-800 border-red-300'
                        }`}
                      >
                        {isException ? '復元' : '例外削除'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-700 text-sm">固定予定はありません</p>
        )}
      </div>

      {/* 学習ブロックセクション */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">学習ブロック</h4>
        {totalBlocks > 0 ? (
          <div className="space-y-4">
            {/* 進捗サマリー */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">進捗状況</span>
                <span className="text-sm text-gray-800">
                  {completedBlocks}/{totalBlocks}ブロック完了
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="text-xs text-gray-800 mt-1">
                完了率: {completionRate.toFixed(1)}%
              </div>
            </div>

            {/* 学習ブロック一覧 */}
            <div className="space-y-2">
              {studyBlocksForDate.map((block, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    block.is_completed 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: block.color }}
                    />
                    <div>
                      <div className={`font-medium ${
                        block.is_completed ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {block.subject}
                      </div>
                      <div className={`text-sm ${
                        block.is_completed ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {formatTime(block.start_time)} - {formatTime(block.end_time)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      block.is_completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {block.is_completed ? '完了' : '未完了'}
                    </span>
                    {block.is_completed && block.completed_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(block.completed_at).toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                    <div className="flex space-x-1">
                      {onEditStudyBlock && (
                        <Button
                          onClick={() => onEditStudyBlock(block)}
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1"
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
                          className="text-xs px-2 py-1 text-red-600 hover:text-red-800"
                        >
                          削除
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-sm">学習ブロックはありません</p>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex space-x-2 pt-4 border-t">
        <Button onClick={() => {
          console.log('下部の固定予定を追加ボタンクリック - selectedDate:', selectedDate)
          onAddEvent(selectedDate)
        }} className="flex-1">
          固定予定を追加
        </Button>
        <Button onClick={() => onAddStudyBlock(selectedDate)} className="flex-1">
          学習ブロックを追加
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FixedEventForm } from '@/components/fixed-events/FixedEventForm'
import { FixedEventList } from '@/components/fixed-events/FixedEventList'
import { LearningGoalForm } from '@/components/learning-goals/LearningGoalForm'
import { LearningGoalDisplay } from '@/components/learning-goals/LearningGoalDisplay'
import { TodaySchedule } from '@/components/dashboard/TodaySchedule'
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress'
import { CalendarView } from '@/components/calendar/CalendarView'
import { DateDetail } from '@/components/calendar/DateDetail'
import { CountdownTimer } from '@/components/countdown/CountdownTimer'
import { CountdownTargetForm } from '@/components/countdown/CountdownTargetForm'
import { StudyBlockForm } from '@/components/study-blocks/StudyBlockForm'
import { DailyTimeSchedule } from '@/components/calendar/DailyTimeSchedule'
import { Button } from '@/components/ui/button'
import { NotificationSystem } from '@/components/notifications/NotificationSystem'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFixedEventForm, setShowFixedEventForm] = useState(false)
  const [showLearningGoalForm, setShowLearningGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [learningGoal, setLearningGoal] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showCountdownTargetForm, setShowCountdownTargetForm] = useState(false)
  const [editingCountdownTarget, setEditingCountdownTarget] = useState<any>(null)
  const [showStudyBlockForm, setShowStudyBlockForm] = useState(false)
  const [editingStudyBlock, setEditingStudyBlock] = useState<any>(null)
  const [editingFixedEvent, setEditingFixedEvent] = useState<any>(null)
  const [selectedDateForForm, setSelectedDateForForm] = useState<Date | null>(null)
  const [showDailyTimeSchedule, setShowDailyTimeSchedule] = useState(false)
  // 固定予定の例外削除を管理（日付文字列をキーとして使用）
  const [fixedEventExceptions, setFixedEventExceptions] = useState<{ [key: string]: string[] | undefined }>({})
  
  
  console.log('page.tsx - showFixedEventForm:', showFixedEventForm)
  console.log('page.tsx - selectedDate:', selectedDate)
  const [demoFixedEvents, setDemoFixedEvents] = useState<any[]>([])
  const [demoStudyBlocks, setDemoStudyBlocks] = useState<any[]>([])
  const [countdownTargets, setCountdownTargets] = useState<any[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
        // 一時的にデモユーザーを使用
        const demoUser = { id: 'demo-user', user_metadata: { name: 'デモユーザー' } }


    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  こんにちは、{demoUser.user_metadata?.name || 'ユーザー'}さん
                </h1>
                <p className="text-gray-800 mt-2">
                  今日も効率的に学習を進めましょう
                </p>
              </div>
              <div className="flex space-x-2">
                <NotificationSystem
                  fixedEvents={demoFixedEvents}
                  studyBlocks={demoStudyBlocks}
                  fixedEventExceptions={fixedEventExceptions}
                />
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showCalendar ? 'ダッシュボード' : 'カレンダー'}
                </button>
              </div>
            </div>
          </div>

              {/* Main Content */}
              {showCalendar ? (
                <div>
                  {showDailyTimeSchedule && selectedDate ? (
                    <div className="mb-4">
                      <Button
                        onClick={() => setShowDailyTimeSchedule(false)}
                        variant="outline"
                        size="sm"
                      >
                        ← カレンダーに戻る
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column - Calendar */}
                      <div className="lg:col-span-2">
                        <CalendarView
                          userId={demoUser.id}
                          fixedEvents={demoFixedEvents}
                          studyBlocks={demoStudyBlocks}
                          onDateClick={(date) => {
                            console.log('カレンダーで日付をクリック:', date)
                            setSelectedDate(date)
                            setShowDailyTimeSchedule(true)
                          }}
                          selectedDate={selectedDate}
                          fixedEventExceptions={fixedEventExceptions}
                        />
                      </div>

                      {/* Right Column - Date Detail */}
                      <div>
                        <DateDetail
                          selectedDate={selectedDate}
                          fixedEvents={demoFixedEvents}
                          studyBlocks={demoStudyBlocks}
                          onAddEvent={(date) => {
                            console.log('予定を追加します:', date)
                            console.log('showFixedEventForm before:', showFixedEventForm)
                            setSelectedDateForForm(date)
                            setEditingFixedEvent(null)
                            setShowFixedEventForm(true)
                            console.log('showFixedEventForm after:', true)
                          }}
                          onAddStudyBlock={(date) => {
                            console.log('学習ブロックを追加します:', date)
                            setSelectedDateForForm(date)
                            setEditingStudyBlock(null)
                            setShowStudyBlockForm(true)
                          }}
                          onDeleteStudyBlock={(blockId) => {
                            console.log('学習ブロックを削除します:', blockId)
                            setDemoStudyBlocks(prev => prev.filter(block => block.id !== blockId))
                          }}
                          onEditStudyBlock={(block) => {
                            console.log('学習ブロックを編集します:', block)
                            setSelectedDateForForm(new Date(block.date))
                            setEditingStudyBlock(block)
                            setShowStudyBlockForm(true)
                          }}
                          fixedEventExceptions={fixedEventExceptions}
                          onToggleFixedEventException={(eventId, dateStr) => {
                            console.log('固定予定の例外を切り替えます:', eventId, dateStr)
                            setFixedEventExceptions(prev => {
                              const currentExceptions = prev[dateStr] || []
                              const isException = currentExceptions.includes(eventId)
                              
                              if (isException) {
                                // 例外を解除（復元）
                                const newExceptions = currentExceptions.filter(id => id !== eventId)
                                return {
                                  ...prev,
                                  [dateStr]: newExceptions.length > 0 ? newExceptions : undefined
                                }
                              } else {
                                // 例外を追加（削除）
                                return {
                                  ...prev,
                                  [dateStr]: [...currentExceptions, eventId]
                                }
                              }
                            })
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 日別タイムスケジュール表示 */}
                  {showDailyTimeSchedule && selectedDate && (
                    <DailyTimeSchedule
                      selectedDate={selectedDate}
                      fixedEvents={demoFixedEvents}
                      studyBlocks={demoStudyBlocks}
                      onAddEvent={(date) => {
                        console.log('予定を追加します:', date)
                        setSelectedDateForForm(date)
                        setEditingFixedEvent(null)
                        setShowFixedEventForm(true)
                      }}
                      onAddStudyBlock={(date) => {
                        console.log('学習ブロックを追加します:', date)
                        setSelectedDateForForm(date)
                        setEditingStudyBlock(null)
                        setShowStudyBlockForm(true)
                      }}
                      onEditStudyBlock={(block) => {
                        console.log('学習ブロックを編集します:', block)
                        setSelectedDateForForm(new Date(block.date))
                        setEditingStudyBlock(block)
                        setShowStudyBlockForm(true)
                      }}
                      onDeleteStudyBlock={(blockId) => {
                        console.log('学習ブロックを削除します:', blockId)
                        setDemoStudyBlocks(prev => prev.filter(block => block.id !== blockId))
                      }}
                      onEditFixedEvent={(event) => {
                        console.log('固定予定を編集します:', event)
                        setEditingFixedEvent(event)
                        setShowFixedEventForm(true)
                      }}
                      onDeleteFixedEvent={(eventId) => {
                        console.log('固定予定の例外削除を切り替えます:', eventId)
                        // 固定予定全体を削除するのではなく、例外削除として処理
                        // 実際の削除はonToggleFixedEventExceptionで処理される
                      }}
                      fixedEventExceptions={fixedEventExceptions}
                      onToggleFixedEventException={(eventId, dateStr) => {
                        console.log('固定予定の例外を切り替えます:', eventId, dateStr)
                        setFixedEventExceptions(prev => {
                          const currentExceptions = prev[dateStr] || []
                          const isException = currentExceptions.includes(eventId)
                          
                          if (isException) {
                            // 例外を解除（復元）
                            const newExceptions = currentExceptions.filter(id => id !== eventId)
                            return {
                              ...prev,
                              [dateStr]: newExceptions.length > 0 ? newExceptions : undefined
                            }
                          } else {
                            // 例外を追加（削除）
                            return {
                              ...prev,
                              [dateStr]: [...currentExceptions, eventId]
                            }
                          }
                        })
                      }}
                      onAddStudyBlockFromTimeSchedule={(studyBlock) => {
                        console.log('タイムスケジュールから学習ブロックを追加:', studyBlock)
                        setDemoStudyBlocks(prev => [...prev, studyBlock])
                      }}
                    />
                  )}
                </div>
              ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Today's Schedule */}
              <div className="lg:col-span-2 space-y-8">
                <CountdownTimer
                  userId={demoUser.id}
                  studyBlocks={demoStudyBlocks}
                  targets={countdownTargets}
                  setTargets={setCountdownTargets}
                  onAddTarget={() => {
                    setEditingCountdownTarget(null)
                    setShowCountdownTargetForm(true)
                  }}
                  onEditTarget={(target) => {
                    console.log('編集ボタンクリック - ターゲット:', target)
                    setEditingCountdownTarget(target)
                    setShowCountdownTargetForm(true)
                  }}
                  onUpdateTarget={(targetId, updatedData) => {
                    console.log('メインページ: カウントダウン目標を更新します:', targetId, updatedData)
                    setCountdownTargets(prev => prev.map(target => 
                      target.id === targetId 
                        ? { ...target, ...updatedData }
                        : target
                    ))
                  }}
                  onAddNewTarget={(targetData) => {
                    console.log('メインページ: 新しいカウントダウン目標を追加します:', targetData)
                    const newTarget = {
                      ...targetData,
                      id: `target-${Date.now()}`,
                      completedHours: 0
                    }
                    setCountdownTargets(prev => [...prev, newTarget])
                  }}
                  onDeleteTarget={(targetId) => {
                    console.log('メインページ: カウントダウン目標を削除します:', targetId)
                    setCountdownTargets(prev => prev.filter(target => target.id !== targetId))
                  }}
                />
                <TodaySchedule userId={demoUser.id} />
                <WeeklyProgress userId={demoUser.id} />
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-8">
              {/* Learning Goal */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">学習目標</h2>
                    {!showLearningGoalForm ? (
                  <>
                        <LearningGoalDisplay 
                          userId={demoUser.id}
                          learningGoal={learningGoal}
                          onEdit={(goal) => {
                            if (goal) {
                              console.log('学習目標を編集します:', goal)
                              setEditingGoal(goal)
                            } else {
                              console.log('学習目標を削除しました')
                              setEditingGoal(null)
                            }
                            setShowLearningGoalForm(true)
                          }}
                        />
                    <div className="mt-4">
                      <button 
                        onClick={() => {
                          setEditingGoal(null)
                          setShowLearningGoalForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        学習目標を設定する
                      </button>
                    </div>
                  </>
                ) : (
                      <LearningGoalForm
                        onSubmit={async (goalData) => {
                          console.log('学習目標を保存します:', goalData)
                          if (editingGoal) {
                            console.log('編集モード: 学習目標を更新します')
                            // 編集の場合は更新処理
                            setLearningGoal(prev => ({
                              ...prev,
                              ...goalData,
                              updated_at: new Date().toISOString()
                            }))
                          } else {
                            console.log('新規作成モード: 学習目標を追加します')
                            // 新規作成の場合は追加処理
                            const newGoal = {
                              ...goalData,
                              id: `goal-${Date.now()}`,
                              user_id: demoUser.id,
                              created_at: new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            }
                            setLearningGoal(newGoal)
                          }
                          setEditingGoal(null)
                          setShowLearningGoalForm(false)
                        }}
                    onCancel={() => {
                      setEditingGoal(null)
                      setShowLearningGoalForm(false)
                    }}
                    initialData={editingGoal}
                  />
                )}
              </div>

              {/* Fixed Events */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">固定予定</h2>
                <FixedEventList 
                  userId={demoUser.id} 
                  fixedEvents={demoFixedEvents} 
                  setFixedEvents={setDemoFixedEvents}
                  fixedEventExceptions={fixedEventExceptions}
                  onToggleFixedEventException={(eventId, dateStr) => {
                    console.log('固定予定の例外を切り替えます:', eventId, dateStr)
                    setFixedEventExceptions(prev => {
                      const currentExceptions = prev[dateStr] || []
                      const isException = currentExceptions.includes(eventId)
                      
                      if (isException) {
                        // 例外を解除（復元）
                        const newExceptions = currentExceptions.filter(id => id !== eventId)
                        return {
                          ...prev,
                          [dateStr]: newExceptions.length > 0 ? newExceptions : undefined
                        }
                      } else {
                        // 例外を追加（削除）
                        return {
                          ...prev,
                          [dateStr]: [...currentExceptions, eventId]
                        }
                      }
                    })
                  }}
                />
                {!showFixedEventForm && (
                  <button 
                    onClick={() => setShowFixedEventForm(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    予定を追加
                  </button>
                )}
                {showFixedEventForm && (
                  <div className="mt-4">
                    <FixedEventForm 
                      onSubmit={async (eventData) => {
                        console.log('固定予定を保存します:', eventData)
                        const newEvent = {
                          ...eventData,
                          id: `event-${Date.now()}`,
                          user_id: 'demo-user',
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString()
                        }
                        setDemoFixedEvents(prev => [...prev, newEvent])
                        setShowFixedEventForm(false)
                      }}
                      onCancel={() => setShowFixedEventForm(false)}
                    />
                  </div>
                )}
              </div>
              </div>
            </div>
          )}

              {/* Countdown Target Form Modal */}
              {showCountdownTargetForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingCountdownTarget ? 'カウントダウン目標を編集' : 'カウントダウン目標を追加'}
                    </h2>
                    <CountdownTargetForm
                      onSubmit={async (targetData) => {
                        console.log('カウントダウン目標を保存します:', targetData)
                        console.log('編集中のターゲット:', editingCountdownTarget)
                        
                        if (editingCountdownTarget) {
                          console.log('編集モード: 目標を更新します')
                          // 編集の場合は更新処理
                          setCountdownTargets(prev => prev.map(target => 
                            target.id === editingCountdownTarget.id 
                              ? { ...target, ...targetData }
                              : target
                          ))
                        } else {
                          console.log('新規作成モード: 目標を追加します')
                          // 新規作成の場合は追加処理
                          const newTarget = {
                            ...targetData,
                            id: `target-${Date.now()}`,
                            completedHours: 0
                          }
                          setCountdownTargets(prev => [...prev, newTarget])
                        }
                        
                        setEditingCountdownTarget(null)
                        setShowCountdownTargetForm(false)
                      }}
                      onCancel={() => {
                        console.log('フォームキャンセル')
                        setEditingCountdownTarget(null)
                        setShowCountdownTargetForm(false)
                      }}
                      initialData={editingCountdownTarget}
                    />
                  </div>
                </div>
              )}

              {/* Fixed Event Form Modal (from Calendar) */}
              {showFixedEventForm && selectedDateForForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingFixedEvent ? '固定予定を編集' : '固定予定を追加'}
                    </h2>
                    <FixedEventForm
                      onSubmit={async (eventData) => {
                        console.log('固定予定を保存します:', eventData)
                        if (editingFixedEvent) {
                          console.log('編集モード: 予定を更新します')
                          setDemoFixedEvents(prev => prev.map(event => 
                            event.id === editingFixedEvent.id 
                              ? { ...event, ...eventData, updated_at: new Date().toISOString() }
                              : event
                          ))
                        } else {
                          console.log('新規作成モード: 予定を追加します')
                          const newEvent = {
                            ...eventData,
                            id: `event-${Date.now()}`,
                            user_id: 'demo-user',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          }
                          setDemoFixedEvents(prev => [...prev, newEvent])
                        }
                        
                        setEditingFixedEvent(null)
                        setShowFixedEventForm(false)
                        setSelectedDateForForm(null)
                      }}
                      onCancel={() => {
                        console.log('フォームキャンセル')
                        setEditingFixedEvent(null)
                        setShowFixedEventForm(false)
                        setSelectedDateForForm(null)
                      }}
                      initialData={editingFixedEvent}
                    />
                  </div>
                </div>
              )}

              {/* Study Block Form Modal */}
              {showStudyBlockForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingStudyBlock ? '学習ブロックを編集' : '学習ブロックを追加'}
                    </h2>
                    <StudyBlockForm
                      onSubmit={async (blockData) => {
                        console.log('学習ブロックを保存します:', blockData)
                        console.log('編集中のブロック:', editingStudyBlock)
                        
                        if (editingStudyBlock) {
                          console.log('編集モード: ブロックを更新します')
                          // 編集の場合は更新処理
                          setDemoStudyBlocks(prev => prev.map(block => 
                            block.id === editingStudyBlock.id 
                              ? { ...block, ...blockData, updated_at: new Date().toISOString() }
                              : block
                          ))
                        } else {
                          console.log('新規作成モード: ブロックを追加します')
                          // 新規作成の場合は追加処理
                          const newBlock = {
                            ...blockData,
                            id: `block-${Date.now()}`,
                            user_id: 'demo-user',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          }
                          setDemoStudyBlocks(prev => [...prev, newBlock])
                        }
                        
                        setEditingStudyBlock(null)
                        setShowStudyBlockForm(false)
                        setSelectedDateForForm(null)
                      }}
                      onCancel={() => {
                        console.log('フォームキャンセル')
                        setEditingStudyBlock(null)
                        setShowStudyBlockForm(false)
                        setSelectedDateForForm(null)
                      }}
                      initialData={editingStudyBlock}
                      selectedDate={selectedDateForForm || undefined}
                    />
                  </div>
                </div>
              )}

          {/* Setup Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              🚀 次のステップ: Supabaseの設定
            </h3>
            <div className="text-blue-700 space-y-2">
              <p>1. Supabaseでアカウントを作成</p>
              <p>2. 新しいプロジェクトを作成</p>
              <p>3. プロジェクトのURLとAPIキーを取得</p>
              <p>4. .env.localファイルを更新</p>
              <p>5. データベースを初期化</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            こんにちは、{user.user_metadata?.name || 'ユーザー'}さん
          </h1>
          <p className="text-gray-600 mt-2">
            今日も効率的に学習を進めましょう
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Today's Schedule */}
          <div className="lg:col-span-2 space-y-8">
            <TodaySchedule userId={user.id} />
            <WeeklyProgress userId={user.id} />
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-8">
            {/* Learning Goal */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">学習目標</h2>
              <LearningGoalDisplay userId={user.id} />
              {!showLearningGoalForm && (
                <button 
                  onClick={() => setShowLearningGoalForm(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  学習目標を設定する
                </button>
              )}
              {showLearningGoalForm && (
                <div className="mt-4">
                  <LearningGoalForm 
                    onSubmit={async (goalData) => {
                      console.log('学習目標を保存します:', goalData)
                      setShowLearningGoalForm(false)
                    }}
                    onCancel={() => setShowLearningGoalForm(false)}
                  />
                </div>
              )}
            </div>

            {/* Fixed Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">固定予定</h2>
              <FixedEventList userId={user.id} />
              {!showFixedEventForm && (
                <button 
                  onClick={() => setShowFixedEventForm(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  予定を追加
                </button>
              )}
              {showFixedEventForm && (
                <div className="mt-4">
                  <FixedEventForm 
                    onSubmit={async (eventData) => {
                      console.log('固定予定を保存します:', eventData)
                      setShowFixedEventForm(false)
                    }}
                    onCancel={() => setShowFixedEventForm(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
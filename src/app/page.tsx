'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/AuthProvider'
import { useScheduleStore, useHydrated } from '@/store/schedule'
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
import { LoginButton } from '@/components/auth/LoginButton'

export default function HomePage() {
  // 認証状態
  const { user, loading, signIn, signOut } = useAuth()
  
  // Zustandストアから状態を取得
  const hydrated = useHydrated()
  const fixedEvents = useScheduleStore(state => state.fixedEvents)
  const studyBlocks = useScheduleStore(state => state.studyBlocks)
  const learningGoal = useScheduleStore(state => state.learningGoal)
  const countdownTargets = useScheduleStore(state => state.countdownTargets)
  const fixedEventExceptions = useScheduleStore(state => state.fixedEventExceptions)
  
  // Zustandストアからアクションを取得
  const setFixedEvents = useScheduleStore(state => state.setFixedEvents)
  const setStudyBlocks = useScheduleStore(state => state.setStudyBlocks)
  const setLearningGoalStore = useScheduleStore(state => state.setLearningGoal)
  const setCountdownTargets = useScheduleStore(state => state.setCountdownTargets)
  const setFixedEventExceptions = useScheduleStore(state => state.setFixedEventExceptions)
  const removeStudyBlock = useScheduleStore(state => state.removeStudyBlock)
  const removeFixedEvent = useScheduleStore(state => state.removeFixedEvent)
  const clearAll = useScheduleStore(state => state.clearAll)
  
  // UIの状態管理
  const [showFixedEventForm, setShowFixedEventForm] = useState(false)
  const [showLearningGoalForm, setShowLearningGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [learningGoalState, setLearningGoalState] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showCountdownTargetForm, setShowCountdownTargetForm] = useState(false)
  const [editingCountdownTarget, setEditingCountdownTarget] = useState<any>(null)
  const [showStudyBlockForm, setShowStudyBlockForm] = useState(false)
  const [editingStudyBlock, setEditingStudyBlock] = useState<any>(null)
  const [editingFixedEvent, setEditingFixedEvent] = useState<any>(null)
  const [selectedDateForForm, setSelectedDateForForm] = useState<Date | null>(null)
  const [showDailyTimeSchedule, setShowDailyTimeSchedule] = useState(false)
  
  console.log('page.tsx - showFixedEventForm:', showFixedEventForm)
  console.log('page.tsx - selectedDate:', selectedDate)

  // Cookieからの復元（IndexedDBがない場合のみ）
  useEffect(() => {
    if (!hydrated) return
    
    const restoreFromCookie = async () => {
      try {
        // IndexedDBにデータがあるか確認
        const idbStorage = (await import('@/lib/idbStorage')).idbStorage
        const exists = await idbStorage.getItem('ai-schedule-app:v1')
        
        // IndexedDBにデータがない場合のみCookieから復元
        if (!exists && typeof window !== 'undefined' && (window as any).__COOKIE_BACKUP__) {
          const cookieBackup = (window as any).__COOKIE_BACKUP__
          console.log('🍪 Cookieからデータを復元します:', cookieBackup)
          
          // Zustandストアの状態を置き換え
          useScheduleStore.setState(cookieBackup, false)
          
          // 再度ハイドレーション完了を通知
          useScheduleStore.getState().setHasHydrated(true)
        }
      } catch (error) {
        console.error('Cookie復元エラー:', error)
      }
    }
    
    restoreFromCookie()
  }, [hydrated])

  // Zustandストアのハイドレーション完了を待つ
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
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

  // ユーザー情報（ログインしていない場合はデモユーザー）
  const currentUser = user || { id: 'demo-user', user_metadata: { name: 'デモユーザー' } }

  // 時間帯に応じたあいさつを生成
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return 'おはようございます'
    } else if (hour >= 12 && hour < 18) {
      return 'こんにちは'
    } else if (hour >= 18 && hour < 22) {
      return 'こんばんは'
    } else {
      return 'おやすみなさい'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              学習スケジュール管理
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Googleアカウントでログインして
              <br />
              効率的に学習を進めましょう
            </p>
            <LoginButton />
            <p className="text-sm text-gray-500 mt-4 text-center">
              ※ログインすると、どこからでも続きから利用できます
            </p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}
          </h1>
                <p className="text-gray-800 mt-2">
                  今日も効率的に学習を進めましょう
          </p>
        </div>
              <div className="flex space-x-2">
                <NotificationSystem
                  fixedEvents={fixedEvents}
                  studyBlocks={studyBlocks}
                  fixedEventExceptions={fixedEventExceptions}
                />
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showCalendar ? 'ダッシュボード' : 'カレンダー'}
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ログアウト
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
                          userId={currentUser.id}
                          fixedEvents={fixedEvents}
                          studyBlocks={studyBlocks}
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
                          fixedEvents={fixedEvents}
                          studyBlocks={studyBlocks}
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
                            removeStudyBlock(blockId)
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
                      fixedEvents={fixedEvents}
                      studyBlocks={studyBlocks}
                      learningGoal={learningGoal}
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
                        removeStudyBlock(blockId)
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
                        setStudyBlocks([...studyBlocks, studyBlock])
                      }}
                    />
                  )}
                </div>
              ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Today's Schedule */}
              <div className="lg:col-span-2 space-y-8">
                <CountdownTimer
                  userId={currentUser.id}
                  studyBlocks={studyBlocks}
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
                    const updated = countdownTargets.map(target => 
                      target.id === targetId 
                        ? { ...target, ...updatedData }
                        : target
                    )
                    setCountdownTargets(updated)
                    // 即座にストレージに保存
                  }}
                  onAddNewTarget={(targetData) => {
                    console.log('メインページ: 新しいカウントダウン目標を追加します:', targetData)
                    const newTarget = {
                      ...targetData,
                      id: `target-${Date.now()}`,
                      completedHours: 0
                    }
                    const updated = [...countdownTargets, newTarget]
                    setCountdownTargets(updated)
                    // 即座にストレージに保存
                  }}
                  onDeleteTarget={(targetId) => {
                    console.log('メインページ: カウントダウン目標を削除します:', targetId)
                    const updated = countdownTargets.filter(target => target.id !== targetId)
                    setCountdownTargets(updated)
                    // 即座にストレージに保存
                  }}
                />
                <TodaySchedule userId={currentUser.id} />
                <WeeklyProgress userId={currentUser.id} />
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-8">
              {/* Learning Goal */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">学習目標</h2>
                    {!showLearningGoalForm ? (
                  <>
                        <LearningGoalDisplay 
                          userId={currentUser.id}
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
                          
                          // ローカルストレージモード（Supabase不使用）
                          const newGoal = {
                            ...goalData,
                            id: editingGoal?.id || `goal-${Date.now()}`,
                            user_id: currentUser.id,
                            created_at: editingGoal?.created_at || new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          }
                          
                          console.log('学習目標を設定:', newGoal)
                          setLearningGoalStore(newGoal)
                          // 即座にストレージに保存
                          
                          setEditingGoal(null)
                          setShowLearningGoalForm(false)
                          
                          /* Supabase保存（コメントアウト）
                          try {
                            if (editingGoal) {
                              console.log('編集モード: 学習目標を更新します')
                              const { data, error } = await supabase
                                .from('learning_goals')
                                .update({
                                  ...goalData,
                                  updated_at: new Date().toISOString()
                                })
                                .eq('id', editingGoal.id)
                                .select()
                                .single()
                              
                              if (error) throw error
                              if (data) {
                                setLearningGoalStore(data)
                              }
                            } else {
                              console.log('新規作成モード: 学習目標を追加します')
                              const { data, error } = await supabase
                                .from('learning_goals')
                                .insert({
                                  ...goalData,
                                  user_id: currentUser.id
                                })
                                .select()
                                .single()
                              
                              if (error) throw error
                              if (data) {
                                setLearningGoalStore(data)
                              }
                            }
                          } catch (error) {
                            console.error('Error saving learning goal:', error)
                          }
                          */
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
                  userId={currentUser.id} 
                  fixedEvents={fixedEvents} 
                  setFixedEvents={setFixedEvents}
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
                        
                        // ローカルストレージモード
                        const newEvent = {
                          id: `event-${Date.now()}`,
                          user_id: currentUser.id,
                          title: eventData.title,
                          day_of_week: eventData.day_of_week,
                          start_time: eventData.start_time,
                          end_time: eventData.end_time,
                          color: eventData.color,
                          is_active: true,
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString()
                        }
                        
                        const newFixedEvents = [...fixedEvents, newEvent]
                        setFixedEvents(newFixedEvents)
                        // 即座にストレージに保存
                        
                        setShowFixedEventForm(false)
                        
                        /* Supabase保存（コメントアウト）
                        try {
                          const { data, error } = await supabase
                            .from('fixed_events')
                            .insert({
                              user_id: currentUser.id,
                              title: eventData.title,
                              day_of_week: eventData.day_of_week,
                              start_time: eventData.start_time,
                              end_time: eventData.end_time,
                              color: eventData.color,
                              is_active: true
                            })
                            .select()
                            .single()
                          
                          if (error) throw error
                          if (data) {
                            const newFixedEvents = [...fixedEvents, data]
                            setFixedEvents(newFixedEvents)
                          }
                        } catch (error) {
                          console.error('Error saving fixed event:', error)
                        }
                        */
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
                            completed_hours: 0,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
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
                          setFixedEvents(prev => prev.map(event => 
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
                          setFixedEvents(prev => [...prev, newEvent])
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
                          setStudyBlocks(prev => prev.map(block => 
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
                          setStudyBlocks(prev => [...prev, newBlock])
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
                      learningGoal={learningGoal}
                    />
                  </div>
                </div>
              )}

        </div>
    </div>
    )
}


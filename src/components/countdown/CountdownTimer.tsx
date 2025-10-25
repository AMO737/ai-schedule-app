'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { StudyBlock } from '@/types'

interface CountdownTarget {
  id: string
  title: string
  targetDate: string
  totalStudyHours: number
  completedHours: number
  subjects: string[]
  isActive: boolean
}

interface CountdownTimerProps {
  userId: string
  studyBlocks: StudyBlock[]
  targets?: CountdownTarget[]
  setTargets?: (targets: CountdownTarget[]) => void
  onAddTarget: () => void
  onEditTarget: (target: CountdownTarget) => void
  onUpdateTarget?: (targetId: string, updatedData: Partial<CountdownTarget>) => void
  onAddNewTarget?: (targetData: Omit<CountdownTarget, 'id'>) => void
  onDeleteTarget?: (targetId: string) => void
}

export function CountdownTimer({ userId, studyBlocks, targets: externalTargets, setTargets: setExternalTargets, onAddTarget, onEditTarget, onUpdateTarget, onAddNewTarget, onDeleteTarget }: CountdownTimerProps) {
  const [targets, setTargets] = useState<CountdownTarget[]>([])
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({})

  // 外部からtargetsが渡された場合はそれを使用
  const currentTargets = externalTargets || targets
  const updateTargets = useCallback((updater: CountdownTarget[] | ((prev: CountdownTarget[]) => CountdownTarget[])) => {
    if (typeof updater === 'function') {
      if (setExternalTargets) {
        setExternalTargets(updater(externalTargets || []))
      } else {
        setTargets(updater)
      }
    } else {
      // 直接値を渡された場合
      if (setExternalTargets) {
        setExternalTargets(updater)
      } else {
        setTargets(updater)
      }
    }
  }, [setExternalTargets, externalTargets])

  // 学習ブロックから完了時間を自動計算する関数
  const calculateCompletedHours = useCallback((target: CountdownTarget) => {
    const completedBlocks = studyBlocks.filter(block => {
      // ブロックが完了している
      if (!block.is_completed) return false
      
      // 対象科目に含まれている
      if (!target.subjects.includes(block.subject)) return false
      
      // 目標日より前の日付
      const blockDate = new Date(block.date)
      const targetDate = new Date(target.targetDate)
      if (blockDate > targetDate) return false
      
      return true
    })

    // ブロックの時間を計算（分を時間に変換）
    const totalMinutes = completedBlocks.reduce((sum, block) => {
      const startTime = new Date(`2000-01-01T${block.start_time}`)
      const endTime = new Date(`2000-01-01T${block.end_time}`)
      const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      return sum + durationMinutes
    }, 0)

    return totalMinutes / 60 // 分を時間に変換
  }, [studyBlocks])

  // デモデータなし
  useEffect(() => {
    if (!externalTargets || externalTargets.length === 0) {
      updateTargets([])
    }
  }, [userId, externalTargets])

  // 学習ブロックが変更されたときに完了時間を再計算
  useEffect(() => {
    if (currentTargets.length > 0) {
      const updatedTargets = currentTargets.map(target => ({
        ...target,
        completedHours: calculateCompletedHours(target)
      }))
      
      // 変更があった場合のみ更新
      const hasChanges = updatedTargets.some((target, index) => 
        target.completedHours !== currentTargets[index]?.completedHours
      )
      
      if (hasChanges) {
        updateTargets(updatedTargets)
      }
    }
  }, [studyBlocks, currentTargets.length])

  // カウントダウン計算
  useEffect(() => {
    const updateCountdown = () => {
      const newTimeLeft: { [key: string]: string } = {}
      
      currentTargets.forEach(target => {
        if (!target.isActive) return
        
        const targetDate = new Date(target.targetDate)
        const now = new Date()
        const diff = targetDate.getTime() - now.getTime()
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          
          if (days > 0) {
            newTimeLeft[target.id] = `${days}日${hours}時間${minutes}分`
          } else if (hours > 0) {
            newTimeLeft[target.id] = `${hours}時間${minutes}分`
          } else {
            newTimeLeft[target.id] = `${minutes}分`
          }
        } else {
          newTimeLeft[target.id] = '期限切れ'
        }
      })
      
      setTimeLeft(newTimeLeft)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // 1分ごとに更新

    return () => clearInterval(interval)
  }, [currentTargets])

  // 進捗率計算
  const getProgressPercentage = (target: CountdownTarget) => {
    return Math.min((target.completedHours / target.totalStudyHours) * 100, 100)
  }

  // 残り時間計算
  const getRemainingHours = (target: CountdownTarget) => {
    return Math.max(target.totalStudyHours - target.completedHours, 0)
  }

  // 1日あたりの必要学習時間計算
  const getDailyRequiredHours = (target: CountdownTarget) => {
    const targetDate = new Date(target.targetDate)
    const now = new Date()
    const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return 0
    return getRemainingHours(target) / diffDays
  }

  const handleDelete = (targetId: string) => {
    if (confirm('この目標を削除しますか？')) {
      updateTargets(prev => prev.filter(target => target.id !== targetId))
      
      // 親コンポーネントにも通知
      if (onDeleteTarget) {
        onDeleteTarget(targetId)
      }
    }
  }

  const handleToggleActive = (targetId: string) => {
    updateTargets(prev => prev.map(target => 
      target.id === targetId 
        ? { ...target, isActive: !target.isActive }
        : target
    ))
  }

  const handleAdd = () => {
    console.log('CountdownTimer: 新しい目標を追加します')
    onAddTarget()
  }

  const handleUpdateTarget = (targetId: string, updatedData: Partial<CountdownTarget>) => {
    console.log('CountdownTimer: 目標を更新します:', targetId, updatedData)
    updateTargets(prev => prev.map(target => 
      target.id === targetId 
        ? { ...target, ...updatedData }
        : target
    ))
    
    // 親コンポーネントにも通知
    if (onUpdateTarget) {
      onUpdateTarget(targetId, updatedData)
    }
  }

  const handleAddNewTarget = (targetData: Omit<CountdownTarget, 'id'>) => {
    console.log('CountdownTimer: 新しい目標を追加します:', targetData)
    const newTarget: CountdownTarget = {
      ...targetData,
      id: `target-${Date.now()}`,
      completedHours: calculateCompletedHours(targetData as CountdownTarget)
    }
    
    updateTargets(prev => [...prev, newTarget])
    
    // 親コンポーネントにも通知
    if (onAddNewTarget) {
      onAddNewTarget(targetData)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">カウントダウン</h2>
        <Button onClick={onAddTarget} size="sm">
          目標を追加
        </Button>
      </div>

      {currentTargets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">カウントダウン目標がありません</p>
          <Button onClick={onAddTarget}>
            最初の目標を設定する
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentTargets.map(target => {
            const progressPercentage = getProgressPercentage(target)
            const remainingHours = getRemainingHours(target)
            const dailyRequiredHours = getDailyRequiredHours(target)
            const isExpired = timeLeft[target.id] === '期限切れ'

            return (
              <div
                key={target.id}
                className={`border rounded-lg p-4 ${
                  isExpired ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{target.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      target.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {target.isActive ? 'アクティブ' : '非アクティブ'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditTarget(target)}
                      variant="outline"
                      size="sm"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(target.id)}
                      variant="outline"
                      size="sm"
                    >
                      {target.isActive ? '非アクティブ' : 'アクティブ'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(target.id)}
                      variant="outline"
                      size="sm"
                    >
                      削除
                    </Button>
                  </div>
                </div>

                {/* カウントダウン表示 */}
                <div className="mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        isExpired ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {timeLeft[target.id] || '計算中...'}
                      </div>
                      <div className="text-sm text-gray-800">
                        {!isExpired && '残り時間'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-800">
                      目標日: {new Date(target.targetDate).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>

                {/* 学習進捗 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">学習進捗</span>
                    <span className="text-sm text-gray-800">
                      {target.completedHours.toFixed(1)}時間 / {target.totalStudyHours}時間
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        progressPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-800 mt-1">
                    <span>完了率: {progressPercentage.toFixed(1)}%</span>
                    <span>残り: {remainingHours.toFixed(1)}時間</span>
                  </div>
                </div>

                {/* 科目と1日あたりの必要時間 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">対象科目</h4>
                    <div className="flex flex-wrap gap-1">
                      {target.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">1日あたりの必要時間</h4>
                    <div className={`text-lg font-semibold ${
                      dailyRequiredHours > 8 ? 'text-red-600' : 
                      dailyRequiredHours > 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {dailyRequiredHours.toFixed(1)}時間
                    </div>
                    {dailyRequiredHours > 8 && (
                      <div className="text-xs text-red-600 mt-1">
                        ⚠️ 1日8時間を超えています
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

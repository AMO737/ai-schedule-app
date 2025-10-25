'use client'

import { useState, useEffect } from 'react'
import { WeeklyProgress as WeeklyProgressType } from '@/types'

interface WeeklyProgressProps {
  userId: string
}

export function WeeklyProgress({ userId }: WeeklyProgressProps) {
  const [progress, setProgress] = useState<WeeklyProgressType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 一時的にデモデータを使用
    const demoProgress: WeeklyProgressType = {
      week_start_date: new Date().toISOString().split('T')[0],
      total_planned_hours: 10,
      total_completed_hours: 6.5,
      completion_rate: 65,
      subject_progress: [
        { subject: '英語', completed_hours: 3, planned_hours: 4, completion_rate: 75 },
        { subject: '数学', completed_hours: 2.5, planned_hours: 3, completion_rate: 83 },
        { subject: '国語', completed_hours: 1, planned_hours: 3, completion_rate: 33 }
      ]
    }
    
    setProgress(demoProgress)
    setLoading(false)
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">週間進捗</h2>
        <p className="text-gray-700">読み込み中...</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">週間進捗</h2>
        <p className="text-gray-700">進捗データがありません。</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">週間進捗</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-800">計画時間</span>
          <span className="font-medium">{progress.total_planned_hours}時間</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-800">完了時間</span>
          <span className="font-medium">{progress.total_completed_hours}時間</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-800">達成率</span>
          <span className="font-medium">{progress.completion_rate.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.completion_rate}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
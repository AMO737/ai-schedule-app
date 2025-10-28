'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LearningGoal, SubjectDistribution } from '@/types'

interface LearningGoalFormProps {
  onSubmit: (goal: Omit<LearningGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<LearningGoal>
}

const BLOCK_DURATION_OPTIONS = [
  { value: 15, label: '15分' },
  { value: 30, label: '30分' },
  { value: 45, label: '45分' },
  { value: 60, label: '60分' },
  { value: 90, label: '90分' },
]

const BREAK_DURATION_OPTIONS = [
  { value: 5, label: '5分' },
  { value: 10, label: '10分' },
  { value: 15, label: '15分' },
  { value: 20, label: '20分' },
]

export function LearningGoalForm({ onSubmit, onCancel, initialData }: LearningGoalFormProps) {
  const [formData, setFormData] = useState({
    weekly_hours: 10,
    block_duration: 30,
    wake_up_time: '07:00',
    sleep_time: '23:00',
    break_duration: 5,
    is_active: true,
  })

  const [subjects, setSubjects] = useState<SubjectDistribution[]>([
    { subject: '英語', percentage: 40 },
    { subject: '数学', percentage: 30 },
    { subject: 'その他', percentage: 30 },
  ])

  // 初期データが変更されたときにフォームデータを更新
  useEffect(() => {
    if (initialData) {
      setFormData({
        weekly_hours: initialData.weekly_hours || 10,
        block_duration: initialData.block_duration || 30,
        wake_up_time: initialData.wake_up_time || '07:00',
        sleep_time: initialData.sleep_time || '23:00',
        break_duration: initialData.break_duration || 5,
        is_active: initialData.is_active ?? true,
      })
      
      if (initialData.subject_distribution) {
        setSubjects(initialData.subject_distribution)
      }
    }
  }, [initialData])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPercentage = subjects.reduce((sum, sub) => sum + sub.percentage, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (Math.abs(totalPercentage - 100) > 0.1) {
      alert('科目の配分は合計100%になるように設定してください。')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        subject_distribution: subjects
      })
    } catch (error) {
      console.error('Failed to submit learning goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubjectChange = (index: number, field: 'subject' | 'percentage', value: string | number) => {
    setSubjects(prev => prev.map((subject, i) => 
      i === index ? { ...subject, [field]: value } : subject
    ))
  }

  const addSubject = () => {
    setSubjects(prev => [...prev, { subject: '', percentage: 0 }])
  }

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(prev => prev.filter((_, i) => i !== index))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="weekly_hours" className="block text-sm font-medium text-gray-700 mb-1">
          週の学習時間（時間）
        </label>
        <input
          type="number"
          id="weekly_hours"
          min="0.5"
          max="168"
          step="0.5"
          value={formData.weekly_hours.toString()}
          onChange={(e) => handleChange('weekly_hours', parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="block_duration" className="block text-sm font-medium text-gray-700 mb-1">
          学習ブロックの長さ
        </label>
        <select
          id="block_duration"
          value={formData.block_duration}
          onChange={(e) => handleChange('block_duration', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {BLOCK_DURATION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="wake_up_time" className="block text-sm font-medium text-gray-700 mb-1">
            起床時刻
          </label>
          <input
            type="time"
            id="wake_up_time"
            value={formData.wake_up_time}
            onChange={(e) => handleChange('wake_up_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="sleep_time" className="block text-sm font-medium text-gray-700 mb-1">
            就寝時刻
          </label>
          <input
            type="time"
            id="sleep_time"
            value={formData.sleep_time}
            onChange={(e) => handleChange('sleep_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="break_duration" className="block text-sm font-medium text-gray-700 mb-1">
          休憩時間
        </label>
        <select
          id="break_duration"
          value={formData.break_duration}
          onChange={(e) => handleChange('break_duration', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {BREAK_DURATION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            科目配分
          </label>
          <Button type="button" onClick={addSubject} variant="outline" size="sm">
            科目を追加
          </Button>
        </div>
        
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={subject.subject}
                onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                placeholder="科目名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={subject.percentage.toString()}
                onChange={(e) => handleSubjectChange(index, 'percentage', parseFloat(e.target.value) || 0)}
                placeholder="%"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-500">%</span>
              {subjects.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeSubject(index)}
                  variant="outline"
                  size="sm"
                >
                  削除
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-sm">
          <span className={totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}>
            合計: {totalPercentage.toFixed(1)}%
          </span>
          {totalPercentage !== 100 && (
            <span className="text-red-600 ml-2">
              (100%になるように調整してください)
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => handleChange('is_active', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
          有効
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || Math.abs(totalPercentage - 100) > 0.1}
          className="flex-1"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}

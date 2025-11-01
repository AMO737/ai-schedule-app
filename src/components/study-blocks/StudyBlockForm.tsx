'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { StudyBlock, LearningGoal } from '@/types'

interface StudyBlockFormProps {
  onSubmit: (block: Omit<StudyBlock, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<StudyBlock>
  selectedDate?: Date
  learningGoal?: LearningGoal | null
}

export function StudyBlockForm({ onSubmit, onCancel, initialData, selectedDate, learningGoal }: StudyBlockFormProps) {
  // 学習目標から科目選択肢を取得
  const subjectOptions = useMemo(() => {
    return learningGoal?.subject_distribution?.map(s => s.subject) || []
  }, [learningGoal])
  
  const [formData, setFormData] = useState({
    subject: '',
    scheduled_date: '',
    start_time: '07:00',
    end_time: '07:30',
    color: '#10B981',
    is_completed: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 初期データが変更されたときにフォームデータを更新
  useEffect(() => {
    // Date型から YYYY-MM-DD 形式に変換する関数
    const formatDateToLocal = (date: Date | string): string => {
      let d: Date
      if (typeof date === 'string') {
        // すでに YYYY-MM-DD 形式の場合はそのまま返す
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return date
        }
        d = new Date(date)
      } else {
        d = date
      }
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    
    if (initialData) {
      let dateStr = ''
      if ((initialData as any).scheduled_date) {
        dateStr = formatDateToLocal((initialData as any).scheduled_date)
      } else if (initialData.date) {
        dateStr = formatDateToLocal(initialData.date)
      } else if (selectedDate) {
        dateStr = formatDateToLocal(selectedDate)
      }
      
      setFormData({
        subject: initialData.subject || '',
        scheduled_date: dateStr,
        start_time: initialData.start_time || '07:00',
        end_time: initialData.end_time || '07:30',
        color: initialData.color || '#10B981',
        is_completed: initialData.is_completed || false,
      })
    } else if (selectedDate) {
      // 新規作成時は選択された日付を使用（ローカル日付として扱う）
      const dateStr = formatDateToLocal(selectedDate)
      setFormData({
        subject: subjectOptions.length > 0 ? subjectOptions[0] : '',
        scheduled_date: dateStr,
        start_time: '07:00',
        end_time: '07:30',
        color: '#10B981',
        is_completed: false,
      })
    }
  }, [initialData, selectedDate, subjectOptions])
  
  // 学習目標が変更されたら科目を更新
  useEffect(() => {
    if (subjectOptions.length > 0 && !formData.subject) {
      setFormData(prev => ({ ...prev, subject: subjectOptions[0] }))
    }
  }, [learningGoal, subjectOptions, formData.subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject.trim()) {
      alert('科目を選択してください。')
      return
    }
    
    if (!formData.scheduled_date) {
      alert('日付を選択してください。')
      return
    }
    
    if (!formData.start_time || !formData.end_time) {
      alert('開始時間と終了時間を入力してください。')
      return
    }

    // 時間の妥当性チェック
    const startTime = new Date(`2000-01-01T${formData.start_time}`)
    const endTime = new Date(`2000-01-01T${formData.end_time}`)
    
    if (startTime >= endTime) {
      alert('終了時間は開始時間より後に設定してください。')
      return
    }

    console.log('[StudyBlockForm] Submitting with formData:', formData)
    setIsSubmitting(true)

    try {
      // YYYY-MM-DD 形式を保証
      const dateStr = formData.scheduled_date // すでに YYYY-MM-DD 形式のはず
      
      const submitData = {
        subject: formData.subject.trim(),
        date: dateStr,
        start_time: formData.start_time,
        end_time: formData.end_time,
        duration: calculateDuration(),
        color: '#10B981',
        is_completed: formData.is_completed,
        is_skipped: false,
        hasAlarm: false,
        completed_at: formData.is_completed ? new Date().toISOString() : undefined,
      }
      console.log('[StudyBlockForm] Submit data:', submitData)
      console.log('[StudyBlockForm] date field (YYYY-MM-DD):', dateStr)
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Failed to submit study block:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateDuration = () => {
    const startTime = new Date(`2000-01-01T${formData.start_time}`)
    const endTime = new Date(`2000-01-01T${formData.end_time}`)
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    return durationMinutes
  }

  // 学習目標が設定されていない場合
  if (!learningGoal || subjectOptions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ 学習ブロックを追加するには、まず「学習目標」で科目配分を設定してください。
          </p>
        </div>
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            閉じる
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-1">
          科目
        </label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {subjectOptions.map(subject => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          ※ 学習目標で設定した科目のみ選択できます
        </p>
      </div>

      <div>
        <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-900 mb-1">
          日付
        </label>
        <input
          type="date"
          id="scheduled_date"
          value={formData.scheduled_date}
          onChange={(e) => handleChange('scheduled_date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-900 mb-1">
            開始時間
          </label>
          <input
            type="time"
            id="start_time"
            value={formData.start_time}
            onChange={(e) => handleChange('start_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-900 mb-1">
            終了時間
          </label>
          <input
            type="time"
            id="end_time"
            value={formData.end_time}
            onChange={(e) => handleChange('end_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* 学習時間の表示 */}
      {formData.start_time && formData.end_time && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>学習時間:</strong> {calculateDuration()}分
          </p>
        </div>
      )}

      <ColorPicker
        selectedColor={formData.color}
        onColorChange={(color) => handleChange('color', color)}
        label="色"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_completed"
          checked={formData.is_completed}
          onChange={(e) => handleChange('is_completed', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_completed" className="ml-2 block text-sm text-gray-900">
          完了済みとして登録
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
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

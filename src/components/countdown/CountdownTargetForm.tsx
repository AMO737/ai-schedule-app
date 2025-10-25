'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface CountdownTarget {
  id: string
  target_date: string
  target_hours: number
  completed_hours: number
  title: string
  created_at: string
  updated_at: string
}

interface CountdownTargetFormProps {
  onSubmit: (target: Omit<CountdownTarget, 'id'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<CountdownTarget>
}

export function CountdownTargetForm({ onSubmit, onCancel, initialData }: CountdownTargetFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    targetDate: '',
    totalStudyHours: 50,
    subjects: [''],
    isActive: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初期データが変更されたときにフォームデータを更新
  useEffect(() => {
    console.log('useEffect実行 - initialData:', initialData)
    if (initialData) {
      const newFormData = {
        title: initialData.title || '',
        targetDate: initialData.targetDate || '',
        totalStudyHours: initialData.totalStudyHours || 50,
        subjects: initialData.subjects || [''],
        isActive: initialData.isActive ?? true,
      }
      console.log('編集モード - フォームデータを設定:', newFormData)
      setFormData(newFormData)
    } else {
      // 新規作成時はデフォルト値にリセット
      const defaultFormData = {
        title: '',
        targetDate: '',
        totalStudyHours: 50,
        subjects: [''],
        isActive: true,
      }
      console.log('新規作成モード - デフォルトデータを設定:', defaultFormData)
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('フォーム送信開始:', formData)
    console.log('初期データ:', initialData)
    
    if (!formData.title.trim()) {
      alert('目標名を入力してください。')
      return
    }
    
    if (!formData.targetDate) {
      alert('目標日を選択してください。')
      return
    }
    
    if (formData.totalStudyHours <= 0) {
      alert('総学習時間は0より大きい値を入力してください。')
      return
    }
    

    const validSubjects = formData.subjects.filter(subject => subject.trim())
    if (validSubjects.length === 0) {
      alert('少なくとも1つの科目を入力してください。')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        title: formData.title.trim(),
        targetDate: formData.targetDate,
        totalStudyHours: formData.totalStudyHours,
        completedHours: 0, // 自動計算される
        subjects: validSubjects,
        isActive: formData.isActive,
      }
      
      console.log('送信データ:', submitData)
      await onSubmit(submitData)
    } catch (error) {
      console.error('Failed to submit countdown target:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    console.log(`フィールド変更: ${field} = ${value}`)
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      console.log('新しいフォームデータ:', newData)
      return newData
    })
  }

  const handleSubjectChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? value : subject
      )
    }))
  }

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }))
  }

  const removeSubject = (index: number) => {
    if (formData.subjects.length > 1) {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter((_, i) => i !== index)
      }))
    }
  }

  // 今日の日付を取得（最小値として設定）
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          目標名
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="例: 大学受験、TOEIC試験、資格試験"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
          目標日
        </label>
        <input
          type="date"
          id="targetDate"
          value={formData.targetDate}
          onChange={(e) => handleChange('targetDate', e.target.value)}
          min={today}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="totalStudyHours" className="block text-sm font-medium text-gray-700 mb-1">
          総学習時間（時間）
        </label>
        <input
          type="number"
          id="totalStudyHours"
          min="1"
          max="1000"
          step="0.5"
          value={formData.totalStudyHours.toString()}
          onChange={(e) => handleChange('totalStudyHours', parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          ※ 完了時間は学習ブロックの完了状況から自動計算されます
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            対象科目
          </label>
          <Button type="button" onClick={addSubject} variant="outline" size="sm">
            科目を追加
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={subject}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                placeholder="科目名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formData.subjects.length > 1 && (
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
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          アクティブ（カウントダウンを表示）
        </label>
      </div>

      {/* 進捗プレビュー */}
      {formData.targetDate && formData.totalStudyHours > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">プレビュー</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>残り時間: {(() => {
              const targetDate = new Date(formData.targetDate)
              const now = new Date()
              const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              return diffDays > 0 ? `${diffDays}日` : '期限切れ'
            })()}</div>
            <div>完了率: 0.0% (学習ブロック完了後に自動更新)</div>
            <div>残り学習時間: {formData.totalStudyHours}時間</div>
          </div>
        </div>
      )}

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

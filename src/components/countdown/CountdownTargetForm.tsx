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
    target_date: '',
    target_hours: 50,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初期データが変更されたときにフォームデータを更新
  useEffect(() => {
    console.log('useEffect実行 - initialData:', initialData)
    if (initialData) {
      const newFormData = {
        title: initialData.title || '',
        target_date: initialData.target_date || '',
        target_hours: initialData.target_hours || 50,
      }
      console.log('編集モード - フォームデータを設定:', newFormData)
      setFormData(newFormData)
    } else {
      // 新規作成時はデフォルト値にリセット
      const defaultFormData = {
        title: '',
        target_date: '',
        target_hours: 50,
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
    
    if (!formData.target_date) {
      alert('目標日を選択してください。')
      return
    }
    
    if (formData.target_hours <= 0) {
      alert('総学習時間は0より大きい値を入力してください。')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        title: formData.title.trim(),
        target_date: formData.target_date,
        target_hours: formData.target_hours,
        completed_hours: 0, // 自動計算される
        created_at: initialData?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
          value={formData.target_date}
          onChange={(e) => handleChange('target_date', e.target.value)}
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
          value={formData.target_hours.toString()}
          onChange={(e) => handleChange('target_hours', parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          ※ 完了時間は学習ブロックの完了状況から自動計算されます
        </p>
      </div>

      {/* 進捗プレビュー */}
      {formData.target_date && formData.target_hours > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">プレビュー</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>残り時間: {(() => {
              const targetDate = new Date(formData.target_date)
              const now = new Date()
              const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              return diffDays > 0 ? `${diffDays}日` : '期限切れ'
            })()}</div>
            <div>完了率: 0.0% (学習ブロック完了後に自動更新)</div>
            <div>残り学習時間: {formData.target_hours}時間</div>
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

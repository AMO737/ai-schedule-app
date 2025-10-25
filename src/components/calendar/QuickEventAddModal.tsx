'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface QuickEventAddModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  selectedTime: string
  onAddEvent: (eventData: {
    title: string
    startTime: string
    endTime: string
    color: string
    type: 'fixed-event' | 'study-block'
    subject?: string
    hasAlarm?: boolean
  }) => void
}

export function QuickEventAddModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onAddEvent
}: QuickEventAddModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    startTime: selectedTime,
    endTime: '',
    color: '#3B82F6',
    type: 'study-block' as 'study-block',
    subject: '英語',
    hasAlarm: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // selectedTimeが変更されたときにstartTimeを更新
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      startTime: selectedTime,
      endTime: '' // 終了時間はリセット
    }))
  }, [selectedTime])

  const colorOptions = [
    { name: '青', value: '#3B82F6' },
    { name: '緑', value: '#10B981' },
    { name: '赤', value: '#EF4444' },
    { name: '黄', value: '#F59E0B' },
    { name: '紫', value: '#8B5CF6' },
    { name: 'ピンク', value: '#EC4899' },
    { name: 'オレンジ', value: '#F97316' },
    { name: 'シアン', value: '#06B6D4' }
  ]

  const subjectOptions = [
    '英語', '数学', '国語', '理科', '社会', 'その他'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.endTime) {
      alert('終了時間を入力してください。')
      return
    }

    setIsSubmitting(true)

    try {
      await onAddEvent({
        title: formData.title,
        startTime: formData.startTime,
        endTime: formData.endTime,
        color: formData.color,
        type: formData.type,
        subject: formData.type === 'study-block' ? formData.subject : undefined
      })
      onClose()
    } catch (error) {
      console.error('Failed to add event:', error)
      alert('予定の追加に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">予定を追加</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>日付:</strong> {selectedDate.toLocaleDateString('ja-JP', { 
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
            <div className="text-sm text-blue-800">
              <strong>開始時間:</strong> {formData.startTime}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 予定タイプは学習ブロックのみ */}
            <div className="hidden">
              <input type="hidden" name="type" value="study-block" />
            </div>

            {/* 科目選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                科目
              </label>
              <select
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
            </div>

            {/* 時間設定 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  開始時間
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">※ クリックした時間が自動設定されます</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  終了時間
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* クイック時間設定 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                クイック設定
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 90, 120, 180, 240].map(duration => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => {
                      const endTime = calculateEndTime(formData.startTime, duration)
                      setFormData(prev => ({ ...prev, endTime }))
                    }}
                    className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {duration}分
                  </button>
                ))}
              </div>
            </div>

            {/* 色選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                色
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color.value 
                        ? 'border-gray-800' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* アラーム機能 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.hasAlarm}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasAlarm: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  開始30分前に通知する
                </span>
              </label>
            </div>

            {/* ボタン */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? '追加中...' : '追加'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { FixedEvent } from '@/types'

interface FixedEventFormProps {
  onSubmit: (event: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<FixedEvent>
}

const DAYS_OF_WEEK = [
  { value: 0, label: '日曜日' },
  { value: 1, label: '月曜日' },
  { value: 2, label: '火曜日' },
  { value: 3, label: '水曜日' },
  { value: 4, label: '木曜日' },
  { value: 5, label: '金曜日' },
  { value: 6, label: '土曜日' },
]

export function FixedEventForm({ onSubmit, onCancel, initialData }: FixedEventFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    day_of_week: initialData?.day_of_week || 1,
    start_time: initialData?.start_time || '09:00',
    end_time: initialData?.end_time || '10:00',
    color: initialData?.color || '#3B82F6',
    is_active: initialData?.is_active ?? true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit fixed event:', error)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
          予定名
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-900 mb-1">
          曜日
        </label>
        <select
          id="day_of_week"
          value={formData.day_of_week}
          onChange={(e) => handleChange('day_of_week', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {DAYS_OF_WEEK.map(day => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
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

      <ColorPicker
        selectedColor={formData.color}
        onColorChange={(color) => handleChange('color', color)}
        label="色"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => handleChange('is_active', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          有効
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


import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { FixedEvent } from '@/types'

interface FixedEventFormProps {
  onSubmit: (event: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<FixedEvent>
}

const DAYS_OF_WEEK = [
  { value: 0, label: '日曜日' },
  { value: 1, label: '月曜日' },
  { value: 2, label: '火曜日' },
  { value: 3, label: '水曜日' },
  { value: 4, label: '木曜日' },
  { value: 5, label: '金曜日' },
  { value: 6, label: '土曜日' },
]

export function FixedEventForm({ onSubmit, onCancel, initialData }: FixedEventFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    day_of_week: initialData?.day_of_week || 1,
    start_time: initialData?.start_time || '09:00',
    end_time: initialData?.end_time || '10:00',
    color: initialData?.color || '#3B82F6',
    is_active: initialData?.is_active ?? true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit fixed event:', error)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
          予定名
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-900 mb-1">
          曜日
        </label>
        <select
          id="day_of_week"
          value={formData.day_of_week}
          onChange={(e) => handleChange('day_of_week', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {DAYS_OF_WEEK.map(day => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
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

      <ColorPicker
        selectedColor={formData.color}
        onColorChange={(color) => handleChange('color', color)}
        label="色"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => handleChange('is_active', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          有効
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

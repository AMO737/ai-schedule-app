'use client'

import { useState, useEffect } from 'react'
import { FixedEvent } from '@/types'
import { Button } from '@/components/ui/button'
import { FixedEventForm } from './FixedEventForm'
import { FixedEventService } from '@/lib/fixed-events'
import { SimpleStorage } from '@/lib/simple-storage'

interface FixedEventListProps {
  userId: string
  fixedEvents?: FixedEvent[]
  setFixedEvents?: (events: FixedEvent[]) => void
  fixedEventExceptions?: { [key: string]: string[] | undefined }
  onToggleFixedEventException?: (eventId: string, date: string) => void
}

const DAYS_OF_WEEK = [
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
]

export function FixedEventList({ userId, fixedEvents: externalFixedEvents, setFixedEvents: setExternalFixedEvents, fixedEventExceptions = {}, onToggleFixedEventException }: FixedEventListProps) {
  const [events, setEvents] = useState<FixedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<FixedEvent | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // 外部からfixedEventsが渡された場合はそれを使用
  const currentEvents = externalFixedEvents || events
  const updateEvents = (updater: FixedEvent[] | ((prev: FixedEvent[]) => FixedEvent[])) => {
    if (typeof updater === 'function') {
      if (setExternalFixedEvents) {
        setExternalFixedEvents(updater(externalFixedEvents || []))
      } else {
        setEvents(updater)
      }
    } else {
      if (setExternalFixedEvents) {
        setExternalFixedEvents(updater)
      } else {
        setEvents(updater)
      }
    }
  }

  useEffect(() => {
    if (externalFixedEvents) {
      // 外部からfixedEventsが渡された場合はそれを使用
      setLoading(false)
    } else {
      // デモデータなし（空のリスト）
      setEvents([])
      setLoading(false)
    }
  }, [userId, externalFixedEvents])

  const handleEdit = (event: FixedEvent) => {
    setEditingEvent(event)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingEvent(null)
  }

  const handleCancel = () => {
    setEditingEvent(null)
    setIsAdding(false)
  }

  const handleSubmit = async (formData: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingEvent) {
        // デモモード: 編集されたイベントを更新
        const updatedEvent = { ...editingEvent, ...formData, updated_at: new Date().toISOString() }
        const updated = currentEvents.map(event => event.id === editingEvent.id ? updatedEvent : event)
        updateEvents(updated)
        // 即座にストレージに保存
        SimpleStorage.save('fixedEvents', updated)
      } else {
        // デモモード: 新しいイベントを追加
        const newEvent: FixedEvent = {
          ...formData,
          id: `demo-event-${Date.now()}`,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        const updated = [...currentEvents, newEvent]
        updateEvents(updated)
        // 即座にストレージに保存
        SimpleStorage.save('fixedEvents', updated)
      }
      handleCancel()
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (confirm('この予定を削除しますか？')) {
      try {
        // デモモード: イベントを削除
        const updated = currentEvents.filter(event => event.id !== eventId)
        updateEvents(updated)
        // 即座にストレージに保存
        SimpleStorage.save('fixedEvents', updated)
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM format
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-700">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">固定予定</h2>
        <Button onClick={handleAdd} variant="outline">
          予定を追加
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">新しい予定を追加</h3>
          <FixedEventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {editingEvent && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4 text-gray-900">予定を編集</h3>
          <FixedEventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingEvent}
          />
        </div>
      )}

      <div className="space-y-2">
        {currentEvents.length === 0 ? (
          <p className="text-gray-700 text-center py-8">
            固定予定がありません。予定を追加してください。
          </p>
        ) : (
          currentEvents.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${
                event.is_active ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-900">{event.title}</h3>
                  <p className="text-gray-800">
                    {DAYS_OF_WEEK[event.day_of_week]} {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                  {!event.is_active && (
                    <p className="text-sm text-gray-700">無効</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                  >
                    編集
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(event.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { FixedEvent } from '@/types'
import { Button } from '@/components/ui/button'
import { FixedEventForm } from './FixedEventForm'
import { FixedEventService } from '@/lib/fixed-events'
import { SimpleStorage } from '@/lib/simple-storage'

interface FixedEventListProps {
  userId: string
  fixedEvents?: FixedEvent[]
  setFixedEvents?: (events: FixedEvent[]) => void
  fixedEventExceptions?: { [key: string]: string[] | undefined }
  onToggleFixedEventException?: (eventId: string, date: string) => void
}

const DAYS_OF_WEEK = [
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
]

export function FixedEventList({ userId, fixedEvents: externalFixedEvents, setFixedEvents: setExternalFixedEvents, fixedEventExceptions = {}, onToggleFixedEventException }: FixedEventListProps) {
  const [events, setEvents] = useState<FixedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<FixedEvent | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // 外部からfixedEventsが渡された場合はそれを使用
  const currentEvents = externalFixedEvents || events
  const updateEvents = (updater: FixedEvent[] | ((prev: FixedEvent[]) => FixedEvent[])) => {
    if (typeof updater === 'function') {
      if (setExternalFixedEvents) {
        setExternalFixedEvents(updater(externalFixedEvents || []))
      } else {
        setEvents(updater)
      }
    } else {
      if (setExternalFixedEvents) {
        setExternalFixedEvents(updater)
      } else {
        setEvents(updater)
      }
    }
  }

  useEffect(() => {
    if (externalFixedEvents) {
      // 外部からfixedEventsが渡された場合はそれを使用
      setLoading(false)
    } else {
      // デモデータなし（空のリスト）
      setEvents([])
      setLoading(false)
    }
  }, [userId, externalFixedEvents])

  const handleEdit = (event: FixedEvent) => {
    setEditingEvent(event)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingEvent(null)
  }

  const handleCancel = () => {
    setEditingEvent(null)
    setIsAdding(false)
  }

  const handleSubmit = async (formData: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingEvent) {
        // デモモード: 編集されたイベントを更新
        const updatedEvent = { ...editingEvent, ...formData, updated_at: new Date().toISOString() }
        const updated = currentEvents.map(event => event.id === editingEvent.id ? updatedEvent : event)
        updateEvents(updated)
        // 即座にストレージに保存
        SimpleStorage.save('fixedEvents', updated)
      } else {
        // デモモード: 新しいイベントを追加
        const newEvent: FixedEvent = {
          ...formData,
          id: `demo-event-${Date.now()}`,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        const updated = [...currentEvents, newEvent]
        updateEvents(updated)
        // 即座にストレージに保存
        SimpleStorage.save('fixedEvents', updated)
      }
      handleCancel()
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (confirm('この予定を削除しますか？')) {
      try {
        // デモモード: イベントを削除
        const updated = currentEvents.filter(event => event.id !== eventId)
        updateEvents(updated)
        // 即座にストレージに保存
        SimpleStorage.save('fixedEvents', updated)
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM format
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-700">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">固定予定</h2>
        <Button onClick={handleAdd} variant="outline">
          予定を追加
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">新しい予定を追加</h3>
          <FixedEventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {editingEvent && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4 text-gray-900">予定を編集</h3>
          <FixedEventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingEvent}
          />
        </div>
      )}

      <div className="space-y-2">
        {currentEvents.length === 0 ? (
          <p className="text-gray-700 text-center py-8">
            固定予定がありません。予定を追加してください。
          </p>
        ) : (
          currentEvents.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${
                event.is_active ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-900">{event.title}</h3>
                  <p className="text-gray-800">
                    {DAYS_OF_WEEK[event.day_of_week]} {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                  {!event.is_active && (
                    <p className="text-sm text-gray-700">無効</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                  >
                    編集
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(event.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

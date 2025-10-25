'use client'

import { useState, useEffect } from 'react'
import { FixedEvent, StudyBlock } from '@/types'
import { EmailNotificationSettings } from './EmailNotificationSettings'

interface NotificationSystemProps {
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  fixedEventExceptions: { [key: string]: string[] | undefined }
}

interface NotificationItem {
  id: string
  type: 'fixed-event-exception' | 'study-block-alarm'
  title: string
  message: string
  time: string
  date: string
  isRead: boolean
  createdAt: Date
}

export function NotificationSystem({ 
  fixedEvents, 
  studyBlocks, 
  fixedEventExceptions 
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showEmailSettings, setShowEmailSettings] = useState(false)
  const [emailSettings, setEmailSettings] = useState<{ enabled: boolean; email: string }>({ 
    enabled: false, 
    email: '' 
  })

  // 通知を生成する関数
  const generateNotifications = () => {
    const newNotifications: NotificationItem[] = []
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    console.log('Generating notifications for date:', todayStr)
    console.log('Fixed events:', fixedEvents.length)
    console.log('Study blocks:', studyBlocks.length)
    console.log('Fixed event exceptions:', Object.keys(fixedEventExceptions).length)

    // 1. 固定予定の例外削除の通知
    Object.entries(fixedEventExceptions).forEach(([date, eventIds]) => {
      if (date === todayStr && eventIds) {
        eventIds.forEach(eventId => {
          const event = fixedEvents.find(e => e.id === eventId)
          if (event) {
            newNotifications.push({
              id: `fixed-exception-${eventId}-${date}`,
              type: 'fixed-event-exception',
              title: '固定予定が例外削除されました',
              message: `${event.title} (${event.start_time}-${event.end_time})`,
              time: event.start_time,
              date: date,
              isRead: false,
              createdAt: new Date()
            })
          }
        })
      }
    })

    // 2. アラーム機能付き学習ブロックの通知
    studyBlocks.forEach(block => {
      if (block.hasAlarm && block.date === todayStr) {
        const startTime = new Date(`${block.date}T${block.start_time}:00`)
        const now = new Date()
        const timeDiff = startTime.getTime() - now.getTime()
        
        // 開始時間の30分前に通知
        if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
          newNotifications.push({
            id: `study-alarm-${block.id}`,
            type: 'study-block-alarm',
            title: '学習時間のお知らせ',
            message: `${block.subject} の学習時間が30分後に開始されます`,
            time: block.start_time,
            date: block.date,
            isRead: false,
            createdAt: new Date()
          })
        }
      }
    })

    setNotifications(prev => {
      // 既存の通知と新しい通知をマージ（重複を避ける）
      const existingIds = prev.map(n => n.id)
      const uniqueNewNotifications = newNotifications.filter(n => !existingIds.includes(n.id))
      
      // メール通知を送信（有効な場合）
      if (emailSettings.enabled && emailSettings.email && uniqueNewNotifications.length > 0) {
        sendEmailNotification(uniqueNewNotifications[0])
      }
      
      return [...prev, ...uniqueNewNotifications].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
  }

  // メール通知を送信
  const sendEmailNotification = async (notification: NotificationItem) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailSettings.email,
          subject: notification.title,
          message: `${notification.message}\n\n時間: ${notification.time}\n日付: ${notification.date}`
        })
      })
      
      if (response.ok) {
        console.log('メール通知を送信しました:', notification.title)
      }
    } catch (error) {
      console.error('メール送信エラー:', error)
    }
  }

  // 定期的に通知をチェック（1分ごと）
  useEffect(() => {
    const interval = setInterval(generateNotifications, 60000) // 1分
    generateNotifications() // 初回実行

    return () => clearInterval(interval)
  }, [fixedEvents, studyBlocks, fixedEventExceptions])

  // 通知を既読にする
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  // 通知を削除する
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  // 未読通知の数
  const unreadCount = notifications.filter(n => !n.isRead).length

  console.log('NotificationSystem rendered, notifications count:', notifications.length)

  return (
    <div className="relative">
      {/* 通知ベルアイコン */}
      <button
        onClick={() => {
          console.log('Notification button clicked')
          setShowNotifications(!showNotifications)
        }}
        className="relative px-3 py-2 bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-gray-300 shadow-sm transition-colors"
        title="通知"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* 未読通知のバッジ */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 通知ドロップダウン */}
      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">通知</h3>
            <button
              onClick={() => setShowEmailSettings(!showEmailSettings)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              メール設定
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              通知はありません
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          既読
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* メール設定フォーム */}
          {showEmailSettings && (
            <div className="p-4 border-t border-gray-200">
              <EmailNotificationSettings
                onSettingsChange={setEmailSettings}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

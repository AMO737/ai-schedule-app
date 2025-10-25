'use client'

import { useState, useEffect } from 'react'

interface EmailNotificationSettingsProps {
  onSettingsChange?: (settings: { enabled: boolean; email: string }) => void
}

export function EmailNotificationSettings({ onSettingsChange }: EmailNotificationSettingsProps) {
  const [enabled, setEnabled] = useState(false)
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Cookieから設定を読み込む
    const savedSettings = localStorage.getItem('email_notification_settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setEnabled(settings.enabled || false)
      setEmail(settings.email || '')
      setShowForm(settings.enabled || false)
    }
  }, [])

  const handleEnableChange = (value: boolean) => {
    setEnabled(value)
    setShowForm(value)
    
    if (value) {
      // 有効化した場合はメールアドレスが必要
      // showFormが開かれる
    } else {
      // 無効化した場合は設定を保存
      saveSettings(false, '')
      if (onSettingsChange) {
        onSettingsChange({ enabled: false, email: '' })
      }
    }
  }

  const handleSave = () => {
    if (!email || !email.includes('@')) {
      alert('有効なメールアドレスを入力してください')
      return
    }
    
    saveSettings(true, email)
    if (onSettingsChange) {
      onSettingsChange({ enabled: true, email })
    }
    setShowForm(false)
    alert('メール通知設定を保存しました')
  }

  const handleDisable = () => {
    setEnabled(false)
    setShowForm(false)
    saveSettings(false, '')
    if (onSettingsChange) {
      onSettingsChange({ enabled: false, email: '' })
    }
  }

  const saveSettings = (enabled: boolean, email: string) => {
    const settings = { enabled, email }
    localStorage.setItem('email_notification_settings', JSON.stringify(settings))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        メール通知設定
      </h3>
      
      <div className="space-y-4">
        {/* トグルスイッチ */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              メール通知を有効にする
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {enabled ? 'メールアドレスを登録すると通知を受け取れます' : '希望する場合のみ有効にしてください'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleEnableChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* メールアドレス入力フォーム */}
        {showForm && (
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  保存
                </button>
                <button
                  onClick={handleDisable}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>

            {email && enabled && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  ✓ メール通知が有効です<br />
                  <span className="text-xs">{email}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 通知の説明 */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">通知が届くタイミング：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>固定予定の例外削除時</li>
            <li>学習ブロックの開始30分前（アラームONの場合）</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

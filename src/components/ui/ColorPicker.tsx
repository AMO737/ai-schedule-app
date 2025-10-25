'use client'

import { useState } from 'react'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
  label?: string
}

const COLOR_OPTIONS = [
  { name: '青', value: '#3B82F6', bg: 'bg-blue-500', text: 'text-blue-500' },
  { name: '緑', value: '#10B981', bg: 'bg-green-500', text: 'text-green-500' },
  { name: '赤', value: '#EF4444', bg: 'bg-red-500', text: 'text-red-500' },
  { name: '黄', value: '#F59E0B', bg: 'bg-yellow-500', text: 'text-yellow-500' },
  { name: '紫', value: '#8B5CF6', bg: 'bg-purple-500', text: 'text-purple-500' },
  { name: 'ピンク', value: '#EC4899', bg: 'bg-pink-500', text: 'text-pink-500' },
  { name: 'オレンジ', value: '#F97316', bg: 'bg-orange-500', text: 'text-orange-500' },
  { name: 'シアン', value: '#06B6D4', bg: 'bg-cyan-500', text: 'text-cyan-500' },
  { name: 'グレー', value: '#6B7280', bg: 'bg-gray-500', text: 'text-gray-500' },
  { name: 'インドゴ', value: '#6366F1', bg: 'bg-indigo-500', text: 'text-indigo-500' },
  { name: 'エメラルド', value: '#059669', bg: 'bg-emerald-500', text: 'text-emerald-500' },
  { name: 'ローズ', value: '#F43F5E', bg: 'bg-rose-500', text: 'text-rose-500' },
]

export function ColorPicker({ selectedColor, onColorChange, label = '色' }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="grid grid-cols-6 gap-2">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all duration-200
              ${selectedColor === color.value 
                ? 'border-gray-800 scale-110 shadow-lg' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${color.bg}
            `}
            title={color.name}
          />
        ))}
      </div>
      <div className="text-xs text-gray-700 mt-1">
        選択中の色: {COLOR_OPTIONS.find(c => c.value === selectedColor)?.name || 'カスタム'}
      </div>
    </div>
  )
}

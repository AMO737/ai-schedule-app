import { get, set, del } from 'idb-keyval'
import type { StateStorage } from 'zustand/middleware'

// IndexedDB を Zustand persist の storage として使うためのラッパー
export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get(name)
      // idb-keyvalのgetは値をそのまま返すので、文字列として扱う
      if (value === undefined || value === null) {
        return null
      }
      // 既に文字列ならそのまま、そうでなければJSON化
      return typeof value === 'string' ? value : JSON.stringify(value)
    } catch (error) {
      console.error('IndexedDB getItem error:', error)
      return null
    }
  },
  
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // valueはZustandが既にJSON文字列にしてくれているのでそのまま保存
      await set(name, value)
      console.log('💾 IndexedDB にデータを保存しました:', name)
    } catch (error) {
      console.error('IndexedDB setItem error:', error)
    }
  },
  
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name)
    } catch (error) {
      console.error('IndexedDB removeItem error:', error)
    }
  }
}

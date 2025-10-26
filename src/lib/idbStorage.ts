import { get, set, del } from 'idb-keyval'

// IndexedDB を Zustand persist の storage として使うためのラッパー
export const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get(name)
      return value ?? null
    } catch (error) {
      console.error('IndexedDB getItem error:', error)
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
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

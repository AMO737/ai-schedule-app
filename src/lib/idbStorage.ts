import { StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'
import { withTimeout } from './timeout'

// IndexedDBストレージの初期化（タイムアウト付き）
async function ensureStorage() {
  try {
    // 1秒でタイムアウト（高速化）
    await withTimeout(
      new Promise<void>((resolve) => {
        get('__test__').then(() => resolve()).catch(() => resolve())
      }),
      1000,
      'idb-keyval'
    )
    return true
  } catch (e) {
    console.warn('[idbStorage] Initialization timeout or error', e)
    return false
  }
}

export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const isReady = await ensureStorage()
      if (!isReady) {
        console.warn('[idbStorage] Storage not ready, using localStorage fallback')
        return typeof window !== 'undefined' ? localStorage.getItem(name) : null
      }
      const value = await get<string>(name)
      return value ?? null
    } catch (e) {
      console.warn('[idbStorage] Get failed, using localStorage fallback', e)
      return typeof window !== 'undefined' ? localStorage.getItem(name) : null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const isReady = await ensureStorage()
      if (!isReady) {
        console.warn('[idbStorage] Storage not ready, using localStorage fallback')
        if (typeof window !== 'undefined') {
          localStorage.setItem(name, value)
        }
        return
      }
      await set(name, value)
      // localStorageにもバックアップ
      if (typeof window !== 'undefined') {
        localStorage.setItem(`_backup_${name}`, value)
      }
    } catch (e) {
      console.warn('[idbStorage] Set failed, using localStorage fallback', e)
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, value)
      }
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const isReady = await ensureStorage()
      if (!isReady) {
        console.warn('[idbStorage] Storage not ready, using localStorage fallback')
        if (typeof window !== 'undefined') {
          localStorage.removeItem(name)
          localStorage.removeItem(`_backup_${name}`)
        }
        return
      }
      await del(name)
      // localStorageからも削除
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`_backup_${name}`)
      }
    } catch (e) {
      console.warn('[idbStorage] Remove failed, using localStorage fallback', e)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name)
        localStorage.removeItem(`_backup_${name}`)
      }
    }
  },
}

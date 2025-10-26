// シンプルで確実に動作するストレージユーティリティ

const STORAGE_PREFIX = 'schedule_app_'

export const SimpleStorage = {
  // データを保存
  save(key: string, data: any) {
    try {
      const json = JSON.stringify(data)
      localStorage.setItem(STORAGE_PREFIX + key, json)
      console.log(`✅ Saved: ${key}`, data)
      return true
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error)
      return false
    }
  },

  // データを読み込む
  load(key: string, defaultValue: any = null) {
    try {
      const json = localStorage.getItem(STORAGE_PREFIX + key)
      if (json) {
        const data = JSON.parse(json)
        console.log(`✅ Loaded: ${key}`, data)
        return data
      }
      console.log(`ℹ️  No data found: ${key}`)
      return defaultValue
    } catch (error) {
      console.error(`❌ Failed to load ${key}:`, error)
      return defaultValue
    }
  },

  // データを削除
  remove(key: string) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
      console.log(`✅ Removed: ${key}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error)
      return false
    }
  },

  // 全データをクリア
  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX))
      keys.forEach(key => localStorage.removeItem(key))
      console.log('✅ Cleared all data')
      return true
    } catch (error) {
      console.error('❌ Failed to clear:', error)
      return false
    }
  }
}

const STORAGE_PREFIX = 'schedule_app_'

export const SimpleStorage = {
  // データを保存
  save(key: string, data: any) {
    try {
      const json = JSON.stringify(data)
      localStorage.setItem(STORAGE_PREFIX + key, json)
      console.log(`✅ Saved: ${key}`, data)
      return true
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error)
      return false
    }
  },

  // データを読み込む
  load(key: string, defaultValue: any = null) {
    try {
      const json = localStorage.getItem(STORAGE_PREFIX + key)
      if (json) {
        const data = JSON.parse(json)
        console.log(`✅ Loaded: ${key}`, data)
        return data
      }
      console.log(`ℹ️  No data found: ${key}`)
      return defaultValue
    } catch (error) {
      console.error(`❌ Failed to load ${key}:`, error)
      return defaultValue
    }
  },

  // データを削除
  remove(key: string) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
      console.log(`✅ Removed: ${key}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error)
      return false
    }
  },

  // 全データをクリア
  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX))
      keys.forEach(key => localStorage.removeItem(key))
      console.log('✅ Cleared all data')
      return true
    } catch (error) {
      console.error('❌ Failed to clear:', error)
      return false
    }
  }
}

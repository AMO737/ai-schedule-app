import { withTimeout } from './timeout'

export async function initStorage() {
  try {
    // IndexedDBストレージの初期化を試行
    const { idbStorage } = await import('@/lib/idbStorage')
    const testKey = '__init_test__'
    
    // 読み書きテスト（タイムアウト付き）
    await withTimeout(
      Promise.all([
        idbStorage.setItem(testKey, 'test'),
        idbStorage.getItem(testKey),
        idbStorage.removeItem(testKey),
      ]),
      3000,
      'initStorage'
    )
    
    return true
  } catch (e) {
    console.warn('[boot] IDB init failed => fallback to localStorage', e)
    return false
  }
}

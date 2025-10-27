import { withTimeout } from './timeout'

export async function initStorage() {
  try {
    // TODO: 実アプリのIDB初期化に差し替え
    const db = await withTimeout(
      new Promise(resolve => setTimeout(() => resolve('ok' as any), 1)),
      3000,
      'indexeddb'
    )
    return db
  } catch (e) {
    console.warn('[boot] IDB fail => fallback to in-memory/localStorage', e)
    return null
  }
}

'use client'

import { useEffect } from 'react'
import { useFlags } from './useFlags'

export function useReset() {
  const { reset } = useFlags()

  useEffect(() => {
    if (!reset) return

    (async () => {
      try {
        console.log('[reset] Starting reset...')

        // Service Worker解除
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations()
          await Promise.all(regs.map(r => r.unregister()))
          console.log('[reset] Service Workers unregistered')
        }

        // Cache削除
        if (typeof caches !== 'undefined') {
          const keys = await caches.keys()
          await Promise.all(keys.map(k => caches.delete(k)))
          console.log('[reset] Caches cleared')
        }

        // Storage削除
        try {
          localStorage.clear()
          console.log('[reset] localStorage cleared')
        } catch {}

        try {
          sessionStorage.clear()
          console.log('[reset] sessionStorage cleared')
        } catch {}

        // IndexedDB削除
        try {
          if (indexedDB && indexedDB.databases) {
            const dbs = await indexedDB.databases()
            if (dbs?.length) {
              for (const db of dbs) {
                if (db.name) {
                  try {
                    indexedDB.deleteDatabase(db.name)
                  } catch {}
                }
              }
            }
            console.log('[reset] IndexedDB cleared')
          }
        } catch {}
      } finally {
        // クエリを外して再読み込み
        const url = new URL(window.location.href)
        url.searchParams.delete('reset')
        console.log('[reset] Reloading...')
        window.location.replace(url.toString())
      }
    })()
  }, [reset])
}

'use client'

import { useEffect } from 'react'
import { useFlags } from './useFlags'

export function useSw() {
  const { safe, debug } = useFlags()

  useEffect(() => {
    // 一時的にService Workerを完全に無効化
    // 問題が解決したら復元可能
    if (debug) console.log('[boot] SW disabled for now')
    return

    // TODO: 以下のコードを復元可能（今は無効化）
    /*
    if (safe) {
      if (debug) console.log('[boot] SW skipped (safe mode)')
      return
    }

    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker
        .register('/sw.js')
        .then(r => {
          if (debug) console.log('[boot] SW ok', r.scope)
        })
        .catch(e => console.warn('[boot] SW fail', e))
    }
    */
  }, [safe, debug])
}

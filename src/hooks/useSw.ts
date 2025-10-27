'use client'

import { useEffect } from 'react'
import { useFlags } from './useFlags'

export function useSw() {
  const { safe, debug } = useFlags()

  useEffect(() => {
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
  }, [safe, debug])
}

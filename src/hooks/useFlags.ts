'use client'
import { useMemo } from 'react'

export function useFlags() {
  const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const debug = !!sp?.get('debug')
  const safe = !!sp?.get('safe')
  return useMemo(() => ({ debug, safe }), [debug, safe])
}

'use client'

export function useFlags() {
  if (typeof window === 'undefined') return { debug: false, safe: false, reset: false }
  const sp = new URLSearchParams(window.location.search)
  return {
    debug: sp.has('debug'),
    safe: sp.has('safe'),
    reset: sp.has('reset'),
  }
}

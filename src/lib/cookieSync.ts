import { useEffect, useRef } from 'react'

// ストアの変更をCookieに同期
export function useCookieSync(
  shouldSync: () => boolean,
  getState: () => any,
  debounceMs: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // 初回マウント時はスキップ
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!shouldSync()) return

    // デバウンス
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const state = getState()
      
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: state })
      }).catch(err => console.error('Cookie保存エラー:', err))
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [shouldSync, getState, debounceMs])
}

// ストアの変更をCookieに同期
export function useCookieSync(
  shouldSync: () => boolean,
  getState: () => any,
  debounceMs: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // 初回マウント時はスキップ
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!shouldSync()) return

    // デバウンス
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const state = getState()
      
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: state })
      }).catch(err => console.error('Cookie保存エラー:', err))
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [shouldSync, getState, debounceMs])
}

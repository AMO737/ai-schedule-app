'use client'

import { useEffect, useState } from 'react'
import { useFlags } from '@/hooks/useFlags'
import { useHydrated } from '@/store/schedule'

export default function BootGate({ children }: { children: React.ReactNode }) {
  const { debug, safe } = useFlags()
  const hasHydrated = useHydrated()
  const [ready, setReady] = useState(false)
  const [warn, setWarn] = useState<string | null>(null)

  useEffect(() => {
    let stale = false

    const init = async () => {
      try {
        if (debug) console.log('[boot] start', { safe })

        // Service Worker登録（safeモードではスキップ）
        if (safe) {
          if (debug) console.log('[boot] SW skipped (safe mode)')
        } else if ('serviceWorker' in navigator && typeof window !== 'undefined') {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            if (debug) console.log('[boot] SW ok', registration.scope)
          } catch (e) {
            console.warn('[boot] SW fail', e)
          }
        }

        // Zustandストアのハイドレーション完了を待つ（タイムアウト付き）
        const hydratePromise = new Promise<void>((resolve) => {
          if (hasHydrated) {
            resolve()
            return
          }

          const checkInterval = setInterval(() => {
            if (hasHydrated) {
              clearInterval(checkInterval)
              resolve()
            }
          }, 100)

          // タイムアウト: 3秒
          setTimeout(() => {
            clearInterval(checkInterval)
            console.warn('[boot] Hydration timeout, continuing anyway')
            resolve()
          }, 3000)
        })

        await hydratePromise

        if (debug) console.log('[boot] complete')
        if (!stale) setReady(true)
      } catch (e) {
        console.error('[boot] fail', e)
        if (!stale) {
          setWarn('接続が不安定です。オフラインモードで続行します。')
          setReady(true)
        }
      }
    }

    init()

    // 5秒タイムアウト
    const t = setTimeout(() => {
      if (!ready) {
        setWarn('読み込みに時間がかかっています。再読み込みまたは?safe=1をお試しください。')
        setReady(true)
      }
    }, 5000)

    return () => {
      stale = true
      clearTimeout(t)
    }
  }, [debug, safe, hasHydrated, ready])

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>読み込み中…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {warn && (
        <div className="m-3 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-sm text-center">
          {warn}
        </div>
      )}
      {children}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useFlags } from '@/hooks/useFlags'
import { useSw } from '@/hooks/useSw'
import { useReset } from '@/hooks/useReset'
import { bootAuth } from '@/lib/authBoot'
import { initStorage } from '@/lib/storage'
import { useHydrated } from '@/store/schedule'

export default function BootGate({ children }: { children: React.ReactNode }) {
  const { debug, safe } = useFlags()
  const hasHydrated = useHydrated()
  const [ready, setReady] = useState(false)
  const [warn, setWarn] = useState<string | null>(null)

  useReset()
  useSw()

  useEffect(() => {
    let stale = false

    const init = async () => {
      try {
        if (debug) console.log('[boot] start', { safe })

        // Storage初期化とAuth初期化を並列実行（高速化）
        await Promise.allSettled([
          initStorage().then(() => {
            if (debug) console.log('[boot] Storage initialized')
          }).catch((e) => {
            console.warn('[boot] Storage init failed', e)
          }),
          bootAuth().then(() => {
            if (debug) console.log('[boot] Auth initialized')
          }).catch((e) => {
            console.warn('[boot] Auth init failed', e)
          })
        ])

        // Zustandストアのハイドレーション完了を待つ（高速化：チェック間隔50ms）
        if (!hasHydrated) {
          const hydratePromise = new Promise<void>(resolve => {
            const checkInterval = setInterval(() => {
              if (hasHydrated) {
                clearInterval(checkInterval)
                resolve()
              }
            }, 50)

            setTimeout(() => {
              clearInterval(checkInterval)
              if (debug) console.warn('[boot] Hydration timeout, continuing anyway')
              resolve()
            }, 2000)
          })

          await hydratePromise
        }

        if (debug) console.log('[boot] complete')
        if (!stale) setReady(true)
      } catch (e) {
        console.error('[boot] fail', e)
        if (!stale) {
          setWarn('接続が不安定です。オフラインで続行します。')
          setReady(true)
        }
      }
    }

    // 3秒タイムアウト（高速化）
    const t = setTimeout(() => {
      if (!ready) {
        if (debug) setWarn('読み込みが長いです。?safe=1 を試すか、?reset=1 でリセットしてください。')
        setReady(true)
      }
    }, 3000)

    init()

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
        <div className="m-3 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-sm">
          {warn}
        </div>
      )}
      {children}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()
  const [status, setStatus] = useState('処理中...')

  useEffect(() => {
    console.log('[auth/callback] Component mounted')
    console.log('[auth/callback] Full URL:', typeof window !== 'undefined' ? window.location.href : 'N/A')

    // URLフラグメントからアクセストークンを取得
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hashParams = new URLSearchParams(hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const errorDescription = hashParams.get('error_description')
    const code = sp.get('code')

    console.log('[auth/callback] hash:', hash.substring(0, 100))
    console.log('[auth/callback] code:', code)
    console.log('[auth/callback] access_token exists:', !!accessToken)

    const run = async () => {
      try {
        if (errorDescription) {
          console.error('[auth/callback] Provider error:', errorDescription)
          setStatus(`エラー: ${errorDescription}`)
          setTimeout(() => router.replace('/'), 5000)
          return
        }

        // URLハッシュからトークンを取得
        if (accessToken) {
          setStatus('認証情報を検出しました。処理中...')
          console.log('[auth/callback] Hash token detected (auto-detect enabled)')
          try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            if (!url || !anon) throw new Error('ENV_MISSING')
            // コールバック専用の一時クライアントを生成し、ハッシュからの自動検出を確実に実行
            const temp = createClient(url, anon, {
              auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
              },
            })
            // セッション確立をポーリング
            const startedAt = Date.now()
            while (Date.now() - startedAt < 8000) {
              const { data } = await temp.auth.getSession()
              if (data.session) {
                console.log('[auth/callback] Session available, redirecting')
                window.location.replace('/')
                return
              }
              await new Promise(r => setTimeout(r, 300))
            }
            console.warn('[auth/callback] Session not available within 8s, redirecting anyway')
            window.location.replace('/')
            return
          } catch (e) {
            console.warn('[auth/callback] Auto-detect handling failed, redirecting', e)
            window.location.replace('/')
            return
          }
        } else if (code) {
          // PKCEコードフロー（将来の拡張用）
          console.log('[auth/callback] PKCE code detected, redirecting...')
          setStatus('認証中...')
          router.replace(`/?code=${code}`)
        } else {
          console.error('[auth/callback] No auth data found')
          setStatus('エラー: 認証情報が見つかりません')
          setTimeout(() => router.replace('/'), 5000)
        }
      } catch (e) {
        console.error('[auth/callback] Exception:', e)
        setStatus(`エラー: ${e instanceof Error ? e.message : 'Unknown error'}`)
        setTimeout(() => router.replace('/'), 5000)
      }
    }

    // タイムアウト: 10秒
    const timeout = setTimeout(() => {
      console.warn('[auth/callback] Timeout after 10 seconds')
      setStatus('タイムアウト: ホームにリダイレクトします...')
      router.replace('/')
    }, 10000)

    run().finally(() => {
      clearTimeout(timeout)
    })
  }, [router, sp])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">{status}</p>
        <p className="text-sm text-gray-500 mt-2">しばらくお待ちください...</p>
      </div>
    </div>
  )
}

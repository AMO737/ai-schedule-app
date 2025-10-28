'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabaseClient'
import { useFlags } from '@/hooks/useFlags'

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()
  const { debug } = useFlags()
  const [status, setStatus] = useState('処理中...')

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hashParams = new URLSearchParams(hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const errorDescription = hashParams.get('error_description')
    const code = sp.get('code')

    const run = async () => {
      try {
        if (errorDescription) {
          if (debug) console.error('[auth/callback] Provider error:', errorDescription)
          setStatus(`エラー: ${errorDescription}`)
          setTimeout(() => router.replace('/'), 5000)
          return
        }

        // Supabase (detectSessionInUrl: true) が自動処理する前提でセッションをポーリング
        if (accessToken || code) {
          setStatus('認証情報を確認中...')
          if (debug) console.log('[auth/callback] token/code detected; polling session')

          const supabase = getSupabase()
          let attempts = 0
          const maxAttempts = 8
          while (attempts < maxAttempts) {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
              if (debug) console.log('[auth/callback] Session established')
              setStatus('ログイン成功！リダイレクト中...')
              await new Promise(r => setTimeout(r, 500))
              window.location.replace('/')
              return
            }
            attempts++
            await new Promise(r => setTimeout(r, 1000))
          }

          if (debug) console.warn('[auth/callback] Session not found after polling; redirecting')
          setStatus('認証に失敗しました。ホームにリダイレクトします...')
          setTimeout(() => router.replace('/'), 3000)
        } else {
          // 既にログイン済みの可能性もあるため即リダイレクト
          if (debug) console.log('[auth/callback] No auth data; redirecting')
          setStatus('リダイレクト中...')
          router.replace('/')
        }
      } catch (e) {
        if (debug) console.error('[auth/callback] Exception:', e)
        setStatus('エラーが発生しました。ホームにリダイレクトします...')
        setTimeout(() => router.replace('/'), 3000)
      }
    }

    // 全体のタイムアウト: 10秒
    const timeout = setTimeout(() => {
      if (debug) console.warn('[auth/callback] Overall timeout; redirecting')
      setStatus('タイムアウト: ホームにリダイレクトします...')
      router.replace('/')
    }, 10000)

    run().finally(() => clearTimeout(timeout))
  }, [router, sp, debug])

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

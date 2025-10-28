'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabaseClient'
import { withTimeout } from '@/lib/timeout'

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
        setStatus('認証情報を確認中...')
        console.log('[auth/callback] Getting Supabase client...')
        const supabase = getSupabase()
        console.log('[auth/callback] Got Supabase client')

        if (errorDescription) {
          console.error('[auth/callback] Provider error:', errorDescription)
          setStatus(`エラー: ${errorDescription}`)
          setTimeout(() => router.replace('/'), 5000)
          return
        }

        // Supabaseが自動的にURLからセッションを検出して処理する
        // 少し待ってセッションが確立されるのを待つ
        console.log('[auth/callback] Waiting for Supabase to process session...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        // セッションを確認
        try {
          const { data: { session }, error } = await withTimeout(
            supabase.auth.getSession(),
            5000,
            'getSession'
          )

          if (error) {
            console.error('[auth/callback] getSession error:', error)
            setStatus(`エラー: ${error.message}`)
            setTimeout(() => router.replace('/'), 5000)
            return
          }

          if (session) {
            console.log('[auth/callback] Session established, user:', session.user?.email)
            setStatus('ログイン成功！リダイレクト中...')
          } else {
            console.warn('[auth/callback] No session found after wait')
            setStatus('セッションが確立されませんでした。リダイレクト中...')
          }
        } catch (e) {
          console.error('[auth/callback] getSession exception:', e)
          setStatus(`エラー: ${e instanceof Error ? e.message : 'Unknown error'}`)
          setTimeout(() => router.replace('/'), 5000)
          return
        }

        // ホームにリダイレクト
        console.log('[auth/callback] Redirecting to home')
        router.replace('/')
        // Fallback in case router is stuck
        if (typeof window !== 'undefined') {
          setTimeout(() => { window.location.replace('/') }, 1500)
        }
      } catch (e) {
        console.error('[auth/callback] Exception:', e)
        setStatus(`エラー: ${e instanceof Error ? e.message : 'Unknown error'}`)
        
        // 5秒後にホームにリダイレクト
        setTimeout(() => {
          console.log('[auth/callback] Redirecting to home after exception')
          router.replace('/')
        }, 5000)
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

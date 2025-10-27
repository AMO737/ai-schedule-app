'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabaseClient'

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
        setStatus('Supabaseクライアントの取得中...')
        console.log('[auth/callback] Getting Supabase client...')
        const supabase = getSupabase()
        console.log('[auth/callback] Got Supabase client')

        if (errorDescription) {
          console.error('[auth/callback] Provider error:', errorDescription)
          setStatus(`エラー: ${errorDescription}`)
          setTimeout(() => router.replace('/'), 5000)
          return
        }

        if (accessToken) {
          setStatus('トークンからセッションを設定中...')
          console.log('[auth/callback] Detected hash token, waiting for Supabase to process...')
          
          // Supabaseがハッシュからセッションを保存するのを待つ
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // セッション確認
          try {
            const { data: { session } } = await supabase.auth.getSession()
            console.log('[auth/callback] Session after wait:', !!session, session?.user?.email)
            if (session) {
              console.log('[auth/callback] Session confirmed, redirecting to home...')
              setStatus('ログイン成功！リダイレクト中...')
            } else {
              console.error('[auth/callback] No session found after waiting')
              setStatus('エラー: セッションが確立できませんでした')
              setTimeout(() => router.replace('/'), 3000)
              return
            }
          } catch (e) {
            console.error('[auth/callback] Session check failed:', e)
            setStatus('エラー: セッション確認に失敗しました')
            setTimeout(() => router.replace('/'), 3000)
            return
          }
        } else if (code) {
          setStatus('コードをセッションに交換中...')
          console.log('[auth/callback] Exchanging code for session...')

          // Exchange PKCE code from query param
          const { data, error } = await supabase.auth.exchangeCodeForSession(code!)

          if (error) {
            console.error('[auth/callback] Exchange error:', error)
            setStatus(`エラー: ${error.message}`)
            
            // 5秒後にホームにリダイレクト
            setTimeout(() => {
              console.log('[auth/callback] Redirecting to home after error')
              router.replace('/')
            }, 5000)
            return
          }

          console.log('[auth/callback] Session exchange successful, user:', data?.user?.email)
          setStatus('ログイン成功！リダイレクト中...')
        } else {
          console.error('[auth/callback] No code or access_token found')
          setStatus('エラー: 認証情報が見つかりません')
          
          // 5秒後にホームにリダイレクト
          setTimeout(() => {
            console.log('[auth/callback] Redirecting to home - no auth data')
            router.replace('/')
          }, 5000)
          return
        }

        // 成功確認後、少し待ってからリダイレクト
        await new Promise(resolve => setTimeout(resolve, 500))
        try {
          const s = await supabase.auth.getSession()
          console.log('[auth/callback] Session check after set/exchange:', !!s.data.session)
        } catch {}
        console.log('[auth/callback] Redirecting to home (success)')
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

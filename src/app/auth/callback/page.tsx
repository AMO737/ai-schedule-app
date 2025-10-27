'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    // URLフラグメントからアクセストークンを取得
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hashParams = new URLSearchParams(hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const code = sp.get('code')

    console.log('[auth/callback] hash:', hash)
    console.log('[auth/callback] code:', code)
    console.log('[auth/callback] access_token:', accessToken ? 'exists' : 'none')
    console.log('[auth/callback] URL:', window.location.href)

    const run = async () => {
      try {
        const supabase = getSupabase()

        if (accessToken) {
          // フラグメントからアクセストークンが取得できた場合
          console.log('[auth/callback] Setting session from access_token...')
          
          // URLパラメータから追加の情報を取得
          const refreshToken = hashParams.get('refresh_token')
          const expiresAt = hashParams.get('expires_at')
          const tokenType = hashParams.get('token_type') || 'bearer'

          // セッションを設定
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })

          if (error) {
            console.error('[auth/callback] Session error:', error)
          } else {
            console.log('[auth/callback] Session set successfully')
          }
        } else if (code) {
          // codeパラメータがある場合（通常のOAuthフロー）
          console.log('[auth/callback] Exchanging code for session...')
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error('[auth/callback] Exchange error:', error)
          } else {
            console.log('[auth/callback] Session exchange successful')
          }
        } else {
          console.error('[auth/callback] No code or access_token found')
        }
      } catch (e) {
        console.error('[auth/callback] Error:', e)
      } finally {
        // ログイン後の行き先
        console.log('[auth/callback] Redirecting...')
        router.replace('/')
      }
    }

    run()
  }, [router, sp])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>サインインを完了しています…</p>
      </div>
    </div>
  )
}

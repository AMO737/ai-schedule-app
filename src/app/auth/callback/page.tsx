'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    const code = sp.get('code')
    console.log('[auth/callback] code:', code)
    console.log('[auth/callback] URL:', window.location.href)

    if (!code) {
      console.error('[auth/callback] No code parameter')
      router.replace('/')
      return
    }

    const run = async () => {
      try {
        const supabase = getSupabase()
        
        // フルURLを渡すのが安全
        console.log('[auth/callback] Exchanging code for session...')
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        
        if (error) {
          console.error('[auth/callback] Exchange error:', error)
        } else {
          console.log('[auth/callback] Session exchange successful')
        }
      } catch (e) {
        console.error('[auth/callback] Exchange failed:', e)
      } finally {
        // ログイン後の行き先（ダッシュボードまたはトップページ）
        console.log('[auth/callback] Redirecting to dashboard...')
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

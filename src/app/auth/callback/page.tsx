'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
          setStatus('ログイン情報を保存中...')
          console.log('[auth/callback] Hash token detected')
          
          const refreshToken = hashParams.get('refresh_token')
          const expiresIn = hashParams.get('expires_in')
          
          console.log('[auth/callback] Has refresh_token:', !!refreshToken)
          console.log('[auth/callback] Expires in:', expiresIn)

          // Supabaseのセッションとして保存（正式な方法）
          try {
            const supabase = (await import('@/lib/supabaseClient')).getSupabase()
            
            // セッションデータを構築
            const sessionData = {
              access_token: accessToken,
              refresh_token: refreshToken || '',
            }

            console.log('[auth/callback] Calling setSession...')
            
            // setSessionを使ってSupabase形式で保存（リトライ付き）
            let success = false
            for (let i = 0; i < 3 && !success; i++) {
              try {
                const { data, error } = await Promise.race([
                  supabase.auth.setSession(sessionData),
                  new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('setSession timeout')), 3000)
                  )
                ])
                
                if (error) {
                  console.error(`[auth/callback] setSession error (attempt ${i + 1}):`, error)
                  if (i === 2) throw error
                  await new Promise(resolve => setTimeout(resolve, 500))
                  continue
                }
                
                console.log('[auth/callback] Session set successfully:', data.session?.user?.email)
                success = true
              } catch (e) {
                console.error(`[auth/callback] setSession attempt ${i + 1} failed:`, e)
                if (i === 2) throw e
                await new Promise(resolve => setTimeout(resolve, 500))
              }
            }

            setStatus('ログイン成功！リダイレクト中...')
            
            // セッションが反映されるまで少し待つ
            await new Promise(resolve => setTimeout(resolve, 800))
            
            console.log('[auth/callback] Redirecting to home')
            window.location.replace('/')
          } catch (e) {
            console.error('[auth/callback] Session save error:', e)
            setStatus(`エラー: ${e instanceof Error ? e.message : 'Unknown error'}`)
            setTimeout(() => router.replace('/'), 5000)
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

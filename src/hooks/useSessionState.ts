'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

export function useSessionState() {
  const [session, setSession] = useState<null | undefined | Session>(undefined)

  useEffect(() => {
    const supabase = getSupabase()
    
    // 初期セッション取得
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    // 認証状態変更を監視
    const { data: subscription } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return session
}

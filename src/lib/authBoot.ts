'use client'

import { withTimeout } from './timeout'
import { getSupabase } from './supabaseClient'

export async function bootAuth() {
  try {
    const supabase = getSupabase()
    const r = await withTimeout(supabase.auth.getSession(), 4000, 'supabase.getSession')
    return r?.data?.session ?? null
  } catch (e) {
    console.warn('[boot] supabase session fail/timeout', e)
    return null
  }
}

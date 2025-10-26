import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { requireEnvOrMessage } from './env'

let client: SupabaseClient | null = null

export function getSupabase() {
  if (client) return client
  const cfg = requireEnvOrMessage()
  if (!cfg.ok) throw new Error(cfg.message)
  client = createClient(cfg.URL, cfg.ANON)
  return client
}

// 後方互換性のため
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const instance = getSupabase()
    return (instance as any)[prop]
  }
})

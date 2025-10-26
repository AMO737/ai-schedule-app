import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { readClientEnv, readServerEnv } from './env'

let client: SupabaseClient | null = null

export function getSupabase() {
  if (client) return client

  // クライアント/サーバ双方で動くように
  const isBrowser = typeof window !== 'undefined'
  const env = isBrowser ? readClientEnv() : readServerEnv()

  if (!env.ok || !env.url || !env.anon) {
    // 例外ではなく安全なメッセージ
    throw new Error('ENV_MISSING:NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  client = createClient(env.url, env.anon)
  return client
}

// 後方互換性のため
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const instance = getSupabase()
    return (instance as any)[prop]
  },
})

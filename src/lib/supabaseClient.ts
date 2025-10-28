import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error('ENV_MISSING:NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Supabaseに自動的にURLからセッションを検出させる
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  })
  return client
}

// 後方互換性のため（使用されている場所でimport-time に呼ばれるとthrow するので注意）
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const instance = getSupabase()
    return (instance as any)[prop]
  },
})

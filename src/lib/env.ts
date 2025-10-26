import { z } from 'zod'

const Raw = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

const Schema = z.object({
  URL: z.string().url().startsWith('https://').optional(),
  ANON: z.string().min(10).optional(),
})

export function safeEnv() {
  const r = Schema.safeParse(Raw)
  return { 
    ok: r.success, 
    URL: r.success ? r.data.URL : undefined, 
    ANON: r.success ? r.data.ANON : undefined 
  }
}

export function requireEnvOrMessage() {
  const { ok, URL, ANON } = safeEnv()
  if (!ok || !URL || !ANON) {
    return { 
      ok: false, 
      message: '環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が必要です。' 
    } as const
  }
  return { ok: true, URL, ANON } as const
}

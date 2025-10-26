import { z } from 'zod'

const Raw = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

const Schema = z.object({
  URL: z.string().url().startsWith('https://').endsWith('.supabase.co').optional(),
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

export function requireEnv() {
  const r = Schema.parse(Raw) // throws if invalid
  if (!r.URL || !r.ANON) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }
  return { URL: r.URL, ANON: r.ANON }
}

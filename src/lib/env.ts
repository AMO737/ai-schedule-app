import { z } from 'zod'

const Raw = {
  // ブラウザに焼き込まれる（ビルド時）
  PUBLIC_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  PUBLIC_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // サーバ実行時（Edge/Node）で読む
  SRV_URL: process.env.SUPABASE_URL,
  SRV_ANON: process.env.SUPABASE_ANON_KEY,
}

const Url = z.string().url().startsWith('https://')
const Key = z.string().min(10)

export function readServerEnv() {
  const url = Raw.PUBLIC_URL ?? Raw.SRV_URL
  const anon = Raw.PUBLIC_ANON ?? Raw.SRV_ANON
  const ok = Url.safeParse(url ?? '').success && Key.safeParse(anon ?? '').success
  return { ok, url: url ?? null, anon: anon ?? null }
}

// クライアント用（ビルド時に焼き込まれるので NEXT_PUBLIC_* のみ）
export function readClientEnv() {
  const url = Raw.PUBLIC_URL
  const anon = Raw.PUBLIC_ANON
  const ok = Url.safeParse(url ?? '').success && Key.safeParse(anon ?? '').success
  return { ok, url: url ?? null, anon: anon ?? null }
}

// 後方互換性
export function safeEnv() {
  const env = typeof window !== 'undefined' ? readClientEnv() : readServerEnv()
  return {
    ok: env.ok,
    URL: env.url ?? undefined,
    ANON: env.anon ?? undefined,
  }
}

export function requireEnvOrMessage() {
  const env = typeof window !== 'undefined' ? readClientEnv() : readServerEnv()
  if (!env.ok || !env.url || !env.anon) {
    return {
      ok: false,
      message: '環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が必要です。',
    } as const
  }
  return { ok: true, URL: env.url, ANON: env.anon } as const
}

const Raw = {
  // ブラウザに焼き込まれる（ビルド時）
  PUBLIC_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  PUBLIC_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // サーバ実行時（Edge/Node）で読む
  SRV_URL: process.env.SUPABASE_URL,
  SRV_ANON: process.env.SUPABASE_ANON_KEY,
}

const Url = z.string().url().startsWith('https://')
const Key = z.string().min(10)

export function readServerEnv() {
  const url = Raw.PUBLIC_URL ?? Raw.SRV_URL
  const anon = Raw.PUBLIC_ANON ?? Raw.SRV_ANON
  const ok = Url.safeParse(url ?? '').success && Key.safeParse(anon ?? '').success
  return { ok, url: url ?? null, anon: anon ?? null }
}

// クライアント用（ビルド時に焼き込まれるので NEXT_PUBLIC_* のみ）
export function readClientEnv() {
  const url = Raw.PUBLIC_URL
  const anon = Raw.PUBLIC_ANON
  const ok = Url.safeParse(url ?? '').success && Key.safeParse(anon ?? '').success
  return { ok, url: url ?? null, anon: anon ?? null }
}

// 後方互換性
export function safeEnv() {
  const env = typeof window !== 'undefined' ? readClientEnv() : readServerEnv()
  return {
    ok: env.ok,
    URL: env.url ?? undefined,
    ANON: env.anon ?? undefined,
  }
}

export function requireEnvOrMessage() {
  const env = typeof window !== 'undefined' ? readClientEnv() : readServerEnv()
  if (!env.ok || !env.url || !env.anon) {
    return {
      ok: false,
      message: '環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が必要です。',
    } as const
  }
  return { ok: true, URL: env.url, ANON: env.anon } as const
}

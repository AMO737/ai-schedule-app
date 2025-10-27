export const runtime = 'nodejs' // 念のため Node ランタイムを指定

export async function GET() {
  return new Response(
    JSON.stringify({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      vercelEnv: process.env.VERCEL_ENV, // 'production' | 'preview' | 'development'
    }),
    { headers: { 'content-type': 'application/json' } }
  )
}

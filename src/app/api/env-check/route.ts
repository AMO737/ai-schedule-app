export async function GET() {
  return Response.json({
    ok:
      !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
      !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY),
    hasPublic: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    hasServer: {
      url: !!process.env.SUPABASE_URL,
      anon: !!process.env.SUPABASE_ANON_KEY,
    },
    vercelEnv: process.env.VERCEL_ENV ?? '(none)',
  })
}

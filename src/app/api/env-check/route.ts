export async function GET() {
  return Response.json({
    hasPublic: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    vercelEnv: process.env.VERCEL_ENV ?? '(none)',
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? '(none)',
  })
}

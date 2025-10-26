import { safeEnv } from '@/lib/env'

/**
 * Debug API endpoint to check Supabase connection
 * Returns connection status without exposing sensitive data
 * Safe to call even if environment variables are not set
 */
export async function GET() {
  const env = safeEnv()
  
  if (!env.ok || !env.URL) {
    return Response.json({ 
      ok: false, 
      reason: 'MISSING_ENV', 
      url: env.URL ?? null 
    })
  }

  try {
    const res = await fetch(`${env.URL}/auth/v1/health`, { 
      method: 'GET', 
      cache: 'no-store' 
    })
    return Response.json({ 
      ok: res.ok, 
      url: env.URL 
    })
  } catch (error) {
    return Response.json({ 
      ok: false, 
      reason: 'FETCH_FAILED', 
      url: env.URL 
    })
  }
}

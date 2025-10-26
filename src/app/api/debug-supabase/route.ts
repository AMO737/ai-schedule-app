import { getSupabase } from '@/lib/supabaseClient'

/**
 * Debug API endpoint to check Supabase connection
 * Returns connection status without exposing sensitive data
 * Safe to call even if environment variables are not set
 */
export async function GET() {
  try {
    const supabase = getSupabase()
    return Response.json({ 
      ok: true, 
      url: process.env.NEXT_PUBLIC_SUPABASE_URL 
    })
  } catch (error: any) {
    return Response.json({ 
      ok: false, 
      reason: 'ENV_MISSING', 
      message: error.message 
    })
  }
}



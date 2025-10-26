import { NextResponse } from 'next/server'
import { ENV } from '@/lib/env'

/**
 * Debug API endpoint to check Supabase connection
 * Returns connection status without exposing sensitive data
 */
export async function GET() {
  try {
    const url = ENV.SUPABASE_URL

    // Try to connect to Supabase REST endpoint
    const healthCheckUrl = `${url}/rest/v1/`
    
    const response = await fetch(healthCheckUrl, {
      method: 'HEAD',
      headers: {
        'apikey': ENV.SUPABASE_ANON_KEY,
      },
    })

    const ok = response.ok || response.status === 404 // 404 is also fine, means endpoint exists

    return NextResponse.json({
      url,
      ok,
      reason: ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
    })
  } catch (error) {
    return NextResponse.json({
      url: ENV.SUPABASE_URL,
      ok: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

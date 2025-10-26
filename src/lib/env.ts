/**
 * Environment variable validation and configuration
 * This file validates all required environment variables at build time
 */

function validateSupabaseUrl(url: string): string {
  // Check for placeholder or invalid values
  const invalidPatterns = [
    'placeholder.supabase.co',
    'YOUR-PROJECT',
    'your-project',
    'example',
    'your_supabase_project_url',
  ]

  for (const pattern of invalidPatterns) {
    if (url.includes(pattern)) {
      throw new Error(
        `Invalid Supabase URL: ${url} contains placeholder value "${pattern}". ` +
        'Please set NEXT_PUBLIC_SUPABASE_URL to your actual Supabase project URL.'
      )
    }
  }

  // Validate URL format
  if (!url.startsWith('https://')) {
    throw new Error(`Invalid Supabase URL: must start with "https://", got: ${url}`)
  }

  if (!url.includes('.supabase.co')) {
    throw new Error(`Invalid Supabase URL: must be a Supabase URL (*.supabase.co), got: ${url}`)
  }

  // Remove trailing slash if present
  const cleanedUrl = url.endsWith('/') ? url.slice(0, -1) : url

  return cleanedUrl
}

function validateSupabaseAnonKey(key: string): string {
  const invalidPatterns = [
    'placeholder-key',
    'your_supabase_anon_key',
    'placeholder',
  ]

  for (const pattern of invalidPatterns) {
    if (key.includes(pattern)) {
      throw new Error(
        `Invalid Supabase Anon Key: contains placeholder value "${pattern}". ` +
        'Please set NEXT_PUBLIC_SUPABASE_ANON_KEY to your actual Supabase anon key.'
      )
    }
  }

  return key
}

// Validate required environment variables
export const ENV = {
  SUPABASE_URL: validateSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  ),
  SUPABASE_ANON_KEY: validateSupabaseAnonKey(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  ),
} as const

// Runtime validation
if (!ENV.SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not set')
}

if (!ENV.SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not set')
}

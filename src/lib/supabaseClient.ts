import { createClient } from '@supabase/supabase-js'
import { requireEnv } from './env'

/**
 * Unified Supabase client
 * All Supabase operations should use this client instance
 * Throws if environment variables are not set
 */
const { URL, ANON } = requireEnv()
export const supabase = createClient(URL, ANON)

import { createClient } from '@supabase/supabase-js'
import { ENV } from './env'

/**
 * Unified Supabase client
 * All Supabase operations should use this client instance
 */
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY)

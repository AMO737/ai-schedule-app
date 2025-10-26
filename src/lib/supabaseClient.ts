import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ビルド時に確実に文字列へ置換されるよう、モジュールのトップレベルで静的参照
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

// 後方互換性のための関数（既存コード用）
export function getSupabase() {
  return supabase
}

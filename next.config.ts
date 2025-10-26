import type { NextConfig } from 'next'

console.log('[build] NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('[build] NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 一時的にESLintを無効化
  },
  productionBrowserSourceMaps: true, // 本番でもソースマップを有効化
}

export default nextConfig

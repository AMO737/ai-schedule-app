'use client'

import { useEffect, useState } from 'react'

export default function EnvCheck() {
  const [api, setApi] = useState<any>(null)
  useEffect(() => {
    fetch('/api/env-check')
      .then(r => r.json())
      .then(setApi)
      .catch(() => setApi({ ok: false }))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">環境変数の確認</h1>
      <pre className="p-4 text-sm whitespace-pre-wrap bg-gray-100 rounded">
        {JSON.stringify(
          {
            vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV ?? '(none)',
            build: {
              inlineUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
              inlineAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              commit: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? '(none)',
            },
            runtimeApi: api,
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}

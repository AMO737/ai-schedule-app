'use client'

import { useEffect, useState } from 'react'

export default function EnvCheck() {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    fetch('/api/env-check')
      .then(r => r.json())
      .then(setState)
      .catch(() => setState({ ok: false }))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">環境変数の確認</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(
          {
            inlineUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            inlineAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            api: state,
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}

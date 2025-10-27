'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  console.error('[route error]', error)

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">予期せぬエラーが発生しました</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-2xl bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
      >
        再読み込み
      </button>
    </div>
  )
}

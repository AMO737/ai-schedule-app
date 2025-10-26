'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // エラー情報をログに送信
    fetch('/api/log-client-error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        digest: error.digest,
      }),
    }).catch(() => {});

    // コンソールにも出力
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">問題が発生しました</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-2xl px-4 py-2 bg-black text-white hover:bg-gray-800"
          >
            リトライ
          </button>
        </div>
      </body>
    </html>
  );
}

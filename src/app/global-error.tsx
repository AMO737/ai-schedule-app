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

  const isEnvError = error.message?.includes('環境変数') || error.message?.includes('NEXT_PUBLIC')

  return (
    <html>
      <body>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {isEnvError ? '設定の確認が必要です' : '問題が発生しました'}
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          {isEnvError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-sm">
                <strong>管理者向け:</strong> Vercelの環境変数を確認してください。
                <br />
                必要な環境変数: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
              </p>
            </div>
          )}
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

  const isEnvError = error.message?.includes('環境変数') || error.message?.includes('NEXT_PUBLIC')

  return (
    <html>
      <body>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {isEnvError ? '設定の確認が必要です' : '問題が発生しました'}
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          {isEnvError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-sm">
                <strong>管理者向け:</strong> Vercelの環境変数を確認してください。
                <br />
                必要な環境変数: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
              </p>
            </div>
          )}
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

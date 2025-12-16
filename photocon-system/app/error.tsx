'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
        <p className="text-gray-500 mb-6">申し訳ございません。問題が発生しました。</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand-600 transition-colors"
        >
          もう一度試す
        </button>
      </div>
    </div>
  )
}

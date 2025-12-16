'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF5F2',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem' }}>
              エラーが発生しました
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              申し訳ございません。問題が発生しました。
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#E84D1C',
                color: 'white',
                borderRadius: '9999px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              もう一度試す
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

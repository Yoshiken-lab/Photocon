import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'スクールフォト! - フォトコンテスト',
  description: 'スマホで参加できるこども写真コンテスト。お子さまの最高の一瞬をみんなでシェアしましょう。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-brand-50 text-text-main antialiased selection:bg-brand-100 selection:text-brand-600">
        {children}
      </body>
    </html>
  )
}

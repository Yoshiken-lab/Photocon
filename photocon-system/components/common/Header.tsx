'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { getAuthMode } from '@/lib/system-settings'

export function Header() {
  const pathname = usePathname()
  const [authEnabled, setAuthEnabled] = useState<boolean | null>(null)

  // DBから認証モードを取得
  useEffect(() => {
    getAuthMode().then(setAuthEnabled)
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="スクールフォト!"
            width={160}
            height={40}
            className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-500">
          <Link
            href="/#about"
            className="hover:text-brand transition-colors py-2"
          >
            はじめての方へ
          </Link>
          <Link
            href="/gallery"
            className={`hover:text-brand transition-colors py-2 ${pathname === '/gallery' ? 'text-brand' : ''
              }`}
          >
            みんなの作品
          </Link>
          {/* Only show login button when auth is enabled */}
          {authEnabled && (
            <Link
              href="/login"
              className="ml-2 px-6 py-2.5 bg-brand text-white rounded-full hover:bg-brand-600 transition-all duration-300 text-xs font-bold tracking-wide shadow-md hover:shadow-brand/30 hover:-translate-y-0.5"
            >
              ログイン
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2 text-gray-600 bg-white rounded-full shadow-sm">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

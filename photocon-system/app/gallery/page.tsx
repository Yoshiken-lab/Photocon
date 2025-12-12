import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sun, Menu } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { GalleryGrid, FilterBar } from '@/components/gallery'

interface SearchParams {
  category?: string
  sort?: 'latest' | 'popular'
}

import type { PublicEntry } from '@/types/entry'

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createServerClient()

  // アクティブなコンテスト取得
  const { data: contest } = await supabase
    .from('contests')
    .select('*, categories(*)')
    .in('status', ['active', 'voting'])
    .single()

  // エントリー取得（emailは取得しない - セキュリティのため）
  const { data } = await supabase
    .from('entries')
    .select('id, media_url, username, like_count, caption, instagram_permalink, instagram_timestamp, category_id, categories(name)')
    .eq('status', 'approved')
    .eq(contest?.id ? 'contest_id' : 'status', contest?.id || 'approved')
    .order(searchParams.sort === 'popular' ? 'like_count' : 'instagram_timestamp', { ascending: false })

  // カテゴリでフィルタリング
  type EntryData = PublicEntry & { category_id?: string }
  let entries = (data as EntryData[] | null) || []
  if (searchParams.category) {
    entries = entries.filter(e => e.category_id === searchParams.category)
  }

  return (
    <>
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
            <Link href="/#about" className="hover:text-brand transition-colors py-2">はじめての方へ</Link>
            <Link href="/gallery" className="text-brand py-2">みんなの作品</Link>
            <Link href="/admin" className="ml-2 px-6 py-2.5 bg-brand text-white rounded-full hover:bg-brand-600 transition-all duration-300 text-xs font-bold tracking-wide shadow-md hover:shadow-brand/30 hover:-translate-y-0.5">
              管理画面
            </Link>
          </nav>

          <button className="md:hidden p-2 text-gray-600 bg-white rounded-full shadow-sm">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 min-h-screen bg-brand-50">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800 font-maru flex items-center gap-3">
              <Sun className="text-brand w-6 h-6" />
              応募作品
            </h1>
            {contest && (
              <p className="text-gray-500 mt-2">{contest.name}</p>
            )}
          </div>

          {/* フィルター */}
          <Suspense fallback={<div>Loading...</div>}>
            <FilterBar
              categories={contest?.categories || []}
              currentCategory={searchParams.category}
              currentSort={searchParams.sort}
            />
          </Suspense>

          {/* ギャラリーグリッド */}
          <GalleryGrid entries={entries || []} />
        </div>
      </main>

      <footer className="bg-white text-gray-500 py-12 border-t border-brand-100 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="スクールフォト!"
              width={120}
              height={32}
              className="h-6 md:h-8 w-auto"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm">
            <Link href="#" className="hover:text-brand transition-colors">よくある質問</Link>
            <Link href="#" className="hover:text-brand transition-colors">利用規約</Link>
            <Link href="#" className="hover:text-brand transition-colors">プライバシーポリシー</Link>
            <Link href="#" className="hover:text-brand transition-colors">運営会社</Link>
          </div>

          <p className="text-xs text-gray-400">&copy; 2025 スクールフォト!</p>
        </div>
      </footer>
    </>
  )
}

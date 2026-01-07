import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Sun } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { GalleryClient } from './GalleryClient'

interface Entry {
  id: string
  media_url: string
  username: string
  like_count: number | null
  caption: string | null
}

interface Contest {
  id: string
  name: string
  emoji: string | null
  theme: string | null
  end_date: string
}

interface Props {
  params: { id: string }
  searchParams: { sort?: 'latest' | 'popular' }
}

export default async function ContestGalleryPage({ params, searchParams }: Props) {
  const supabase = createServerClient()
  const sort = searchParams.sort || 'latest'

  // コンテスト情報を取得
  const { data: contest } = await supabase
    .from('contests')
    .select('id, name, emoji, theme, end_date')
    .eq('id', params.id)
    .single()

  if (!contest) {
    notFound()
  }

  // コンテストが終了しているか判定
  const isContestEnded = new Date(contest.end_date) < new Date()

  // このコンテストの承認済みエントリーを取得
  let query = supabase
    .from('entries')
    .select('id, media_url, username, like_count, caption')
    .eq('contest_id', params.id)
    .eq('status', 'approved')

  if (sort === 'popular') {
    query = query.order('like_count', { ascending: false })
  } else {
    query = query.order('collected_at', { ascending: false })
  }

  const { data: entries } = await query

  // 入賞作品を取得（終了コンテストのみ）
  let winners: Entry[] = []
  if (isContestEnded) {
    const { data: winnerEntries } = await supabase
      .from('entries')
      .select('id, media_url, username, like_count, caption')
      .eq('contest_id', params.id)
      .eq('status', 'winner')
      .order('like_count', { ascending: false })

    winners = winnerEntries || []
  }

  return (
    <div className="min-h-screen bg-brand-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-brand transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">トップに戻る</span>
          </Link>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="スクールフォト!"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* タイトル */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-maru flex items-center justify-center gap-3">
              {contest.emoji && <span className="text-3xl">{contest.emoji}</span>}
              <Sun className="text-brand w-6 h-6" />
              {contest.name}
            </h1>
            {contest.theme && (
              <p className="text-brand mt-2">テーマ：「{contest.theme}」</p>
            )}
            <p className="text-gray-500 mt-4">応募作品一覧</p>
          </div>

          {/* ソートボタン（終了していないコンテストのみ表示） */}
          {!isContestEnded && (
            <div className="flex justify-center gap-2 mb-8">
              <Link
                href={`/contests/${params.id}/gallery?sort=latest`}
                className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm transition-colors ${
                  sort === 'latest'
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-500 hover:text-brand'
                }`}
              >
                新着順
              </Link>
              <Link
                href={`/contests/${params.id}/gallery?sort=popular`}
                className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm transition-colors ${
                  sort === 'popular'
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-500 hover:text-brand'
                }`}
              >
                投票数順
              </Link>
            </div>
          )}

          {/* ギャラリー */}
          {entries && entries.length > 0 ? (
            <GalleryClient entries={entries} winners={winners} isContestEnded={isContestEnded} sort={sort} contestId={params.id} />
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">まだ応募作品がありません</p>
              <p className="text-sm">最初の投稿者になりませんか？</p>
              <Link
                href="/submit"
                className="inline-block mt-6 px-8 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand-600 transition-colors"
              >
                写真を応募する
              </Link>
            </div>
          )}

          {/* 応募ボタン（終了したコンテストでは非表示） */}
          {entries && entries.length > 0 && !isContestEnded && (
            <div className="mt-12 text-center">
              <Link
                href="/submit"
                className="inline-block px-8 py-4 bg-brand text-white rounded-full font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand/30"
              >
                このコンテストに応募する
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white text-gray-500 py-8 border-t border-gray-100 text-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="スクールフォト!"
              width={100}
              height={28}
              className="h-6 w-auto mx-auto mb-4"
            />
          </Link>
          <p className="text-xs text-gray-400">&copy; 2025 スクールフォト!</p>
        </div>
      </footer>
    </div>
  )
}

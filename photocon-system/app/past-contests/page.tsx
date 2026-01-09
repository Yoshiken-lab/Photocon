import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Camera, Heart } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'

interface Contest {
  id: string
  name: string
  description: string | null
  theme: string | null
  emoji: string | null
  image_url: string | null
  start_date: string
  end_date: string
  status: string
}

interface EntryCount {
  contest_id: string
  count: number
}

interface VoteSum {
  contest_id: string
  total_votes: number
}

export default async function PastContestsPage() {
  const supabase = createServerClient()

  // 終了したコンテストを取得
  const { data: contests } = await supabase
    .from('contests')
    .select('*')
    .eq('status', 'ended')
    .order('end_date', { ascending: false })

  // 各コンテストの応募数を取得
  const { data: entryCounts } = await supabase
    .from('entries')
    .select('contest_id')
    .in('status', ['approved', 'winner'])

  // 各コンテストの総投票数を取得
  const { data: voteSums } = await supabase
    .from('entries')
    .select('contest_id, like_count')
    .in('status', ['approved', 'winner'])

  // 応募数を集計
  const entryCountMap: Record<string, number> = {}
  entryCounts?.forEach(entry => {
    entryCountMap[entry.contest_id] = (entryCountMap[entry.contest_id] || 0) + 1
  })

  // 投票数を集計
  const voteCountMap: Record<string, number> = {}
  voteSums?.forEach(entry => {
    voteCountMap[entry.contest_id] = (voteCountMap[entry.contest_id] || 0) + (entry.like_count || 0)
  })

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-maru">開催されたコンテスト一覧</h1>
          </div>

          {/* グリッド */}
          {contests && contests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest: Contest) => (
                <Link
                  key={contest.id}
                  href={`/contests/${contest.id}/gallery`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="relative aspect-[3/2] bg-gray-100">
                    {contest.image_url ? (
                      <Image
                        src={contest.image_url}
                        alt={contest.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-50">
                        <Camera className="w-12 h-12 text-brand/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-800/70 text-white text-xs font-bold px-3 py-1 rounded-full">終了</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-brand font-bold mb-1">{formatDate(contest.end_date)}</p>
                    <h3 className="font-bold text-gray-800 text-lg mb-2 font-maru">
                      {contest.emoji && <span className="mr-1">{contest.emoji}</span>}
                      {contest.name}
                    </h3>
                    {contest.theme && (
                      <p className="text-sm text-gray-500 mb-3">テーマ：「{contest.theme}」</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        {entryCountMap[contest.id] || 0}件
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-current" />
                        {(voteCountMap[contest.id] || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">過去のコンテストはまだありません</p>
              <p className="text-sm">現在開催中のコンテストに参加しませんか？</p>
              <Link
                href="/"
                className="inline-block mt-6 px-8 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand-600 transition-colors"
              >
                トップページへ
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

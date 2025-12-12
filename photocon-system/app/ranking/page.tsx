import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Heart, Menu, Crown, Medal } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'

export default async function RankingPage() {
  const supabase = createServerClient()

  // 投票数でソートしてエントリー取得
  const { data: entries } = await supabase
    .from('entries')
    .select(`
      *,
      categories(name),
      votes:votes(count)
    `)
    .eq('status', 'approved')
    .order('like_count', { ascending: false })
    .limit(20)

  // 投票数を集計
  const entriesWithVotes = await Promise.all(
    (entries || []).map(async (entry) => {
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('entry_id', entry.id)
      return { ...entry, vote_count: count || 0 }
    })
  )

  // 投票数でソート
  entriesWithVotes.sort((a, b) => b.vote_count - a.vote_count)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />
    if (rank === 2) return <Medal className="w-7 h-7 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="text-2xl font-bold text-gray-400">{rank}</span>
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
    return 'bg-white border-gray-200'
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
            <Link href="/gallery" className="hover:text-brand transition-colors py-2">みんなの作品</Link>
            <Link href="/ranking" className="text-brand py-2">ランキング</Link>
            <Link href="/admin" className="ml-2 px-6 py-2.5 bg-brand text-white rounded-full hover:bg-brand-600 transition-all duration-300 text-xs font-bold tracking-wide shadow-md hover:shadow-brand/30 hover:-translate-y-0.5">
              ログイン
            </Link>
          </nav>

          <button className="md:hidden p-2 text-gray-600 bg-white rounded-full shadow-sm">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 min-h-screen bg-brand-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 font-maru">投票ランキング</h1>
            <p className="text-gray-500 mt-2">みんなの投票で決まる人気作品</p>
          </div>

          <div className="space-y-4">
            {entriesWithVotes.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-lg ${getRankStyle(index + 1)}`}
              >
                <div className="w-12 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>

                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={entry.media_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">@{entry.username}</p>
                  {entry.categories?.name && (
                    <span className="text-xs text-brand bg-brand-50 px-2 py-0.5 rounded-full">
                      {entry.categories.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span className="font-bold text-gray-800">{entry.vote_count}</span>
                  <span className="text-xs text-gray-500">票</span>
                </div>
              </div>
            ))}

            {entriesWithVotes.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                まだ投票がありません
              </div>
            )}
          </div>
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

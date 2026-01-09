import Link from 'next/link'
import { Trophy, Clock, CalendarClock, Images, ChevronRight, ClipboardCheck } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

interface Contest {
  id: string
  name: string
  theme: string | null
  status: string
  start_date: string
  end_date: string
  voting_start: string | null
  voting_end: string | null
}

interface RecentEntry {
  id: string
  media_url: string
  username: string
  status: string
  collected_at: string
}

// 残り日数を計算
function getRemainingDays(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// 開始までの日数を計算
function getDaysUntilStart(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  const diff = start.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// 日付フォーマット
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // 開催中のコンテスト
  const { data: activeContests } = await supabase
    .from('contests')
    .select('*')
    .eq('status', 'active')
    .order('end_date', { ascending: true })

  // 開催予定のコンテスト
  const { data: upcomingContests } = await supabase
    .from('contests')
    .select('*')
    .eq('status', 'upcoming')
    .order('start_date', { ascending: true })
    .limit(1)

  const nextContest = upcomingContests?.[0] as Contest | undefined

  // 審査待ち件数
  const { count: pendingCount } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // 開催中コンテストの応募数を取得
  const contestStats: { [key: string]: { total: number; pending: number } } = {}
  if (activeContests && activeContests.length > 0) {
    for (const contest of activeContests) {
      const { count: total } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)

      const { count: pending } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)
        .eq('status', 'pending')

      contestStats[contest.id] = {
        total: total || 0,
        pending: pending || 0,
      }
    }
  }

  // 最近の応募
  const { data: recentEntries } = await supabase
    .from('entries')
    .select('id, media_url, username, status, collected_at')
    .order('collected_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-gray-500 mt-1">コンテストの運営状況を確認</p>
      </div>

      {/* 開催中のコンテスト */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-gray-800">開催中のコンテスト</h2>
          </div>
          {activeContests && activeContests.length > 0 && (
            <Link
              href="/admin/contests"
              className="flex items-center gap-1 text-sm text-brand hover:underline font-medium"
            >
              詳細を見る
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {activeContests && activeContests.length > 0 ? (
          <div className={activeContests.length === 1 ? '' : 'grid gap-4 md:grid-cols-2'}>
              {(activeContests as Contest[]).map((contest) => {
              const remaining = getRemainingDays(contest.end_date)
              const stats = contestStats[contest.id]

              return (
                <div
                  key={contest.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* 左ボーダー付きコンテンツ */}
                  <div className="border-l-4 border-brand p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{contest.name}</h3>
                        {contest.theme && (
                          <p className="text-gray-500 text-sm mt-1">テーマ: {contest.theme}</p>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-brand text-white rounded-full text-sm font-bold">
                        開催中
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-brand-50 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-brand">{stats?.total || 0}</p>
                        <p className="text-xs text-gray-500">応募数</p>
                      </div>
                      <div className="bg-brand-50 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-brand">{stats?.pending || 0}</p>
                        <p className="text-xs text-gray-500">審査待ち</p>
                      </div>
                      <div className="bg-brand-50 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-brand">{remaining > 0 ? remaining : 0}</p>
                        <p className="text-xs text-gray-500">残り日数</p>
                      </div>
                    </div>

                    {/* 期間情報 */}
                    <div className="space-y-1 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <p>
                        <span className="font-medium text-gray-600">開催期間:</span>{' '}
                        {formatDate(contest.start_date)} 〜 {formatDate(contest.end_date)}
                      </p>
                      {contest.voting_start && contest.voting_end && (
                        <p>
                          <span className="font-medium text-gray-600">投票期間:</span>{' '}
                          {formatDate(contest.voting_start)} 〜 {formatDate(contest.voting_end)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">現在開催中のコンテストはありません</p>
            <Link
              href="/admin/contests"
              className="inline-block mt-4 text-brand hover:underline text-sm font-medium"
            >
              コンテストを作成する
            </Link>
          </div>
        )}
      </section>

      {/* 開催予定のコンテスト */}
      {nextContest && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800">開催予定のコンテスト</h2>
            </div>
            <Link
              href="/admin/contests"
              className="flex items-center gap-1 text-sm text-brand hover:underline font-medium"
            >
              詳細を見る
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{nextContest.name}</h3>
                  {nextContest.theme && (
                    <p className="text-sm text-gray-500">テーマ: {nextContest.theme}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">開始まで</p>
                <p className="text-2xl font-bold text-blue-500">
                  {getDaysUntilStart(nextContest.start_date)}
                  <span className="text-sm font-normal text-gray-500 ml-1">日</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
              開催期間: {formatDate(nextContest.start_date)} 〜 {formatDate(nextContest.end_date)}
            </div>
          </div>
        </section>
      )}

      {/* 要対応 & 最新の応募 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 要対応：審査待ち */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-800">要対応</h2>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">審査待ちの応募</p>
                  <p className="text-3xl font-bold text-gray-800">{pendingCount || 0}件</p>
                </div>
              </div>
            </div>

            {(pendingCount || 0) > 0 ? (
              <Link
                href="/admin/review"
                className="block w-full py-3 bg-brand text-white text-center rounded-xl font-bold hover:bg-brand-600 transition-colors"
              >
                審査を開始する
              </Link>
            ) : (
              <div className="py-3 bg-green-50 text-green-600 text-center rounded-xl font-medium">
                すべて審査済みです
              </div>
            )}
          </div>
        </section>

        {/* 最新の応募 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Images className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-bold text-gray-800">最新の応募</h2>
            </div>
            <Link
              href="/admin/entries"
              className="text-sm text-brand hover:underline font-medium"
            >
              すべて見る
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {recentEntries && recentEntries.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {(recentEntries as RecentEntry[]).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-gray-100 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${entry.media_url})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">@{entry.username}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(entry.collected_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                        entry.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : entry.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {entry.status === 'pending' ? '審査中' : entry.status === 'approved' ? '承認済' : '却下'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                応募がありません
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

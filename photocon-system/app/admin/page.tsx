import { Images, CheckCircle, Clock, Heart } from 'lucide-react'
import { StatsCard } from '@/components/admin'
import { createAdminClient } from '@/lib/supabase/admin'

interface RecentEntry {
  id: string
  media_url: string
  username: string
  status: string
  categories: { name: string } | null
}

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // 統計情報取得
  const { count: totalEntries } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })

  const { count: pendingEntries } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: approvedEntries } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: totalVotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })

  // 最近の応募
  const { data } = await supabase
    .from('entries')
    .select('id, media_url, username, status, categories(name)')
    .order('collected_at', { ascending: false })
    .limit(5)

  const recentEntries = data as RecentEntry[] | null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-gray-500 mt-1">フォトコンテストの状況を確認</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="総応募数"
          value={totalEntries || 0}
          icon={Images}
          color="brand"
        />
        <StatsCard
          title="審査待ち"
          value={pendingEntries || 0}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="承認済み"
          value={approvedEntries || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="総投票数"
          value={totalVotes || 0}
          icon={Heart}
          color="brand"
        />
      </div>

      {/* 最近の応募 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">最近の応募</h2>
        {recentEntries && recentEntries.length > 0 ? (
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${entry.media_url})` }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">@{entry.username}</p>
                    <p className="text-sm text-gray-500">{entry.categories?.name || '未分類'}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
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
          <p className="text-gray-500 text-center py-8">応募がありません</p>
        )}
      </div>
    </div>
  )
}

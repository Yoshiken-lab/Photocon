import { createAdminClient } from '@/lib/supabase/admin'
import { ReportsClient } from './ReportsClient'

interface Contest {
  id: string
  name: string
  theme: string | null
  status: string
  start_date: string
  end_date: string
}

interface ContestStats {
  contestId: string
  contestName: string
  totalEntries: number
  approvedEntries: number
  pendingEntries: number
  rejectedEntries: number
  totalVotes: number
}

export default async function ReportsPage() {
  const supabase = createAdminClient()

  // コンテスト一覧を取得
  const { data: contests } = await supabase
    .from('contests')
    .select('id, name, theme, status, start_date, end_date')
    .order('start_date', { ascending: false })

  const contestList = contests as Contest[] || []

  // 各コンテストの統計を取得
  const contestStats: ContestStats[] = await Promise.all(
    contestList.map(async (contest) => {
      // エントリー数を取得
      const { count: totalEntries } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)

      const { count: approvedEntries } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)
        .eq('status', 'approved')

      const { count: pendingEntries } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)
        .eq('status', 'pending')

      const { count: rejectedEntries } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', contest.id)
        .eq('status', 'rejected')

      // 投票数を取得（このコンテストのエントリーに対する投票）
      const { data: entries } = await supabase
        .from('entries')
        .select('id')
        .eq('contest_id', contest.id)

      let totalVotes = 0
      if (entries && entries.length > 0) {
        const entryIds = entries.map(e => e.id)
        const { count } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .in('entry_id', entryIds)
        totalVotes = count || 0
      }

      return {
        contestId: contest.id,
        contestName: contest.name,
        totalEntries: totalEntries || 0,
        approvedEntries: approvedEntries || 0,
        pendingEntries: pendingEntries || 0,
        rejectedEntries: rejectedEntries || 0,
        totalVotes,
      }
    })
  )

  // 全体統計
  const { count: totalAllEntries } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })

  const { count: totalAllVotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })

  const overallStats = {
    totalContests: contestList.length,
    totalEntries: totalAllEntries || 0,
    totalVotes: totalAllVotes || 0,
    activeContests: contestList.filter(c => c.status === 'active').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">レポート</h1>
        <p className="text-gray-500 mt-1">コンテストの統計情報を確認</p>
      </div>

      <ReportsClient
        contests={contestList}
        contestStats={contestStats}
        overallStats={overallStats}
      />
    </div>
  )
}

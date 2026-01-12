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
  uniqueUsers: number
}

interface Entry {
  id: string
  username: string
  collected_at: string
  contest_id: string
  category_id: string | null
}

interface Category {
  id: string
  name: string
}

interface PageView {
  id: string
  visitor_id: string
  accessed_at: string
  device_type: string
}

export default async function ReportsPage() {
  const supabase = createAdminClient()

  // コンテスト一覧を取得
  const { data: contests } = await supabase
    .from('contests')
    .select('id, name, theme, status, start_date, end_date')
    .order('start_date', { ascending: false })

  const contestList = contests as Contest[] || []

  // カテゴリ一覧を取得
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
  const categoryList = categories as Category[] || []

  // ページビューデータを取得（アクセス分析用）
  const { data: pageViews } = await supabase
    .from('page_views')
    .select('id, visitor_id, accessed_at, device_type')
    .order('accessed_at', { ascending: false })

  const pageViewList = pageViews as PageView[] || []

  // 全エントリーを取得（時間帯分析・ユーザー分析用）
  const { data: allEntries } = await supabase
    .from('entries')
    .select('id, username, collected_at, contest_id, category_id')
    .order('collected_at', { ascending: false })

  const entryList = allEntries as Entry[] || []

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

      // ユニークユーザー数を取得
      const contestEntries = entryList.filter(e => e.contest_id === contest.id)
      const uniqueUsers = new Set(contestEntries.map(e => e.username)).size

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
        uniqueUsers,
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

  // ユニークユーザー数（全体）
  const allUniqueUsers = new Set(entryList.map(e => e.username)).size

  const overallStats = {
    totalContests: contestList.length,
    totalEntries: totalAllEntries || 0,
    totalVotes: totalAllVotes || 0,
    activeContests: contestList.filter(c => c.status === 'active').length,
    totalUsers: allUniqueUsers,
  }

  // 時間帯分析用データ
  const timeAnalysisData = entryList.map(entry => ({
    date: entry.collected_at,
    contestId: entry.contest_id,
  }))

  // ユーザー分析用データ
  const userAnalysisData = entryList.reduce((acc, entry) => {
    if (!acc[entry.username]) {
      acc[entry.username] = { count: 0, contests: new Set<string>() }
    }
    acc[entry.username].count++
    acc[entry.username].contests.add(entry.contest_id)
    return acc
  }, {} as Record<string, { count: number; contests: Set<string> }>)

  const userStats = Object.entries(userAnalysisData).map(([username, data]) => ({
    username,
    totalEntries: data.count,
    contestCount: data.contests.size,
  })).sort((a, b) => b.totalEntries - a.totalEntries)

  // カテゴリ別集計
  const categoryStats = categoryList.map(category => {
    const count = entryList.filter(e => e.category_id === category.id).length
    return { id: category.id, name: category.name, count }
  }).filter(c => c.count > 0)

  // アクセス分析用データ
  const accessAnalysisData = pageViewList.map(pv => ({
    date: pv.accessed_at,
    deviceType: pv.device_type,
    visitorId: pv.visitor_id,
  }))

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
        timeAnalysisData={timeAnalysisData}
        userStats={userStats}
        categoryStats={categoryStats}
        accessAnalysisData={accessAnalysisData}
      />
    </div>
  )
}

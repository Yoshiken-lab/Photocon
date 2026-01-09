'use client'

import { Trophy, Images, Heart, Clock, CheckCircle, XCircle, Download } from 'lucide-react'

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

interface OverallStats {
  totalContests: number
  totalEntries: number
  totalVotes: number
  activeContests: number
}

interface ReportsClientProps {
  contests: Contest[]
  contestStats: ContestStats[]
  overallStats: OverallStats
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">開催中</span>
    case 'voting':
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">投票中</span>
    case 'ended':
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">終了</span>
    case 'upcoming':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">開催予定</span>
    default:
      return null
  }
}

export function ReportsClient({ contests, contestStats, overallStats }: ReportsClientProps) {
  const handleExportCSV = () => {
    // CSVデータを作成
    const headers = ['コンテスト名', 'ステータス', '総応募数', '承認済み', '審査待ち', '却下', '総投票数']
    const rows = contestStats.map(stat => {
      const contest = contests.find(c => c.id === stat.contestId)
      return [
        stat.contestName,
        contest?.status || '',
        stat.totalEntries,
        stat.approvedEntries,
        stat.pendingEntries,
        stat.rejectedEntries,
        stat.totalVotes,
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // BOMを追加してExcelで文字化けしないようにする
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contest-report-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 全体統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-brand" />
            </div>
            <span className="text-sm text-gray-500">総コンテスト数</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{overallStats.totalContests}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">開催中</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{overallStats.activeContests}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Images className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">総応募数</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{overallStats.totalEntries.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-gray-500">総投票数</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{overallStats.totalVotes.toLocaleString()}</p>
        </div>
      </div>

      {/* コンテスト別統計 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">コンテスト別統計</h2>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            CSVエクスポート
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">コンテスト</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">総応募</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    承認
                  </span>
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-yellow-500" />
                    審査待ち
                  </span>
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1">
                    <XCircle className="w-3 h-3 text-red-500" />
                    却下
                  </span>
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1">
                    <Heart className="w-3 h-3 text-brand" />
                    投票数
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contestStats.map((stat) => {
                const contest = contests.find(c => c.id === stat.contestId)
                return (
                  <tr key={stat.contestId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{stat.contestName}</p>
                        {contest?.theme && (
                          <p className="text-xs text-gray-500">テーマ: {contest.theme}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {contest && getStatusBadge(contest.status)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800">
                      {stat.totalEntries}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">
                      {stat.approvedEntries}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-yellow-600">
                      {stat.pendingEntries}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">
                      {stat.rejectedEntries}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-brand">
                      {stat.totalVotes.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {contestStats.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            コンテストがありません
          </div>
        )}
      </div>
    </div>
  )
}

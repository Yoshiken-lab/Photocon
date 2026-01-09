'use client'

import { useState, useMemo } from 'react'
import {
  Trophy, Images, Heart, Clock, CheckCircle, XCircle, Download,
  BarChart3, Users, GitCompare, ChevronDown, Search, X
} from 'lucide-react'

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

interface OverallStats {
  totalContests: number
  totalEntries: number
  totalVotes: number
  activeContests: number
  totalUsers: number
}

interface TimeData {
  date: string
  contestId: string
}

interface UserStat {
  username: string
  totalEntries: number
  contestCount: number
}

interface CategoryStat {
  id: string
  name: string
  count: number
}

interface ReportsClientProps {
  contests: Contest[]
  contestStats: ContestStats[]
  overallStats: OverallStats
  timeAnalysisData: TimeData[]
  userStats: UserStat[]
  categoryStats: CategoryStat[]
}

type TabType = 'summary' | 'time' | 'users' | 'compare'

const tabs = [
  { id: 'summary' as TabType, label: 'コンテスト別サマリー', icon: BarChart3 },
  { id: 'time' as TabType, label: '時間帯分析', icon: Clock },
  { id: 'users' as TabType, label: 'ユーザー分析', icon: Users },
  { id: 'compare' as TabType, label: 'コンテスト比較', icon: GitCompare },
]

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

// 曜日名
const dayNames = ['日', '月', '火', '水', '木', '金', '土']

export function ReportsClient({
  contests,
  contestStats,
  overallStats,
  timeAnalysisData,
  userStats,
  categoryStats,
}: ReportsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary')
  const [selectedContestId, setSelectedContestId] = useState<string>(contests[0]?.id || '')
  const [compareContestIds, setCompareContestIds] = useState<string[]>(
    contests.slice(0, 3).map(c => c.id)
  )
  const [compareSearchQuery, setCompareSearchQuery] = useState('')

  // 選択されたコンテストの統計
  const selectedContestStats = contestStats.find(s => s.contestId === selectedContestId)
  const selectedContest = contests.find(c => c.id === selectedContestId)

  // 時間帯分析データの集計
  const timeStats = useMemo(() => {
    // 曜日×時間帯のヒートマップデータ
    const heatmap: number[][] = Array(7).fill(null).map(() => Array(12).fill(0))
    // 曜日別の集計
    const dayTotals = Array(7).fill(0)
    // 時間帯別の集計
    const hourTotals: { [key: string]: number } = {}

    timeAnalysisData.forEach(item => {
      const date = new Date(item.date)
      const day = date.getDay()
      const hour = date.getHours()
      const hourSlot = Math.floor(hour / 2) // 2時間ごとのスロット

      heatmap[day][hourSlot]++
      dayTotals[day]++

      const key = `${dayNames[day]} ${hourSlot * 2}:00-${(hourSlot + 1) * 2}:00`
      hourTotals[key] = (hourTotals[key] || 0) + 1
    })

    // ピーク時間帯TOP5
    const peakTimes = Object.entries(hourTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // ヒートマップの最大値
    const maxHeatValue = Math.max(...heatmap.flat())

    return { heatmap, dayTotals, peakTimes, maxHeatValue }
  }, [timeAnalysisData])

  // ユーザー分析データ
  const userAnalysis = useMemo(() => {
    const totalUsers = userStats.length
    const repeatUsers = userStats.filter(u => u.contestCount > 1).length
    const repeatRate = totalUsers > 0 ? (repeatUsers / totalUsers * 100).toFixed(1) : '0'

    // リピート回数分布
    const repeatDistribution = {
      once: userStats.filter(u => u.contestCount === 1).length,
      twoThree: userStats.filter(u => u.contestCount >= 2 && u.contestCount <= 3).length,
      fourSix: userStats.filter(u => u.contestCount >= 4 && u.contestCount <= 6).length,
      sevenPlus: userStats.filter(u => u.contestCount >= 7).length,
    }

    // トップ応募者
    const topUsers = userStats.slice(0, 5)

    return { totalUsers, repeatUsers, repeatRate, repeatDistribution, topUsers }
  }, [userStats])

  // 比較対象コンテストの統計
  const compareStats = contestStats.filter(s => compareContestIds.includes(s.contestId))

  // 検索でフィルタリングされたコンテストリスト
  const filteredContests = useMemo(() => {
    if (!compareSearchQuery.trim()) return contests
    const query = compareSearchQuery.toLowerCase()
    return contests.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.theme && c.theme.toLowerCase().includes(query))
    )
  }, [contests, compareSearchQuery])

  // CSVエクスポート
  const handleExportCSV = () => {
    const headers = ['コンテスト名', 'ステータス', '総応募数', '承認済み', '審査待ち', '却下', 'ユニークユーザー', '総投票数']
    const rows = contestStats.map(stat => {
      const contest = contests.find(c => c.id === stat.contestId)
      return [
        stat.contestName,
        contest?.status || '',
        stat.totalEntries,
        stat.approvedEntries,
        stat.pendingEntries,
        stat.rejectedEntries,
        stat.uniqueUsers,
        stat.totalVotes,
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contest-report-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 比較対象の切り替え
  const toggleCompareContest = (contestId: string) => {
    if (compareContestIds.includes(contestId)) {
      setCompareContestIds(compareContestIds.filter(id => id !== contestId))
    } else {
      setCompareContestIds([...compareContestIds, contestId])
    }
  }

  // ヒートマップの色を取得
  const getHeatColor = (value: number, max: number) => {
    if (max === 0 || value === 0) return 'bg-gray-100'
    const ratio = value / max
    if (ratio > 0.7) return 'bg-brand'
    if (ratio > 0.3) return 'bg-brand-100'
    return 'bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* 全体統計 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-brand" />
            </div>
            <span className="text-sm text-gray-500">総コンテスト</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overallStats.totalContests}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">開催中</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overallStats.activeContests}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Images className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">総応募数</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overallStats.totalEntries.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">総ユーザー</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overallStats.totalUsers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-gray-500">総投票数</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overallStats.totalVotes.toLocaleString()}</p>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand bg-brand-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* コンテスト別サマリー */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* コンテスト選択 */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">コンテスト選択:</span>
                <div className="relative">
                  <select
                    value={selectedContestId}
                    onChange={(e) => setSelectedContestId(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    {contests.map((contest) => (
                      <option key={contest.id} value={contest.id}>
                        {contest.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {selectedContestStats && selectedContest && (
                <>
                  {/* 統計カード */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500 mb-1">総応募数</p>
                      <p className="text-3xl font-bold text-gray-800">{selectedContestStats.totalEntries.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500 mb-1">承認数</p>
                      <p className="text-3xl font-bold text-green-600">{selectedContestStats.approvedEntries.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500 mb-1">却下数</p>
                      <p className="text-3xl font-bold text-red-500">{selectedContestStats.rejectedEntries.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500 mb-1">ユニークユーザー</p>
                      <p className="text-3xl font-bold text-brand">{selectedContestStats.uniqueUsers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        平均 {selectedContestStats.uniqueUsers > 0
                          ? (selectedContestStats.totalEntries / selectedContestStats.uniqueUsers).toFixed(1)
                          : 0}件/人
                      </p>
                    </div>
                  </div>

                  {/* カテゴリ別内訳 */}
                  {categoryStats.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4">カテゴリ別内訳</h3>
                      <div className="space-y-3">
                        {categoryStats.map((category, index) => {
                          const percentage = overallStats.totalEntries > 0
                            ? (category.count / overallStats.totalEntries * 100).toFixed(0)
                            : 0
                          const colors = ['bg-brand', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
                          return (
                            <div key={category.id}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">{category.name}</span>
                                <span className="font-medium text-gray-800">{category.count}件 ({percentage}%)</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${colors[index % colors.length]} rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* 時間帯分析 */}
          {activeTab === 'time' && (
            <div className="space-y-6">
              {/* ヒートマップ */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">曜日×時間帯 ヒートマップ</h3>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    {/* 時間帯ラベル */}
                    <div className="flex mb-2">
                      <div className="w-12"></div>
                      <div className="flex-1 grid grid-cols-12 gap-1 text-xs text-gray-500 text-center">
                        {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map(hour => (
                          <span key={hour}>{hour}時</span>
                        ))}
                      </div>
                    </div>

                    {/* ヒートマップ本体 */}
                    <div className="space-y-1">
                      {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => (
                        <div key={dayIndex} className="flex items-center">
                          <div className={`w-12 text-sm ${dayIndex === 0 ? 'text-red-500 font-medium' : dayIndex === 6 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                            {dayNames[dayIndex]}
                          </div>
                          <div className="flex-1 grid grid-cols-12 gap-1">
                            {timeStats.heatmap[dayIndex].map((value, hourIndex) => (
                              <div
                                key={hourIndex}
                                className={`h-8 ${getHeatColor(value, timeStats.maxHeatValue)} rounded cursor-pointer transition-all hover:scale-110`}
                                title={`${dayNames[dayIndex]} ${hourIndex * 2}:00-${(hourIndex + 1) * 2}:00: ${value}件`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 凡例 */}
                    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
                      <span>少</span>
                      <div className="w-4 h-4 bg-gray-100 rounded"></div>
                      <div className="w-4 h-4 bg-brand-100 rounded"></div>
                      <div className="w-4 h-4 bg-brand rounded"></div>
                      <span>多</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ピーク時間帯 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">ピーク時間帯 TOP5</h3>
                  <div className="space-y-3">
                    {timeStats.peakTimes.map(([time, count], index) => {
                      const maxCount = timeStats.peakTimes[0]?.[1] || 1
                      const percentage = (count / maxCount * 100).toFixed(0)
                      const medals = ['bg-yellow-400 text-white', 'bg-gray-400 text-white', 'bg-amber-600 text-white', 'bg-gray-200 text-gray-600', 'bg-gray-200 text-gray-600']
                      return (
                        <div key={time} className="flex items-center gap-3">
                          <span className={`w-6 h-6 ${medals[index]} rounded-full flex items-center justify-center text-xs font-bold`}>
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{time}</p>
                            <p className="text-xs text-gray-500">{count}件</p>
                          </div>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                    {timeStats.peakTimes.length === 0 && (
                      <p className="text-gray-500 text-center py-4">データがありません</p>
                    )}
                  </div>
                </div>

                {/* 曜日別応募数 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">曜日別 応募数</h3>
                  {(() => {
                    const maxDay = Math.max(...timeStats.dayTotals)
                    return (
                      <div className="flex">
                        {/* 縦軸目盛り */}
                        <div className="w-12 flex-shrink-0 pr-2">
                          <div className="flex flex-col justify-between h-40 text-right">
                            <span className="text-xs text-gray-400 leading-none">{maxDay.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 leading-none">{Math.round(maxDay * 0.75).toLocaleString()}</span>
                            <span className="text-xs text-gray-400 leading-none">{Math.round(maxDay * 0.5).toLocaleString()}</span>
                            <span className="text-xs text-gray-400 leading-none">{Math.round(maxDay * 0.25).toLocaleString()}</span>
                            <span className="text-xs text-gray-400 leading-none">0</span>
                          </div>
                        </div>
                        {/* グラフ本体 */}
                        <div className="flex-1 min-w-0">
                          <div className="relative h-40 border-l border-gray-200">
                            {/* グリッドライン */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="border-t border-gray-200 w-full" />
                              ))}
                            </div>
                            {/* 棒グラフ */}
                            <div className="flex items-end justify-around h-full relative z-10 px-2">
                              {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                                const height = maxDay > 0 ? (timeStats.dayTotals[dayIndex] / maxDay * 100) : 0
                                return (
                                  <div key={dayIndex} className="w-[12%] h-full flex items-end justify-center group">
                                    <div
                                      className={`w-full rounded-t transition-all relative ${dayIndex === 0 || dayIndex === 6 ? 'bg-brand' : 'bg-gray-300'}`}
                                      style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                                    >
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        {timeStats.dayTotals[dayIndex].toLocaleString()}件
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          {/* 曜日ラベル */}
                          <div className="flex justify-around mt-2 px-2">
                            {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => (
                              <span key={dayIndex} className={`w-[12%] text-xs text-center ${dayIndex === 0 ? 'text-red-500 font-medium' : dayIndex === 6 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                {dayNames[dayIndex]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ユーザー分析 */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* ユーザー統計カード */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-1">総ユーザー数</p>
                  <p className="text-3xl font-bold text-gray-800">{userAnalysis.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">累計参加者</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-1">リピーター率</p>
                  <p className="text-3xl font-bold text-green-600">{userAnalysis.repeatRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">{userAnalysis.repeatUsers}人</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-1">新規参加者</p>
                  <p className="text-3xl font-bold text-blue-500">{userAnalysis.repeatDistribution.once.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">1回のみ参加</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-1">平均応募数</p>
                  <p className="text-3xl font-bold text-brand">
                    {userAnalysis.totalUsers > 0
                      ? (overallStats.totalEntries / userAnalysis.totalUsers).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">件/ユーザー</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 新規 vs リピーター */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">新規 vs リピーター</h3>
                  <div className="flex items-center gap-6">
                    {/* ドーナツチャート風 */}
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeDasharray={`${userAnalysis.repeatRate}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{userAnalysis.repeatRate}%</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">リピーター</span>
                        <span className="text-sm font-bold text-gray-800">{userAnalysis.repeatUsers}人</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-600">新規参加</span>
                        <span className="text-sm font-bold text-gray-800">{userAnalysis.repeatDistribution.once}人</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* トップ応募者 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">トップ応募者</h3>
                  <div className="space-y-3">
                    {userAnalysis.topUsers.map((user, index) => {
                      const medals = ['bg-yellow-400 text-white', 'bg-gray-400 text-white', 'bg-amber-600 text-white', 'bg-gray-200 text-gray-600', 'bg-gray-200 text-gray-600']
                      return (
                        <div key={user.username} className="flex items-center gap-3">
                          <span className={`w-6 h-6 ${medals[index]} rounded-full flex items-center justify-center text-xs font-bold`}>
                            {index + 1}
                          </span>
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">@{user.username}</p>
                            <p className="text-xs text-gray-500">累計参加: {user.contestCount}回</p>
                          </div>
                          <span className="text-sm font-bold text-brand">{user.totalEntries}件</span>
                        </div>
                      )
                    })}
                    {userAnalysis.topUsers.length === 0 && (
                      <p className="text-gray-500 text-center py-4">データがありません</p>
                    )}
                  </div>
                </div>
              </div>

              {/* リピート回数分布 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">リピート回数分布</h3>
                <div className="space-y-3">
                  {[
                    { label: '1回のみ', count: userAnalysis.repeatDistribution.once, color: 'bg-gray-300' },
                    { label: '2-3回', count: userAnalysis.repeatDistribution.twoThree, color: 'bg-green-300' },
                    { label: '4-6回', count: userAnalysis.repeatDistribution.fourSix, color: 'bg-green-500' },
                    { label: '7回以上', count: userAnalysis.repeatDistribution.sevenPlus, color: 'bg-green-700' },
                  ].map((item) => {
                    const percentage = userAnalysis.totalUsers > 0
                      ? (item.count / userAnalysis.totalUsers * 100).toFixed(1)
                      : 0
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-medium text-gray-800">{item.count}人 ({percentage}%)</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* コンテスト比較 */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              {/* コンテスト選択：検索付きマルチセレクト */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <GitCompare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">比較対象を選択</span>
                  <span className="text-xs text-gray-400">（{compareContestIds.length}件選択中）</span>
                </div>

                {/* 選択済みタグ */}
                {compareContestIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {compareContestIds.map((id) => {
                      const contest = contests.find(c => c.id === id)
                      if (!contest) return null
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white rounded-full text-sm font-medium"
                        >
                          {contest.name}
                          <button
                            onClick={() => toggleCompareContest(id)}
                            className="hover:bg-brand-600 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )
                    })}
                    <button
                      onClick={() => setCompareContestIds([])}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      すべて解除
                    </button>
                  </div>
                )}

                {/* 検索ボックス */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="コンテスト名・テーマで検索..."
                    value={compareSearchQuery}
                    onChange={(e) => setCompareSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                  {compareSearchQuery && (
                    <button
                      onClick={() => setCompareSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* コンテストリスト */}
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                  {filteredContests.length > 0 ? (
                    filteredContests.map((contest) => {
                      const isSelected = compareContestIds.includes(contest.id)
                      return (
                        <label
                          key={contest.id}
                          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                            isSelected ? 'bg-brand-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCompareContest(contest.id)}
                            className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-brand' : 'text-gray-800'}`}>
                              {contest.name}
                            </p>
                            {contest.theme && (
                              <p className="text-xs text-gray-500 truncate">{contest.theme}</p>
                            )}
                          </div>
                          {getStatusBadge(contest.status)}
                        </label>
                      )
                    })
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                      「{compareSearchQuery}」に一致するコンテストがありません
                    </div>
                  )}
                </div>

                {/* クイック選択 */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className="text-gray-500">クイック選択:</span>
                  <button
                    onClick={() => setCompareContestIds(contests.slice(0, 3).map(c => c.id))}
                    className="text-brand hover:underline"
                  >
                    最新3件
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setCompareContestIds(contests.slice(0, 5).map(c => c.id))}
                    className="text-brand hover:underline"
                  >
                    最新5件
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setCompareContestIds(contests.map(c => c.id))}
                    className="text-brand hover:underline"
                  >
                    すべて選択
                  </button>
                </div>
              </div>

              {/* 比較テーブル */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">コンテスト名</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">応募数</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">ユーザー数</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">投票数</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">開催期間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {compareStats.map((stat) => {
                      const contest = contests.find(c => c.id === stat.contestId)
                      const startDate = contest ? new Date(contest.start_date) : null
                      const endDate = contest ? new Date(contest.end_date) : null
                      const days = startDate && endDate
                        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        : 0
                      return (
                        <tr key={stat.contestId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-brand rounded-full"></span>
                              <span className="font-medium text-gray-800">{stat.contestName}</span>
                              {contest && getStatusBadge(contest.status)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-800">
                            {stat.totalEntries.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-800">
                            {stat.uniqueUsers.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-brand">
                            {stat.totalVotes.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500">
                            {days}日間
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {compareStats.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  比較対象のコンテストを選択してください
                </div>
              )}

              {/* 比較チャート */}
              {compareStats.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 応募数比較 */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">応募数の比較</h3>
                    {(() => {
                      const maxEntries = Math.max(...compareStats.map(s => s.totalEntries))
                      const colors = ['bg-brand', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']
                      return (
                        <div className="flex">
                          {/* 縦軸目盛り */}
                          <div className="w-12 flex-shrink-0 pr-2">
                            <div className="flex flex-col justify-between h-40 text-right">
                              <span className="text-xs text-gray-400 leading-none">{maxEntries.toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">{Math.round(maxEntries * 0.75).toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">{Math.round(maxEntries * 0.5).toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">{Math.round(maxEntries * 0.25).toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">0</span>
                            </div>
                          </div>
                          {/* グラフ本体 */}
                          <div className="flex-1 min-w-0">
                            <div className="relative h-40 border-l border-gray-200">
                              {/* グリッドライン */}
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[0, 1, 2, 3, 4].map((i) => (
                                  <div key={i} className="border-t border-gray-200 w-full" />
                                ))}
                              </div>
                              {/* 棒グラフ */}
                              <div className="flex items-end justify-around h-full relative z-10 px-2">
                                {compareStats.map((stat, index) => {
                                  const height = maxEntries > 0 ? (stat.totalEntries / maxEntries * 100) : 0
                                  return (
                                    <div key={stat.contestId} className="flex-1 max-w-[60px] h-full flex items-end justify-center group">
                                      <div
                                        className={`w-full ${colors[index % colors.length]} rounded-t relative`}
                                        style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                                      >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                          {stat.totalEntries.toLocaleString()}件
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            {/* ラベル */}
                            <div className="flex justify-around mt-2 px-2">
                              {compareStats.map((stat) => (
                                <span key={stat.contestId} className="flex-1 max-w-[60px] text-xs text-gray-500 text-center truncate">
                                  {stat.contestName.slice(0, 8)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* ユーザー数比較 */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">ユーザー数の比較</h3>
                    {(() => {
                      const maxUsers = Math.max(...compareStats.map(s => s.uniqueUsers))
                      const colors = ['bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800']
                      return (
                        <div className="flex">
                          {/* 縦軸目盛り */}
                          <div className="w-12 flex-shrink-0 pr-2">
                            <div className="flex flex-col justify-between h-40 text-right">
                              <span className="text-xs text-gray-400 leading-none">{maxUsers.toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">{Math.round(maxUsers * 0.75).toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">{Math.round(maxUsers * 0.5).toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">{Math.round(maxUsers * 0.25).toLocaleString()}</span>
                              <span className="text-xs text-gray-400 leading-none">0</span>
                            </div>
                          </div>
                          {/* グラフ本体 */}
                          <div className="flex-1 min-w-0">
                            <div className="relative h-40 border-l border-gray-200">
                              {/* グリッドライン */}
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[0, 1, 2, 3, 4].map((i) => (
                                  <div key={i} className="border-t border-gray-200 w-full" />
                                ))}
                              </div>
                              {/* 棒グラフ */}
                              <div className="flex items-end justify-around h-full relative z-10 px-2">
                                {compareStats.map((stat, index) => {
                                  const height = maxUsers > 0 ? (stat.uniqueUsers / maxUsers * 100) : 0
                                  return (
                                    <div key={stat.contestId} className="flex-1 max-w-[60px] h-full flex items-end justify-center group">
                                      <div
                                        className={`w-full ${colors[index % colors.length]} rounded-t relative`}
                                        style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                                      >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                          {stat.uniqueUsers.toLocaleString()}人
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            {/* ラベル */}
                            <div className="flex justify-around mt-2 px-2">
                              {compareStats.map((stat) => (
                                <span key={stat.contestId} className="flex-1 max-w-[60px] text-xs text-gray-500 text-center truncate">
                                  {stat.contestName.slice(0, 8)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSVエクスポートボタン */}
      <div className="flex justify-end">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          CSVエクスポート
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Calendar, Hash, Users, Search, Filter, ChevronDown, List, LayoutGrid, Trophy, CheckCircle2, Clock } from 'lucide-react'
import ContestForm from './ContestForm'

type Contest = {
  id: string
  name: string
  description: string | null
  theme: string | null
  emoji: string | null
  image_url: string | null
  hashtags: string[] | null
  start_date: string
  end_date: string // Usually overall end date
  voting_start: string | null
  voting_end: string | null
  status: string
  categories: { id: string; name: string; hashtag: string }[] | null
}

type Props = {
  contests: Contest[] | null
}

type ViewType = 'card' | 'table'
type SortType = 'created_desc' | 'created_asc' | 'start_desc' | 'start_asc' | 'end_desc' | 'end_asc' | 'name_asc' | 'name_desc'

const STATUS_OPTIONS = [
  { value: undefined, label: 'すべて' },
  { value: 'active', label: '開催中', color: 'green' },
  { value: 'voting', label: '投票中', color: 'blue' },
  { value: 'upcoming', label: '公開予定', color: 'yellow' },
  { value: 'draft', label: '下書き', color: 'gray' },
  { value: 'ended', label: '終了', color: 'gray' },
]

const SORT_OPTIONS = [
  { value: 'created_desc', label: '作成日（新しい順）' },
  { value: 'created_asc', label: '作成日（古い順）' },
  { value: 'start_desc', label: '開始日（新しい順）' },
  { value: 'start_asc', label: '開始日（古い順）' },
  { value: 'end_desc', label: '終了日（新しい順）' },
  { value: 'end_asc', label: '終了日（古い順）' },
  { value: 'name_asc', label: '名前（あいうえお順）' },
  { value: 'name_desc', label: '名前（逆順）' },
]

/**
 * Helper to determine current progress phase and percentages
 */
function getContestProgress(contest: Contest) {
  const now = new Date().getTime()
  const start = new Date(contest.start_date).getTime()
  const end = new Date(contest.end_date).getTime()
  const votingStart = contest.voting_start ? new Date(contest.voting_start).getTime() : null
  const votingEnd = contest.voting_end ? new Date(contest.voting_end).getTime() : null

  // Define phases: Upcoming -> Submission -> Voting -> Ended
  // If no voting, Submission goes until End.

  let phases = [
    { id: 'upcoming', label: '公開前', color: 'bg-yellow-500' },
    { id: 'submission', label: '応募期間', color: 'bg-green-500' },
    { id: 'voting', label: '投票期間', color: 'bg-blue-500' },
    { id: 'ended', label: '終了', color: 'bg-gray-500' }
  ]

  let currentPhaseId = 'upcoming'
  let progressInPhase = 0 // 0 to 100
  let remainingDays = 0

  if (now < start) {
    currentPhaseId = 'upcoming'
    // Days until start
    remainingDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
  } else if (votingStart && now >= votingStart && votingEnd && now < votingEnd) {
    // Voting Phase
    currentPhaseId = 'voting'
    const totalDuration = votingEnd - votingStart
    const elapsed = now - votingStart
    progressInPhase = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    remainingDays = Math.ceil((votingEnd - now) / (1000 * 60 * 60 * 24))
  } else if (now >= end) {
    currentPhaseId = 'ended'
    progressInPhase = 100
    remainingDays = 0
  } else {
    // Submission Phase (Active)
    // If voting exists, ends at votingStart. If not, ends at end_date.
    currentPhaseId = 'submission'
    const phaseEnd = votingStart || end
    const totalDuration = phaseEnd - start
    const elapsed = now - start
    progressInPhase = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    remainingDays = Math.ceil((phaseEnd - now) / (1000 * 60 * 60 * 24))
  }

  // Use contest status from DB to override if it's draft or cancelled? 
  // For visual consistency, if status is 'draft', maybe we should just show 'upcoming' or 'draft'.
  if (contest.status === 'draft') {
    currentPhaseId = 'draft' // Special case
  }

  return { phases, currentPhaseId, progressInPhase, remainingDays }
}


export default function ContestsClient({ contests }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContest, setEditingContest] = useState<Contest | null>(null)

  // フィルター・ビュー状態 (Tabs removed)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('created_desc')
  const [viewType, setViewType] = useState<ViewType>('card')

  const handleEdit = (contest: Contest) => {
    setEditingContest(contest)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setEditingContest(null)
  }

  // ステータスごとの件数を計算
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 }
    contests?.forEach(c => {
      counts.all++
      counts[c.status] = (counts[c.status] || 0) + 1
    })
    return counts
  }, [contests])

  // フィルタリング・ソート済みコンテスト
  const filteredContests = useMemo(() => {
    let result = [...(contests || [])]

    // ステータスフィルター
    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter)
    }

    // テキスト検索
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.theme?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      )
    }

    // ソート
    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'created_asc':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        case 'start_desc':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'start_asc':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        case 'end_desc':
          return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        case 'end_asc':
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        case 'name_asc':
          return a.name.localeCompare(b.name, 'ja')
        case 'name_desc':
          return b.name.localeCompare(a.name, 'ja')
        default:
          return 0
      }
    })

    return result
  }, [contests, statusFilter, searchQuery, sortBy])

  // ステータスバッジ取得
  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find(o => o.value === status)
    const colorClass = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-600',
    }[option?.color || 'gray']

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
        {option?.label || status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">コンテスト管理</h1>
          <p className="text-gray-500 mt-1">コンテストの作成・編集・進捗管理</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
        >
          新規作成
        </button>
      </div>

      {/* フィルター・検索エリア */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
        {/* ステータスフィルタ */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">ステータス:</span>
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value || 'all'}
                onClick={() => setStatusFilter(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === option.value
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {option.label} ({option.value ? statusCounts[option.value] || 0 : statusCounts.all || 0})
              </button>
            ))}
          </div>
        </div>

        {/* 検索・ソート・ビュー切り替え */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 検索 */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="コンテスト名・テーマで検索..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* ソート */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">並び替え:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* ビュー切り替え */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('card')}
              className={`p-2 rounded-md transition-colors ${viewType === 'card' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-700'
                }`}
              title="カードビュー"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`p-2 rounded-md transition-colors ${viewType === 'table' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-700'
                }`}
              title="テーブルビュー"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* カードビュー */}
      {viewType === 'card' && (
        <div className="grid gap-6">
          {filteredContests.map((contest) => {
            const { phases, currentPhaseId, progressInPhase, remainingDays } = getContestProgress(contest)

            return (
              <div
                key={contest.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Image & Title */}
                  <div className="md:w-1/3 min-w-[280px]">
                    <div className="flex gap-4 mb-4">
                      {contest.image_url && (
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={contest.image_url}
                            alt={contest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        {/* Status for Draft/Special Cases */}
                        <div className="mb-2">
                          {getStatusBadge(contest.status)}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {contest.emoji && (
                            <span className="text-xl">{contest.emoji}</span>
                          )}
                          <h2 className="text-lg font-bold text-gray-800">{contest.name}</h2>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{contest.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {new Date(contest.start_date).toLocaleDateString('ja-JP')} 〜 {new Date(contest.end_date).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      {contest.hashtags && (
                        <div className="flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-gray-400" />
                          <span>{contest.hashtags[0]}{contest.hashtags.length > 1 && ` +${contest.hashtags.length - 1}`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Progress Stepper */}
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand" />
                        進捗状況
                      </h3>
                      <button
                        onClick={() => handleEdit(contest)}
                        className="text-sm text-brand hover:underline font-medium"
                      >
                        編集する
                      </button>
                    </div>

                    {/* Stepper UI */}
                    <div className="relative">
                      {/* Connecting Line (Background) */}
                      <div className="absolute top-3 left-0 right-0 h-1 bg-gray-100 rounded-full"></div>

                      <div className="grid grid-cols-4 gap-2 relative">
                        {phases.map((phase) => {
                          const isActive = phase.id === currentPhaseId
                          const isPast = phases.findIndex(p => p.id === phase.id) < phases.findIndex(p => p.id === currentPhaseId)

                          // Color logic
                          const baseColor = isActive ? phase.color : (isPast ? 'bg-gray-300' : 'bg-gray-100')
                          const textColor = isActive ? 'text-gray-800 font-bold' : (isPast ? 'text-gray-500' : 'text-gray-400')

                          return (
                            <div key={phase.id} className="flex flex-col items-center group">
                              {/* Dot / Indicator */}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white z-10 transition-all ${isActive ? phase.color + ' scale-110 shadow-md ring-4 ring-white' : (isPast ? 'bg-gray-400' : 'bg-gray-200')
                                }`}>
                                {isPast ? <CheckCircle2 className="w-4 h-4" /> : (isActive ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <div className="w-2 h-2 bg-white rounded-full opacity-0" />)}
                              </div>

                              {/* Label */}
                              <span className={`text-xs mt-2 text-center ${textColor}`}>
                                {phase.label}
                              </span>

                              {/* Active Phase Progress Bar (Only for active phase) */}
                              {isActive && remainingDays > 0 && (
                                <div className="absolute top-10 left-0 right-0 mt-4 px-2">
                                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center shadow-sm">
                                    <div className="flex justify-between text-[10px] mb-1 font-bold">
                                      <span className="text-brand">進行中</span>
                                      <span className="text-red-500">あと{remainingDays}日</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-1000 ${phase.color}`}
                                        style={{ width: `${progressInPhase}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Padding for the popover progress bar if active */}
                    {currentPhaseId !== 'ended' && currentPhaseId !== 'draft' && <div className="h-16 md:h-12"></div>}
                  </div>
                </div>

                {/* Footer / Categories */}
                {contest.categories && contest.categories.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {contest.categories.map((category) => (
                      <span
                        key={category.id}
                        className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs border border-gray-200"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {filteredContests.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">コンテストがありません</h3>
              <p className="text-gray-500">条件に一致するコンテストが見つかりませんでした</p>
            </div>
          )}
        </div>
      )}

      {/* テーブルビュー (Simplified, no progress bar here, or maybe just simple text) */}
      {viewType === 'table' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredContests.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">コンテスト</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">フェーズ</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ステータス</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">期間</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContests.map((contest) => {
                  const { currentPhaseId, remainingDays } = getContestProgress(contest)
                  return (
                    <tr key={contest.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {contest.emoji && <span className="text-xl">{contest.emoji}</span>}
                          <span className="font-medium text-gray-800">{contest.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {currentPhaseId === 'submission' ? '応募期間' :
                            currentPhaseId === 'voting' ? '投票期間' :
                              currentPhaseId === 'upcoming' ? '公開前' : '終了'}
                        </span>
                        {remainingDays > 0 && currentPhaseId !== 'ended' && (
                          <span className="ml-2 text-xs text-red-500 font-bold">残{remainingDays}日</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(contest.status)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(contest.start_date).toLocaleDateString('ja-JP')} 〜{' '}
                          {new Date(contest.end_date).toLocaleDateString('ja-JP')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(contest)}
                          className="text-sm text-brand hover:underline"
                        >
                          編集
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">コンテストがありません</h3>
              <p className="text-gray-500">条件に一致するコンテストが見つかりませんでした</p>
            </div>
          )}
        </div>
      )}

      <ContestForm isOpen={isFormOpen} onClose={handleClose} contest={editingContest} />
    </div>
  )
}

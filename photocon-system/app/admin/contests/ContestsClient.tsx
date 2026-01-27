'use client'

import { useState, useMemo, useEffect } from 'react'
import { Calendar, Hash, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
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
  end_date: string
  voting_start: string | null
  voting_end: string | null
  status: string
  categories: { id: string; name: string; hashtag: string }[] | null
  settings: any // Json
}

type Props = {
  contests: Contest[] | null
}

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

export default function ContestsClient({ contests }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContest, setEditingContest] = useState<Contest | null>(null)

  // Hydration Fix: Use a mounted state to ensure consistent rendering
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only calculate 'now' on the client side after mount
  const now = mounted ? new Date().getTime() : null

  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('created_desc')

  const handleEdit = (contest: Contest) => {
    setEditingContest(contest)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setEditingContest(null)
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 }
    // Note: statusCounts relies on DB status. If we want dynamic counts, we'd need to calculate status for all contests here.
    // For now, let's keep using DB status for filtering/counting to avoid complex re-calc logic affecting performance,
    // but display the dynamic status on the card.
    contests?.forEach(c => {
      counts.all++
      counts[c.status] = (counts[c.status] || 0) + 1
    })
    return counts
  }, [contests])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredContests = useMemo(() => {
    let result = [...(contests || [])]

    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.theme?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc': return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'created_asc': return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        case 'start_desc': return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'start_asc': return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        case 'end_desc': return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        case 'end_asc': return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        case 'name_asc': return a.name.localeCompare(b.name, 'ja')
        case 'name_desc': return b.name.localeCompare(a.name, 'ja')
        default: return 0
      }
    })

    return result
  }, [contests, statusFilter, searchQuery, sortBy])

  const totalPages = Math.ceil(filteredContests.length / itemsPerPage)

  // Reset page safely if current page exceeds total pages
  const safeCurrentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage)
    }
  }, [currentPage, safeCurrentPage]);

  const paginatedContests = filteredContests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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

  // --- Date/Timeline Helpers ---
  const formatDate = (d: string) => {
    const date = new Date(d)
    const nowObj = new Date()
    // Show year if it's not the current year
    if (date.getFullYear() !== nowObj.getFullYear()) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const calculateStatus = (contest: Contest, currentTimestamp: number | null): string => {
    // If hydration isn't complete (now is null), return DB status or a safe default
    if (!currentTimestamp) return contest.status;

    // Draft always overrides dates
    if (contest.status === 'draft') return 'draft'

    const start = new Date(contest.start_date).getTime()
    const end = new Date(contest.end_date).getTime()
    const votingStart = contest.voting_start ? new Date(contest.voting_start).getTime() : null
    const votingEnd = contest.voting_end ? new Date(contest.voting_end).getTime() : null

    if (currentTimestamp < start) return 'upcoming'
    if (currentTimestamp > end) return 'ended'

    // Between start and end
    if (contest.settings?.is_voting_enabled !== false && votingStart && votingEnd) {
      if (currentTimestamp >= votingStart && currentTimestamp <= votingEnd) return 'voting'
    }

    return 'active'
  }

  const getTimelineData = (contest: Contest, currentTimestamp: number | null) => {
    if (!currentTimestamp) return null // Don't render complex timeline on server/first render

    const start = new Date(contest.start_date).getTime()
    const end = new Date(contest.end_date).getTime()
    const votingStart = contest.voting_start ? new Date(contest.voting_start).getTime() : null
    const votingEnd = contest.voting_end ? new Date(contest.voting_end).getTime() : null
    const isVotingEnabled = contest.settings?.is_voting_enabled !== false

    const totalDuration = end - start
    if (totalDuration <= 0) return null

    // Calculate Percentages
    const currentPos = Math.min(100, Math.max(0, ((currentTimestamp - start) / totalDuration) * 100))

    let submissionWidth, votingWidth, resultWidth

    if (isVotingEnabled && votingStart && votingEnd) {
      submissionWidth = Math.max(0, ((votingStart - start) / totalDuration) * 100)
      votingWidth = Math.max(0, ((votingEnd - votingStart) / totalDuration) * 100)
      resultWidth = Math.max(0, ((end - votingEnd) / totalDuration) * 100)
    } else {
      // If voting is disabled, Submission takes 100% effectively
      submissionWidth = 100
      votingWidth = 0
      resultWidth = 0
    }

    // Remaining Days Calculation
    let remainingDays = 0
    let phaseLabel = ''

    if (currentTimestamp < start) {
      remainingDays = Math.ceil((start - currentTimestamp) / 86400000)
      phaseLabel = `公開まで${remainingDays}日`
    } else if (currentTimestamp > end) {
      phaseLabel = '終了'
    } else {
      remainingDays = Math.ceil((end - currentTimestamp) / 86400000)
      phaseLabel = `終了まで${remainingDays}日`

      if (isVotingEnabled && votingStart && votingEnd) {
        if (currentTimestamp >= votingStart && currentTimestamp <= votingEnd) {
          const voteDays = Math.ceil((votingEnd - currentTimestamp) / 86400000)
          phaseLabel = `投票終了まで${voteDays}日`
        } else if (currentTimestamp < votingStart) {
          const subDays = Math.ceil((votingStart - currentTimestamp) / 86400000)
          phaseLabel = `投票開始まで${subDays}日`
        }
      }
    }

    return { currentPos, submissionWidth, votingWidth, resultWidth, phaseLabel, isVotingEnabled, votingStart, votingEnd }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filter & Tools */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">ステータス:</span>
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value || 'all'}
                onClick={() => {
                  setStatusFilter(option.value)
                  setCurrentPage(1) // Reset page
                }}
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset page
              }}
              placeholder="コンテスト名・テーマで検索..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

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
        </div>
      </div>

      {/* List View Only */}
      <div className="flex flex-col gap-6">
        {paginatedContests.length > 0 ? (
          paginatedContests.map((contest) => {
            const tl = getTimelineData(contest, now)
            const computedStatus = calculateStatus(contest, now)

            return (
              <div
                key={contest.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">

                  {/* Part 1: Info */}
                  <div className="md:w-1/3 min-w-[280px]">
                    <div className="flex gap-4 mb-4">
                      {contest.image_url && (
                        <div className="flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden w-24 h-24">
                          <img
                            src={contest.image_url}
                            alt={contest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          {getStatusBadge(computedStatus)}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {contest.emoji && (
                            <span className="text-xl">{contest.emoji}</span>
                          )}
                          <h2 className="font-bold text-gray-800 text-lg">{contest.name}</h2>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{contest.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">
                      {/* Basic Period Info just in case */}
                      <div className="flex items-center gap-1.5 opacity-70">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>全体: {formatDate(contest.start_date)} - {formatDate(contest.end_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Timeline */}
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">応募期間</span>
                          <span className="font-bold text-gray-700">{formatDate(contest.start_date)} - {tl?.votingStart ? formatDate(new Date(tl.votingStart).toISOString()) : formatDate(contest.end_date)}</span>
                        </div>
                        {tl?.isVotingEnabled && tl?.votingStart && tl?.votingEnd && (
                          <>
                            <span className="text-gray-300">→</span>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-400">投票期間</span>
                              <span className="font-bold text-gray-700">{formatDate(new Date(tl.votingStart).toISOString())} - {formatDate(new Date(tl.votingEnd).toISOString())}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleEdit(contest)}
                        className="text-sm text-brand hover:underline font-medium"
                      >
                        編集する
                      </button>
                    </div>

                    {/* Timeline Bar */}
                    {tl && (
                      <div className="relative pt-6 pb-2">
                        <div className="h-3 bg-gray-100 rounded-full w-full relative overflow-hidden">
                          {/* Submission */}
                          <div
                            className="absolute left-0 h-full bg-green-500/30"
                            style={{ width: `${tl.submissionWidth}%` }}
                            title="応募期間"
                          />
                          {/* Voting */}
                          {tl.isVotingEnabled && (
                            <div
                              className="absolute h-full bg-blue-500/30"
                              style={{ left: `${tl.submissionWidth}%`, width: `${tl.votingWidth}%` }}
                              title="投票期間"
                            />
                          )}
                          {/* Result */}
                          {tl.isVotingEnabled && (
                            <div
                              className="absolute h-full bg-gray-500/20"
                              style={{ left: `${tl.submissionWidth + tl.votingWidth}%`, width: `${tl.resultWidth}%` }}
                              title="結果発表"
                            />
                          )}
                        </div>

                        {/* Current Position Marker */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand border-2 border-white rounded-full shadow z-10 transition-all duration-500"
                          style={{ left: `calc(${tl.currentPos}% - 0.5rem)` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-sm font-bold">
                            {tl.phaseLabel}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand"></div>
                          </div>
                        </div>

                        {/* Labels under bar */}
                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 relative">
                          {/* Start */}
                          <span>{formatDate(contest.start_date)}</span>

                          {/* Middle labels could be added if space permits, but might overlap */}

                          {/* End */}
                          <span>{formatDate(contest.end_date)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer / Categories */}
                {contest.categories && contest.categories.length > 0 && (
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {contest.categories.slice(0, 10).map((category) => (
                      <span
                        key={category.id}
                        className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs border border-gray-200"
                      >
                        # {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="col-span-full bg-white rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">コンテストがありません</h3>
            <p className="text-gray-500">条件に一致するコンテストが見つかりませんでした</p>
          </div>
        )}
      </div>

      {/* Control Footer */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="px-4 text-sm font-bold text-gray-700">
              {safeCurrentPage} / {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
      <ContestForm isOpen={isFormOpen} onClose={handleClose} contest={editingContest} />
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { Trophy, Medal, Award, Heart, ChevronDown, CheckCircle, LayoutGrid, List, Filter, ArrowDownNarrowWide, ZoomIn, X, Loader2 } from 'lucide-react'
import { updateEntryAward, type AwardLabel } from '@/app/actions/admin-ranking'

interface Contest {
  id: string
  name: string
  theme: string | null
  status: string
}

interface Entry {
  id: string
  media_url: string
  username: string
  like_count: number
  caption: string | null
  award_label: string | null
}

interface RankingClientProps {
  contests: Contest[]
  entries: Entry[]
  selectedContestId: string | undefined
}

type FilterType = 'all' | 'winner' | 'unselected'
type SortType = 'likes' | 'date' // date is not strictly available in this subset, maybe use default order (which is likes or award)

export function RankingClient({ contests, entries: initialEntries, selectedContestId }: RankingClientProps) {
  const router = useRouter()
  const [entries, setEntries] = useState(initialEntries)
  const [filter, setFilter] = useState<FilterType>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // プロップスが変更されたらステートを同期する
  useEffect(() => {
    setEntries(initialEntries)
  }, [initialEntries])

  // 統計情報
  const stats = useMemo(() => {
    return {
      gold: entries.filter(e => e.award_label === 'gold').length,
      silver: entries.filter(e => e.award_label === 'silver').length,
      bronze: entries.filter(e => e.award_label === 'bronze').length,
    }
  }, [entries])

  const handleContestChange = (contestId: string) => {
    router.push(`/admin/ranking?contest=${contestId}`)
  }

  const handleUpdateAward = async (entryId: string, award: AwardLabel) => {
    if (updatingId) return // Prevent double click

    // Optimistic Update
    setUpdatingId(entryId)
    const oldEntries = [...entries]

    setEntries(prev => prev.map(e => {
      if (e.id === entryId) {
        return { ...e, award_label: award }
      }
      return e
    }))

    const result = await updateEntryAward(entryId, award)

    if (!result.success) {
      // Revert on error
      setEntries(oldEntries)
      alert(`更新に失敗しました: ${result.error}`)
    }
    setUpdatingId(null)
  }

  const filteredEntries = useMemo(() => {
    let result = [...entries]

    // Filter
    if (filter === 'winner') {
      result = result.filter(e => e.award_label !== null)
    } else if (filter === 'unselected') {
      result = result.filter(e => e.award_label === null)
    }

    // Sort (Ranking Page default is likes desc from server, but we might want to group awards)
    // Client-side sort: Gold > Silver > Bronze > Likes
    result.sort((a, b) => {
      const awardOrder = { gold: 3, silver: 2, bronze: 1, null: 0 }
      const awardA = awardOrder[(a.award_label as keyof typeof awardOrder) || 'null']
      const awardB = awardOrder[(b.award_label as keyof typeof awardOrder) || 'null']

      if (awardA !== awardB) {
        return awardB - awardA // Higher award first
      }
      return b.like_count - a.like_count // Then likes
    })

    return result
  }, [entries, filter])

  const selectedContest = contests.find(c => c.id === selectedContestId)

  return (
    <div className="space-y-6 pb-20">
      {/* Header Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4">
          <div className="relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400">コンテスト</label>
            <select
              value={selectedContestId || ''}
              onChange={(e) => handleContestChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand w-64 cursor-pointer hover:border-gray-300"
            >
              {contests.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.status === 'active' ? '(開催中)' : c.status === 'ended' ? '(終了)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              全て
            </button>
            <button
              onClick={() => setFilter('winner')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'winner' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              入賞のみ
            </button>
            <button
              onClick={() => setFilter('unselected')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'unselected' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              未選定
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs font-bold text-gray-500">現在の選定数:</span>
          <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm ring-1 ring-yellow-400/50"></div>
            金 {stats.gold}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-500 ml-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 shadow-sm ring-1 ring-gray-400/50"></div>
            銀 {stats.silver}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 ml-2">
            <div className="w-2 h-2 rounded-full bg-amber-600 shadow-sm ring-1 ring-amber-600/50"></div>
            銅 {stats.bronze}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredEntries.map((entry) => {
          const isWinner = !!entry.award_label
          const isGold = entry.award_label === 'gold'
          const isSilver = entry.award_label === 'silver'
          const isBronze = entry.award_label === 'bronze'
          const isUpdating = updatingId === entry.id

          return (
            <div
              key={entry.id}
              className={`group relative aspect-[4/5] bg-white rounded-2xl overflow-hidden transition-all duration-300
                ${isGold ? 'shadow-lg border-2 border-yellow-400 ring-4 ring-yellow-400/20 transform hover:-translate-y-1' : ''}
                ${isSilver ? 'shadow-md border-2 border-gray-300 ring-2 ring-gray-300/30 transform hover:-translate-y-1' : ''}
                ${isBronze ? 'shadow-md border-2 border-amber-600 ring-2 ring-amber-600/30 transform hover:-translate-y-1' : ''}
                ${!isWinner ? 'shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02]' : ''}
              `}
            >
              {/* Updating overlay */}
              {isUpdating && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brand animate-spin" />
                </div>
              )}

              {/* Badges */}
              {isWinner && (
                <div className="absolute top-0 right-0 z-20">
                  <div className={`
                     text-xs font-black px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1
                     ${isGold ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900' : ''}
                     ${isSilver ? 'bg-gradient-to-br from-gray-100 to-gray-400 text-gray-800' : ''}
                     ${isBronze ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' : ''}
                   `}>
                    {isGold && <><Trophy className="w-3 h-3 fill-current" /> 金賞</>}
                    {isSilver && <><Medal className="w-3 h-3 fill-current" /> 銀賞</>}
                    {isBronze && <><Award className="w-3 h-3" /> 銅賞</>}
                  </div>
                </div>
              )}

              <Image
                src={entry.media_url}
                alt={entry.username}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />

              {/* Info Overlay (Always visible for winners, hover for others) */}
              <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${!isWinner ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                <p className="text-white font-bold text-sm truncate">@{entry.username}</p>
                <div className="flex items-center gap-1 text-pink-400 text-xs font-bold mt-1">
                  <Heart className="w-3 h-3 fill-current" /> {entry.like_count}
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                <div className="text-center">
                  <p className="text-gray-800 font-bold text-xs mb-3">
                    {isWinner ? '賞を変更する' : '賞を選択'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleUpdateAward(entry.id, 'gold')}
                      className={`group/btn flex flex-col items-center gap-1 transform hover:-translate-y-1 transition-transform ${isGold ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-white shadow-md flex items-center justify-center ring-2 ring-transparent group-hover/btn:ring-yellow-400/50">
                        <Trophy className="w-4 h-4 text-yellow-900 fill-yellow-900" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 group-hover/btn:text-yellow-600">金賞</span>
                    </button>

                    <button
                      onClick={() => handleUpdateAward(entry.id, 'silver')}
                      className={`group/btn flex flex-col items-center gap-1 transform hover:-translate-y-1 transition-transform ${isSilver ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-white shadow-md flex items-center justify-center ring-2 ring-transparent group-hover/btn:ring-gray-400/50">
                        <Medal className="w-4 h-4 text-gray-700 fill-gray-700" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 group-hover/btn:text-gray-600">銀賞</span>
                    </button>

                    <button
                      onClick={() => handleUpdateAward(entry.id, 'bronze')}
                      className={`group/btn flex flex-col items-center gap-1 transform hover:-translate-y-1 transition-transform ${isBronze ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-white shadow-md flex items-center justify-center ring-2 ring-transparent group-hover/btn:ring-amber-600/50">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 group-hover/btn:text-amber-700">銅賞</span>
                    </button>
                  </div>

                  {isWinner && (
                    <button
                      onClick={() => handleUpdateAward(entry.id, null)}
                      className="mt-4 px-3 py-1.5 text-gray-400 hover:text-red-500 text-xs font-bold border border-transparent hover:border-red-100 hover:bg-red-50 rounded-full transition-all flex items-center gap-1 mx-auto"
                    >
                      <X className="w-3 h-3" /> 入賞を取り消す
                    </button>
                  )}
                </div>
              </div>

            </div>
          )
        })}

        {filteredEntries.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>条件に一致する応募がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}

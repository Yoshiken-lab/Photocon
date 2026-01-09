'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trophy, Medal, Award, Heart, ChevronDown } from 'lucide-react'

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
}

interface RankingClientProps {
  contests: Contest[]
  entries: Entry[]
  selectedContestId: string | undefined
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />
    default:
      return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>
  }
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
    case 2:
      return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
    case 3:
      return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
    default:
      return 'bg-white border-gray-100'
  }
}

export function RankingClient({ contests, entries, selectedContestId }: RankingClientProps) {
  const router = useRouter()

  const handleContestChange = (contestId: string) => {
    router.push(`/admin/ranking?contest=${contestId}`)
  }

  const selectedContest = contests.find(c => c.id === selectedContestId)

  return (
    <div className="space-y-6">
      {/* コンテスト選択 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-600">コンテスト:</label>
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedContestId || ''}
              onChange={(e) => handleContestChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            >
              {contests.map((contest) => (
                <option key={contest.id} value={contest.id}>
                  {contest.name}
                  {contest.status === 'active' && ' (開催中)'}
                  {contest.status === 'voting' && ' (投票中)'}
                  {contest.status === 'ended' && ' (終了)'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {selectedContest?.theme && (
          <p className="text-sm text-gray-500 mt-2">
            テーマ: 「{selectedContest.theme}」
          </p>
        )}
      </div>

      {/* ランキング表示 */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          {/* トップ3 */}
          <div className="grid md:grid-cols-3 gap-4">
            {entries.slice(0, 3).map((entry, index) => (
              <div
                key={entry.id}
                className={`rounded-2xl p-4 border-2 ${getRankStyle(index + 1)} ${index === 0 ? 'md:col-span-3 md:flex md:items-center md:gap-6' : ''}`}
              >
                <div className={`relative ${index === 0 ? 'md:w-48 md:h-48' : 'w-full'} aspect-square rounded-xl overflow-hidden mb-4 ${index === 0 ? 'md:mb-0' : ''}`}>
                  <Image
                    src={entry.media_url}
                    alt={`${entry.username}の応募写真`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {getRankIcon(index + 1)}
                  </div>
                </div>

                <div className={index === 0 ? 'flex-1' : ''}>
                  <div className="flex items-center gap-2 mb-2">
                    {index === 0 && <span className="text-lg font-bold text-yellow-600">1位</span>}
                    {index === 1 && <span className="text-lg font-bold text-gray-500">2位</span>}
                    {index === 2 && <span className="text-lg font-bold text-amber-600">3位</span>}
                    <span className="font-medium text-gray-800">@{entry.username}</span>
                  </div>

                  <div className="flex items-center gap-1 text-brand">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-bold text-lg">{entry.like_count.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">票</span>
                  </div>

                  {entry.caption && index === 0 && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{entry.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 4位以下 */}
          {entries.length > 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">4位以下</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {entries.slice(3).map((entry, index) => (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-8 text-center">
                      {getRankIcon(index + 4)}
                    </div>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={entry.media_url}
                        alt={`${entry.username}の応募写真`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">@{entry.username}</p>
                    </div>
                    <div className="flex items-center gap-1 text-brand">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="font-bold">{entry.like_count.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ランキングデータがありません</h2>
          <p className="text-gray-500">このコンテストにはまだ承認済みの応募がありません</p>
        </div>
      )}
    </div>
  )
}

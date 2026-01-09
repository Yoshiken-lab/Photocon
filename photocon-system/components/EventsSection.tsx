'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, CalendarDays, Users, Clock, Camera, Archive, ArrowRight, ImageIcon, Heart, Images, Sparkles } from 'lucide-react'

type Contest = {
  id: string
  name: string
  description: string | null
  theme: string | null
  emoji: string | null
  image_url: string | null
  start_date: string
  end_date: string
  status: string
  entry_count?: number
  total_votes?: number
}

type RecentApplicant = {
  id: string
  username: string
  instagram_timestamp: string
  contest_theme: string | null
}

type Props = {
  activeContests: Contest[]
  endedContests: Contest[]
  recentApplicants: RecentApplicant[]
  totalApplicants: number
}

// 日付フォーマット
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatMonth(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

// 残り日数計算
function getDaysLeft(endDateStr: string) {
  const now = new Date()
  const endDate = new Date(endDateStr)
  const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

// 相対時間を計算する関数
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'たった今'
  if (diffMinutes < 60) return `${diffMinutes}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
}

// ランダムなパステルカラーを生成
function getAvatarColor(username: string): string {
  const colors = [
    'bg-pink-100 text-pink-600',
    'bg-purple-100 text-purple-600',
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-yellow-100 text-yellow-600',
    'bg-orange-100 text-orange-600',
    'bg-red-100 text-red-600',
    'bg-indigo-100 text-indigo-600',
  ]
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function EventsSection({ activeContests, endedContests, recentApplicants, totalApplicants }: Props) {

  return (
    <section id="events" className="py-20 px-4 bg-white scroll-mt-32">
      <div className="max-w-6xl mx-auto">

        {/* 開催中イベント */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-maru">開催中のイベント</h2>
          </div>

          <div className="space-y-6">
            {activeContests.length > 0 ? (
              activeContests.map((contest) => {
                const daysLeft = getDaysLeft(contest.end_date)
                return (
                  <div
                    key={contest.id}
                    className="relative bg-gradient-to-br from-brand-50 to-white rounded-[2rem] p-6 md:p-10 shadow-xl border-2 border-brand-100 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full">
                          <Calendar className="w-3 h-3" />
                          <span>募集中</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 font-maru">
                          {contest.emoji && <span className="mr-2">{contest.emoji}</span>}
                          {contest.name}
                        </h3>
                        {contest.theme && (
                          <p className="text-gray-500 text-sm md:text-base">テーマ：「{contest.theme}」</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-brand" />
                            <span>{formatDate(contest.start_date)} 〜 {formatDate(contest.end_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-brand" />
                            <span>応募 {contest.entry_count || 0}件</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-brand" />
                            <span>残り {daysLeft}日</span>
                          </div>
                        </div>
                        <div className="pt-4 flex flex-wrap gap-3">
                          <Link
                            href="/submit"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold transition-all shadow-lg shadow-brand/30 hover:-translate-y-1"
                          >
                            <Camera className="w-5 h-5" />
                            <span>今すぐ応募する</span>
                          </Link>
                          <Link
                            href={`/contests/${contest.id}/gallery`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-brand-100 hover:border-brand hover:text-brand text-gray-600 rounded-full font-bold transition-all"
                          >
                            <Images className="w-5 h-5" />
                            <span>応募作品を見る</span>
                          </Link>
                        </div>
                      </div>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                        {contest.image_url ? (
                          <Image
                            src={contest.image_url}
                            alt={contest.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon className="w-16 h-16" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 bg-brand-50 rounded-2xl text-gray-500">
                現在開催中のイベントはありません
              </div>
            )}
          </div>
        </div>

        {/* 最近の応募者リスト */}
        {recentApplicants.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-br from-brand-50 to-white rounded-2xl p-6 md:p-8 border border-brand-100">
              {/* ヘッダー */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <Sparkles className="w-3 h-3" />
                    リアルタイム
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 font-maru">最近の応募</h3>
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-brand font-bold">{totalApplicants}名</span> が参加中
                </p>
              </div>

              {/* 応募者リスト */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="flex items-center gap-4 p-4 hover:bg-brand-50/30 transition-colors"
                    >
                      {/* アバター */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${getAvatarColor(applicant.username)}`}>
                        {applicant.username.charAt(0).toUpperCase()}
                      </div>

                      {/* 情報 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-sm truncate">
                            {applicant.username}
                          </span>
                          <span className="text-xs text-gray-400">さんが応募</span>
                        </div>
                      </div>

                      {/* 時間 */}
                      <div className="text-xs text-gray-400 flex-shrink-0">
                        {getRelativeTime(applicant.instagram_timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 過去のイベント */}
        {endedContests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 font-maru flex items-center gap-2">
                <Archive className="w-5 h-5 text-gray-400" />
                過去のイベント
              </h3>
              <Link href="/past-contests" className="text-sm text-brand font-bold hover:underline flex items-center gap-1">
                すべて見る <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {endedContests.map((contest) => (
                <Link key={contest.id} href={`/contests/${contest.id}/gallery`} className="flex-shrink-0 w-64 snap-start">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 h-full">
                    <div className="relative aspect-[3/2] bg-gray-100">
                      {contest.image_url ? (
                        <Image
                          src={contest.image_url}
                          alt={contest.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-gray-800/70 text-white text-xs font-bold px-2 py-1 rounded-full">終了</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400">{formatMonth(contest.end_date)}</p>
                      <h4 className="font-bold text-gray-800 font-maru mt-1">
                        {contest.emoji && <span className="mr-1">{contest.emoji}</span>}
                        {contest.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> {contest.entry_count || 0}件
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {(contest.total_votes || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-brand font-bold flex items-center gap-1">
                        応募作品を見る <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

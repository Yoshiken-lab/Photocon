'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, CalendarDays, CalendarRange, Users, Clock, Camera, ChevronDown, Archive, ArrowRight, ImageIcon, Heart, Images } from 'lucide-react'

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

type Props = {
  activeContests: Contest[]
  upcomingContests: Contest[]
  endedContests: Contest[]
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

export function EventsSection({ activeContests, upcomingContests, endedContests }: Props) {
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false)

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

        {/* 今後の予定 */}
        {upcomingContests.length > 0 && (
          <div className="mb-16">
            <button
              onClick={() => setIsUpcomingOpen(!isUpcomingOpen)}
              className="w-full flex items-center justify-between p-4 bg-brand-50 hover:bg-brand-100 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand shadow-sm">
                  <CalendarRange className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800 font-maru">今後の予定</h3>
                  <p className="text-xs text-gray-500">{upcomingContests.length}件のイベントが予定されています</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-brand font-bold text-sm">
                <span>{isUpcomingOpen ? '閉じる' : '開く'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isUpcomingOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isUpcomingOpen && (
              <div className="mt-4">
                {/* PC: 横タイムライン */}
                <div className="hidden md:block bg-white rounded-2xl p-8 shadow-lg border border-brand-50">
                  <div className="relative">
                    <div className="absolute top-6 left-0 right-0 h-1 bg-brand-100 rounded-full"></div>
                    <div className="relative flex justify-between">
                      {upcomingContests.map((contest) => (
                        <div key={contest.id} className="flex flex-col items-center flex-1">
                          <div className="w-12 h-12 bg-white border-4 border-brand-200 rounded-full flex items-center justify-center text-2xl shadow-sm z-10">
                            <span>{contest.emoji || '📅'}</span>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-xs text-brand font-bold">{formatMonth(contest.start_date)}</p>
                            <h4 className="font-bold text-gray-800 font-maru mt-1">{contest.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(contest.start_date)} 〜 {formatDate(contest.end_date)}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                              Coming Soon
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* スマホ: 縦タイムライン */}
                <div className="md:hidden bg-white rounded-2xl p-6 shadow-lg border border-brand-50">
                  <div className="relative pl-8">
                    <div className="absolute top-0 bottom-0 left-[14px] w-1 bg-brand-100 rounded-full"></div>
                    {upcomingContests.map((contest, index) => (
                      <div key={contest.id} className={`relative ${index < upcomingContests.length - 1 ? 'pb-8' : ''}`}>
                        <div className="absolute left-[-22px] w-8 h-8 bg-white border-4 border-brand-200 rounded-full flex items-center justify-center text-lg z-10">
                          <span>{contest.emoji || '📅'}</span>
                        </div>
                        <div className="bg-brand-50 rounded-xl p-4">
                          <p className="text-xs text-brand font-bold">{formatMonth(contest.start_date)}</p>
                          <h4 className="font-bold text-gray-800 font-maru mt-1">{contest.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(contest.start_date)} 〜 {formatDate(contest.end_date)}
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 bg-white text-gray-500 text-xs rounded-full">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

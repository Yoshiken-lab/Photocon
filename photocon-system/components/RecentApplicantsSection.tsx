'use client'

import Link from 'next/link'
import { Users, Camera, Sparkles } from 'lucide-react'

interface RecentApplicant {
  id: string
  username: string
  instagram_timestamp: string
  contest_theme: string | null
}

interface RecentApplicantsSectionProps {
  applicants: RecentApplicant[]
  totalCount: number
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
  // usernameからハッシュ値を生成して色を決定
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function RecentApplicantsSection({ applicants, totalCount }: RecentApplicantsSectionProps) {
  if (applicants.length === 0) return null

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-brand-50/50">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            リアルタイム更新中
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-maru mb-3">
            みんなの応募が続々届いています！
          </h2>
          <p className="text-gray-500 text-sm">
            すでに <span className="text-brand font-bold text-lg">{totalCount}名</span> の方が参加中
          </p>
        </div>

        {/* 応募者リスト */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="divide-y divide-gray-100">
            {applicants.map((applicant, index) => (
              <div
                key={applicant.id}
                className="flex items-center gap-4 p-4 hover:bg-brand-50/30 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* アバター */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${getAvatarColor(applicant.username)}`}>
                  {applicant.username.charAt(0).toUpperCase()}
                </div>

                {/* 情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 truncate">
                      {applicant.username}
                    </span>
                    <span className="text-xs text-gray-400">さんが応募しました</span>
                  </div>
                  {applicant.contest_theme && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      テーマ: {applicant.contest_theme}
                    </div>
                  )}
                </div>

                {/* 時間 */}
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {getRelativeTime(applicant.instagram_timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold transition-all shadow-lg shadow-brand/20 hover:-translate-y-1"
          >
            <Camera className="w-5 h-5" />
            あなたも参加する
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            <Users className="w-3 h-3 inline mr-1" />
            毎日たくさんの方が参加しています
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { Calendar, Hash, Users, Image } from 'lucide-react'
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
  status: string
  categories: { id: string; name: string; hashtag: string }[] | null
}

type Props = {
  contests: Contest[] | null
}

export default function ContestsClient({ contests }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">コンテスト管理</h1>
          <p className="text-gray-500 mt-1">コンテストの作成・編集</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
        >
          新規作成
        </button>
      </div>

      <div className="grid gap-6">
        {contests?.map((contest) => (
          <div
            key={contest.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex gap-6">
              {contest.image_url && (
                <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={contest.image_url}
                    alt={contest.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {contest.emoji && (
                        <span className="text-2xl">{contest.emoji}</span>
                      )}
                      <h2 className="text-lg font-bold text-gray-800">{contest.name}</h2>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          contest.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : contest.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : contest.status === 'upcoming'
                            ? 'bg-yellow-100 text-yellow-800'
                            : contest.status === 'voting'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {contest.status === 'active' ? '開催中' :
                         contest.status === 'draft' ? '下書き' :
                         contest.status === 'upcoming' ? '公開予定' :
                         contest.status === 'voting' ? '投票中' : '終了'}
                      </span>
                    </div>

                    {contest.theme && (
                      <p className="text-brand text-sm mb-2">テーマ：「{contest.theme}」</p>
                    )}

                    <p className="text-gray-500 text-sm mb-4">{contest.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(contest.start_date).toLocaleDateString('ja-JP')} 〜{' '}
                          {new Date(contest.end_date).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      {contest.hashtags && contest.hashtags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          <span>{contest.hashtags.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{contest.categories?.length || 0} 部門</span>
                      </div>
                    </div>
                  </div>

                  <button className="text-sm text-brand hover:underline">編集</button>
                </div>
              </div>
            </div>

            {contest.categories && contest.categories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">部門</p>
                <div className="flex flex-wrap gap-2">
                  {contest.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 bg-brand-50 text-brand rounded-full text-sm"
                    >
                      {category.name} ({category.hashtag})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {(!contests || contests.length === 0) && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            コンテストがありません
          </div>
        )}
      </div>

      <ContestForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}

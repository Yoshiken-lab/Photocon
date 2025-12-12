'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, X, ExternalLink, Loader2 } from 'lucide-react'
import type { Entry } from '@/types/entry'

interface Props {
  entries: Entry[]
  onStatusChange: (id: string, status: 'approved' | 'rejected' | 'pending') => Promise<void>
}

export function EntryTable({ entries, onStatusChange }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setUpdating(id)
    await onStatusChange(id, status)
    setUpdating(null)
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      winner: 'bg-purple-100 text-purple-800',
    }
    const labels: Record<string, string> = {
      pending: '審査中',
      approved: '承認済',
      rejected: '却下',
      winner: '入賞',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center text-gray-500">
        応募作品がありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">画像</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ユーザー</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">部門</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">いいね</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ステータス</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={entry.media_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={entry.instagram_permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-brand hover:underline font-medium"
                  >
                    @{entry.username}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {entry.categories?.name || '-'}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-800">
                  {entry.like_count}
                </td>
                <td className="px-4 py-3">
                  {statusBadge(entry.status)}
                </td>
                <td className="px-4 py-3">
                  {entry.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(entry.id, 'approved')}
                        disabled={updating === entry.id}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        title="承認"
                      >
                        {updating === entry.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleStatusChange(entry.id, 'rejected')}
                        disabled={updating === entry.id}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        title="却下"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {entry.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(entry.id, 'pending')}
                      disabled={updating === entry.id}
                      className="text-xs text-gray-500 hover:text-brand"
                    >
                      再審査
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

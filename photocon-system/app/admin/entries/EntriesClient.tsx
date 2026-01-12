'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Search, Filter, ChevronDown, Check, X, Clock, Images, ImageOff } from 'lucide-react'
import { updateEntryStatus } from '@/app/actions/entries'

// 画像読み込みエラー時のフォールバックコンポーネント
function ImageWithFallback({ src, alt, ...props }: { src: string; alt: string; width: number; height: number; className?: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <ImageOff className="w-5 h-5 text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      {...props}
      onError={() => setHasError(true)}
    />
  )
}

interface Entry {
  id: string
  media_url: string
  username: string
  caption: string | null
  status: string
  collected_at: string
  categories: { name: string } | null
  contests: { id: string; name: string } | null
}

interface Contest {
  id: string
  name: string
  status: string
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface Props {
  entries: Entry[]
  contests: Contest[]
  currentStatus?: string
  currentContest?: string
  currentSearch?: string
  stats: Stats
}

export function EntriesClient({ entries, contests, currentStatus, currentContest, currentSearch, stats }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchValue, setSearchValue] = useState(currentSearch || '')

  // URLパラメータを更新
  const updateParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/entries?${params.toString()}`)
  }

  // 検索実行
  const handleSearch = () => {
    updateParams('search', searchValue || undefined)
  }

  // 検索クリア
  const handleClearSearch = () => {
    setSearchValue('')
    updateParams('search', undefined)
  }

  // ステータス変更
  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await updateEntryStatus(id, status)
      router.refresh()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  // 一括選択
  const handleSelectAll = () => {
    if (selectedIds.length === entries.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(entries.map(e => e.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // 一括操作
  const handleBulkAction = async (status: 'approved' | 'rejected') => {
    if (selectedIds.length === 0 || isProcessing) return

    setIsProcessing(true)

    try {
      for (const id of selectedIds) {
        await updateEntryStatus(id, status)
      }
      setSelectedIds([])
    } catch (error) {
      console.error('Failed to bulk update status:', error)
    } finally {
      setIsProcessing(false)
      router.refresh()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">審査中</span>
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">承認済</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">却下</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* フィルター・検索エリア */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
        {/* 上段: フィルター */}
        <div className="flex flex-wrap items-center gap-4">
          {/* ステータスフィルタ */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">ステータス:</span>
            <div className="flex gap-1">
              {[
                { value: undefined, label: 'すべて', count: stats.total },
                { value: 'pending', label: '審査中', count: stats.pending, color: 'yellow' },
                { value: 'approved', label: '承認済', count: stats.approved, color: 'green' },
                { value: 'rejected', label: '却下', count: stats.rejected, color: 'red' },
              ].map((option) => (
                <button
                  key={option.value || 'all'}
                  onClick={() => updateParams('status', option.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    currentStatus === option.value
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>

          {/* コンテストフィルタ */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">コンテスト:</span>
            <div className="relative">
              <select
                value={currentContest || ''}
                onChange={(e) => updateParams('contest', e.target.value || undefined)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="">すべて</option>
                {contests.map((contest) => (
                  <option key={contest.id} value={contest.id}>
                    {contest.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 下段: 検索 */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ユーザー名で検索..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            検索
          </button>
          {currentSearch && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/* 一括操作バー */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-50 rounded-xl p-4 flex items-center justify-between border border-brand-100">
          <span className="text-sm font-medium text-brand">
            {selectedIds.length}件を選択中
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('approved')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              一括承認
            </button>
            <button
              onClick={() => handleBulkAction('rejected')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              一括却下
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              選択解除
            </button>
          </div>
        </div>
      )}

      {/* エントリーテーブル */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {entries.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === entries.length && entries.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">写真</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ユーザー</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">コンテスト</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ステータス</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">応募日</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(entry.id)}
                      onChange={() => handleSelectOne(entry.id)}
                      className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={entry.media_url}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">@{entry.username}</p>
                    {entry.categories && (
                      <p className="text-xs text-gray-500">{entry.categories.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{entry.contests?.name || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-500">
                      {new Date(entry.collected_at).toLocaleDateString('ja-JP')}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {entry.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(entry.id, 'approved')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          承認
                        </button>
                      )}
                      {entry.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(entry.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          却下
                        </button>
                      )}
                      {entry.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(entry.id, 'pending')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          保留
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Images className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">応募がありません</h3>
            <p className="text-gray-500">条件に一致する応募が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}

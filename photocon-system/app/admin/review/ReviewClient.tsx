'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, X, ChevronLeft, ChevronRight, Clock, User, Tag, Calendar, ExternalLink, ImageOff } from 'lucide-react'
import { updateEntryStatus } from '@/app/actions/entries'
import { useRouter } from 'next/navigation'

// 画像読み込みエラー時のフォールバックコンポーネント
function ImageWithFallback({ src, alt, className }: { src: string; alt: string; fill?: boolean; className?: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ImageOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">画像を読み込めませんでした</p>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

interface Entry {
  id: string
  media_url: string
  username: string
  caption: string | null
  instagram_permalink: string | null
  collected_at: string
  contests: { name: string; theme: string | null } | null
  categories: { name: string } | null
}

interface ReviewClientProps {
  entries: Entry[]
}

export function ReviewClient({ entries }: ReviewClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  // インデックスが範囲外になった場合は調整
  useEffect(() => {
    if (currentIndex >= entries.length && entries.length > 0) {
      setCurrentIndex(entries.length - 1)
    }
  }, [entries.length, currentIndex])

  const currentEntry = entries[currentIndex]
  const totalEntries = entries.length

  const handleApprove = async () => {
    if (!currentEntry || isProcessing) return
    setIsProcessing(true)

    try {
      await updateEntryStatus(currentEntry.id, 'approved')
      router.refresh()
    } catch (error) {
      console.error('Failed to approve entry:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!currentEntry || isProcessing) return
    setIsProcessing(true)

    try {
      await updateEntryStatus(currentEntry.id, 'rejected')
      router.refresh()
    } catch (error) {
      console.error('Failed to reject entry:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < totalEntries - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // 審査待ちがない場合
  if (totalEntries === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">審査待ちはありません</h2>
        <p className="text-gray-500">すべての応募を審査済みです</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 進捗バー */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">審査進捗</span>
          <span className="text-sm font-bold text-gray-800">
            {currentIndex + 1} / {totalEntries}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalEntries) * 100}%` }}
          />
        </div>
      </div>

      {/* メイン審査エリア */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 画像表示 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={currentEntry.media_url}
              alt={`応募写真 by ${currentEntry.username}`}
              className="object-contain"
            />
          </div>

          {/* ナビゲーション */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">前へ</span>
            </button>

            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {totalEntries}
            </span>

            <button
              onClick={goToNext}
              disabled={currentIndex === totalEntries - 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-sm">次へ</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 詳細情報 & アクション */}
        <div className="space-y-6">
          {/* 応募情報 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800">応募情報</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">ユーザー名:</span>
                <span className="font-medium text-gray-800">@{currentEntry.username}</span>
              </div>

              {currentEntry.contests && (
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">コンテスト:</span>
                  <span className="font-medium text-gray-800">{currentEntry.contests.name}</span>
                </div>
              )}

              {currentEntry.categories && (
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">カテゴリ:</span>
                  <span className="font-medium text-gray-800">{currentEntry.categories.name}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">応募日時:</span>
                <span className="font-medium text-gray-800">
                  {new Date(currentEntry.collected_at).toLocaleString('ja-JP')}
                </span>
              </div>

              {currentEntry.instagram_permalink && (
                <a
                  href={currentEntry.instagram_permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-brand hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Instagramで見る
                </a>
              )}
            </div>

            {currentEntry.caption && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">キャプション:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentEntry.caption}</p>
              </div>
            )}
          </div>

          {/* アクションボタン */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">審査アクション</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                却下する
              </button>

              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                承認する
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              承認後は自動的に次の審査待ちに進みます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

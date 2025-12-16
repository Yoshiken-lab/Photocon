'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, X, Loader2 } from 'lucide-react'

interface Entry {
  id: string
  media_url: string
  username: string
  like_count: number | null
  caption: string | null
}

interface VoteModalProps {
  entry: Entry
  voteCount: number
  onClose: () => void
  onVoteUpdate: (entryId: string, newCount: number) => void
}

export function VoteModal({ entry, voteCount, onClose, onVoteUpdate }: VoteModalProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [currentVoteCount, setCurrentVoteCount] = useState(voteCount)

  // 投票状態をチェック
  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const res = await fetch(`/api/votes?entryId=${entry.id}`)
        if (res.ok) {
          const data = await res.json()
          setHasVoted(data.hasVoted)
          setCurrentVoteCount(data.voteCount)
        }
      } catch (error) {
        console.error('Failed to check vote status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkVoteStatus()
  }, [entry.id])

  const handleVote = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/votes', {
        method: hasVoted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: entry.id })
      })

      if (res.ok) {
        const data = await res.json()
        setHasVoted(!hasVoted)
        setCurrentVoteCount(data.voteCount)
        onVoteUpdate(entry.id, data.voteCount)
      } else {
        const error = await res.json()
        alert(error.error || '投票に失敗しました')
      }
    } catch (error) {
      console.error('Vote error:', error)
      alert('投票に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 写真 */}
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={entry.media_url}
            alt={entry.caption || ''}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 情報 */}
        <div className="p-6">
          {/* キャプション */}
          {entry.caption && (
            <p className="text-gray-700 mb-6 leading-relaxed">{entry.caption}</p>
          )}

          {/* 投票ボタン */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleVote}
              disabled={isLoading || isChecking}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                hasVoted
                  ? 'bg-brand text-white shadow-lg shadow-brand/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-brand hover:text-white hover:shadow-lg hover:shadow-brand/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading || isChecking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${hasVoted ? 'fill-white' : ''}`} />
              )}
              <span>{currentVoteCount}</span>
            </button>
            <span className="text-sm text-gray-500">
              {hasVoted ? '投票済み（クリックで取消）' : 'クリックで投票'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

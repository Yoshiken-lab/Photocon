'use client'

import { useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { useVote } from '@/hooks/useVote'

interface Props {
  entryId: string
  initialCount: number
}

export function VoteButton({ entryId, initialCount }: Props) {
  const { voteCount, hasVoted, isLoading, error, vote, checkVoteStatus } = useVote(entryId, initialCount)

  useEffect(() => {
    checkVoteStatus()
  }, [checkVoteStatus])

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation()
          vote()
        }}
        disabled={hasVoted || isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
          hasVoted
            ? 'bg-red-500 text-white cursor-default'
            : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500 shadow-md hover:shadow-lg'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${hasVoted ? 'fill-white' : ''}`} />
        )}
        <span>{voteCount}</span>
      </button>
      {hasVoted && (
        <span className="text-xs text-green-600 font-medium">投票済み</span>
      )}
      {error && !hasVoted && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}

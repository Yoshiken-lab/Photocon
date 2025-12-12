'use client'

import { useState, useCallback } from 'react'

interface VoteState {
  voteCount: number
  hasVoted: boolean
  isLoading: boolean
  error: string | null
}

export function useVote(entryId: string, initialCount: number = 0) {
  const [state, setState] = useState<VoteState>({
    voteCount: initialCount,
    hasVoted: false,
    isLoading: false,
    error: null,
  })

  const vote = useCallback(async () => {
    if (state.hasVoted || state.isLoading) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.error,
          hasVoted: data.error === '既に投票済みです',
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        voteCount: data.voteCount,
        hasVoted: true,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: '投票に失敗しました',
      }))
    }
  }, [entryId, state.hasVoted, state.isLoading])

  const checkVoteStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/votes?entryId=${entryId}`)
      const data = await res.json()

      if (res.ok) {
        setState((prev) => ({
          ...prev,
          voteCount: data.voteCount,
          hasVoted: data.hasVoted,
        }))
      }
    } catch (error) {
      console.error('Failed to check vote status:', error)
    }
  }, [entryId])

  return {
    ...state,
    vote,
    checkVoteStatus,
  }
}

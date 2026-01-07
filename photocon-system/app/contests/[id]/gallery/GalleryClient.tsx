'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Crown } from 'lucide-react'
import { VoteModal } from './VoteModal'

interface Entry {
  id: string
  media_url: string
  username: string
  like_count: number | null
  caption: string | null
}

interface GalleryClientProps {
  entries: Entry[]
  winners?: Entry[]
}

export function GalleryClient({ entries, winners = [] }: GalleryClientProps) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [entryVotes, setEntryVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    entries.forEach(entry => {
      initial[entry.id] = entry.like_count || 0
    })
    winners.forEach(entry => {
      initial[entry.id] = entry.like_count || 0
    })
    return initial
  })

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry)
  }

  const handleCloseModal = () => {
    setSelectedEntry(null)
  }

  const handleVoteUpdate = (entryId: string, newCount: number) => {
    setEntryVotes(prev => ({
      ...prev,
      [entryId]: newCount
    }))
  }

  return (
    <>
      {/* 入賞作品セクション */}
      {winners.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-maru">入賞作品</h2>
            <Crown className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
            {winners.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry)}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                className="group relative w-[45%] md:w-[280px] aspect-[4/5] bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none border-4 border-yellow-400"
              >
                <Image
                  src={entry.media_url}
                  alt={entry.caption || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 select-none"
                  draggable={false}
                />
                {/* 王冠バッジ */}
                <div className="absolute top-3 left-3 z-[3]">
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                    <Crown className="w-3 h-3" />
                    入賞
                  </div>
                </div>
                {/* 画像保護用の透明オーバーレイ */}
                <div className="absolute inset-0 z-[1]" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent pt-12 z-[2]">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm font-bold">@{entry.username}</span>
                    <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                      <Heart className="w-3 h-3 fill-white" /> {entryVotes[entry.id] || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 応募作品一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => handleEntryClick(entry)}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="group relative aspect-[4/5] bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 select-none"
          >
            <Image
              src={entry.media_url}
              alt={entry.caption || ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 select-none"
              draggable={false}
            />
            {/* 画像保護用の透明オーバーレイ */}
            <div className="absolute inset-0 z-[1]" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent pt-12 z-[2]">
              <div className="flex items-center justify-between text-white">
                <span className="text-xs font-bold">@{entry.username}</span>
                <div className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3 fill-white" /> {entryVotes[entry.id] || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEntry && (
        <VoteModal
          entry={selectedEntry}
          voteCount={entryVotes[selectedEntry.id] || 0}
          onClose={handleCloseModal}
          onVoteUpdate={handleVoteUpdate}
        />
      )}
    </>
  )
}

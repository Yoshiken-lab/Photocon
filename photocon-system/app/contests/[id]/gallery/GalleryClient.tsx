'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
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
}

export function GalleryClient({ entries }: GalleryClientProps) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [entryVotes, setEntryVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    entries.forEach(entry => {
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => handleEntryClick(entry)}
            className="group relative aspect-[4/5] bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Image
              src={entry.media_url}
              alt={entry.caption || ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent pt-12">
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

'use client'

import { useState } from 'react'
import { EntryCard } from './EntryCard'
import { LightboxModal } from './LightboxModal'
import type { PublicEntry } from '@/types/entry'

interface Props {
  entries: PublicEntry[]
}

export function GalleryGrid({ entries }: Props) {
  const [selectedEntry, setSelectedEntry] = useState<PublicEntry | null>(null)

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">まだ作品がありません</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}
      </div>

      <LightboxModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </>
  )
}

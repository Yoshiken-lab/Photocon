'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { PublicEntry } from '@/types/entry'

interface Props {
  entry: PublicEntry
  onClick: () => void
}

export function EntryCard({ entry, onClick }: Props) {
  return (
    <div
      className="group relative aspect-[4/5] bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <Image
        src={entry.media_url}
        alt={entry.caption || '応募作品'}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {entry.categories?.name && (
        <div className="absolute top-3 left-3">
          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            {entry.categories.name}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent pt-12">
        <div className="flex items-center justify-between text-white">
          <span className="text-xs font-bold">@{entry.username}</span>
          <div className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full">
            <Heart className="w-3 h-3 fill-white" /> {entry.like_count}
          </div>
        </div>
      </div>
    </div>
  )
}

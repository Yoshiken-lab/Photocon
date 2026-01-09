'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import { VoteButton } from './VoteButton'
import type { PublicEntry } from '@/types/entry'

interface Props {
  entry: PublicEntry | null
  onClose: () => void
}

export function LightboxModal({ entry, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (entry) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [entry, onClose])

  if (!entry) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* 画像 */}
        <div
          className="relative w-full md:w-2/3 aspect-square md:aspect-auto md:min-h-[500px] bg-gray-100 select-none"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          <Image
            src={entry.media_url}
            alt={entry.caption || '応募作品'}
            fill
            className="object-contain select-none"
            draggable={false}
          />
          {/* 画像保護用の透明オーバーレイ */}
          <div className="absolute inset-0 z-10" />
        </div>

        {/* 情報 */}
        <div className="w-full md:w-1/3 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand font-bold">
              {entry.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-800">@{entry.username}</p>
              {entry.categories?.name && (
                <span className="text-xs text-brand bg-brand-50 px-2 py-0.5 rounded-full">
                  {entry.categories.name}
                </span>
              )}
            </div>
          </div>

          {entry.caption && (
            <p className="text-gray-600 text-sm mb-4 flex-1">{entry.caption}</p>
          )}

          <div className="border-t pt-4 mt-auto space-y-4">
            <VoteButton entryId={entry.id} initialCount={entry.like_count ?? 0} />

            <div className="flex justify-center">
              <a
                href={entry.instagram_permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-brand hover:underline"
              >
                Instagram <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

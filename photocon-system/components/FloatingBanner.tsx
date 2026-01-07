'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, HelpCircle } from 'lucide-react'

export function FloatingBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* FAQボタン */}
      <Link
        href="#"
        className="flex items-center gap-1.5 bg-white border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-bold"
      >
        <HelpCircle className="w-4 h-4" />
        FAQ
      </Link>

      {/* メインバナー */}
      <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-brand overflow-hidden max-w-[320px]">
        {/* 閉じるボタン */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 left-2 z-10 w-6 h-6 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* バナー内容 */}
        <div className="pt-4 pb-5 px-4">
          {/* リンクボックス */}
          <Link
            href="https://www.schoolphoto.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-brand-50 border-2 border-brand-200 rounded-xl p-4 hover:bg-brand-100 transition-colors group"
          >
            <div className="text-center">
              <p className="text-brand font-black text-lg tracking-tight">お写真のご購入は</p>
              <p className="text-brand font-black text-lg tracking-tight">こちらから</p>
            </div>

            {/* スクールフォト！ロゴ */}
            <div className="flex justify-center mt-3">
              <Image
                src="/logo-bak.png"
                alt="スクールフォト!"
                width={140}
                height={35}
                className="h-7 w-auto group-hover:scale-105 transition-transform"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

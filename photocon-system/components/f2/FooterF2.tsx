'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function FooterF2() {
    return (
        <footer className="bg-white text-gray-500 py-12 border-t border-[#E75D2E]/20 text-sm relative z-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="スクールフォト!"
                        width={180}
                        height={40}
                        className="h-8 md:h-10 w-auto"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-bold">
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">よくある質問</Link>
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">利用規約</Link>
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">プライバシーポリシー</Link>
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">運営会社</Link>
                </div>

                <p className="text-xs text-gray-400 font-bold">&copy; 2025 スクールフォト!</p>
            </div>
        </footer>
    )
}

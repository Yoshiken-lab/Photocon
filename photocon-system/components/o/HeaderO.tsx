'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export const HeaderO = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none py-4 px-6 flex justify-between items-center h-16 md:h-20 max-w-[1920px] mx-auto pointer-events-none md:pointer-events-auto">
                {/* Logo - Visible on Mobile, but maybe hidden on Desktop if Sidebar has navigation? 
                    The mockup shows a small "School Photo!" logo at top center on mobile?
                    Let's assume standard logo placement for now.
                */}
                <div className="relative z-50 pointer-events-auto">
                    <Link href="/sample-o" className="block w-32 md:w-40 hover:opacity-80 transition-opacity">
                        {/* Placeholder Logo Text if image missing, or use standard logo path */}
                        <img src="/logo.png" alt="スクールフォト！" className="w-full h-auto" />
                    </Link>
                </div>

                {/* Hamburger Trigger */}
                <button
                    className="relative z-50 p-2 text-brand-600 md:hidden pointer-events-auto"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-brand-500 z-40 transition-transform duration-300 flex flex-col items-center justify-center ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                <nav className="flex flex-col gap-8 text-center text-white font-bold text-xl">
                    <Link href="/sample-o" onClick={() => setIsOpen(false)}>トップ</Link>
                    <Link href="#howto" onClick={() => setIsOpen(false)}>応募方法</Link>
                    <Link href="#events" onClick={() => setIsOpen(false)}>開催イベント</Link>
                    <Link href="#faq" onClick={() => setIsOpen(false)}>Q&A</Link>
                    <Link href="#contact" onClick={() => setIsOpen(false)}>お問い合わせ</Link>
                </nav>
            </div>
        </>
    )
}

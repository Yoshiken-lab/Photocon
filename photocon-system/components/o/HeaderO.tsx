'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export const HeaderO = () => {
    const [isOpen, setIsOpen] = useState(false)

    // Scroll Lock & Body Class Toggle
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.classList.add('mobile-menu-open')
        } else {
            document.body.style.overflow = 'unset'
            document.body.classList.remove('mobile-menu-open')
        }
        return () => {
            document.body.style.overflow = 'unset'
            document.body.classList.remove('mobile-menu-open')
        }
    }, [isOpen])

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none py-4 px-6 flex justify-between items-center h-16 md:h-20 max-w-[1920px] mx-auto pointer-events-none md:pointer-events-auto">
                {/* Logo - Visible on Mobile, but maybe hidden on Desktop if Sidebar has navigation? 
                    The mockup shows a small "School Photo!" logo at top center on mobile?
                    Let's assume standard logo placement for now.
                */}
                <div className="relative z-50 pointer-events-auto">
                    <Link href="/sample-o" className="block w-60 md:w-64 hover:opacity-80 transition-opacity">
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
            {/* Mobile Menu Overlay - Glassmorphism Style */}
            <div className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`}>
                {/* Backdrop with Blur */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>

                {/* Close Button Positioned absolutely */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-6 p-2 text-gray-500 hover:text-gray-800 z-50"
                >
                    <X size={32} />
                </button>

                {/* Menu Content */}
                <nav className="relative z-50 flex flex-col items-center justify-center h-full gap-8">
                    <Link href="/sample-o" onClick={() => setIsOpen(false)} className="text-3xl font-maru font-bold text-gray-800 hover:text-brand-500 transition-colors">トップ</Link>
                    <Link href="#howto" onClick={() => setIsOpen(false)} className="text-3xl font-maru font-bold text-gray-800 hover:text-brand-500 transition-colors">応募方法</Link>
                    <Link href="#events" onClick={() => setIsOpen(false)} className="text-3xl font-maru font-bold text-gray-800 hover:text-brand-500 transition-colors">開催イベント</Link>
                    <Link href="#faq" onClick={() => setIsOpen(false)} className="text-3xl font-maru font-bold text-gray-800 hover:text-brand-500 transition-colors">Q&A</Link>

                    <div className="w-16 h-1 bg-[#ffdbc7] rounded-full my-2"></div>

                    <Link href="#contact" onClick={() => setIsOpen(false)} className="text-lg font-bold text-white bg-[#E84D1C] px-10 py-3 rounded-full shadow-lg hover:bg-[#D63E0F] transition-colors">
                        お問い合わせ
                    </Link>
                </nav>
            </div>
        </>
    )
}

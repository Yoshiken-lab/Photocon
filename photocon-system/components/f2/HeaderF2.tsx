'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export function HeaderF2() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const menuItems = [
        { label: 'トップ', href: '#' },
        { label: '応募方法', href: '#' },
        { label: '開催イベント', href: '#' },
        { label: '過去イベント', href: '#' },
        { label: 'Q&A', href: '#' },
        { label: 'お問い合わせ', href: '#' },
    ]

    return (
        <>
            <header className="bg-white/90 backdrop-blur-md text-gray-800 py-4 px-6 md:px-8 flex justify-between items-center fixed top-0 w-full z-50 shadow-sm transition-all duration-300">
                {/* Logo */}
                <div className="flex items-center gap-2 relative z-50">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="スクールフォト!"
                            width={180}
                            height={40}
                            className="h-8 md:h-10 w-auto"
                        />
                    </Link>
                </div>

                {/* Desktop Nav (Visible on Large Screens) */}
                <nav className="hidden lg:flex gap-6 font-bold text-sm tracking-wider">
                    {menuItems.slice(1, 5).map((item) => (
                        <Link key={item.label} href={item.href} className="hover:text-[#E75D2E] transition-colors">
                            {item.label}
                        </Link>
                    ))}
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">写真ギャラリー</Link>
                </nav>

                {/* Desktop CTA (Visible on Large Screens) */}
                <div className="hidden lg:flex gap-4">
                    <button className="bg-[#E75D2E] text-white px-6 py-2 rounded-full font-bold hover:bg-[#c9451b] transition-colors shadow-md">
                        ログイン | 応募
                    </button>
                </div>

                {/* Hamburger Button (Mobile/Tablet) */}
                <button
                    className="lg:hidden relative z-50 p-2 text-gray-800 hover:text-[#E75D2E] transition-colors"
                    onClick={toggleMenu}
                    aria-label="Menu"
                >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-[#FFF5F0] z-40 transition-transform duration-300 ease-in-out lg:hidden flex flex-col justify-center items-center ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <nav className="flex flex-col gap-8 text-center">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-2xl font-bold font-maru text-gray-800 hover:text-[#E75D2E] transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="mt-8">
                        <button className="bg-[#E75D2E] text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#c9451b] transition-colors w-full">
                            ログイン | 応募
                        </button>
                    </div>
                </nav>
            </div>
        </>
    )
}

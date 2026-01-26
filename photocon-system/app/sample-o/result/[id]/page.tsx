'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'

// --- Mock Data Generation (Deterministic) ---
// Total 152 items as per design mock
// Top 3 are special, others are generated
const TOTAL_ENTRIES = 152

// Winners Data
const WINNERS = [
    { rank: 1, title: '奇跡の瞬間', author: 'お母さん', image: 'https://placehold.co/400x400/fef3c7/d97706?text=Winner', text: '1st' },
    { rank: 2, title: '雪遊び最高', author: 'はるきち', image: 'https://placehold.co/300x300/e2e8f0/94a3b8?text=2nd', text: '2nd' },
    { rank: 3, title: 'こたつみかん', author: 'パパ', image: 'https://placehold.co/300x300/ffedd5/c2410c?text=3rd', text: '3rd' },
]

// Generate other entries
const ENTRIES = Array.from({ length: TOTAL_ENTRIES }).map((_, i) => {
    const seeds = [123, 456, 789, 101]
    const seed = seeds[i % 4]
    // Deterministic colors
    const bgColor = ['e2e8f0', 'fef3c7', 'e0f2fe', 'fce7f3', 'f3f4f6'][i % 5]
    const fgColor = ['94a3b8', 'd97706', '0ea5e9', 'db2777', '4b5563'][i % 5]

    return {
        id: i + 1,
        title: `Photo ${i + 1}`,
        image: `https://placehold.co/200x200/${bgColor}/${fgColor}?text=${i + 1}`,
        likes: (i * seed) % 50
    }
})

const ITEMS_PER_PAGE = 9

export default function ResultPageO({ params }: { params: { id: string } }) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(ENTRIES.length / ITEMS_PER_PAGE)

    const currentItems = ENTRIES.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handlePageChange = (page: number) => {
        // Scroll to top of grid section, not top of page, to keep context? 
        // Or top of page is safer. Let's do top of page for simplicity first.
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setCurrentPage(page)
    }

    return (
        <div className="min-h-screen bg-[#FFF5F0] font-sans pb-20">

            {/* Mobile Container (Max 600px) */}
            <div className="w-full md:max-w-[600px] mx-auto min-h-screen bg-[#FFF5F0] border-x border-brand-100/50 relative shadow-2xl shadow-brand-100/20">

                {/* Header */}
                <header className="p-4 sticky top-0 z-50 bg-[#FFF5F0]/95 backdrop-blur-sm border-b border-brand-100/50 flex justify-between items-center">
                    <Link href="/sample-o" className="font-bold text-gray-400 hover:text-[#E84D1C] transition-colors flex items-center gap-1 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        TOP
                    </Link>
                    <div className="font-maru font-bold text-[#E84D1C] text-lg">結果発表</div>
                    <div className="w-12"></div>
                </header>

                <main className="px-4 py-8">

                    {/* --- PODIUM SECTION --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-6 text-center mb-8 border-b-2 border-dashed border-gray-200"
                    >
                        <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm mb-8">
                            <h1 className="text-xl font-extrabold font-maru text-gray-700 flex items-center gap-2">
                                <span>👑</span> 今月の入賞作品
                            </h1>
                        </div>

                        <div className="flex items-end justify-center gap-3 px-2">
                            {/* 2nd Place */}
                            <div className="w-1/3 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                                    className="w-full aspect-square bg-white rounded-lg mb-2 relative border-4 border-gray-200 shadow-md overflow-hidden"
                                >
                                    <img src={WINNERS[1].image} alt="2nd" className="w-full h-full object-cover" />
                                    <div className="absolute -top-2 -left-2 bg-gray-400 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow z-10">2</div>
                                </motion.div>
                                <p className="font-bold text-xs text-gray-600 line-clamp-1">{WINNERS[1].title}</p>
                                <p className="text-[10px] text-gray-400">@{WINNERS[1].author}</p>
                            </div>

                            {/* 1st Place */}
                            <div className="w-2/5 flex flex-col items-center pb-4 z-10">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
                                    className="w-full aspect-square bg-yellow-50 rounded-2xl mb-2 relative border-4 border-yellow-400 shadow-xl transform scale-110 overflow-hidden"
                                >
                                    <img src={WINNERS[0].image} alt="1st" className="w-full h-full object-cover" />
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl drop-shadow-sm z-10 filter">👑</div>
                                </motion.div>
                                <p className="font-bold text-base text-[#E84D1C] font-maru mt-1">{WINNERS[0].title}</p>
                                <p className="text-xs text-gray-500 font-bold">@{WINNERS[0].author}</p>
                            </div>

                            {/* 3rd Place */}
                            <div className="w-1/3 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                                    className="w-full aspect-square bg-white rounded-lg mb-2 relative border-4 border-orange-200 shadow-md overflow-hidden"
                                >
                                    <img src={WINNERS[2].image} alt="3rd" className="w-full h-full object-cover" />
                                    <div className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow z-10">3</div>
                                </motion.div>
                                <p className="font-bold text-xs text-gray-600 line-clamp-1">{WINNERS[2].title}</p>
                                <p className="text-[10px] text-gray-400">@{WINNERS[2].author}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- ALL ENTRIES SECTION --- */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold font-maru text-gray-700 text-lg flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#E84D1C] rounded-full"></span>
                                みんなのアルバム
                            </h2>
                            <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-md">
                                {/* Calculate range: 1-9, 10-18... */}
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, ENTRIES.length)} / {ENTRIES.length}件
                            </span>
                        </div>

                        {/* 3x3 Grid */}
                        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-auto">
                            <AnimatePresence mode="wait">
                                {currentItems.map((item) => (
                                    <motion.div
                                        key={`${currentPage}-${item.id}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                                    >
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white font-bold text-xs">
                                            <Heart size={12} fill="currentColor" /> {item.likes}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination UI */}
                        <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <ArrowLeft size={18} />
                            </button>

                            {/* Simple Pagination: Current / Total */}
                            <div className="flex items-center gap-1 font-bold font-maru mx-2">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E84D1C] text-white shadow-md">
                                    {currentPage}
                                </span>
                                <span className="text-gray-300 text-xs px-1">/</span>
                                <span className="text-gray-400 text-sm">
                                    {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-300' : 'bg-[#E84D1C] text-white shadow-md hover:bg-[#D63E0F]'
                                    }`}
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react'

// --- Mock Data Generator ---
// Generating 32 items to test pagination (4 pages: 10, 10, 10, 2)
const PAST_EVENTS = Array.from({ length: 32 }).map((_, i) => {
    const year = 2025 - Math.floor(i / 12)
    const month = 12 - (i % 12)
    const id = i + 1

    // Randomize title slightly for variety
    const themes = ['冬のフォトコン', '秋の運動会', '夏の思い出', '春の入学式', '笑顔の瞬間', '家族の肖像', 'ペットとの日常', 'お正月']
    const title = themes[i % themes.length]

    // Deterministic "random" number for entries to avoid hydration mismatch
    // using (i * 1237 + 7) % 300 + 50
    const entries = ((i * 1237 + 7) % 300) + 50

    // Rotate angle for scrapbook feel (-3 to 3 degrees)
    const rotate = (i % 2 === 0 ? -1 : 1) * ((i % 3) + 1)

    // Tape style variation
    const tapeColor = ['rgba(255,255,255,0.8)', 'rgba(255,230,230,0.8)', 'rgba(255,255,200,0.6)'][i % 3]

    return {
        id,
        year,
        date: `${year}.${month.toString().padStart(2, '0')}.01`,
        title,
        entries,
        rotate,
        tapeColor,
        // Using placeholder images with different colors/text
        imageUrl: `https://placehold.co/400x400/${['e2e8f0', 'fef3c7', 'e0f2fe', 'fce7f3'][i % 4]}/${['94a3b8', 'd97706', '0ea5e9', 'db2777'][i % 4]}?text=${encodeURIComponent(title)}`
    }
})

const ITEMS_PER_PAGE = 10

export default function ArchivePageO() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(PAST_EVENTS.length / ITEMS_PER_PAGE)

    const currentItems = PAST_EVENTS.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setCurrentPage(page)
    }

    return (
        <div className="min-h-screen bg-[#FFF5F0] font-sans pb-20">

            {/* Mobile Container Wrapper (Max 600px centered) */}
            <div className="w-full md:max-w-[600px] mx-auto min-h-screen bg-[#FFF5F0] border-x border-brand-100/50 relative overflow-hidden shadow-2xl shadow-brand-100/20">

                {/* Background Decor */}
                <div className="absolute top-20 -left-10 text-9xl text-yellow-100 opacity-50 rotate-12 -z-0 pointer-events-none">★</div>
                <div className="absolute bottom-40 -right-10 text-9xl text-brand-100 opacity-50 -rotate-12 -z-0 pointer-events-none">♥</div>

                {/* Header */}
                <header className="p-6 flex items-center justify-between sticky top-0 z-50 pointer-events-none">
                    <Link href="/sample-o" className="bg-white/90 backdrop-blur pointer-events-auto p-3 rounded-full shadow-sm text-gray-500 hover:text-[#E84D1C] transition-colors group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    {/* Logo could go here if needed */}
                </header>

                <main className="px-4 md:px-8 relative z-10">

                    {/* Title Section */}
                    <div className="text-center mb-12 mt-8">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-extrabold font-maru text-gray-800 drop-shadow-sm"
                        >
                            過去イベント一覧
                        </motion.h1>
                    </div>

                    {/* Scrapbook Grid (2 Columns) */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 pb-12">
                        <AnimatePresence mode="wait">
                            {currentItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                                    animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative group cursor-pointer"
                                >
                                    {/* Tape Effect */}
                                    <div
                                        className="absolute -top-3 left-1/2 w-16 h-6 z-10 shadow-sm"
                                        style={{
                                            backgroundColor: item.tapeColor,
                                            transform: 'translateX(-50%) rotate(-2deg)',
                                            clipPath: 'polygon(0% 10%, 5% 0%, 10% 10%, 15% 0%, 20% 10%, 25% 0%, 30% 10%, 35% 0%, 40% 10%, 45% 0%, 50% 10%, 55% 0%, 60% 10%, 65% 0%, 70% 10%, 75% 0%, 80% 10%, 85% 0%, 90% 10%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 90% 90%, 85% 100%, 80% 90%, 75% 100%, 70% 90%, 65% 100%, 60% 90%, 55% 100%, 50% 90%, 45% 100%, 40% 90%, 35% 100%, 30% 90%, 25% 100%, 20% 90%, 15% 100%, 10% 90%, 5% 100%, 0% 90%)'
                                        }}
                                    ></div>

                                    <div className="bg-white p-2 pb-5 rounded-sm shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                        {/* Photo Frame */}
                                        <div className="aspect-square bg-gray-100 mb-2 overflow-hidden border-4 border-white shadow-inner relative">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera className="text-white w-8 h-8 drop-shadow-lg" />
                                            </div>
                                        </div>

                                        {/* Text Info */}
                                        <div className="text-center px-1">
                                            <h3 className="font-bold font-maru text-sm text-gray-700 line-clamp-1 group-hover:text-[#E84D1C] transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-[10px] text-gray-400 font-mono tracking-widest mt-1">
                                                {item.date}
                                            </p>
                                        </div>

                                        {/* Entries Count Badge */}
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-yellow-200 transform rotate-[-5deg]">
                                            {item.entries} posts
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-8 mb-12">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-3 rounded-full shadow-md transition-all ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-[#E84D1C] hover:text-white'
                                }`}
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <span className="font-maru font-bold text-gray-600">
                            <span className="text-xl text-[#E84D1C]">{currentPage}</span> / {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-3 rounded-full shadow-md transition-all ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-[#E84D1C] hover:text-white'
                                }`}
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                </main>
            </div>
        </div>
    )
}

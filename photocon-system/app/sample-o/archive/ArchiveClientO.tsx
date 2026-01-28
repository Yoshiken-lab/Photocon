'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react'

// Define Contest Type
interface Contest {
    id: string
    name: string
    start_date: string
    end_date: string
    status: string
    thumbnail_url: string | null
    // Add other fields if needed for display like entry_count if you fetch it
}

// Helper: Generate scrapbook props deterministically from ID
const getScrapbookStyle = (idStr: string) => {
    // Simple hash-like replacement
    const id = idStr.length
    const rotate = (id % 2 === 0 ? -1 : 1) * ((id % 3) + 1)
    const tapeColor = ['rgba(255,255,255,0.8)', 'rgba(255,230,230,0.8)', 'rgba(255,255,200,0.6)'][id % 3]
    const bgColor = ['e2e8f0', 'fef3c7', 'e0f2fe', 'fce7f3'][id % 4]
    const fgColor = ['94a3b8', 'd97706', '0ea5e9', 'db2777'][id % 4]
    return { rotate, tapeColor, bgColor, fgColor }
}

const ITEMS_PER_PAGE = 10

export default function ArchiveClientO({ contests }: { contests: Contest[] }) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(contests.length / ITEMS_PER_PAGE)

    const currentItems = contests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setCurrentPage(page)
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.01` // Simplified
    }

    return (
        <div className="min-h-screen bg-white font-sans pb-20">

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
                        {contests.length > 0 ? (
                            <AnimatePresence mode="wait">
                                {currentItems.map((contest, index) => {
                                    const style = getScrapbookStyle(contest.id)
                                    // Use DB thumbnail if available, else placeholder
                                    const imageUrl = contest.thumbnail_url
                                        ? contest.thumbnail_url
                                        : `https://placehold.co/400x400/${style.bgColor}/${style.fgColor}?text=${encodeURIComponent(contest.name.substring(0, 4))}`

                                    return (
                                        <motion.div
                                            key={contest.id}
                                            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                                            animate={{ opacity: 1, scale: 1, rotate: style.rotate }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="relative group cursor-pointer"
                                        >
                                            <Link href={`/sample-o/result/${contest.id}`}>

                                                {/* Tape Effect */}
                                                <div
                                                    className="absolute -top-3 left-1/2 w-16 h-6 z-10 shadow-sm"
                                                    style={{
                                                        backgroundColor: style.tapeColor,
                                                        transform: 'translateX(-50%) rotate(-2deg)',
                                                        clipPath: 'polygon(0% 10%, 5% 0%, 10% 10%, 15% 0%, 20% 10%, 25% 0%, 30% 10%, 35% 0%, 40% 10%, 45% 0%, 50% 10%, 55% 0%, 60% 10%, 65% 0%, 70% 10%, 75% 0%, 80% 10%, 85% 0%, 90% 10%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 90% 90%, 85% 100%, 80% 90%, 75% 100%, 70% 90%, 65% 100%, 60% 90%, 55% 100%, 50% 90%, 45% 100%, 40% 90%, 35% 100%, 30% 90%, 25% 100%, 20% 90%, 15% 100%, 10% 90%, 5% 100%, 0% 90%)'
                                                    }}
                                                ></div>

                                                <div className="bg-white p-2 pb-5 rounded-sm shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                                    {/* Photo Frame */}
                                                    <div className="aspect-square bg-gray-100 mb-2 overflow-hidden border-4 border-white shadow-inner relative">
                                                        <img
                                                            src={imageUrl}
                                                            alt={contest.name}
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
                                                            {contest.name}
                                                        </h3>
                                                        <p className="text-[10px] text-gray-400 font-mono tracking-widest mt-1">
                                                            {formatDate(contest.start_date)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        ) : (
                            <div className="col-span-2 text-center py-20 opacity-80">
                                <h3 className="text-2xl font-bold text-gray-400 mb-4 font-maru">
                                    まだ見ぬ伝説を待て！！！！
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    現在、過去のイベントデータが表示されていません。<br />
                                    システムログを確認してください。
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
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
                    )}

                </main>
            </div>
        </div>
    )
}

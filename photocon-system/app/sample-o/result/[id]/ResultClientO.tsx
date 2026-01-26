'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'

// Type definition based on real DB data
export interface Entry {
    id: string
    media_url: string
    username: string
    caption: string | null
    // likes: number // To be added if real votes exist
    // rank?: number
    collected_at: string
}

const ITEMS_PER_PAGE = 9

// Pagination Logic Helper
const getPaginationItems = (current: number, total: number) => {
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1)
    const items: (number | string)[] = [1]
    if (current > 3) items.push('...')
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)
    if (current === 1) end = 3
    if (current === total) start = total - 2
    start = Math.max(2, start)
    end = Math.min(total - 1, end)
    for (let i = start; i <= end; i++) items.push(i)
    if (current < total - 2) items.push('...')
    items.push(total)
    return items
}

export default function ResultClientO({ entries }: { entries: Entry[] }) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE)

    const currentItems = entries.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setCurrentPage(page)
    }

    const paginationItems = getPaginationItems(currentPage, totalPages)

    // Podium Logic (Simulated for now simply by taking the first 3 as winners if sorted by 'rank' or 'likes' - or just random for fun if no data? 
    // Actually, let's just show standard grid if no explicit winners data, OR use the first 3 as a "Pickup" section)
    // For this implementation, I will treat the first 3 as "Latest/Featured" to fill the podium visual if enough entries exist.
    const podiumEntries = entries.length >= 3 ? entries.slice(0, 3) : []
    const displayGridEntries = entries // Show all in grid? Or exclude podium? Usually grid shows all.

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

                    {/* --- PODIUM SECTION (Only if we have entries) --- */}
                    {podiumEntries.length === 3 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-6 text-center mb-8 border-b-2 border-dashed border-gray-200"
                        >
                            <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm mb-8">
                                <h1 className="text-xl font-extrabold font-maru text-gray-700 flex items-center gap-2">
                                    <span>👑</span> ピックアップ
                                </h1>
                            </div>

                            <div className="flex items-end justify-center gap-3 px-2">
                                {/* 2nd (Left) = Index 1 */}
                                <div className="w-1/3 flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                                        className="w-full aspect-square bg-white rounded-lg mb-2 relative border-4 border-gray-200 shadow-md overflow-hidden"
                                    >
                                        <img src={podiumEntries[1].media_url} alt="Pickup" className="w-full h-full object-cover" />
                                    </motion.div>
                                    <p className="font-bold text-xs text-gray-600 line-clamp-1">{podiumEntries[1].caption || 'No Title'}</p>
                                    <p className="text-[10px] text-gray-400">@{podiumEntries[1].username}</p>
                                </div>

                                {/* 1st (Center) = Index 0 */}
                                <div className="w-2/5 flex flex-col items-center pb-4 z-10">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
                                        className="w-full aspect-square bg-yellow-50 rounded-2xl mb-2 relative border-4 border-yellow-400 shadow-xl transform scale-110 overflow-hidden"
                                    >
                                        <img src={podiumEntries[0].media_url} alt="Pickup" className="w-full h-full object-cover" />
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl drop-shadow-sm z-10 filter">👑</div>
                                    </motion.div>
                                    <p className="font-bold text-base text-[#E84D1C] font-maru mt-1">{podiumEntries[0].caption || 'No Title'}</p>
                                    <p className="text-xs text-gray-500 font-bold">@{podiumEntries[0].username}</p>
                                </div>

                                {/* 3rd (Right) = Index 2 */}
                                <div className="w-1/3 flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                                        className="w-full aspect-square bg-white rounded-lg mb-2 relative border-4 border-orange-200 shadow-md overflow-hidden"
                                    >
                                        <img src={podiumEntries[2].media_url} alt="Pickup" className="w-full h-full object-cover" />
                                    </motion.div>
                                    <p className="font-bold text-xs text-gray-600 line-clamp-1">{podiumEntries[2].caption || 'No Title'}</p>
                                    <p className="text-[10px] text-gray-400">@{podiumEntries[2].username}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- ALL ENTRIES SECTION --- */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold font-maru text-gray-700 text-lg flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#E84D1C] rounded-full"></span>
                                みんなのアルバム
                            </h2>
                            <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-md">
                                {entries.length === 0 ? '0件' : (
                                    <>
                                        {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, entries.length)} / {entries.length}件
                                    </>
                                )}
                            </span>
                        </div>

                        {entries.length > 0 ? (
                            <>
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
                                                <img src={item.media_url} alt={item.caption || 'Entry'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                {/* Likes overlay (removed if no real like data, or keep mock?) -> Removing for now as we don't have real likes data passed yet */}
                                                {/* 
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white font-bold text-xs">
                                                    <Heart size={12} fill="currentColor" /> Like
                                                </div>
                                                */}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination UI (Numeric) */}
                                <div className="flex justify-center items-center gap-1 mt-8 pt-6 border-t border-gray-100 flex-wrap">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors mr-1 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        <ArrowLeft size={16} />
                                    </button>

                                    {paginationItems.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {item === '...' ? (
                                                <span className="text-gray-300 px-1 text-xs">...</span>
                                            ) : (
                                                <button
                                                    onClick={() => handlePageChange(item as number)}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-maru transition-all ${currentPage === item
                                                        ? 'bg-[#E84D1C] text-white shadow-md scale-110'
                                                        : 'text-gray-500 hover:bg-orange-50 hover:text-[#E84D1C]'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            )}
                                        </React.Fragment>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-1 ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <p>まだ投稿がありません</p>
                            </div>
                        )}

                    </div>

                </main>
            </div>
        </div>
    )
}

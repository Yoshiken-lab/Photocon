'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Heart, X, Check } from 'lucide-react'
import { voteForEntry } from '@/app/actions/sample-o'

// Type definition based on real DB data
export interface Entry {
    id: string
    media_url: string
    username: string
    caption: string | null
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
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
    const [isVoting, setIsVoting] = useState(false)
    const [votedEntries, setVotedEntries] = useState<string[]>([]) // Track session votes

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

    // Parse Title and Comment from Caption
    const parseCaption = (rawCaption: string | null) => {
        if (!rawCaption) return { title: 'No Title', comment: '' }
        const parts = rawCaption.split('\n\n')
        if (parts.length >= 2) {
            return { title: parts[0], comment: parts.slice(1).join('\n\n') }
        }
        return { title: parts.length > 1 ? parts[0] : 'No Title', comment: parts.length > 1 ? parts.slice(1).join('\n') : rawCaption }
    }

    const handleVote = async (entry: Entry) => {
        setIsVoting(true)
        // Voter ID: Use localStorage
        let voterId = localStorage.getItem('photocon_voter_id')
        if (!voterId) {
            voterId = Math.random().toString(36).substring(2) + Date.now().toString(36)
            localStorage.setItem('photocon_voter_id', voterId)
        }

        const result = await voteForEntry(entry.id, voterId)

        if (result.success) {
            if (result.action === 'added') {
                setVotedEntries(prev => [...prev, entry.id])
            } else if (result.action === 'removed') {
                setVotedEntries(prev => prev.filter(id => id !== entry.id))
            }
        } else {
            alert(result.message)
        }
        setIsVoting(false)
    }

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            {/* Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <EntryModal
                        entry={selectedEntry}
                        onClose={() => setSelectedEntry(null)}
                        hasVoted={votedEntries.includes(selectedEntry.id)}
                        onVote={() => handleVote(selectedEntry)}
                        isVoting={isVoting}
                        parseCaption={parseCaption}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Container (Max 600px) */}
            <div className="w-full md:max-w-[600px] mx-auto min-h-screen bg-[#FFF5F0] border-x border-brand-100/50 relative shadow-2xl shadow-brand-100/20">

                {/* Header */}
                <header className="p-4 sticky top-0 z-50 bg-[#FFF5F0]/95 backdrop-blur-sm border-b border-brand-100/50 flex justify-between items-center">
                    <Link href="/sample-o" className="font-bold text-gray-400 hover:text-[#E84D1C] transition-colors flex items-center gap-1 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        TOP
                    </Link>
                    <div className="font-maru font-bold text-[#E84D1C] text-lg">みんなの作品</div>
                    <div className="w-12"></div>
                </header>

                <main className="px-4 py-8">

                    {/* --- ALL ENTRIES SECTION --- */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold font-maru text-gray-700 text-lg flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#E84D1C] rounded-full"></span>
                                一覧
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
                                                onClick={() => setSelectedEntry(item)}
                                            >
                                                <img src={item.media_url} alt={item.caption || 'Entry'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
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

// Extracted Modal Component to prevent re-renders causing flicker
const EntryModal = ({
    entry,
    onClose,
    hasVoted,
    onVote,
    isVoting,
    parseCaption
}: {
    entry: Entry,
    onClose: () => void,
    hasVoted: boolean,
    onVote: () => void,
    isVoting: boolean,
    parseCaption: (caption: string | null) => { title: string, comment: string }
}) => {
    const { title, comment } = parseCaption(entry.caption)

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Image Section */}
                <div className="w-full md:w-3/5 bg-gray-100 flex items-center justify-center bg-black/5">
                    <img src={entry.media_url} alt={title} className="max-w-full max-h-[60vh] md:max-h-[90vh] object-contain" />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col bg-white overflow-y-auto">
                    <div className="flex justify-end mb-2">
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold font-maru text-gray-800 mb-2 leading-tight">{title}</h2>
                        <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                            <span>Author:</span>
                            <span className="text-brand-500 text-base">@{entry.username}</span>
                        </p>
                    </div>

                    <div className="flex-grow mb-8 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment}
                    </div>

                    {/* Vote Button */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button
                            onClick={() => onVote()}
                            disabled={isVoting}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform shadow-lg ${hasVoted
                                    ? "bg-pink-500 hover:bg-pink-600 text-white hover:-translate-y-1 hover:shadow-xl active:scale-95" // Voted State: Pink/Red to cancel
                                    : "bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-1 hover:shadow-xl active:scale-95"
                                }`}
                        >
                            {isVoting ? (
                                <span className="animate-pulse">処理中...</span>
                            ) : hasVoted ? (
                                <>
                                    <Heart size={24} fill="currentColor" /> 投票済み (取り消す)
                                </>
                            ) : (
                                <>
                                    <Heart size={24} /> 投票する
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            {hasVoted ? "もう一度押すと投票を取り消せます" : "ログイン不要で投票できます"}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

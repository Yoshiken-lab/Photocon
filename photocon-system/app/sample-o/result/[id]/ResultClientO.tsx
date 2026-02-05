'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Heart, X, Copy, Check, Trophy, Medal, Award } from 'lucide-react'
import { voteForEntry, getMyVotes } from '@/app/actions/sample-o'

// Type definition based on real DB data
export interface Entry {
    id: string
    media_url: string
    username: string
    caption: string | null
    collected_at: string
    display_seq: number | null  // For structured ID display
    award_label: 'gold' | 'silver' | 'bronze' | null
}

// Helper: Format structured display ID
const formatDisplayId = (contestCode: string | null, seq: number | null): string => {
    const code = contestCode || '0000'
    const seqStr = seq ? String(seq).padStart(4, '0') : '0000'
    return `#${code}-${seqStr}`
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

export default function ResultClientO({
    entries: initialEntries,
    isVotingOpen,
    contestShortCode = null,
    votingHint = null
}: {
    entries: Entry[],
    isVotingOpen: boolean,
    contestShortCode?: string | null,
    votingHint?: string | null
}) {
    // Sort entries: Gold > Silver > Bronze > Others
    // Note: This sorts ALL entries before pagination, so winners appear on page 1.
    const sortedEntries = React.useMemo(() => {
        const sorted = [...initialEntries]
        sorted.sort((a, b) => {
            const awardOrder = { gold: 3, silver: 2, bronze: 1, null: 0 }
            const awardA = awardOrder[a.award_label || 'null'] || 0
            const awardB = awardOrder[b.award_label || 'null'] || 0

            if (awardA !== awardB) {
                return awardB - awardA // Higher award first
            }
            // Secondary sort: display_seq (if available) or collected_at
            return (a.display_seq || 0) - (b.display_seq || 0)
        })
        return sorted
    }, [initialEntries])

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
    const [isVoting, setIsVoting] = useState(false)
    const [votedEntries, setVotedEntries] = useState<string[]>([]) // Track session votes

    const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE)

    const currentItems = sortedEntries.slice(
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

    // Fetch initial votes on mount
    React.useEffect(() => {
        const fetchInitialVotes = async () => {
            const voterId = localStorage.getItem('photocon_voter_id')
            console.log('[ResultClientO] Mount. VoterID:', voterId)

            if (voterId) {
                try {
                    const votes = await getMyVotes(voterId)
                    console.log('[ResultClientO] Fetched votes:', votes)
                    setVotedEntries(votes)
                } catch (e) {
                    console.error('[ResultClientO] Failed to fetch votes:', e)
                }
            } else {
                console.log('[ResultClientO] No VoterID found in localStorage')
            }
        }
        fetchInitialVotes()
    }, [])
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
                        isVotingOpen={isVotingOpen}
                        contestShortCode={contestShortCode}
                        votingHint={votingHint}
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
                                {sortedEntries.length === 0 ? '0件' : (
                                    <>
                                        {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedEntries.length)} / {sortedEntries.length}件
                                    </>
                                )}
                            </span>
                        </div>

                        {sortedEntries.length > 0 ? (
                            <>
                                {/* --- WINNERS PODIUM (Top 3) --- */}
                                {/* Only show if we are on the first page to avoid duplication across pages */}
                                {currentPage === 1 && (
                                    <div className="relative mb-12 space-y-8 md:space-y-0 md:flex md:items-end md:justify-center md:gap-3 md:h-[420px] mt-4">
                                        {/* Logic to find winners */}
                                        {(() => {
                                            const goldEntry = sortedEntries.find(e => e.award_label === 'gold')
                                            const silverEntry = sortedEntries.find(e => e.award_label === 'silver')
                                            const bronzeEntry = sortedEntries.find(e => e.award_label === 'bronze')

                                            // Helper to render a winner card
                                            const renderWinner = (entry: Entry | undefined, rank: 1 | 2 | 3, label: string, colorClass: string, orderClass: string) => {
                                                if (!entry) return null // Placeholder or empty if no winner

                                                const isGold = rank === 1
                                                // Mobile: vertical stack order. Desktop: 2-1-3 order.
                                                // Rank 1 (Gold): Order 1 (Mobile), Order 2 (Desktop) -> order-1 md:order-2
                                                // Rank 2 (Silver): Order 2 (Mobile), Order 1 (Desktop) -> order-2 md:order-1
                                                // Rank 3 (Bronze): Order 3 (Mobile), Order 3 (Desktop) -> order-3 md:order-3

                                                return (
                                                    <div className={`${orderClass} w-full ${isGold ? 'md:w-5/12 z-20 md:mb-6' : 'md:w-1/3'} flex flex-col items-center`}>
                                                        {isGold && (
                                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] aspect-square bg-orange-300/20 blur-3xl rounded-full pointer-events-none md:top-1/2 md:-translate-y-1/2"></div>
                                                        )}

                                                        {/* Card Container */}
                                                        {/* Mobile: Row for 2nd/3rd, Col for 1st. Desktop: Always Col. */}
                                                        <div className={`w-full flex ${isGold ? 'flex-col items-center' : 'flex-row md:flex-col items-center gap-4 md:gap-0 px-4 md:px-0'}`}>

                                                            {/* Image Frame */}
                                                            <div
                                                                className={`cursor-pointer bg-white overflow-hidden shadow-xl transform transition hover:scale-105 duration-300 relative
                                                                    ${isGold
                                                                        ? 'w-[80%] md:w-full mx-auto aspect-square rounded-[2rem] p-1.5 border-2 border-brand-100 md:scale-110'
                                                                        : 'w-24 md:w-full aspect-square rounded-2xl md:rounded-[1.5rem] p-1 shadow-soft flex-shrink-0'
                                                                    }`}
                                                                onClick={() => setSelectedEntry(entry)}
                                                            >
                                                                <img src={entry.media_url} className={`w-full h-full object-cover ${isGold ? 'rounded-[1.7rem]' : 'rounded-xl md:rounded-[1.2rem]'}`} />

                                                                {/* Gold Badge (Pinned to top-right) */}
                                                                {isGold && (
                                                                    <div className="absolute top-0 right-0 p-3">
                                                                        <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 text-white font-maru font-bold text-base px-5 py-1.5 rounded-full shadow-lg">
                                                                            金賞
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Info Section */}
                                                            <div className={`text-center relative ${isGold ? 'mt-5' : 'text-left md:text-center flex-grow'}`}>

                                                                {/* Rank Badge (Circle) */}
                                                                {isGold ? (
                                                                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg mx-auto -mt-10 border-4 border-white z-20 relative">1</div>
                                                                ) : (
                                                                    <div className={`hidden md:flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold mx-auto mt-2 ${rank === 2 ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-yellow-800'}`}>{rank}</div>
                                                                )}

                                                                {/* Mobile Inline Badge for Silver/Bronze */}
                                                                {!isGold && (
                                                                    <div className={`md:hidden inline-block font-maru font-bold text-xs px-2 py-0.5 rounded-full mb-1 text-white ${rank === 2 ? 'bg-gray-400' : 'bg-yellow-700'}`}>
                                                                        {label}
                                                                    </div>
                                                                )}

                                                                {/* Desktop Badge for Silver/Bronze */}
                                                                {!isGold && (
                                                                    <div className={`hidden md:flex font-maru font-bold text-xs px-3 py-1 rounded-full shadow-md z-10 mx-auto w-fit mb-2 -mt-4 relative border-2 border-white text-white ${rank === 2 ? 'bg-gray-400' : 'bg-yellow-700'}`}>
                                                                        {label}
                                                                    </div>
                                                                )}

                                                                {/* User Name */}
                                                                {isGold ? (
                                                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl py-4 px-2 mt-[-1.5rem] pt-8 shadow-sm mx-6 border border-yellow-100">
                                                                        <h3 className="text-xl font-bold text-gray-800 font-maru truncate">@{entry.username}</h3>
                                                                    </div>
                                                                ) : (
                                                                    <h3 className="text-base font-bold font-maru text-gray-700">@{entry.username}</h3>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <>
                                                    {renderWinner(goldEntry, 1, '金賞', 'bg-yellow-400', 'order-1 md:order-2')}
                                                    {renderWinner(silverEntry, 2, '銀賞', 'bg-gray-300', 'order-2 md:order-1')}
                                                    {renderWinner(bronzeEntry, 3, '銅賞', 'bg-amber-600', 'order-3 md:order-3')}
                                                </>
                                            )
                                        })()}
                                    </div>
                                )}

                                {/* Divider if there are winners */}
                                {currentPage === 1 && sortedEntries.some(e => e.award_label) && (
                                    <div className="flex items-center gap-4 my-8 px-4 opacity-40">
                                        <div className="h-0.5 bg-[#E84D1C]/20 flex-1 rounded-full"></div>
                                        <div className="text-[#E84D1C]/40 text-xs md:text-sm font-bold font-maru">その他の入賞作品</div>
                                        <div className="h-0.5 bg-[#E84D1C]/20 flex-1 rounded-full"></div>
                                    </div>
                                )}

                                {/* 3x3 Grid (Standard Display) */}
                                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-auto">
                                    <AnimatePresence mode="wait">
                                        {currentItems.map((item) => {
                                            // Requirements:
                                            // 1. If we are on Page 1, hide Top 3 (Gold/Silver/Bronze) from the grid because they are shown in the Podium above.
                                            // 2. If we are on Page 2+, show everything normally (or just the paginated items).
                                            // Note: `currentItems` contains the items for the current page.
                                            // If Page 1 contains 9 items, and 3 are winners:
                                            // - Podium shows 3 winners.
                                            // - Grid shows remaining 6 items?
                                            // No, `renderWinner` implies they are separate. 
                                            // If we just hide them here, the grid will have holes or be shorter.
                                            // However, `sortedEntries` already includes them.
                                            // Let's hide them from the grid on Page 1 as requested to avoid duplication.

                                            const isTop3 = ['gold', 'silver', 'bronze'].includes(item.award_label || '')
                                            if (currentPage === 1 && isTop3) return null

                                            const isGold = item.award_label === 'gold'
                                            const isSilver = item.award_label === 'silver'
                                            const isBronze = item.award_label === 'bronze'
                                            const isWinner = !!item.award_label

                                            // Dynamic styling for winners (if they appear in grid on other pages, or if logic changes)
                                            let borderClass = 'border-transparent'
                                            if (isGold) borderClass = 'border-yellow-400 ring-2 ring-yellow-400/30'
                                            if (isSilver) borderClass = 'border-gray-300 ring-2 ring-gray-300/30'
                                            if (isBronze) borderClass = 'border-amber-600 ring-2 ring-amber-600/30'

                                            return (
                                                <motion.div
                                                    key={`${currentPage}-${item.id}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    whileHover={{ scale: 1.05, zIndex: 10 }}
                                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer border-2 ${borderClass}`}
                                                    onClick={() => setSelectedEntry(item)}
                                                >
                                                    <img src={item.media_url} alt={item.caption || 'Entry'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />

                                                    {/* Award Badge (Only shown if not Top 3 context, or if we decide to show them in grid) */}
                                                    {isWinner && (
                                                        <div className={`absolute top-0 left-0 p-1 rounded-br-lg shadow-sm z-10
                                                            ${isGold ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : ''}
                                                            ${isSilver ? 'bg-gradient-to-br from-gray-200 to-gray-400' : ''}
                                                            ${isBronze ? 'bg-gradient-to-br from-amber-600 to-amber-800' : ''}
                                                        `}>
                                                            {isGold && <Trophy className="w-3 h-3 text-yellow-900 fill-yellow-900" />}
                                                            {isSilver && <Medal className="w-3 h-3 text-gray-700 fill-gray-700" />}
                                                            {isBronze && <Award className="w-3 h-3 text-white" />}
                                                        </div>
                                                    )}

                                                    {/* Entry ID Badge */}
                                                    <div className="absolute bottom-1 right-1 bg-black/50 text-white/90 text-[10px] px-1.5 py-0.5 rounded font-mono">
                                                        {formatDisplayId(contestShortCode, item.display_seq)}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
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
            </div >
        </div >
    )
}

// Extracted Modal Component to prevent re-renders causing flicker
const EntryModal = ({
    entry,
    onClose,
    hasVoted,
    onVote,
    isVoting,
    parseCaption,
    isVotingOpen,
    contestShortCode,
    votingHint
}: {
    entry: Entry,
    onClose: () => void,
    hasVoted: boolean,
    onVote: () => void,
    isVoting: boolean,
    parseCaption: (caption: string | null) => { title: string, comment: string },
    isVotingOpen: boolean,
    contestShortCode: string | null,
    votingHint: string | null
}) => {
    const { title, comment } = parseCaption(entry.caption)
    const [copied, setCopied] = React.useState(false)
    const displayId = formatDisplayId(contestShortCode, entry.display_seq)

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(displayId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

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

                    {/* Entry ID with Copy Button */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">ID:</span>
                            <span className="font-mono font-bold text-gray-700">{displayId}</span>
                        </div>
                        <button
                            onClick={handleCopyId}
                            className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 transition-all ${copied
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} />
                                    コピー済
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    コピー
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex-grow mb-8 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment}
                    </div>

                    {/* Vote Button or Voting Hint */}
                    {isVotingOpen ? (
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <button
                                onClick={() => onVote()}
                                disabled={isVoting}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform shadow-lg ${hasVoted
                                    ? "bg-pink-500 hover:bg-pink-600 text-white hover:-translate-y-1 hover:shadow-xl active:scale-95"
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
                    ) : votingHint ? (
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <div className="text-center py-4 bg-orange-50 rounded-xl text-[#E84D1C] font-bold">
                                📸 {votingHint}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </motion.div>
    )
}

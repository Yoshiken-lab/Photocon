'use client'

import { ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const EventCard = ({ year, title, period, status, color = "brand", index, id, isVoting = false }: {
    year: string,
    title: string,
    period: string,
    status: "Active" | "Closed",
    color?: "brand" | "gray",
    index: number,
    id?: string,
    isVoting?: boolean
}) => {
    const isBrand = color === "brand"
    const bgColor = isBrand ? "bg-red-50" : "bg-gray-50"
    const borderColor = isBrand ? "border-brand-200" : "border-gray-200"
    const titleColor = isBrand ? "text-brand-600" : "text-gray-600"

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`w-full ${bgColor} border-2 ${borderColor} rounded-2xl p-6 relative overflow-hidden group`}
        >
            {status === "Active" && (
                <div className={`absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-xl ${isVoting ? "bg-blue-400 text-white" : "bg-yellow-400 text-brand-600"}`}>
                    {isVoting ? "投票受付中" : "開催中"}
                </div>
            )}

            <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold opacity-60">{year}</span>
                {status === "Closed" && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">終了</span>}
            </div>

            <h3 className={`text-xl font-bold ${titleColor} mb-4 font-maru`}>{title}</h3>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Calendar size={16} />
                <span>{period}</span>
            </div>

            {status === "Active" ? (
                // Active Logic: Apply or Vote
                isVoting ? (
                    <Link
                        href={`/sample-o/result/${id}`}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors block ${isBrand
                            ? "bg-blue-500 text-white border-2 border-blue-500 group-hover:bg-blue-600"
                            : "bg-gray-100 border-2 border-gray-200 text-gray-600 group-hover:bg-gray-200"
                            }`}
                    >
                        投票する
                        <ArrowRight size={16} />
                    </Link>
                ) : (
                    <div className="space-y-2">
                        <Link
                            href="/sample-o/apply"
                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors block ${isBrand
                                ? "bg-[#E84D1C] text-white border-2 border-[#E84D1C] group-hover:bg-[#D63E0F]"
                                : "bg-gray-100 border-2 border-gray-200 text-gray-600 group-hover:bg-gray-200"
                                }`}
                        >
                            応募する
                            <ArrowRight size={16} />
                        </Link>
                        {/* View Photos Link during submission period */}
                        <Link
                            href={`/sample-o/result/${id}`}
                            className="w-full py-2 text-sm text-gray-500 hover:text-[#E84D1C] flex items-center justify-center gap-1 transition-colors"
                        >
                            みんなの投稿を見る →
                        </Link>
                    </div>
                )
            ) : (
                <Link
                    href={`/sample-o/result/${id}`}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors block ${isBrand
                        ? "bg-[#E84D1C] text-white border-2 border-[#E84D1C] group-hover:bg-[#D63E0F]"
                        : "bg-gray-100 border-2 border-gray-200 text-gray-600 group-hover:bg-gray-200"
                        }`}
                >
                    結果を見る
                    <ArrowRight size={16} />
                </Link>
            )}
        </motion.div>
    )
}

interface Contest {
    id: string
    name: string
    start_date: string
    end_date: string
    voting_start: string | null
    voting_end: string | null
    status: string
    settings: any // Json type
}

export const ActiveEventsO = ({ activeContests, pastContests }: { activeContests: Contest[], pastContests: Contest[] }) => {

    // Helper to format date "YYYY.M.D"
    const formatDatePeriod = (start: string, end: string) => {
        const s = new Date(start)
        const e = new Date(end)
        return `${s.getFullYear()}.${s.getMonth() + 1}.${s.getDate()} - ${e.getMonth() + 1}.${e.getDate()}`
    }

    const getYear = (dateStr: string) => new Date(dateStr).getFullYear() + "年"

    // Check if currently in voting period
    const isVotingPeriod = (contest: Contest) => {
        // If voting is explicitly disabled in settings, return false immediately
        if (contest.settings?.is_voting_enabled === false) return false

        if (!contest.voting_start || !contest.voting_end) return false
        const now = new Date()
        const start = new Date(contest.voting_start)
        const end = new Date(contest.voting_end)
        return now >= start && now <= end
    }

    return (
        <div id="events" className="w-full bg-[#FFF5F0] py-24 px-6 relative overflow-hidden">
            {/* Diagonal Header Decoration - Matching HowToApply Background (White) */}
            <div className="absolute top-0 left-0 w-full h-[80px] bg-white skew-y-[-2] origin-top-left transform -translate-y-10 z-0"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl font-bold text-gray-800 font-maru mb-2">開催中のイベント</h2>
                <div className="h-1 w-16 bg-brand-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="space-y-6 max-w-sm mx-auto">
                {activeContests.length > 0 ? (
                    activeContests.map((contest, i) => {
                        const isVoting = isVotingPeriod(contest)
                        // If status is specifically 'voting', also treat as voting ONLY IF enabled
                        const effectiveIsVoting = (isVoting || contest.status === 'voting') && (contest.settings?.is_voting_enabled !== false)

                        return (
                            <EventCard
                                key={contest.id}
                                index={i}
                                year={getYear(contest.start_date)}
                                title={contest.name}
                                period={formatDatePeriod(contest.start_date, contest.end_date)}
                                status="Active"
                                color="brand"
                                id={contest.id}
                                // Pass voting state to EventCard
                                isVoting={effectiveIsVoting}
                            />
                        )
                    })
                ) : (
                    <div className="text-center text-gray-400 font-bold py-4">現在開催中のイベントはありません</div>
                )}

                <div className="pt-8">
                    <h3 className="text-center text-gray-400 font-bold mb-6 text-sm">過去のイベント</h3>
                    <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                        {pastContests.slice(0, 3).map((contest, i) => (
                            <EventCard
                                key={contest.id}
                                index={i}
                                year={getYear(contest.start_date)}
                                title={contest.name}
                                period={formatDatePeriod(contest.start_date, contest.end_date)}
                                status="Closed"
                                color="gray"
                                id={contest.id}
                            />
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/sample-o/archive"
                            className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-[#E84D1C] transition-colors group"
                        >
                            <span>もっと見る</span>
                            <div className="bg-white p-1 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

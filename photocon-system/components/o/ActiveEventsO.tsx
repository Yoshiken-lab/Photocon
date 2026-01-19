'use client'

import { ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const EventCard = ({ year, title, period, status, color = "brand", index }: { year: string, title: string, period: string, status: "Active" | "Closed", color?: "brand" | "gray", index: number }) => {
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
                <div className="absolute top-0 right-0 bg-yellow-400 text-brand-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
                    開催中
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

            <button className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${isBrand
                ? "bg-[#E84D1C] text-white border-2 border-[#E84D1C] group-hover:bg-[#D63E0F]"
                : "bg-gray-100 border-2 border-gray-200 text-gray-600 group-hover:bg-gray-200"
                }`}>
                {status === "Active" ? "詳細・応募はこちら" : "結果を見る"}
                <ArrowRight size={16} />
            </button>
        </motion.div>
    )
}

export const ActiveEventsO = () => {
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
                <EventCard
                    index={0}
                    year="2026年"
                    title="春のフォトコンテスト"
                    period="2026.4.10 - 4.24"
                    status="Active"
                    color="brand"
                />

                <div className="pt-8">
                    <h3 className="text-center text-gray-400 font-bold mb-6 text-sm">過去のイベント</h3>
                    <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                        <EventCard
                            index={1}
                            year="2025年"
                            title="冬のフォトコンテスト"
                            period="2025.12.1 - 12.15"
                            status="Closed"
                            color="gray"
                        />
                        <EventCard
                            index={2}
                            year="2025年"
                            title="夏のフォトコンテスト"
                            period="2025.8.1 - 8.15"
                            status="Closed"
                            color="gray"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

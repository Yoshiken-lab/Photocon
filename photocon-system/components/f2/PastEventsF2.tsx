'use client'

import { useRef, useState } from 'react'

const pastEvents = [
    { year: 2025, season: '春', theme: '●●●', count: 20, date: '2025年12月1日開催' },
    { year: 2025, season: '春', theme: '●●●', count: 20, date: '2025年12月1日開催' },
    { year: 2025, season: '春', theme: '●●●', count: 20, date: '2025年12月1日開催' },
    // Duplicate for scroll demo
    { year: 2024, season: '秋', theme: '運動会', count: 45, date: '2024年10月10日開催' },
    { year: 2024, season: '夏', theme: 'プール', count: 32, date: '2024年7月20日開催' },
]

export function PastEventsF2() {
    return (
        <section className="bg-white pb-20 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-6 h-6 rounded-full bg-[#E75D2E]"></div>
                    <h2 className="text-3xl md:text-4xl font-bold font-maru text-[#E75D2E]">
                        過去のイベント情報
                    </h2>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-hide">
                        {pastEvents.map((event, index) => (
                            <div
                                key={index}
                                className="snap-center shrink-0 w-[85vw] md:w-[400px] border-2 border-brand-200 rounded-3xl p-6 bg-white hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[280px]"
                            >
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-600 border-b-2 border-gray-200 pb-2 mb-4 font-maru truncate">
                                        {event.year}年{event.season}のフォトコンテスト
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-500 w-20 shrink-0">テーマ</span>
                                            <span className="text-xl font-bold text-gray-800 font-maru">「{event.theme}」</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-500">
                                            開催日時：<span className="font-sans text-gray-700">{event.date}</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-500">
                                            応募件数：<span className="font-sans text-gray-700">{event.count}件</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dots for "more content" visualization */}
                                <div className="flex justify-end mt-4">
                                    <div className="flex bg-gray-200 p-2 rounded-lg gap-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Scroll Indicators (Mock) */}
                    <div className="flex justify-center gap-3 mt-4">
                        {pastEvents.map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-gray-500' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

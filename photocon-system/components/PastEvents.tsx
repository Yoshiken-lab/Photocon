'use client'

import React from 'react'

export const PastEvents = () => {
    // Mock data for past events
    const pastEvents = [
        { title: '2025年春のフォトコンテスト', theme: '●●●', date: '2025年12月1日開催', count: '20件' },
        { title: '2025年春のフォトコンテスト', theme: '●●●', date: '2025年12月1日開催', count: '20件' },
        { title: '2025年春のフォトコンテスト', theme: '●●●', date: '2025年12月1日開催', count: '20件' },
    ]

    return (
        <section className="py-12 bg-white text-center">
            <div className="max-w-6xl mx-auto px-4">

                <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-brand text-2xl">●</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-brand font-maru">
                        過去のイベント情報
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
                    {pastEvents.map((event, index) => (
                        <div key={index} className="border-2 border-brand rounded-2xl p-6 text-left hover:shadow-lg transition-shadow bg-white flex flex-col justify-between min-w-[280px]">
                            <div>
                                <h3 className="text-lg font-bold text-gray-700 border-b border-gray-300 pb-2 mb-3">
                                    {event.title}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex gap-2">
                                        <span className="font-bold shrink-0">テーマ</span>
                                        <span className="text-gray-800 font-bold">「{event.theme}」</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold shrink-0">開催日時</span>
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold shrink-0">応募件数</span>
                                        <span>{event.count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Indicators (Mock) */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>

            </div>
        </section>
    )
}
